import { useRef } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { ReportProvider } from './state/ReportContext';
import { PreviewPane } from './template/PreviewPane';
import { ReportTemplate } from './template/ReportTemplate';
import { EXPORT_WIDTH, EXPORT_HEIGHT } from './template/templateSpec';
import { ControlsPane } from './controls/ControlsPane';
import { ExportBar } from './export/ExportBar';

// Taqririun — Arabic only, full RTL.
// Force right-to-left for the whole app before anything renders.
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo: require('./assets/fonts/Cairo-Regular.ttf'),
  });

  // Ref to a hidden, full-size render of the template used only for export.
  const captureRef = useRef<View | null>(null);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ReportProvider>
      <View style={styles.root}>
        <View style={styles.preview}>
          <PreviewPane />
        </View>
        <View style={styles.controls}>
          <ControlsPane />
        </View>
        <ExportBar captureRef={captureRef} />
        {/* Hidden high-resolution copy of the template (off-screen) for export. */}
        <View
          ref={captureRef}
          collapsable={false}
          pointerEvents="none"
          style={styles.captureTarget}
        >
          <ReportTemplate width={EXPORT_WIDTH} />
        </View>
      </View>
    </ReportProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  preview: { flex: 1.1 },
  controls: { flex: 1, borderTopWidth: 1, borderTopColor: '#dcdcdc' },
  captureTarget: {
    position: 'absolute',
    left: -10000,
    top: 0,
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    backgroundColor: '#ffffff',
  },
});
