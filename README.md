# Ma Fille FR — هيفين & الصغيرة

تطبيق ويب لتعليم طفلة 4 سنوات الفرنسية بدعم عامية مصرية، بأصوات مسجلة من أختها هيفين.

## رفع على GitHub Pages
1. اعمل ريبو جديد Public.
2. ارفع كل الملفات.
3. Settings > Pages > Branch: main / root > Save.
4. افتح https://<username>.github.io/<repo>/

## التشغيل محليًا
python3 -m http.server 8080
ثم افتح http://localhost:8080

## بنية الملفات
- index.html — الهيكل
- css/ — التصميم المتجاوب
- js/ — storage, audio, router, games-loader, app
- games/manifest.json — قائمة الـ 50 لعبة
- games/_template.js — قالب للحقن
- audio/fr/, audio/eg/ — ملفات صوت هيفين

## الحقن التدريجي
كل لعبة = ملف في games/ + سطر في manifest.json + تغيير locked لـ false.
