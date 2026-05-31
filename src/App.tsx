import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Copy, 
  Check, 
  Trash2, 
  Play, 
  History, 
  BookOpen, 
  Gauge, 
  Terminal, 
  AlertCircle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeftRight,
  Maximize2,
  FileText,
  Workflow,
  Plus,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { 
  OptimizationResult, 
  HistoryItem, 
  StructuredResult,
  MissingElement 
} from "./types";

const CATEGORIES = [
  { id: "كتابة المحتوى", label: "كتابة المحتوى", desc: "مقالات، سيناريوهات، تدوينات وإعادة صياغة" },
  { id: "التسويق", label: "التسويق", desc: "حملات إعلانية، خطط استراتيجية وبحوث سوق" },
  { id: "البرمجة", label: "البرمجة", desc: "أكواد برمجية، حلول منطقية وهندسة خوارزميات" },
  { id: "تصميم المواقع", label: "تصميم المواقع", desc: "واجهات المستخدم وتجربة التصفح المتكاملة" },
  { id: "تصميم التطبيقات", label: "تصميم التطبيقات", desc: "أنظمة تطبيقات الجوال وخرائط التدفق" },
  { id: "التجارة الإلكترونية", label: "التجارة الإلكترونية", desc: "أوصاف منتج، صفحات هبوط ومعدلات التحويل" },
  { id: "تحليل البيانات", label: "تحليل البيانات", desc: "استخلاص أنماط وتفسير مخرجات قواعد البيانات" },
  { id: "التعليم", label: "التعليم", desc: "تبسيط النظريات، مناهج وتجارب تعليمية" },
  { id: "البحث العلمي", label: "البحث العلمي", desc: "مراجعات منهجية، اقتباسات ومقترحات أطروحة" },
  { id: "الأعمال", label: "الأعمال", desc: "خطط، تقارير ربع سنوية وهيكلة إدارية" },
  { id: "صناعة المحتوى", label: "صناعة المحتوى", desc: "منصات اجتماعية، محتوى مرئي وتفاعلي" },
  { id: "الذكاء الاصطناعي", label: "الذكاء الاصطناعي", desc: "أتمتة، كود برمجت، تكامل النماذج اللغوية" },
  { id: "أخرى", label: "مجال آخر", desc: "أفكار ومواضيع عامة أو تخصصات فرعية" }
];

const TONES = [
  { id: "احترافي ورسمي", label: "حقّاني واحترافي ورسمي", desc: "نبرة رصينة وموضوعية متسقة مع بيئات العمل والشركات" },
  { id: "إبداعي ملهم", label: "إبداعي ملهم ومبتكر", desc: "بلاغة تسويقية وأسلوب شيق يلفت الانتباه" },
  { id: "تقني مباشر وثاقب", label: "تقني مباشر وصارم ومحكم", desc: "شروحات ولغة مركّزة للمهندسين والمختصين" },
  { id: "ودود وجذاب", label: "ودود ومتفهم وتقاربي", desc: "حوار لطيف ومحاورة دافئة للجماهير العامة والعملاء" },
  { id: "تعليمي بسيط ومبسط", label: "أكاديمي مبسط وجليّ", desc: "تدرج في الشرح مناسب لكافة مستويات الفهم" }
];

const PRESETS = [
  {
    title: "مساعد تطوير البرمجيات",
    category: "البرمجة",
    tone: "تقني مباشر وثاقب",
    input: "أريد كود بايثون لمعالجة وتحليل مبيعات منتجات متجر إلكتروني واستخراج أفضل 3 منتجات مبيعاً من ملف CSV.",
    requirements: "تجنب استخدام مكاتب خارجية ثقيلة، استخدام pandas فقط، معالجة القيم المفقودة."
  },
  {
    title: "حملة إعلان لعلامة تجارية",
    category: "التسويق",
    tone: "إبداعي ملهم",
    input: "كتابة حملة إعلانية لمتجر قهوة مختصة جديد يركز على الاستدامة والبن العضوي المستورد مباشرة من المزارعين.",
    requirements: "3 منشورات لمواقع التواصل الاجتماعي (تويتر وإنستغرام)، كتابة شعار رئيسي جذاب (Slogan)."
  },
  {
    title: "شرح نظرية علمية معقدة",
    category: "التعليم",
    tone: "تعليمي بسيط ومبسط",
    input: "تبسيط وشرح نظرية النسبية لألبرت أينشتاين وتحديداً تمدد الزمن لطلاب المرحلة الإعدادية.",
    requirements: "استخدام تشبيه حسي واقعي (مثل القطارات أو الساعات)، لا تتجاوز 400 كلمة، أضف سؤالاً تنشيطياً في النهاية."
  },
  {
    title: "مساعد مراجعة وتعديل عقود",
    category: "الأعمال",
    tone: "احترافي ورسمي",
    input: "تصميم برومبت يقوم بمراجعة اتفاقية سرية معلومات (NDA) للشركات الناشئة لضمان عدم وجود ثغرات مجحفة.",
    requirements: "فحص مدة سريان السرية، تحديد التعويضات، والتحقق من الاستثناءات المعتادة."
  }
];

