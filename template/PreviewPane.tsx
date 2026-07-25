import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { ReportTemplate } from './ReportTemplate';
import { TEMPLATE_H, TEMPLATE_W } from './templateSpec';

// width / height of the fixed canvas.
const ASPECT = TEMPLATE_W / TEMPLATE_H;

export function PreviewPane() {
  const [layout, setLayout] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  };

  const { width: availW, height: availH } = layout;
  // Contain: fit the fixed-aspect template inside the available area,
  // letterboxing (centering) whatever does not fill. Positions never shift.
  const dispW = availW > 0 && availH > 0
    ? (availW / ASPECT > availH ? availH * ASPECT : availW)
    : 0;

  return (
    <View style={styles.stage} onLayout={onLayout}>
      {dispW > 0 ? <ReportTemplate width={dispW} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: '#e9e9e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
