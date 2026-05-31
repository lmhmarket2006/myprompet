import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";

dotenv.config();
// Fallback to reading from .env.example if GEMINI_API_KEY is not defined in .env or standard env vars
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.join(process.cwd(), '.env.example') });
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// PostgreSQL connection pool configuration
const dbUrl = process.env.DATABASE_URL;
const isDbConnected = !!dbUrl;
const pool = new Pool({
  connectionString: dbUrl,
  ssl: dbUrl ? { rejectUnauthorized: false } : false,
});

if (!isDbConnected) {
  console.log("⚠️ DATABASE_URL is not set. Saving history will only fallback to local browser storage.");
}

async function initializeDatabase() {
  if (!isDbConnected) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prompt_history (
        id VARCHAR(255) PRIMARY KEY,
        timestamp VARCHAR(255) NOT NULL,
        raw_input TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        result JSONB NOT NULL
      );
    `);
    console.log("✅ Database initialized: 'prompt_history' table is ready.");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
  }
}

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY_IF_MISSING",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint to optimize the prompt
app.post("/api/optimize-prompt", async (req, res) => {
  try {
    const { rawInput, category, tone, customRequirements } = req.body;

    if (!rawInput || typeof rawInput !== "string" || !rawInput.trim()) {
      return res.status(400).json({ error: "الرجاء إدخال فكرة أو برومبت للعمل عليه." });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "مفتاح GEMINI_API_KEY غير متوفر في بيئة العمل. يرجى تهيئته عبر لوحة التحكم.",
      });
    }

    const systemInstruction = `أنت خبير عالمي في Prompt Engineering و AI Systems Design باللغة العربية والإنجليزية.
مهمتك هي تحويل أي فكرة أو طلب أو برومبت خام إلى برومبت احترافي فائق الجودة يحقق أفضل النتائج الممكنة من نماذج الذكاء الاصطناعي.
يجب عليك اتباع الخطوات الست بدقة تامة:

المرحلة الأولى: تحليل الطلب
حلل المدخل واستخرج: الهدف الأساسي، الهدف الخفي المحتمل، نوع المهمة، الجمهور المستهدف، مستوى التعقيد، المجال التخصصي، والمخرجات المثالية.

المرحلة الثانية: تصنيف المهمة
صنف الطلب ضمن أحد المجالات التالية: (كتابة المحتوى، التسوق، البرمجة، تصميم المواقع، تصميم التطبيقات، التجارة الإلكترونية، تحليل البيانات، التعليم، البحث العلمي، الأعمال، صناعة المحتوى، الذكاء الاصطناعي، أخرى) واختر أفضل إطار هندسي مناسب لنوع هذه المهمة بالتحديد (مثل CRISP, RTDF, CREATE, ERA, etc.) واكتب اسم الإطار بوضوح.

المرحلة الثالثة: اكتشاف النواقص
حدد جميع العناصر المفقودة مثل (الدور، السياق، القيود، الجمهور، معايير الجودة، التنسيق، النبرة، المراجع، أمثلة الإخراج) والمستكمله بافتراضات احترافية ذكية ومنطقية.

المرحلة الرابعة: بناء البرومبت الهيكلي
ابنِ البرومبت بالكامل بالاعتماد على الهيكل التالي بدقة شاملة:
- ROLE
- CONTEXT
- OBJECTIVE
- INPUT
- REQUIREMENTS
- CONSTRAINTS
- QUALITY STANDARDS
- REASONING FRAMEWORK
- OUTPUT FORMAT

المرحلة الخامسة: التحسين المتقدم
طبق مبادئ (Chain of Thought, Expert Reasoning, Context Expansion, Goal Optimization, Constraint Refinement, Quality Enhancement) على البرومبت المكتوب لتحسين كفاءته لأقصى حد.

المرحلة السادسة: التقييم والمراجعة الذاتية
قيّم البرومبت وفق المعايير الستة: الوضوح، الدقة، الاكتمال، التخصص، قابلية التنفيذ، وجودة المخرجات المتوقعة.
امنح درجة من 100.
إذا كانت الدرجة أقل من 95، قم بإعادة معالجة البرومبت وتحسينه داخلياً تلقائياً حتى تتجاوز الدرجة 95/100 حتماً قبل إرسال النتيجة.

يجب أن تقوم بملء حقل 'rawText' وحقول الـ 'structured' باللغة العربية.
تأكد من صياغة الحقل 'rawText' بدقة تامة بحيث يطابق نصاً هذا التنسيق الحرفي تماماً:
تحليل الطلب
[اكتب التحليل هنا]

العناصر الناقصة التي تمت إضافتها
[اكتب العناصر الناقصة هنا]

البرومبت الاحترافي النهائي
[اكتب البرومبت النهائي كاملاً بالهيكل المطلوب هنا]

تقييم الجودة
الدرجة: [الدرجة هنا حتماً من 95 لـ 100]/100
نقاط القوة: [اكتب نقاط القوة هنا]
التحسينات المطبقة: [اكتب التحسينات هنا]
اقتراحات إضافية: [اكتب اقتراحات إضافية هنا] لتحقيق أقصى استفادة من مخرجات الذكاء الاصطناعي.`;

    const userPrompt = `قم بتحويل وتحسين المدخل التالي:
المدخل الخام: "${rawInput}"
${category ? `المجال المحدد: ${category}` : ""}
${tone ? `النبرة المفضلة: ${tone}` : ""}
${customRequirements ? `متطلبات إضافية خاصة بالمستخدم: ${customRequirements}` : ""}

تذكر، يجب أن تتخطى درجة التقييم حاجز الـ 95/100. أجب بصيغة JSON متوافقة تماماً مع المخطط (schema) المطلوب.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rawText: {
              type: Type.STRING,
              description: "النص الكامل المنسق باللغة العربية بنفس الترتيب والصيغة المطلوبة تماماً من المستخدم."
            },
            structured: {
              type: Type.OBJECT,
              properties: {
                analysis: {
                  type: Type.OBJECT,
                  properties: {
                    coreGoal: { type: Type.STRING },
                    hiddenGoal: { type: Type.STRING },
                    taskType: { type: Type.STRING },
                    targetAudience: { type: Type.STRING },
                    complexityLevel: { type: Type.STRING },
                    domain: { type: Type.STRING },
                    idealOutputs: { type: Type.STRING }
                  },
                  required: ["coreGoal", "hiddenGoal", "taskType", "targetAudience", "complexityLevel", "domain", "idealOutputs"]
                },
                category: { type: Type.STRING },
                engineeringFramework: { type: Type.STRING },
                missingElements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      element: { type: Type.STRING, description: "العنصر مثل الدور، السياق، القيود" },
                      status: { type: Type.STRING, description: "الحالة (تمت إضافته / تم تحسينه)" },
                      description: { type: Type.STRING, description: "التفصيل الذي تم افتراضه" }
                    },
                    required: ["element", "status", "description"]
                  }
                },
                finalPrompt: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    context: { type: Type.STRING },
                    objective: { type: Type.STRING },
                    input: { type: Type.STRING },
                    requirements: { type: Type.STRING },
                    constraints: { type: Type.STRING },
                    qualityStandards: { type: Type.STRING },
                    reasoningFramework: { type: Type.STRING },
                    outputFormat: { type: Type.STRING },
                    fullAssembledPrompt: { type: Type.STRING }
                  },
                  required: ["role", "context", "objective", "input", "requirements", "constraints", "qualityStandards", "reasoningFramework", "outputFormat", "fullAssembledPrompt"]
                },
                evaluation: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    appliedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    additionalSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["score", "strengths", "appliedImprovements", "additionalSuggestions"]
                }
              },
              required: ["analysis", "category", "engineeringFramework", "missingElements", "finalPrompt", "evaluation"]
            }
          },
          required: ["rawText", "structured"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("لم يتم استلام رد من النموذج.");
    }

    const parsedResult = JSON.parse(resultText);
    res.json(parsedResult);
  } catch (error: any) {
    console.error("خطأ في معالجة البرومبت:", error);
    res.status(500).json({ error: error?.message || "حدث خطأ غير متوقع أثناء معالجة البرومبت." });
  }
});