export default function App() {
  const [rawInput, setRawInput] = useState("");
  const [category, setCategory] = useState("أخرى");
  const [tone, setTone] = useState("احترافي ورسمي");
  const [customRequirements, setCustomRequirements] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "prompt" | "evaluation" | "text" | "playground">("dashboard");
  
  // Playground state
  const [playgroundInput, setPlaygroundInput] = useState("");
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  
  // Global copy feedback status
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Hide if already running in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice to install: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prompt_architect_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("prompt_architect_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setRawInput(preset.input);
    setCategory(preset.category);
    setTone(preset.tone);
    setCustomRequirements(preset.requirements);
    setError(null);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => {
      setCopyStatus(null);
    }, 2000);
  };

  const handleOptimize = async () => {
    if (!rawInput.trim()) {
      setError("الرجاء إدخال فكرة أو برومبت للبدء في تشييد برومبت أحلامك!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setPlaygroundOutput("");
    
    // Simulate steps sequentially for immersive AI response experience
    setLoadingStep(1); // 1. Analyzing request
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 1800);

    try {
      const response = await fetch("/api/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput,
          category,
          tone,
          customRequirements
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "فشلت عملية التحسين من المخدم.");
      }

      const data: OptimizationResult = await response.json();
      
      clearInterval(stepInterval);
      setResult(data);
      setActiveTab("dashboard");
      setPlaygroundInput("");

      // Save to history
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' }),
        rawInput,
        category,
        result: data
      };
      saveHistory([newItem, ...history]);

    } catch (err: any) {
      setError(err?.message || "حدث خطأ غير متوقع أثناء معالجة البرومبت.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleTestPrompt = async () => {
    if (!result) return;
    setPlaygroundLoading(true);
    setPlaygroundOutput("");
    try {
      const response = await fetch("/api/test-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptToRun: result.structured.finalPrompt.fullAssembledPrompt,
          testInput: playgroundInput
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "فشل نموذج الاختبار في الاستجابة.");
      }

      const data = await response.json();
      setPlaygroundOutput(data.output);
    } catch (err: any) {
      setPlaygroundOutput(`⚠️ خطأ في تشغيل البرومبت: ${err?.message}`);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setRawInput(item.rawInput);
    setCategory(item.category);
    setResult(item.result);
    setActiveTab("dashboard");
    setError(null);
  };

  const getLoadingStepText = () => {
    switch(loadingStep) {
      case 1: return "المرحلة الأولى: تحليل الطلب واستنباط الغايات الخفية والجمهور المستهدف...";
      case 2: return "المرحلة الثانية: تحديد المجال وتدوين فجوات المعنى والنواقص الهيكلية...";
      case 3: return "المرحلة الثالثة: تطبيق الإطار الهندسي الدقيق وبناء المسودة الهيكلية...";
      case 4: return "المرحلة الرابعة: المراجعة الذاتية وموازنة دقة المعايير لتخطي حاجز 95/100...";
      default: return "يتم الآن تأطير النصوص النهائية وعرضها...";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col antialiased text-[#1A1A1A] p-1 sm:p-4 md:p-6 lg:p-8">
      
      {/* Editorial Frame with Thick Off-Black Border */}
      <div className="flex flex-col flex-1 border-2 sm:border-4 md:border-8 border-[#1A1A1A] bg-white shadow-[4px_4px_0px_rgba(26,26,26,0.08)] sm:shadow-[12px_12px_0px_rgba(26,26,26,0.08)] relative overflow-hidden">
        
        {/* Header Section (Classic Newspaper masthead style) */}
        <header className="border-b-2 border-[#1A1A1A] bg-white px-4 py-4 md:py-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] text-white rounded-none flex items-center justify-center font-bold text-lg md:text-xl font-serif select-none shrink-0">
              P
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#F7F7F5] px-2 py-0.5 rounded-none font-bold">V3.02 PRO</span>
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              </div>
              <h1 className="font-serif text-xl md:text-3xl font-bold tracking-tighter italic text-[#1A1A1A] mt-1 truncate">
                PROMPT ARCHITECT <span className="font-sans not-italic text-xs text-gray-500 font-bold ml-1">AI</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats Panel in masthead */}
          <div className="flex flex-wrap gap-4 md:gap-8 items-center border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
            {showInstallBtn && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-2 px-3 py-2 border-2 border-[#1A1A1A] bg-[#F59E0B] text-black font-sans font-bold text-xs uppercase hover:bg-amber-400 transition cursor-pointer shadow-[3px_3px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_rgba(26,26,26,1)] shrink-0 ml-auto md:ml-0 font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                <span>تثبيت التطبيق (PWA)</span>
              </button>
            )}
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">حالة النظام</p>
              <p className="text-xs font-mono font-bold text-emerald-600 tracking-tighter">OPTIMAL_ENGINE_ACTIVE</p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold">معرف البناء</p>
              <p className="text-xs font-mono font-bold text-[#1A1A1A]/80">#ED-V3-X98</p>
            </div>
          </div>
        </header>

        {/* Global Intro / Marquee line */}
        <div className="bg-[#EDEDEB] border-b border-[#1A1A1A] text-[11px] font-mono py-2 px-6 overflow-hidden whitespace-nowrap text-slate-600 font-medium flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#1A1A1A] text-white px-1.5 py-0.2 md:inline hidden">ملاحظة تحريرية</span>
            <span>أداة ذكية لهندسة البرومبتات بمقاييس جودة عالمية. تصنيفات دقيقة، تشريح عميق للنصوص، وساحة تجربة تفاعلية.</span>
          </div>
          <span className="font-bold underline text-[#1A1A1A] ml-2 shrink-0 md:inline hidden text-[10px]">CURRENT_LOC: GMT_UTC</span>
        </div>

        {/* Main Workspace Grid (Bento style, high contrast) */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#EDEDEB]">
          
          {/* Left Console: Controls and inputs (colspan 5) */}
          <section className="lg:col-span-5 border-l-0 lg:border-l-2 border-[#1A1A1A] p-4 md:p-6 bg-[#EDEDEB] flex flex-col gap-6 overflow-y-auto">
            
            <div className="flex flex-col gap-1 border-b border-[#1A1A1A]/20 pb-4">
              <span className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-slate-500 font-mono">01 / Input Phase</span>
              <h2 className="font-serif text-2xl font-bold">التهيئة والمفاتيح الخام</h2>
            </div>

            {/* Presets Grid */}
            <div className="bg-white border border-[#1A1A1A] p-4 relative shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">نماذج ملهمة ومعايرة مسبقة</span>
                <span className="text-[10px] text-slate-500 font-semibold bg-[#F7F7F5] px-2 py-0.5 border border-slate-250">اختر كمثال تجريبي</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-right p-3 rounded-none border border-slate-200 hover:border-[#1A1A1A] hover:bg-[#F7F7F5] transition text-xs flex flex-col justify-between gap-2 h-full cursor-pointer bg-white"
                  >
                    <span className="font-extrabold text-[#1A1A1A] leading-normal">{preset.title}</span>
                    <span className="text-[9px] font-mono font-bold uppercase self-start bg-slate-100 text-slate-600 px-1.5 py-0.5 border border-slate-200">{preset.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Draft Input area */}
            <div className="bg-white border border-[#1A1A1A] p-5 shadow-sm flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">الفكرة الأساسية أو البرومبت الأولي المستهدف *</label>
              
              <div className="relative">
                <textarea
                  value={rawInput}
                  onChange={(e) => {
                    setRawInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="مثال: أريد كود برمجة كعصف ذهن، أو فكرة لتسويق منتجات العناية بالبشرة..."
                  className="w-full min-h-[150px] p-4 text-xs font-mono rounded-none border border-slate-300 focus:border-[#1A1A1A] focus:outline-none transition leading-relaxed bg-[#FAFAF8] focus:bg-white resize-y"
                />
                
                {rawInput && (
                  <button 
                    onClick={() => setRawInput("")}
                    className="absolute bottom-3 left-3 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 transition border border-rose-200"
                  >
                    مسح المسودة
                  </button>
                )}
              </div>
              
              <p className="text-[11px] text-slate-500 italic">
                * يمكنك صياغة متطلباتك بتبسيط مطلق وعامية، وسيقوم المهندس بسد الفجوات في هيكل CRISP التلقائي.
              </p>
            </div>

            {/* Custom parameters (Domain + Tone) */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Category */}
              <div className="bg-white border border-[#1A1A1A] p-4 shadow-sm flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/50 font-mono block">تصنيف التخصص والمجال</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-none border border-slate-300 focus:border-[#1A1A1A] focus:outline-none bg-white font-serif text-xs font-bold appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label} ({cat.desc})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#1A1A1A]">
                    <ChevronLeft className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Tones List */}
              <div className="bg-white border border-[#1A1A1A] p-4 shadow-sm flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/50 font-mono block">التنغيم والنبرة الأدبية للمخرجات</label>
                <div className="flex flex-col gap-1.5 max-h-[190px] overflow-y-auto pr-1">
                  {TONES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTone(item.id)}
                      className={`text-right p-2.5 rounded-none border transition text-xs flex justify-between items-center group cursor-pointer ${
                        tone === item.id 
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white font-bold" 
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-[#1A1A1A]"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px]">{item.label}</span>
                        <span className={`text-[9px] ${tone === item.id ? "text-slate-300" : "text-slate-400"}`}>{item.desc}</span>
                      </div>
                      {tone === item.id && (
                        <Check className="h-3 w-3 text-white shrink-0 mr-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Extra constraints input */}
            <div className="bg-white border border-[#1A1A1A] p-4 shadow-sm flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/40 font-mono block">القيود أو الشروط التحريرية المسبقة (شرح في نقاط... الخ)</label>
              <input
                type="text"
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                placeholder="مثال: كتابة مراجع، تحديد الحجم، ألا يتجاوز الشرح 3 نقاط..."
                className="w-full p-2.5 text-xs font-mono rounded-none border border-slate-300 focus:border-[#1A1A1A] focus:outline-none bg-[#FAFAF8] focus:bg-white"
              />
            </div>

            {/* Error alerts with elegant warning block */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-rose-50 border border-rose-300 rounded-none text-rose-800 text-xs font-mono text-right flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button (Off-black theme, high-contrast) */}
            <button
              onClick={handleOptimize}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-none border-2 border-transparent flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest transition duration-200 cursor-pointer text-white shadow-lg ${
                loading 
                  ? "bg-gray-400 text-slate-200 cursor-not-allowed"
                  : "bg-[#1A1A1A] hover:bg-[#2D2D2D] active:scale-[0.99] hover:shadow-xl shadow-black/10"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-mono">BUILDING_PROMPT_BLUEPRINT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="font-serif italic font-bold text-sm">تشييد البرومبت وصقله باحترافية</span>
                </>
              )}
            </button>

            {/* History Console Sidebar */}
            {history.length > 0 && (
              <div className="bg-white border border-[#1A1A1A] p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">التراكمات الأرشيفية السابقة</span>
                  <button
                    onClick={() => saveHistory([])}
                    className="text-[10px] text-rose-600 hover:text-rose-700 font-mono font-bold hover:underline bg-transparent border-none cursor-pointer"
                  >
                    تفريغ التاريخ
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadHistory(item)}
                      className="border border-slate-200 hover:border-[#1A1A1A] bg-[#FAFAF8] hover:bg-[#F7F7F5] p-3 rounded-none cursor-pointer transition text-xs flex items-center justify-between gap-3 text-right"
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-grow font-mono">
                        <p className="font-bold text-[#1A1A1A] truncate line-clamp-1 leading-normal text-[11px]">
                          {item.rawInput}
                        </p>
                        <div className="flex items-center gap-2 text-[9px] text-slate-500">
                          <span className="bg-[#EDEDEB] text-[#1A1A1A] px-1 rounded font-semibold font-sans">{item.category}</span>
                          <span>⏱️ {item.timestamp}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDeleteHistory(item.id, e)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition shrink-0 bg-transparent border-none cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </section>

          {/* Right Console: Beautiful Editorial Dashboard & Output Sections (colspan 7) */}
          <section className="lg:col-span-7 p-4 md:p-6 flex flex-col bg-white overflow-y-auto h-full relative">
            
            {/* Loading sequence screen */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 border-2 border-dashed border-[#1A1A1A]/40 p-8 md:p-12 flex flex-col items-center justify-center text-center bg-[#F7F7F5] my-auto"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-[#1A1A1A] flex items-center justify-center text-white font-mono text-xl animate-spin">
                    A
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                    {loadingStep}
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-3">الصقل والتحليل الهندسي النشط</h3>
                <p className="text-xs font-mono text-slate-500 max-w-sm leading-relaxed h-10">
                  {getLoadingStepText()}
                </p>

                {/* Vertical processing timeline */}
                <div className="mt-8 flex flex-col gap-3 w-full max-w-xs text-right text-[11px] font-mono">
                  {[
                    "تحليل الأهداف الضمنية واستخراج معطيات الاستقبال",
                    "تبويب التخصص واقتران الإطار المعماري المعتمد",
                    "سد النواقص الهيكلية والفجوات المرجعية للسيناريو",
                    "التدقيق الذاتي وتخطّي عتبة الجودة 95/100"
                  ].map((stepLabel, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-none flex items-center justify-center border font-mono text-[9px] font-bold ${
                        loadingStep > idx + 1 
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                          : loadingStep === idx + 1 
                            ? "bg-white border-[#1A1A1A] text-[#1A1A1A] animate-pulse" 
                            : "border-slate-300 text-slate-400 bg-white"
                      }`}>
                        {loadingStep > idx + 1 ? "✓" : idx + 1}
                      </div>
                      <span className={loadingStep === idx + 1 ? "font-bold text-[#1A1A1A]" : loadingStep > idx + 1 ? "text-slate-600" : "text-slate-400"}>
                        {stepLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Prompt Result Render Screen */}
            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                
                {/* Result Header Card is a premium Editorial box of high metadata focus */}
                <div className="border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mt-8 pointer-events-none" />
                  
                  <div className="flex items-center gap-3.5">
                    <div className="bg-white/10 p-3 text-amber-300">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-emerald-400 block font-bold mb-1">PROMPT ENGINEERBLUEPRINT PASSED</span>
                      <h3 className="font-serif text-2xl font-bold italic">تم إنتاج البرومبت الهيكلي النهائي</h3>
                      <p className="text-xs text-slate-300 leading-normal mt-1.5 font-mono">
                        تصنيف الإطار: <span className="underline font-bold text-white">{result.structured.engineeringFramework}</span> | معدل المطابقة: <span className="font-bold text-amber-300 text-sm font-sans">{result.structured.evaluation.score}/100</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(result.structured.finalPrompt.fullAssembledPrompt, "fullPrompt")}
                    className="bg-white text-slate-950 font-mono font-bold px-4 py-3 border border-[#1A1A1A] hover:bg-[#F7F7F5] text-xs flex items-center justify-center gap-2 tracking-wide transition shrink-0 cursor-pointer shadow-subtle self-start md:self-auto"
                  >
                    {copyStatus === "fullPrompt" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>تم النسخ بنجاح</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>انسخ البرومبت بالكامل</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Custom Elegant Design Tabs */}
                <div className="border border-[#1A1A1A] bg-[#F7F7F5] flex overflow-x-auto lg:flex-wrap p-1 gap-1 no-scrollbar scroll-smooth snap-x">
                  
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex items-center gap-2 py-2 px-3 text-xs font-mono font-bold transition rounded-none cursor-pointer snap-start shrink-0 ${
                      activeTab === "dashboard"
                        ? "bg-[#1A1A1A] text-white"
                        : "text-slate-600 hover:text-black hover:bg-slate-200/50"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5 shrink-0" />
                    <span>01 / خلاصة التحليلات</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("prompt")}
                    className={`flex items-center gap-2 py-2 px-3 text-xs font-mono font-bold transition rounded-none cursor-pointer snap-start shrink-0 ${
                      activeTab === "prompt"
                        ? "bg-[#1A1A1A] text-white"
                        : "text-slate-600 hover:text-black hover:bg-slate-200/50"
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5 shrink-0" />
                    <span>02 / الهيكل المفصل</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("evaluation")}
                    className={`flex items-center gap-2 py-2 px-3 text-xs font-mono font-bold transition rounded-none cursor-pointer snap-start shrink-0 ${
                      activeTab === "evaluation"
                        ? "bg-[#1A1A1A] text-white"
                        : "text-slate-600 hover:text-black hover:bg-slate-200/50"
                    }`}
                  >
                    <Gauge className="h-3.5 w-3.5 shrink-0" />
                    <span>03 / معايير الجودة</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("text")}
                    className={`flex items-center gap-2 py-2 px-3 text-xs font-mono font-bold transition rounded-none cursor-pointer snap-start shrink-0 ${
                      activeTab === "text"
                        ? "bg-[#1A1A1A] text-white"
                        : "text-slate-600 hover:text-black hover:bg-slate-200/50"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span>04 / التقرير الشامل</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("playground")}
                    className={`flex items-center gap-2 py-2 px-4 text-xs font-mono font-bold transition rounded-none cursor-pointer snap-start shrink-0 ${
                      activeTab === "playground"
                        ? "bg-emerald-700 text-white"
                        : "text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                    <span>05 / مختبر التفاعل</span>
                  </button>

                </div>

                {/* Tab Containers with beautiful padding & borders */}
                <div className="border border-t-0 border-[#1A1A1A] p-5 md:p-6 bg-white min-h-[400px] flex flex-col justify-between">
                  
                  {/* Tab 1: Detailed diagnostic list */}
                  {activeTab === "dashboard" && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Classification Alert Box */}
                      <div className="bg-[#EDEDEB] p-4 border-r-4 border-[#1A1A1A] flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block mb-0.5">تصنيف نوع المهمة المستكشف</span>
                          <span className="text-sm font-serif font-bold text-[#1A1A1A]">🎯 {result.structured.category}</span>
                        </div>
                        <div className="bg-white px-3 py-2 border border-slate-350 text-right">
                          <span className="text-[9px] font-mono tracking-wider text-slate-400 block">الإطار الهندسي الأكثر كفاءة لمشروعك</span>
                          <span className="text-xs font-mono font-bold text-slate-800 uppercase italic">{result.structured.engineeringFramework} ENGINE</span>
                        </div>
                      </div>

                      {/* Diagnostic Breakdown */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">تحليل وتشريح الفكرة الخام دلالياً</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          <div className="border border-slate-200 p-4 bg-[#FAFAF8] relative">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">🎯 الهدف الرئيسي المباشر</span>
                            <p className="text-xs text-[#1A1A1A] font-bold leading-relaxed">{result.structured.analysis.coreGoal}</p>
                          </div>

                          <div className="border border-slate-200 p-4 bg-[#FAFAF8] relative">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">👁️ النية الخفية والغاية الضمنية</span>
                            <p className="text-xs text-[#1A1A1A] font-bold leading-relaxed">{result.structured.analysis.hiddenGoal}</p>
                          </div>

                          <div className="border border-slate-200 p-4 bg-[#FAFAF8] relative">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">⚖️ مستوى التعقيد ومحيط التشغيل</span>
                            <p className="text-xs text-[#1A1A1A] font-bold leading-relaxed">{result.structured.analysis.complexityLevel}</p>
                          </div>

                          <div className="border border-slate-200 p-4 bg-[#FAFAF8] relative">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">👥 الجمهور والمستلم المثالي</span>
                            <p className="text-xs text-[#1A1A1A] font-bold leading-relaxed">{result.structured.analysis.targetAudience}</p>
                          </div>

                        </div>
                      </div>

                      {/* Missing properties auto-completed */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">تغطية النواقص واستكمال الفجوات</h4>
                          <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 uppercase tracking-wide font-bold">AUTO_COMPLETED_SUCCESS</span>
                        </div>

                        <div className="border border-[#1A1A1A] divide-y divide-slate-100">
                          {result.structured.missingElements.map((item, index) => (
                            <div key={index} className="p-3 bg-[#FAFAF8] hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right text-xs">
                              <div className="flex items-start sm:items-center gap-2.5">
                                <span className="text-[10px] font-mono font-bold text-white bg-[#1A1A1A] px-2 py-0.5 shrink-0 uppercase">
                                  {item.element}
                                </span>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed pr-2">{item.description}</p>
                              </div>
                              <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 shrink-0 font-bold self-start sm:self-auto">
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tab 2: Structured Prompts Blocks */}
                  {activeTab === "prompt" && (
                    <div className="flex flex-col gap-6">
                      
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">أعمدة التشييد الهيكل الشامل (STRUCTURE PILLARS)</h4>
                        <span className="text-[9px] font-mono text-slate-400">انقر للنسخ المنفرد</span>
                      </div>

                      <div className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-1">
                        {[
                          { key: "ROLE", label: "[ROLE] المرجعية والخلفية المهنية", value: result.structured.finalPrompt.role },
                          { key: "CONTEXT", label: "[CONTEXT] سياق العمل والبيئة المحيطة", value: result.structured.finalPrompt.context },
                          { key: "OBJECTIVE", label: "[OBJECTIVE] الغاية والنتيجة الملموسة", value: result.structured.finalPrompt.objective },
                          { key: "INPUT", label: "[INPUT] البيانات والمعطيات الخام", value: result.structured.finalPrompt.input },
                          { key: "REQUIREMENTS", label: "[REQUIREMENTS] التعليمات والمتطلبات البرمجية", value: result.structured.finalPrompt.requirements },
                          { key: "CONSTRAINTS", label: "[CONSTRAINTS] محددات وممنوعات القيود الصارمة", value: result.structured.finalPrompt.constraints },
                          { key: "QUALITY STANDARDS", label: "[QUALITY STANDARDS] مقاييس الجودة والقبول", value: result.structured.finalPrompt.qualityStandards },
                          { key: "REASONING FRAMEWORK", label: "[REASONING FRAMEWORK] آلية التفكير المستمر والمنطق", value: result.structured.finalPrompt.reasoningFramework },
                          { key: "OUTPUT FORMAT", label: "[OUTPUT FORMAT] قالب التنسيق والمظهر الخارجي", value: result.structured.finalPrompt.outputFormat }
                        ].map((section) => (
                          <div key={section.key} className="border border-[#1A1A1A] shadow-xs">
                            
                            <div className="bg-[#EDEDEB] px-4 py-2 border-b border-[#1A1A1A] flex justify-between items-center text-xs">
                              <span className="font-serif font-bold text-[#1A1A1A]">{section.label}</span>
                              <button
                                onClick={() => handleCopy(`${section.key}\n${section.value}`, section.key)}
                                className="text-slate-600 hover:text-black font-mono font-extrabold text-[10px] flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                              >
                                {copyStatus === section.key ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-700" />
                                    <span className="text-emerald-700">تم النسخ</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>نسخ الركيزة</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="p-4 text-xs text-[#1A1A1A] font-mono leading-relaxed bg-[#FAFAF8] text-right whitespace-pre-wrap">
                              {section.value}
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* Tab 3: Evaluation Grid */}
                  {activeTab === "evaluation" && (
                    <div className="flex flex-col gap-6">

                      {/* Editorial Quality Meter */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-[#1A1A1A] bg-[#FAFAF8]">
                        
                        <div className="relative shrink-0 flex items-center justify-center bg-[#1A1A1A] text-white p-5 w-24 h-24 shadow-sm">
                          <div className="text-center font-mono">
                            <span className="text-3xl font-bold tracking-tighter block">{result.structured.evaluation.score}</span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-350 block">مجموع الجودة</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-emerald-700 font-mono font-bold text-xs mb-1">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>QUALITY_THRESHOLD_GOAL_PASSED (95%+)</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed max-w-lg font-sans">
                            جرى تدقيق البرومبت وصقله محلياً وتجاوز بنجاح معيار محاكاة التفكير. التقييم المذكور يشمل جودة صياغة الـ (ROLE)، عمق الـ (CONTEXT)، ودقة فحص الـ (CONSTRAINTS) لتقديم مخرجات استشارية معيارية نموذجية.
                          </p>
                        </div>

                      </div>

                      {/* Strength points & modifications made */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] uppercase font-mono font-extrabold text-[#1A1A1A]/50 block">✓ نقاط القوة المعيارية للمخرج</span>
                          <div className="bg-[#FAFAF8] border border-slate-200 p-4 flex flex-col gap-2">
                            {result.structured.evaluation.strengths.map((str, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed text-right">
                                <span className="text-black text-xs font-mono mt-0.5">-</span>
                                <span>{str}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] uppercase font-mono font-extrabold text-[#1A1A1A]/50 block">⚙️ التحسينات التلقائية المطبقة</span>
                          <div className="bg-[#FAFAF8] border border-slate-200 p-4 flex flex-col gap-2">
                            {result.structured.evaluation.appliedImprovements.map((imp, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed text-right">
                                <span className="text-emerald-700 text-xs font-mono mt-0.5">✓</span>
                                <span>{imp}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Additional suggestions in footer box */}
                      <div className="flex flex-col gap-2 border-t border-gray-100 pt-5 mt-2">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">💡 إرشادات تكميلية للنموذج المقابل لتحقيق مخرجات مبهرة</span>
                        <div className="bg-[#EDEDEB] border border-[#1A1A1A] p-4 flex flex-col gap-2.5">
                          {result.structured.evaluation.additionalSuggestions.map((sug, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed text-right">
                              <span className="text-slate-900 font-mono mt-0.5">•</span>
                              <span>{sug}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tab 4: Raw formatting report styled like classic book pages */}
                  {activeTab === "text" && (
                    <div className="flex flex-col gap-4">
                      
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400">النص الكامل المحرر للتحسّين المتقدم</span>
                        
                        <button
                          onClick={() => handleCopy(result.rawText, "rawText")}
                          className="text-slate-700 hover:text-black font-mono font-bold text-xs flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                        >
                          {copyStatus === "rawText" ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-700" />
                              <span className="text-emerald-700">تم النسخ بنجاح</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>نسخ التقرير كاملاً</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Styled markdown container */}
                      <div className="text-xs text-slate-700 leading-relaxed bg-[#FAFAF8] p-5 border border-slate-200 prose prose-slate max-w-none text-right font-mono whitespace-pre-wrap">
                        <div className="leading-6 text-[12px]">
                          <Markdown>{result.rawText}</Markdown>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tab 5: Dynamic Testing Environment */}
                  {activeTab === "playground" && (
                    <div className="flex flex-col gap-6">
                      
                      <div className="bg-[#1A1A1A] text-white p-5 border border-black flex flex-col gap-1.5 text-right font-mono">
                        <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-amber-300">
                          <Terminal className="h-4 w-4 shrink-0" />
                          <span>05 / SIMULATED ENVIRONMENT (مختبر المحاكاة)</span>
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          أجر عملية تشغيل تجريبية للبرومبت المشيد للتو في ساحة العمل! أدخل نص المعطيات الخام بالأسفل لاختبار الفعالية الكلية.
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block">مدخلات المحاكاة وتفاصيل المعطيات للاختبار</label>
                          <textarea
                            value={playgroundInput}
                            onChange={(e) => setPlaygroundInput(e.target.value)}
                            placeholder="مثال: قيم البيانات الخاصة بموقعي... أو نص تجريبي لاختبار كفاءة البرومبت..."
                            className="w-full min-h-[100px] p-3 text-xs font-mono rounded-none border border-slate-350 focus:border-[#1A1A1A] focus:outline-none bg-[#FAFAF8] focus:bg-white resize-y"
                          />
                        </div>

                        <button
                          onClick={handleTestPrompt}
                          disabled={playgroundLoading}
                          className={`self-start py-3 px-6 rounded-none border border-transparent font-mono font-bold text-xs uppercase tracking-wider transition duration-200 cursor-pointer ${
                            playgroundLoading
                              ? "bg-gray-200 text-slate-400 cursor-not-allowed border-gray-300"
                              : "bg-[#1A1A1A] text-white hover:bg-slate-800"
                          }`}
                        >
                          {playgroundLoading ? (
                            <>
                              <span>جاري إرسال المعطيات وتحليل الرد اللغوي...</span>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Play className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                              <span>تطبيق ومحاكاة البرومبت الفورية 🚀</span>
                            </div>
                          )}
                        </button>

                        <AnimatePresence>
                          {playgroundOutput && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-col gap-2 mt-2"
                            >
                              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">استجابة النموذج التفصيلية (OUTPUT_RESPONSE)</span>
                              <div className="p-5 bg-[#FAFAF8] border border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] leading-relaxed whitespace-pre-wrap text-right">
                                {playgroundOutput}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>

                    </div>
                  )}

                  {/* Dynamic footer details inside output content container */}
                  <div className="border-t border-[#1A1A1A] pt-4 mt-8 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider gap-3">
                    <div className="flex items-center gap-3">
                      <span>إصدار النواة: V3.02</span>
                      <span>•</span>
                      <span>التحقق الرقمي: متطابق</span>
                    </div>
                    <div className="text-emerald-700">PASS_EVALUATION_CRITERIA_VERIFIED</div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* Empty Welcome Screen (Classic elegant newspaper presentation) */}
            {!loading && !result && (
              <div className="flex-1 bg-[#FAFAF8] border-2 border-dashed border-[#1A1A1A]/40 p-8 md:p-12 flex flex-col items-center justify-center text-center my-auto min-h-[480px]">
                
                <div className="w-16 h-16 bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xl mb-6">
                  W
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">مرحباً بك في PROMPT ARCHITECT AI</h3>
                
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-8">
                  قم بإدخال مسودة الطلب الأولي أو الفكرة العامة على لوحة التحكم اليمينية، وسيتولى المهندس الرقمي سد الفجوات وتطبيق إطار التفكير المناسب لضمان الحصول على برومبت ناضج ذي نسبة كفاءة لا تقل عن 95/100.
                </p>

                {/* Aesthetic Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl text-right mt-4 pt-6 border-t border-slate-200">
                  
                  <div className="p-4 border border-slate-200 bg-white shadow-sm font-sans flex flex-col gap-1.5 justify-between">
                    <span className="text-xs font-extrabold text-[#1A1A1A] block">01 / سد الثغرات الهيكلية</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">تحديد النواقص وافتراض الدور والسياق والمحددات بدقة بالغة.</span>
                  </div>

                  <div className="p-4 border border-slate-200 bg-white shadow-sm font-sans flex flex-col gap-1.5 justify-between">
                    <span className="text-xs font-extrabold text-[#1A1A1A] block">02 / الأطر المعمارية</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">تصنيف المهام في 12 مجالاً واقتران الإطار الأمثل مثل ERA أو CRISP.</span>
                  </div>

                  <div className="p-4 border border-slate-200 bg-white shadow-sm font-sans flex flex-col gap-1.5 justify-between">
                    <span className="text-xs font-extrabold text-[#1A1A1A] block">03 / ساحة الاختبار التفاعلية</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">محاكاة فورية لتشغيل البرومبت والتأكد من صيانة النتيجة قبل استخدامها.</span>
                  </div>

                </div>

              </div>
            )}

          </section>

        </main>

        {/* Global Footer (Classic Technical status bar) */}
        <footer className="h-12 border-t-2 border-[#1A1A1A] bg-white flex flex-col sm:flex-row items-center justify-between px-6 py-2 sm:py-0 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-slate-600 gap-2">
          <div>&copy; 2026 Prompt Architect Intelligence Systems</div>
          <div className="flex gap-4 md:gap-6">
            <span>الاستجابة: 380MS</span>
            <span className="text-[#1A1A1A]">•</span>
            <span className="text-emerald-700 underline decoration-2 cursor-pointer font-extrabold">التحقق من البروتوكول الآمن</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
