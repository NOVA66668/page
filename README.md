# Cloudflare Store Hunter Pages Demo

واجهة + API + D1 لتجربة فكرة Store Hunter على Cloudflare بدون VPS.

## المكونات
- `public/` الواجهة الجاهزة للرفع على Cloudflare Pages
- `functions/api/scan.ts` تشغيل الفحص اليدوي
- `functions/api/stores.ts` جلب المتاجر والمنتجات
- `functions/api/health.ts` حالة آخر عمليات الفحص
- `schema.sql` إنشاء جداول D1
- `wrangler.jsonc` إعداد الربط مع D1

## مهم
هذه النسخة Demo:
- تستعمل بيانات علنية فقط
- لا تشتغل كعملية Python دائمة
- الفحص يتم يدويًا من الصفحة
- يمكن إضافة Cron لاحقًا على Worker إذا أردت

## الخطوات

### 1) تثبيت الأدوات
```bash
npm install
```

### 2) إنشاء قاعدة D1
```bash
npx wrangler d1 create store_hunter_db
```
سيظهر لك `database_id`. ضعه داخل `wrangler.jsonc`.

### 3) إنشاء الجداول
```bash
npx wrangler d1 execute store_hunter_db --file=./schema.sql
```

### 4) تجربة محليًا
```bash
npx wrangler pages dev public --d1 DB=store_hunter_db
```

### 5) الرفع إلى Cloudflare Pages
ارفع المشروع إلى GitHub ثم أنشئ Pages project واربطه بالمستودع.

إعدادات البناء المقترحة:
- Build command: none
- Build output directory: `public`

ثم أضف D1 binding باسم `DB` من:
Workers & Pages → مشروعك → Settings → Bindings → Add → D1 database

## ماذا تفعل الواجهة؟
- زر `Run Scan` يشغّل فحصًا يدويًا
- يمكن إدخال دومينات يدويًا أو تركها فارغة لاستخدام seed list
- تحفظ النتائج في D1
- تعرض أعلى 30 متجرًا
- تعرض المنتجات المكتشفة وإشارات sold out

## إضافة Cron لاحقًا
Pages Functions نفسها للواجهة وAPI ممتازة، لكن التشغيل المجدول يكون عبر Worker مع `scheduled()` وCron Triggers، وليس من الواجهة مباشرة. راجع توثيق Cloudflare:
- Pages Functions تبدأ من مجلد `/functions`
- يمكن ربط D1 مع Pages Functions
- Cron Triggers تعمل عبر `scheduled()` على Workers