// Endpoint to test execution of the prompt inside a playground simulated engine
app.post("/api/test-prompt", async (req, res) => {
  try {
    const { promptToRun, testInput } = req.body;

    if (!promptToRun) {
      return res.status(400).json({ error: "الرجاء توفير البرومبت المراد اختباره." });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "مفتاح API غير متوفر للاختبار.",
      });
    }

    const testPrompt = `لقد قمت بتصميم برومبت مخصص فائق الجودة لمهمة معينة.
البرومبت المصمم هو:
"""
${promptToRun}
"""

الرجاء تطبيق هذا البرومبت بدقة واحترافية متناهية على المعطيات أو المدخلات التالية التي يوفرها المستخدم للاختبار:
"""
${testInput || "لا يوجد مدخل محدد للاختبار، افترض مثالاً منطقياً ونفذه."}
"""

قم بتقديم أفضل استجابة احترافية تعبر عن المخرجات المتوقعة لتوضيح جودة البرومبت وهندسته.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: testPrompt,
      config: {
        temperature: 0.5,
      }
    });

    res.json({ output: response.text });
  } catch (error: any) {
    console.error("خطأ أثناء اختبار البرومبت:", error);
    res.status(500).json({ error: error?.message || "فشل اختبار البرومبت في بيئة التشغيل." });
  }
});

// GET /api/history - Retrieve all prompt history items
app.get("/api/history", async (req, res) => {
  if (!isDbConnected) {
    return res.json([]); // Return empty list gracefully if DB not configured
  }
  try {
    const { rows } = await pool.query("SELECT * FROM prompt_history ORDER BY timestamp DESC");
    const mapped = rows.map(r => ({
      id: r.id,
      timestamp: r.timestamp,
      rawInput: r.raw_input,
      category: r.category,
      result: r.result
    }));
    res.json(mapped);
  } catch (err: any) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "فشل استرجاع الأرشيف من قاعدة البيانات." });
  }
});

// POST /api/history - Save a prompt history item
app.post("/api/history", async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ error: "قاعدة البيانات غير متصلة." });
  }
  try {
    const { id, timestamp, rawInput, category, result } = req.body;
    if (!id || !rawInput) {
      return res.status(400).json({ error: "بيانات الأرشيف غير مكتملة." });
    }
    await pool.query(
      "INSERT INTO prompt_history (id, timestamp, raw_input, category, result) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
      [id, timestamp, rawInput, category, JSON.stringify(result)]
    );
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error saving history:", err);
    res.status(500).json({ error: "فشل حفظ الأرشيف في قاعدة البيانات." });
  }
});

// DELETE /api/history/:id - Delete a prompt history item
app.delete("/api/history/:id", async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ error: "قاعدة البيانات غير متصلة." });
  }
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM prompt_history WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting history item:", err);
    res.status(500).json({ error: "فشل حذف العنصر من قاعدة البيانات." });
  }
});

// DELETE /api/history - Clear all prompt history items
app.delete("/api/history", async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ error: "قاعدة البيانات غير متصلة." });
  }
  try {
    await pool.query("DELETE FROM prompt_history");
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error clearing history:", err);
    res.status(500).json({ error: "فشل مسح الأرشيف من قاعدة البيانات." });
  }
});

// Vite Middleware for dev & static serving for production
async function runServer() {
  await initializeDatabase();
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
}

runServer();
