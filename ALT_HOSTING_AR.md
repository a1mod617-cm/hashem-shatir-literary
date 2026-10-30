# النشر البديل لمكتبة هاشم خالد شطير — Cloudflare Pages

## لماذا هذا المسار؟
الموقع الأصلي يعمل على GitHub Pages، لكن بعض الشبكات لا تستطيع الوصول إلى نطاق github.io.
لذلك جهزنا فرعًا مستقلًا في المستودع نفسه يحتوي الموقع النهائي الجاهز للنشر على نطاق آخر، مع بقاء ملكية المشروع في حساب GitHub الخاص بأحمد.

## بيانات النشر المعتمدة
- المستودع: https://github.com/a1mod617-cm/hashem-shatir-literary
- الفرع الذي يحتوي نسخة الموقع الجاهزة: `portable-site`
- عدد ملفات الموقع: 684 ملفًا تقريبًا، منها 656 صفحة WebP و4 ملفات PDF.
- ملفات التشغيل في جذر الفرع: `index.html` و`app.js` و`style.css`.
- لا يلزم تشغيل Python أو Node ولا توليد الصور في Cloudflare، فالنسخة جاهزة على الفرع.
- الرابط الحالي كنسخة احتياطية: https://a1mod617-cm.github.io/hashem-shatir-literary/

## خطوات التنفيذ (حساب Cloudflare مملوك لصاحب GitHub)
1. افتح https://dash.cloudflare.com/ وسجل أو أنشئ حسابًا تملكه أنت (لا تستخدم حساب ChatGPT).
2. من القائمة اختر **Workers & Pages**.
3. اختر **Create application** ثم **Pages** ثم **Connect to Git**.
4. اختر **GitHub**، ثم وافق على الوصول للمستودع `a1mod617-cm/hashem-shatir-literary` فقط إن أمكن.
5. حدد المستودع نفسه، ثم **Begin setup**.
6. في **Project name** اكتب `hashem-khaled-shatir` إذا كان متاحًا (يمكن اختيار اسم قريب).
7. في **Production branch** اختر `portable-site` (مهم: ليس `main`).
8. في إعدادات البناء:
   - Framework preset: **None**
   - Build command: اتركه فارغًا؛ إن طُلب أمر، استخدم `exit 0`.
   - Build output directory: `.` (نقطة واحدة، جذر فرع `portable-site`).
   - Root directory / Path (advanced): اتركه فارغًا.
9. اضغط **Save and Deploy** وانتظر ظهور **Success**.
10. افتح **Production URL** الذي تعطيه Cloudflare؛ سيكون من شكل `https://<project-name>.pages.dev` لكنه لا يصبح فعليًا إلا بعد إتمام النشر.

## اختبار التسليم النهائي
- افتح الرابط على اللابتوب والهاتف ومن شبكتين إن أمكن.
- افتح كل غلاف كتاب، وانتقل بين صفحتين، وجرّب التكبير.
- جرّب تنزيل PDF.
- اختبر التنقل بين الأقسام والبحث.
- شارك رابط `pages.dev` الجديد مع القرّاء، لا رابط `github.io` الذي يسبب timeout لدى بعض الشبكات.

## تحديث الموقع لاحقًا
- ملفات المصدر الأصلية وGitHub Actions موجودة في فرع `main`.
- عند تحديث ملفات المكتبة/الكتب أو ملفات النشر، ينشئ workflow `Prepare standalone mirror for independent hosting` نسخة محدثة في `portable-site`.
- تأكد من نجاح GitHub Actions، ثم تحقق من ظهور النسخة الجديدة في Cloudflare Deployments. إذا لم يبدأ نشر تلقائي، أعد إطلاقه من لوحة Cloudflare.

## حدود النسخة الحالية
الصفحات والقراءة والتنزيل تعمل دون حساب، لكن هذه النسخة الثابتة لا توفر قاعدة بيانات للتقييمات والتعليقات أو موافقات المؤلف وإشعارات البريد. تلك المزايا تتطلب خدمة خلفية مستقلة لا توفرها GitHub Pages وحدها.
