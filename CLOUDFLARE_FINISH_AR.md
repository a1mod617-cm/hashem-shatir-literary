# إكمال النشر النهائي — موقع هاشم خالد شطير

آخر فحص: 30 أكتوبر 2026.

## الحالة الحالية
- رابط الجمهور: https://hashem-shatir-literary.pages.dev/
- الرابط القصير يعمل حاليًا بتحويل مؤقت (302) إلى:
  https://portable-site.hashem-shatir-literary.pages.dev/
- النسخة البديلة تعمل وتحتوي جميع الكتب الأربعة وصفحاتها الـ656.
- أصل المشروع والملكية في المستودع:
  https://github.com/a1mod617-cm/hashem-shatir-literary
- فرع الموقع النهائي: `portable-site` ويحتوي 684 عنصرًا، منها 656 WebP و4 PDF.
- السبب: في إعدادات Cloudflare Pages اختير فرع الإنتاج `main` بدل `portable-site`، ولذلك كان الرابط الأصلي يرجع 404 قبل إضافة تحويل مؤقت.

## إكمال النشر الحقيقي بدون التحويل المؤقت
1. افتح Cloudflare Dashboard ثم Workers & Pages.
2. ادخل مشروع `hashem-shatir-literary`.
3. افتح تبويب **Settings**.
4. انتقل إلى **Builds & deployments** أو **Builds** حسب الواجهة.
5. ابحث عن **Production branch** أو **Branch control** ثم اضغط Edit / Configure Production deployments.
6. غيّر الفرع من `main` إلى **`portable-site`**.
7. تأكد من تفعيل **automatic production branch deployments** ثم Save.
8. إذا لم يبدأ نشر جديد تلقائيًا، أرسل commit بسيطًا للفرع `portable-site` من GitHub كي يبدأ Cloudflare إنتاج نسخة جديدة. يمكن أيضًا استخدام خيار Retry / Create deployment إن ظهر في اللوحة، مع التحقق من اختيار `portable-site`.
9. راجع **Deployments**: يجب أن تظهر Production Source = `portable-site` وStatus = Success.
10. افتح https://hashem-shatir-literary.pages.dev/ من جهازين، واختبر الكتب والقارئ والتكبير وPDF.

## لماذا نحتاج ذلك؟
رابط الـ Preview الحالي قابل للاستخدام، لكنه يحمل `X-Robots-Tag: noindex` ولا نريد الاعتماد عليه كواجهة نهائية للمؤلف. بعد تغيير فرع الإنتاج والنشر المباشر سيعمل الرابط القصير بدون تحويل إلى preview.

## التحديثات مستقبلًا
- عدل مصدر الموقع على فرع `main` فقط.
- GitHub Actions workflow باسم `Prepare standalone mirror for independent hosting` يبني نسخة `portable-site` بشكل تلقائي من ملفات المصدر.
- تحقق من نجاح Actions ثم نجاح Cloudflare Deployments.

## حدود النسخة الحالية
القراءة والتنزيل والبحث وحفظ موضع القراءة متاحة، لكن نظام تقييمات القراء مع موافقة المؤلف وإشعارات البريد ليس منفذًا في هذه النسخة الثابتة، ويحتاج خدمة بيانات وخادمًا منفصلًا.
