<div align="center">
  <h1>✨ Prompt Architect AI (V3.02) ✨</h1>
  <p><b>أداة ذكية متكاملة مدعومة بالذكاء الاصطناعي لتحليل وصقل وتطوير البرومبتات (Prompts) البرمجية والإبداعية والارتقاء بها لمعايير جودة فائقة الدقة.</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/Node.js->=18.0.0-blue.svg" alt="Node Version" />
    <img src="https://img.shields.io/badge/React-19.0-blueviolet.svg" alt="React Version" />
    <img src="https://img.shields.io/badge/Vite-6.x-green.svg" alt="Vite Version" />
    <img src="https://img.shields.io/badge/Gemini_API-Supported-orange.svg" alt="Gemini SDK" />
    <img src="https://img.shields.io/badge/Express-4.x-brightgreen.svg" alt="Express" />
  </p>
</div>

---

## 🌟 نبذة عن المشروع / Overview

**Prompt Architect AI** هو مهندس برومبتات ذكي يقوم بتحويل أفكارك وطلباتك الخام البسيطة إلى برومبتات هيكلية واحترافية فائقة الدقة باستخدام نموذج **Gemini 3.5 Flash**. 

يتميز التطبيق بواجهة استخدام إبداعية وعصرية فريدة من نوعها (Neobrutalism/Editorial Style) تدعم التفاعل الكامل والتحليل الدقيق للنواقص، مع وجود ساحة تشغيل واختبار تفاعلية (Playground) لتجربة المخرجات مباشرة قبل نسخها!

---

## ✨ المميزات الرئيسية / Key Features

1. **تحليل الطلب دلالياً (Semantic Analysis):** استخراج الهدف الرئيسي المباشر، النية الضمنية، مستوى التعقيد، والجمهور المستهدف.
2. **سد الفجوات والنواقص (Auto-Gap Filling):** اكتشاف المعايير المفقودة في طلبك (مثل الدور، السياق، القيود) وافتراضها بذكاء.
3. **تطبيق أطر هندسة البرومبت (Engineering Frameworks):** يعتمد تلقائياً على أطر عالمية مثل (CRISP, RTDF, CREATE, ERA) طبقاً لنوع المهمة المحددة.
4. **بناء البرومبت الهيكلي الشامل:** تفكيك البرومبت لـ 9 ركائز أساسية:
   - `ROLE` (الدور)
   - `CONTEXT` (السياق)
   - `OBJECTIVE` (الهدف)
   - `INPUT` (المعطيات)
   - `REQUIREMENTS` (التعليمات)
   - `CONSTRAINTS` (القيود)
   - `QUALITY STANDARDS` (معايير الجودة)
   - `REASONING FRAMEWORK` (المنطق والتفكير الاستنتاجي)
   - `OUTPUT FORMAT` (تنسيق المخرجات)
5. **مختبر التفاعل التجريبي (Playground):** تجربة البرومبت الذي تم تشييده مباشرة بمدخلات حقيقية والحصول على المخرجات فوراً للتأكد من فاعليته.
6. **أرشيف محلي (History Logs):** الاحتفاظ بآخر العمليات التي قمت بها في المتصفح للعودة إليها سريعاً.

---

## 🚀 التشغيل المحلي / Local Development

### المتطلبات الأساسية
* تثبيت إصدار **Node.js** (إصدار 18 فما فوق).

### خطوات التشغيل
1. قم بتهيئة المستودع وتثبيت الاعتماديات:
   ```bash
   npm install
   ```
2. قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع وأضف مفتاح Gemini API الخاص بك:
   ```env
   GEMINI_API_KEY="أدخل_مفتاح_الـ_API_الخاص_بك"
   ```
3. قم بتشغيل خادم التطوير:
   ```bash
   npm run dev
   ```
4. افتح المتصفح على الرابط الموضح في الشاشة: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ النشر والتشغيل على Railway / Deployment on Railway

المشروع مصمم ليكون جاهزاً تماماً للرفع والنشر المباشر على منصة **Railway**، حيث يقوم بالبناء والتشغيل التلقائي.

### خطوات النشر:
1. قم بربط مستودع **GitHub** الخاص بك بـ **Railway.app**.
2. أضف متغيرات البيئة (Variables) التالية في لوحة التحكم الخاصة بـ Railway:
   - `GEMINI_API_KEY`: مفتاح الـ API الخاص بك من Google AI Studio.
   - `NODE_ENV`: قم بتعيينه كـ `production`.
3. ستقوم المنصة تلقائياً بالتعرف على ملف الـ `package.json` وبناء التطبيق وتشغيله بنجاح باهر!

---

## 🛠️ التقنيات المستخدمة / Technologies Stack
* **Front-end:** React 19, Lucide React, Motion.
* **Styling:** CSS3, TailwindCSS v4.
* **Back-end:** Express.js, TypeScript.
* **AI integration:** Google Gen AI SDK (`@google/genai`).
* **Bundlers:** Vite (لواجهات المستخدم), Esbuild (لتجميع الخادم).
