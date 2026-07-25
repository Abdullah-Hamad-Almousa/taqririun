import { useMemo, type ReactNode } from 'react';
import { I18nManager, Image, StyleSheet, Text, View, type DimensionValue, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useReport } from '../state/ReportContext';
import { COLORS, SLOTS, TEMPLATE_H, TEMPLATE_W, type SlotRect } from './templateSpec';

// Fixed aspect ratio of the report canvas (width / height).
const ASPECT = TEMPLATE_W / TEMPLATE_H;

function pos(rect: SlotRect): ViewStyle {
  return {
    position: 'absolute',
    left: (rect.x + '%') as DimensionValue,
    top: (rect.y + '%') as DimensionValue,
    width: (rect.w + '%') as DimensionValue,
    height: (rect.h + '%') as DimensionValue,
  };
}

function Slot({ rect, style, children }: { rect: SlotRect; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  return <View style={[pos(rect), style]}>{children}</View>;
}

type TS = {
  page: ViewStyle;
  onTeal: ViewStyle;
  logoBox: ViewStyle;
  pill: ViewStyle;
  titleBox: ViewStyle;
  fieldBox: ViewStyle;
  fieldBoxMultiline: ViewStyle;
  tealLabel: ViewStyle;
  imageBox: ViewStyle;
  labelBox: ViewStyle;
  brandBox: ViewStyle;
  valueText: TextStyle;
  valueOnTeal: TextStyle;
  pillText: TextStyle;
  titleText: TextStyle;
  tealLabelText: TextStyle;
  headingText: TextStyle;
  brandText: TextStyle;
  imageHint: TextStyle;
  labelText: TextStyle;
};

function createStyles(width: number): TS {
  const px = (frac: number) => width * frac;
  return {
    page: { backgroundColor: COLORS.page, borderWidth: 1, borderColor: '#dcdcdc', overflow: 'hidden' },
    onTeal: { justifyContent: 'center', overflow: 'hidden' },
    logoBox: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)', borderRadius: px(0.006), alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    pill: { backgroundColor: COLORS.pillBg, borderWidth: 1, borderColor: COLORS.label, borderRadius: 999, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    titleBox: { justifyContent: 'center', alignItems: 'flex-end' },
    fieldBox: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: COLORS.fieldBorder, borderRadius: px(0.006), justifyContent: 'center', paddingHorizontal: px(0.012), overflow: 'hidden' },
    fieldBoxMultiline: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: COLORS.fieldBorder, borderRadius: px(0.006), paddingHorizontal: px(0.012), paddingVertical: px(0.01), overflow: 'hidden' },
    tealLabel: { backgroundColor: COLORS.label, borderRadius: px(0.006), alignItems: 'center', justifyContent: 'center', paddingHorizontal: px(0.01) },
    imageBox: { backgroundColor: '#f2f3f5', borderWidth: 1, borderColor: COLORS.fieldBorder, borderRadius: px(0.006), alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    labelBox: { justifyContent: 'center', alignItems: 'center' },
    brandBox: { justifyContent: 'center' },
    valueText: { fontFamily: 'Cairo', fontSize: px(0.034), lineHeight: Math.round(px(0.034) * 1.2), includeFontPadding: false, textAlign: 'right', color: '#333333' },
    valueOnTeal: { fontFamily: 'Cairo', fontSize: px(0.025), lineHeight: Math.round(px(0.025) * 1.2), includeFontPadding: false, textAlign: 'right', color: '#ffffff' },
    pillText: { fontFamily: 'Cairo', fontSize: px(0.042), lineHeight: Math.round(px(0.042) * 1.2), includeFontPadding: false, textAlign: 'center', color: COLORS.header },
    titleText: { fontFamily: 'Cairo', fontSize: px(0.044), lineHeight: Math.round(px(0.044) * 1.2), includeFontPadding: false, fontWeight: 'bold', textAlign: 'right', color: COLORS.title },
    tealLabelText: { fontFamily: 'Cairo', fontSize: px(0.038), lineHeight: Math.round(px(0.038) * 1.2), includeFontPadding: false, fontWeight: 'bold', textAlign: 'center', color: '#ffffff' },
    headingText: { fontFamily: 'Cairo', fontSize: px(0.032), lineHeight: Math.round(px(0.032) * 1.2), includeFontPadding: false, fontWeight: 'bold', textAlign: 'center', color: COLORS.header },
    brandText: { fontFamily: 'Cairo', fontSize: px(0.026), lineHeight: Math.round(px(0.026) * 1.2), includeFontPadding: false, fontWeight: 'bold', textAlign: 'left', color: COLORS.header },
    imageHint: { fontFamily: 'Cairo', fontSize: px(0.03), lineHeight: Math.round(px(0.03) * 1.2), includeFontPadding: false, color: COLORS.placeholder },
    labelText: { fontFamily: 'Cairo', fontSize: px(0.02), lineHeight: Math.round(px(0.02) * 1.2), includeFontPadding: false, textAlign: 'center', color: '#333333' },
  };
}

