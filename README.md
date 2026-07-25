# Taqririun (تقريرون)

A mobile app that fills a fixed-layout educational program report from a template, then exports it.

---

## English

### Overview
**Taqririun** is a single-screen mobile app built with React Native + Expo. It lets a user fill in an Arabic, fixed-layout Ministry of Education program report — only the *content* (text and images) is editable; the positions, order, and background of the template never change.

- **Platforms:** Android and iOS only. No web support.
- **Language:** Arabic only, fully right-to-left (RTL). No English anywhere in the UI.
- **No backend:** everything runs locally on the device. No server, no networking, no sharing, no QR codes.
- **No persistence:** all edits live in memory only. Closing the app resets the template to blank.

### Features
- **Fixed-layout template** — a report template with a fixed aspect ratio that scales to fit any screen width, keeping every element in the same relative position on all devices.
- **Live preview** — the preview updates instantly as text is typed or images are picked.
- **Smart image fit** — each of the 4 evidence image slots keeps its exact box size: larger images shrink to fit, smaller images stretch to fill.
- **Editable content** — administration/office/school names, program title, objectives, executor/date/target group/count, 4 evidence images with labels, forum/director names, and the ministry logo.
- **Locked brand mark** — the "Taqririun" mark is hard-coded to the bottom-left of the template. It is not part of the app state and cannot be removed or edited.
- **Export options** — export the finished report as an image (PNG/JPG), as a PDF, or save it directly to the device.

### Tech stack
- **Expo** (managed workflow) + **React Native** + **TypeScript**
- `expo-image-picker` — pick images from the device
- `react-native-view-shot` — capture the template as an image
- `expo-print` — generate a PDF from the template
- `expo-media-library` / `expo-file-system` — save the export to the device
- `expo-font` — load the Arabic display font (Cairo)

No state-management library, no UI kit, no networking or persistence library is used — see `taqririun project/lib taqririun.md` for the full dependency policy.

### Project structure
```
App.tsx                  Root component: RTL setup, font loading, screen composition
state/                   In-memory reportData context (useState + useContext)
template/                Fixed-layout template, scaling (PreviewPane), and layout spec
controls/                Controls panel: text inputs, image pickers, label inputs
export/                  Export bar: image / PDF / save-to-device actions
assets/                  Icons, splash image, Arabic font
```

### Getting started
```bash
npm install
npm start          # start the Expo dev server
npm run android     # run on Android
npm run ios         # run on iOS
```

### Design constraints
- No AsyncStorage, database, or any persistence — state must reset on app close.
- No networking, sharing, or QR code features.
- Template positions, order, and structure are fixed and must never change — only slot content is editable.
- All UI text and content must remain Arabic/RTL.

### License
All Rights Reserved — see [`LICENSE`](./LICENSE).

---

## العربية

### نظرة عامة
**تقريرون** تطبيق جوال بشاشة واحدة مبني باستخدام React Native و Expo. يتيح للمستخدم تعبئة تقرير برنامج تعليمي (وزارة التعليم) بتصميم عربي ثابت — يمكن تعديل **المحتوى** فقط (النصوص والصور)، أما مواضع العناصر وترتيبها وخلفية التقرير فلا تتغير أبدًا.

- **المنصات:** أندرويد و iOS فقط. لا يوجد دعم للويب.
- **اللغة:** عربية فقط، بدعم كامل لاتجاه الكتابة من اليمين لليسار (RTL). لا توجد أي نصوص إنجليزية في واجهة التطبيق.
- **بدون خادم:** كل شيء يعمل محليًا على الجهاز. لا يوجد خادم، ولا اتصال بالإنترنت، ولا مشاركة، ولا رمز استجابة سريعة (QR).
- **بدون حفظ للبيانات:** كل التعديلات تبقى في الذاكرة فقط. عند إغلاق التطبيق يعود القالب فارغًا.

### المميزات
- **قالب ثابت التصميم** — تقرير بنسبة أبعاد ثابتة يتكيف تلقائيًا مع عرض أي شاشة، مع بقاء كل عنصر في موضعه النسبي نفسه على جميع الأجهزة.
- **معاينة فورية** — تتحدث المعاينة لحظيًا مع كل تعديل في النص أو اختيار صورة.
- **ملاءمة ذكية للصور** — كل واحدة من صور "الشواهد" الأربع تحافظ على حجم صندوقها الثابت: الصور الكبيرة تُصغَّر لتناسب الصندوق، والصور الصغيرة تُمدَّد لتملأه.
- **محتوى قابل للتعديل** — اسم الإدارة التعليمية/مكتب التعليم/المدرسة، عنوان البرنامج، الأهداف، اسم المنفذ/التاريخ/الفئة المستهدفة/العدد، 4 صور شواهد مع تسمية لكل منها، اسم منتدى الإرشاد الطلابي/المدير، وشعار الوزارة.
- **علامة تقريرون الثابتة** — علامة "تقريرون" مثبتة في أسفل يسار القالب بشكل ثابت في الكود، وهي ليست جزءًا من بيانات التطبيق ولا يمكن حذفها أو تعديلها.
- **خيارات التصدير** — تصدير التقرير النهائي كصورة (PNG/JPG)، أو كملف PDF، أو حفظه مباشرة على الجهاز.

### التقنيات المستخدمة
- **Expo** (managed workflow) + **React Native** + **TypeScript**
- `expo-image-picker` — لاختيار الصور من الجهاز
- `react-native-view-shot` — لالتقاط القالب كصورة
- `expo-print` — لإنشاء ملف PDF من القالب
- `expo-media-library` / `expo-file-system` — لحفظ الملف المُصدَّر على الجهاز
- `expo-font` — لتحميل خط العرض العربي (Cairo)

لا يستخدم التطبيق أي مكتبة لإدارة الحالة، ولا مكتبة واجهات جاهزة، ولا أي مكتبة اتصال أو حفظ بيانات — راجع ملف `taqririun project/lib taqririun.md` للاطلاع على سياسة المكتبات الكاملة.

### هيكل المشروع
```
App.tsx                  المكوّن الجذري: إعداد RTL، تحميل الخط، تركيب الشاشة
state/                   حالة التقرير في الذاكرة (useState + useContext)
template/                القالب الثابت، والتحجيم (PreviewPane)، ومواصفات التخطيط
controls/                لوحة التحكم: حقول النصوص، أدوات اختيار الصور، حقول التسميات
export/                  شريط التصدير: تصدير كصورة / PDF / حفظ على الجهاز
assets/                  الأيقونات، صورة البداية، الخط العربي
```

### طريقة التشغيل
```bash
npm install
npm start          # تشغيل خادم التطوير الخاص بـ Expo
npm run android     # التشغيل على أندرويد
npm run ios         # التشغيل على iOS
```

### قيود التصميم
- ممنوع استخدام AsyncStorage أو قاعدة بيانات أو أي وسيلة حفظ — يجب أن تُمسح الحالة عند إغلاق التطبيق.
- ممنوع أي اتصال بالإنترنت أو مشاركة أو رمز QR.
- مواضع عناصر القالب وترتيبها وبنيته ثابتة ولا يجوز تغييرها — يمكن تعديل محتوى الحقول فقط.
- يجب أن يبقى كل نص ومحتوى في الواجهة باللغة العربية واتجاه RTL.

### الترخيص
جميع الحقوق محفوظة — راجع ملف [`LICENSE`](./LICENSE).
