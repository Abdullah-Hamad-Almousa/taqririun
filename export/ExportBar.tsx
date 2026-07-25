import { useState, type RefObject } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef as captureView } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { COLORS, EXPORT_WIDTH, TEMPLATE_H, TEMPLATE_W } from '../template/templateSpec';

type Props = {
  captureRef: RefObject<View | null>;
};

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function stamp(): string {
  return new Date().toISOString().replace(/[-:TZ]/g, '').slice(0, 14);
}

// Embed the captured template image in an RTL HTML page sized to the exact
// design canvas so the PDF matches the on-screen preview 1:1.
function buildPdfHtml(base64: string, mime: 'image/jpeg' | 'image/png'): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar"><head><meta charset="utf-8">
<style>
@page { size: ${TEMPLATE_W}px ${TEMPLATE_H}px; margin: 0; }
html, body { margin: 0; padding: 0; background: #ffffff; }
.page { width: ${TEMPLATE_W}px; height: ${TEMPLATE_H}px; }
.page img { width: ${TEMPLATE_W}px; height: ${TEMPLATE_H}px; display: block; }
</style></head>
<body><div class="page"><img src="data:${mime};base64,${base64}"/></div></body>
</html>`;
}

export function ExportBar({ captureRef }: Props) {
  const [busy, setBusy] = useState<null | 'image' | 'pdf'>(null);
  // Remember the user's chosen save folder for the session (Android SAF).
  const [safDir, setSafDir] = useState<string | null>(null);

  // Capture the hidden full-size template. format selects PNG (lossless) or JPG.
  const capture = async (format: 'png' | 'jpg', quality = 1): Promise<string> => {
    if (!captureRef.current) throw new Error('capture target not ready');
    await new Promise((r) => setTimeout(r, 60));
    return captureView(captureRef, { format, result: 'tmpfile', width: EXPORT_WIDTH, quality });
  };

  // Ask the user (once per session) for a folder to write files into on Android.
  const ensureSafDir = async (): Promise<string> => {
    const perms = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!perms.granted) throw new Error('لم يتم اختيار مجلد.');
    setSafDir(perms.directoryUri);
    return perms.directoryUri;
  };

  // Android: write the PDF into the chosen folder via Storage Access Framework.
  // Read the generated PDF file ourselves — more reliable than result.base64.
  const savePdfAndroid = async (pdfUri: string) => {
    const dir = safDir ?? (await ensureSafDir());
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      dir, 'Taqririun_' + stamp() + '.pdf', 'application/pdf');
    const pdfBase64 = await FileSystem.readAsStringAsync(pdfUri, { encoding: FileSystem.EncodingType.Base64 });
    await FileSystem.writeAsStringAsync(fileUri, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });
  };

  // iOS: copy the generated PDF into app documents (visible in the Files app).
  const savePdfIOS = async (pdfUri: string) => {
    const dir = FileSystem.documentDirectory;
    if (!dir) throw new Error('تعذّر الوصول إلى مجلد المستندات.');
    await FileSystem.copyAsync({ from: pdfUri, to: dir + 'Taqririun_' + stamp() + '.pdf' });
  };

  // One tap: capture the template and save the image straight to the gallery.
  const exportImage = async () => {
    try {
      setBusy('image');
      const uri = await capture('png');
      const perm = await MediaLibrary.requestPermissionsAsync(true);
      if (!perm.granted) {
        Alert.alert('إذن مرفوض', 'يجب السماح بالوصول إلى المعرض لحفظ الصورة.');
        return;
      }
      await MediaLibrary.createAssetAsync(uri);
      Alert.alert('تم الحفظ', 'تم حفظ الصورة في معرض الصور.');
    } catch (e) {
      Alert.alert('تعذّر حفظ الصورة', errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  // One tap: capture the template, render a PDF, and save it to the device.
  const exportPdf = async () => {
    try {
      setBusy('pdf');
      const imgUri = await capture('jpg', 0.85);
      const base64 = await FileSystem.readAsStringAsync(imgUri, { encoding: FileSystem.EncodingType.Base64 });
      const html = buildPdfHtml(base64, 'image/jpeg');
      const isAndroid = Platform.OS === 'android';
      const result = await Print.printToFileAsync({ html, width: TEMPLATE_W, height: TEMPLATE_H });
      if (isAndroid) await savePdfAndroid(result.uri);
      else await savePdfIOS(result.uri);
      Alert.alert('تم الحفظ', isAndroid ? 'تم حفظ ملف PDF في المجلد المختار.' : 'تم حفظ ملف PDF في مستندات التطبيق (يظهر في تطبيق الملفات).');
    } catch (e) {
      Alert.alert('تعذّر حفظ ملف PDF', errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.bar}>
      <Btn label="تصدير صورة" color={COLORS.label} onPress={exportImage} busy={busy === 'image'} />
      <Btn label="تصدير PDF" color={COLORS.header} onPress={exportPdf} busy={busy === 'pdf'} />
    </View>
  );
}

function Btn({ label, color, onPress, busy }: {
  label: string;
  color: string;
  onPress: () => void;
  busy: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onPress} disabled={busy} activeOpacity={0.7}>
      <Text style={styles.btnText} numberOfLines={1}>{busy ? 'جارٍ' : label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#f4f5f6', paddingHorizontal: 10, paddingVertical: 8, gap: 8, borderTopWidth: 1, borderTopColor: '#dcdcdc' },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: 'Cairo', fontSize: 13, fontWeight: 'bold', color: '#ffffff' },
});