// Editable text bound to a value: shows the value, or a light placeholder when empty.
function FieldText({ value, placeholder, baseStyle, placeholderColor, valueColor, numberOfLines }: {
  value: string;
  placeholder: string;
  baseStyle: TextStyle;
  placeholderColor: string;
  valueColor: string;
  numberOfLines?: number;
}) {
  const has = value != null && value.length > 0;
  return (
    <Text style={[baseStyle, { color: has ? valueColor : placeholderColor }]} numberOfLines={numberOfLines}>
      {has ? value : placeholder}
    </Text>
  );
}

function InfoRow({ rect, label, value, placeholder, styles, gap }: {
  rect: SlotRect;
  label: string;
  value: string;
  placeholder: string;
  styles: TS;
  gap: number;
}) {
  return (
    <Slot rect={rect} style={{ flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse' }}>
      {/* Label always pinned right, value always on the left, regardless of isRTL */}
      <View style={[styles.tealLabel, { width: '46%' }]}>
        <Text style={styles.tealLabelText} numberOfLines={1}>{label}</Text>
      </View>
      <View style={[styles.fieldBox, { flex: 1, marginRight: gap }]}>
        <FieldText value={value} placeholder={placeholder} baseStyle={styles.valueText} placeholderColor={COLORS.placeholder} valueColor="#333333" numberOfLines={1} />
      </View>
    </Slot>
  );
}

// One evidence slot: fixed image holder (fills the box exactly) + editable label underneath.
function EvidenceCell({ imageRect, labelRect, imageUri, labelValue, imagePlaceholder, labelPlaceholder, styles }: {
  imageRect: SlotRect;
  labelRect: SlotRect;
  imageUri: string | null;
  labelValue: string;
  imagePlaceholder: string;
  labelPlaceholder: string;
  styles: TS;
}) {
  const hasImage = imageUri != null && imageUri.length > 0;
  return (
    <>
      <Slot rect={imageRect} style={styles.imageBox}>
        {hasImage ? (
          <Image source={{ uri: imageUri as string }} style={StyleSheet.absoluteFill} resizeMode="stretch" />
        ) : (
          <Text style={styles.imageHint} numberOfLines={1}>{imagePlaceholder}</Text>
        )}
      </Slot>
      <Slot rect={labelRect} style={styles.labelBox}>
        <FieldText value={labelValue} placeholder={labelPlaceholder} baseStyle={styles.labelText} placeholderColor={COLORS.placeholder} valueColor="#333333" numberOfLines={1} />
      </Slot>
    </>
  );
}

export function ReportTemplate({ width }: { width: number }) {
  const height = width * (TEMPLATE_H / TEMPLATE_W); // fixed aspect ratio
  const styles = useMemo(() => createStyles(width), [width]);
  const { reportData } = useReport();
  const t = reportData.texts;
  const gap = width * 0.012;

  return (
    <View style={[styles.page, { width, height }]}>
      {/* 1. Header band */}
      <Slot rect={SLOTS.header} style={{ backgroundColor: COLORS.header }} />

      {/* 3. Admin + office names (editable, on the teal header) */}
      <Slot rect={SLOTS.adminOffice} style={styles.onTeal}>
        <FieldText value={t.adminName} placeholder="الإدارة العامة للتعليم" baseStyle={styles.valueOnTeal} placeholderColor={COLORS.placeholderOnTeal} valueColor="#ffffff" numberOfLines={1} />
        <FieldText value={t.officeName} placeholder="مكتب التعليم" baseStyle={styles.valueOnTeal} placeholderColor={COLORS.placeholderOnTeal} valueColor="#ffffff" numberOfLines={1} />
      </Slot>

      {/* 2. Ministry logo */}
      <Slot rect={SLOTS.ministryLogo} style={styles.logoBox}>
        {reportData.logos.ministryLogo ? (
          <Image source={{ uri: reportData.logos.ministryLogo }} style={StyleSheet.absoluteFill} resizeMode="contain" />
        ) : (
          <Text style={[styles.valueOnTeal, { fontSize: width * 0.03, lineHeight: Math.round(width * 0.03 * 1.2), textAlign: 'center' }]} numberOfLines={1}>الشعار</Text>
        )}
      </Slot>

      {/* 4. School name pill (editable) */}
      <Slot rect={SLOTS.school} style={styles.pill}>
        <FieldText value={t.schoolName} placeholder="اسم المدرسة" baseStyle={styles.pillText} placeholderColor={COLORS.placeholder} valueColor={COLORS.header} numberOfLines={1} />
      </Slot>

      {/* 6. Program name field (editable) */}
      <Slot rect={SLOTS.programName} style={styles.fieldBox}>
        <FieldText value={t.programName} placeholder="اسم البرنامج" baseStyle={styles.valueText} placeholderColor={COLORS.placeholder} valueColor="#333333" numberOfLines={1} />
      </Slot>

      {/* 5. Title (fixed, green) */}
      <Slot rect={SLOTS.title} style={styles.titleBox}>
        <Text style={styles.titleText} numberOfLines={1}>تقرير برنامج</Text>
      </Slot>

      {/* 7. Info grid: fixed teal labels + editable values */}
      <InfoRow rect={SLOTS.infoRow1} label="اسم المنفذ" value={t.executor} placeholder="مثال: الأستاذ ..." styles={styles} gap={gap} />
      <InfoRow rect={SLOTS.infoRow2} label="تاريخ التنفيذ" value={t.date} placeholder="مثال: ١٤٤٦/٠١/٠١" styles={styles} gap={gap} />
      <InfoRow rect={SLOTS.infoRow3} label="الفئة المستهدفة" value={t.targetGroup} placeholder="مثال: الطلاب" styles={styles} gap={gap} />
      <InfoRow rect={SLOTS.infoRow4} label="العدد" value={t.count} placeholder="مثال: ٥٠" styles={styles} gap={gap} />

      {/* 8. Goals: fixed header + editable objectives box */}
      <Slot rect={SLOTS.goalsHeader} style={styles.tealLabel}>
        <Text style={styles.tealLabelText} numberOfLines={1}>أهداف البرنامج</Text>
      </Slot>
      <Slot rect={SLOTS.goalsBox} style={styles.fieldBoxMultiline}>
        <FieldText value={t.objectives} placeholder="اكتب أهداف البرنامج هنا" baseStyle={styles.valueText} placeholderColor={COLORS.placeholder} valueColor="#333333" numberOfLines={4} />
      </Slot>

      {/* 9. Evidence heading (fixed) */}
      <Slot rect={SLOTS.evidenceHeading}>
        <Text style={styles.headingText} numberOfLines={1}>الشواهد</Text>
      </Slot>

      {/* 10-13. Evidence: 2x2 grid of fixed image holders + editable labels */}
      <EvidenceCell imageRect={SLOTS.image1} labelRect={SLOTS.label1} imageUri={reportData.images[0]} labelValue={reportData.labels[0]} imagePlaceholder="صورة" labelPlaceholder="عنوان الشاهد" styles={styles} />
      <EvidenceCell imageRect={SLOTS.image2} labelRect={SLOTS.label2} imageUri={reportData.images[1]} labelValue={reportData.labels[1]} imagePlaceholder="صورة" labelPlaceholder="عنوان الشاهد" styles={styles} />
      <EvidenceCell imageRect={SLOTS.image3} labelRect={SLOTS.label3} imageUri={reportData.images[2]} labelValue={reportData.labels[2]} imagePlaceholder="صورة" labelPlaceholder="عنوان الشاهد" styles={styles} />
      <EvidenceCell imageRect={SLOTS.image4} labelRect={SLOTS.label4} imageUri={reportData.images[3]} labelValue={reportData.labels[3]} imagePlaceholder="صورة" labelPlaceholder="عنوان الشاهد" styles={styles} />

      {/* 14-15. Footer (editable) */}
      <Slot rect={SLOTS.footerForum} style={styles.fieldBox}>
        <FieldText value={t.forum} placeholder="المنتدى الطلابي" baseStyle={styles.valueText} placeholderColor={COLORS.placeholder} valueColor="#333333" numberOfLines={1} />
      </Slot>
      <Slot rect={SLOTS.footerDirector} style={styles.fieldBox}>
        <FieldText value={t.director} placeholder="اسم المدير" baseStyle={styles.valueText} placeholderColor={COLORS.placeholder} valueColor="#333333" numberOfLines={1} />
      </Slot>

      {/* 16. Taqririun brand mark — locked bottom-left, hard-coded, NOT in state, always included in exports. */}
      <Slot rect={SLOTS.brand} style={styles.brandBox}>
        <Text style={styles.brandText} numberOfLines={1}>تقريرون</Text>
      </Slot>
    </View>
  );
}
