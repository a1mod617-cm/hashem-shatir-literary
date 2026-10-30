# تسليم موقع هاشم خالد شطير — GitHub Pages

## الملكية
- المستودع الأساسي: https://github.com/a1mod617-cm/hashem-shatir-literary
- مالك المستودع: a1mod617-cm
- رابط الموقع المتوقع بعد تفعيل GitHub Pages: https://a1mod617-cm.github.io/hashem-shatir-literary/
- لا يحتاج زائر الموقع إلى تسجيل حساب لقراءة الكتب أو تحميل ملفات PDF.
- حساب إنستغرام الكاتب: https://www.instagram.com/7wa_h9/

## ما تم إنجازه
- نسخة موقع عربية مستقلة داخل `github-pages/`.
- أربعة كتب وملفات PDF أصلية.
- قارئ صفحات (656 صفحة) مع أزرار التنقل والسحب على الجوال، والتكبير والتصغير، والتحميل، وحفظ آخر صفحة محليًا.
- برنامج تجهيز صفحات الكتب: `scripts/render-book-pages.py`.
- برنامج بناء ملفات الموقع: `scripts/build-gh-pages.mjs`.
- مهمة النشر: `.github/workflows/pages.yml`؛ تعمل عند تحديث الملفات ذات الصلة على فرع main أو يدويًا.

## تفعيل النشر — خطوة لمرة واحدة
1. سجل الدخول إلى GitHub بحساب a1mod617-cm.
2. افتح https://github.com/a1mod617-cm/hashem-shatir-literary/settings/pages
3. من **Build and deployment → Source** اختر **GitHub Actions**.
4. افتح https://github.com/a1mod617-cm/hashem-shatir-literary/actions/workflows/pages.yml
5. اختر **Run workflow → main → Run workflow**، وانتظر ظهور علامة النجاح الخضراء.
6. افتح الرابط العام أعلاه وتحقق من فتح الكتب الأربعة والقراءة والتنزيل من الجوال والكمبيوتر.

إذا فشل النشر، افتح آخر مهمة من تبويب Actions واقرأ اسم الخطوة الفاشلة. الفشل السابق قبل تفعيل Pages كان في `Configure GitHub Pages` بسبب عدم تفعيل الاستضافة، لا بسبب ملفات الكتب.

## حدود نسخة GitHub Pages
هذه الاستضافة تقدم HTML/CSS/JS وصور الكتب وPDF فقط. **لا يوجد فيها نظام يعمل لحفظ مراجعات الزوار أو إرسال إيميل إلى الكاتب أو اعتماد التعليقات من لوحة إدارة.** يحتاج ذلك إلى خدمة خلفية مستقلة وآمنة وقاعدة بيانات وتسجيل دخول للمشرف. لا تضع أسرارًا أو مفاتيح API داخل JavaScript المنشور للقراء.

## الصيانة بعد التسليم
- النسخة المعروضة للزوار مصدرها `github-pages/`، وليست تطبيق Next.js القديم في `app/`.
- ملفات الكتب الأصلية داخل `public/books/`، وأغلفتها داخل `public/media/`.
- عند تحديث PDF يجب تعديل عدد صفحاته أيضًا في `github-pages/app.js` و`scripts/render-book-pages.py` و`scripts/build-gh-pages.mjs`.
- أي تحديث يدفع إلى main في المسارات المحددة سيعيد بناء الموقع تلقائيًا.
