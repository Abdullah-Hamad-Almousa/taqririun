import { type ReactNode } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useReport } from '../state/ReportContext';
import type { ReportImages, ReportLabels, ReportTexts } from '../state/ReportContext';
import { COLORS } from '../template/templateSpec';

// Arabic-Indic digits for evidence numbering.
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function arabicNum(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

// --- Reusable field components ---

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {children}
    </View>
  );
}

function LabeledInput({ label, value, onChange, placeholder, multiline }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline ? styles.inputMultiline : undefined]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        textAlign="right"
        multiline={multiline}
      />
    </View>
  );
}

function ImagePickerField({ label, uri, onPick, onRemove }: {
  label: string;
  uri: string | null;
  onPick: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.inputLabel}>{label}</Text>
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onPick}>
              <Text style={styles.btnText}>تغيير</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={onRemove}>
              <Text style={styles.btnText}>حذف</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity style={styles.pickBtn} onPress={onPick}>
          <Text style={styles.pickBtnText}>اختيار صورة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- Main pane ---

export function ControlsPane() {
  const { reportData, update } = useReport();
  const t = reportData.texts;

  const setText = (key: keyof ReportTexts, value: string) =>
    update({ texts: { ...reportData.texts, [key]: value } });

  const setImage = (index: number, uri: string | null) => {
    const images = [...reportData.images] as ReportImages;
    images[index] = uri;
    update({ images });
  };

  const setLabel = (index: number, value: string) => {
    const labels = [...reportData.labels] as ReportLabels;
    labels[index] = value;
    update({ labels });
  };

  const setLogo = (uri: string | null) =>
    update({ logos: { ministryLogo: uri } });

  const pickImage = async (onSet: (uri: string) => void) => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('إذن مرفوض', 'يجب السماح بالوصول إلى معرض الصور لإضافة الشواهد.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSet(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('تعذّر اختيار الصورة', e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.copyright}>© Abdullah hamad almousa</Text>
      <Section title="بيانات الجهة">
        <LabeledInput label="الإدارة العامة" value={t.adminName} onChange={(v) => setText('adminName', v)} placeholder="الإدارة العامة للتعليم" />
        <LabeledInput label="المكتب" value={t.officeName} onChange={(v) => setText('officeName', v)} placeholder="مكتب التعليم" />
        <LabeledInput label="المدرسة" value={t.schoolName} onChange={(v) => setText('schoolName', v)} placeholder="اسم المدرسة" />
      </Section>

      <Section title="البرنامج">
        <LabeledInput label="اسم البرنامج" value={t.programName} onChange={(v) => setText('programName', v)} placeholder="اسم البرنامج" />
        <LabeledInput label="الأهداف" value={t.objectives} onChange={(v) => setText('objectives', v)} placeholder="اكتب أهداف البرنامج" multiline />
      </Section>

      <Section title="معلومات التنفيذ">
        <LabeledInput label="المنفذ" value={t.executor} onChange={(v) => setText('executor', v)} placeholder="مثال: الأستاذ ..." />
        <LabeledInput label="التاريخ" value={t.date} onChange={(v) => setText('date', v)} placeholder="مثال: ١٤٤٦/٠١/٠١" />
        <LabeledInput label="الفئة المستهدفة" value={t.targetGroup} onChange={(v) => setText('targetGroup', v)} placeholder="مثال: الطلاب" />
        <LabeledInput label="العدد" value={t.count} onChange={(v) => setText('count', v)} placeholder="مثال: ٥٠" />
      </Section>

      <Section title="الشواهد">
        {reportData.images.map((img, i) => (
          <View key={i} style={styles.evidenceItem}>
            <ImagePickerField
              label={`الشاهد ${arabicNum(i + 1)}`}
              uri={img}
              onPick={() => pickImage((uri) => setImage(i, uri))}
              onRemove={() => setImage(i, null)}
            />
            <LabeledInput
              label={`عنوان الشاهد ${arabicNum(i + 1)}`}
              value={reportData.labels[i]}
              onChange={(v) => setLabel(i, v)}
              placeholder="عنوان الشاهد"
            />
          </View>
        ))}
      </Section>

      <Section title="الشعار">
        <ImagePickerField
          label="شعار الوزارة"
          uri={reportData.logos.ministryLogo}
          onPick={() => pickImage((uri) => setLogo(uri))}
          onRemove={() => setLogo(null)}
        />
      </Section>

      <Section title="التذييل">
        <LabeledInput label="المنتدى" value={t.forum} onChange={(v) => setText('forum', v)} placeholder="المنتدى الطلابي" />
        <LabeledInput label="المدير" value={t.director} onChange={(v) => setText('director', v)} placeholder="اسم المدير" />
      </Section>
      <Text style={styles.copyright}>© Abdullah hamad almousa</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f6',
  },
  content: {
    padding: 14,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontFamily: 'Cairo',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: COLORS.header,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
    textAlign: 'right',
  },
  field: {
    marginBottom: 12,
  },
  evidenceItem: {
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: 'Cairo',
    fontSize: 13,
    color: COLORS.header,
    marginBottom: 4,
    textAlign: 'right',
  },
  input: {
    fontFamily: 'Cairo',
    fontSize: 15,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#333333',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  thumb: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#e9e9e9',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.label,
  },
  btnDanger: {
    backgroundColor: '#c0392b',
  },
  btnText: {
    fontFamily: 'Cairo',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  pickBtn: {
    borderWidth: 1,
    borderColor: COLORS.label,
    borderStyle: 'dashed',
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickBtnText: {
    fontFamily: 'Cairo',
    fontSize: 14,
    color: COLORS.label,
  },
  copyright: {
    fontFamily: 'Cairo',
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    paddingVertical: 8,
  },
});
