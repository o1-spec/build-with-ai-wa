import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  Send, 
  MapPin, 
  Sprout, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Globe,
  ChevronDown,
  Leaf,
  AlertCircle
} from 'lucide-react';
import { analyzeCropIssue, AnalysisResult } from './services/geminiService';

// --- Types ---
type Language = 'English' | 'Yoruba' | 'Hausa' | 'Igbo';

interface Translations {
  tagline: string;
  farmerInput: string;
  inputSubtitle: string;
  cropType: string;
  selectCrop: string;
  location: string;
  locationPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  sampleVoiceMessage: string;
  voiceInput: string;
  listening: string;
  submit: string;
  analyzing: string;
  readyTitle: string;
  readySubtitle: string;
  analyzingTitle: string;
  analyzingSubtitle: string;
  aiResponse: string;
  responseSubtitle: string;
  likelyIssue: string;
  immediateAction: string;
  prevention: string;
  riskLevel: string;
  startNew: string;
  low: string;
  medium: string;
  high: string;
  whyAgriMind: string;
  whyAgriMindText: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  English: {
    tagline: "Helping farmers make better decisions in their own language",
    farmerInput: "Farmer Input",
    inputSubtitle: "Tell us what's happening in your farm. You can type or use your voice.",
    cropType: "Crop Type",
    selectCrop: "Select Crop",
    location: "Location",
    locationPlaceholder: "e.g. Ibadan, Oyo",
    messageLabel: "Your Message",
    messagePlaceholder: "Describe the issue with your crop...",
    sampleVoiceMessage: "I noticed some small holes in the leaves of my maize plants and some brown dust near the stems.",
    voiceInput: "Use Voice Input",
    listening: "Listening...",
    submit: "Submit Report",
    analyzing: "Analyzing...",
    readyTitle: "Ready to Assist",
    readySubtitle: "Submit your farm details to receive an instant AI diagnosis and action plan.",
    analyzingTitle: "Analyzing your farm data...",
    analyzingSubtitle: "Consulting our agricultural database",
    aiResponse: "AI Response",
    responseSubtitle: "Based on your description and location.",
    likelyIssue: "Likely Issue",
    immediateAction: "Immediate Action",
    prevention: "Prevention",
    riskLevel: "Risk",
    startNew: "Start New Analysis",
    low: "Low",
    medium: "Medium",
    high: "High",
    whyAgriMind: "Why AgriMind?",
    whyAgriMindText: "AgriMind Voice is designed to provide localized farming guidance, responding based on your specific crop type, location, and multilingual input."
  },
  Yoruba: {
    tagline: "Riran awọn agbe lọwọ lati ṣe awọn ipinnu to dara julọ ni ede tiwọn",
    farmerInput: "Alaye Agbe",
    inputSubtitle: "Sọ ohun ti n ṣẹlẹ ni oko rẹ fun wa. O le tẹ ẹ tabi lo ohun rẹ.",
    cropType: "Iru Ohun-ọgbin",
    selectCrop: "Yan Ohun-ọgbin",
    location: "Ibi ti o wa",
    locationPlaceholder: "apẹẹrẹ: Ibadan, Oyo",
    messageLabel: "Iṣẹ Rẹ",
    messagePlaceholder: "Ṣapejuwe iṣoro ti o ni pẹlu ohun-ọgbin rẹ...",
    sampleVoiceMessage: "Mo ṣe akiyesi awọn ihò kekere ninu awọn ewé ọgbin agbado mi ati diẹ ninu eruku brown nitosi awọn igi.",
    voiceInput: "Lo Ohun Rẹ",
    listening: "A n gbọ...",
    submit: "Fi Iroyin Ranṣẹ",
    analyzing: "A n ṣayẹwo...",
    readyTitle: "A ti ṣetan lati ran ọ lọwọ",
    readySubtitle: "Fi alaye oko rẹ ranṣẹ lati gba ayẹwo AI lẹsẹkẹsẹ ati eto iṣẹ.",
    analyzingTitle: "A n ṣayẹwo alaye oko rẹ...",
    analyzingSubtitle: "A n wo inu ibi ipamọ data iṣẹ-ogbin wa",
    aiResponse: "Idahun AI",
    responseSubtitle: "Da lori apejuwe rẹ ati ibi ti o wa.",
    likelyIssue: "Iṣoro ti o le jẹ",
    immediateAction: "Igbese lẹsẹkẹsẹ",
    prevention: "Idena",
    riskLevel: "Ewu",
    startNew: "Bẹrẹ Ayẹwo Tuntun",
    low: "Kere",
    medium: "Wọpọ",
    high: "Pupo",
    whyAgriMind: "Kilode ti AgriMind?",
    whyAgriMindText: "A ṣe AgriMind Voice lati pese itọnisọna iṣẹ-ogbin agbegbe, ni idahun da lori iru ohun-ọgbin rẹ, ipo, ati ede ti o lo."
  },
  Hausa: {
    tagline: "Taimaka wa manoma yanke shawara mafi kyau a cikin yarensu",
    farmerInput: "Bayanin Manomi",
    inputSubtitle: "Faɗa mana abin da ke faruwa a gonarka. Kuna iya rubutawa ko amfani da muryar ku.",
    cropType: "Irin Shuka",
    selectCrop: "Zaɓi Shuka",
    location: "Wuri",
    locationPlaceholder: "misali: Kano, Kaduna",
    messageLabel: "Saƙon ku",
    messagePlaceholder: "Bayyana matsalar shukar ku...",
    sampleVoiceMessage: "Na lura da wasu ƙananan ramuka a cikin ganyen masarata da wasu ƙurar launin ruwan kasa kusa da kututturen.",
    voiceInput: "Yi amfani da Murya",
    listening: "Ina sauraro...",
    submit: "Aika Rahoto",
    analyzing: "Ana bincike...",
    readyTitle: "Shirye don Taimakawa",
    readySubtitle: "Aika bayanan gonar ku don karɓar binciken AI nan take da tsarin aiki.",
    analyzingTitle: "Ana bincika bayanan gonar ku...",
    analyzingSubtitle: "Tuntuɓar bayanan aikin gona na mu",
    aiResponse: "Amsar AI",
    responseSubtitle: "Dangane da bayanin ku da wurin ku.",
    likelyIssue: "Matsalar da ka iya kasancewa",
    immediateAction: "Mataki na gaggawa",
    prevention: "Rigakafi",
    riskLevel: "Haɗari",
    startNew: "Fara Sabon Bincike",
    low: "Kaɗan",
    medium: "Matsakaici",
    high: "Babba",
    whyAgriMind: "Me yasa AgriMind?",
    whyAgriMindText: "An tsara AgriMind Voice don ba da jagorar aikin gona na gida, yana ba da amsa dangane da takamaiman nau'in shuka, wuri, da shigarwar harsuna da yawa."
  },
  Igbo: {
    tagline: "Inyere ndị ọrụ ugbo aka ime mkpebi ka mma n'asụsụ nke ha",
    farmerInput: "Ihe onye ọrụ ugbo kwuru",
    inputSubtitle: "Gwa anyị ihe na-eme n'ugbo gị. I nwere ike pịnye ya ma ọ bụ jiri olu gị.",
    cropType: "Ụdị ihe ọkụkụ",
    selectCrop: "Họrọ ihe ọkụkụ",
    location: "Ebe ị nọ",
    locationPlaceholder: "dịka ọmụmaatụ: Enugu, Owerri",
    messageLabel: "Ozi gị",
    messagePlaceholder: "Kọwaa nsogbu ị nwere n'ihe ọkụkụ gị...",
    sampleVoiceMessage: "Achọpụtara m ụfọdụ obere oghere na akwụkwọ ọka m na ụfọdụ uzuzu aja aja n'akụkụ ogporo ya.",
    voiceInput: "Jiri olu gị",
    listening: "Ana m ege ntị...",
    submit: "Zipụ akụkọ",
    analyzing: "Ana m enyocha...",
    readyTitle: "Adị m njikere inyere aka",
    readySubtitle: "Zipụ nkọwa ugbo gị ka ị nweta nyocha AI ozugbo na atụmatụ ọrụ.",
    analyzingTitle: "Ana m enyocha nkọwa ugbo gị...",
    analyzingSubtitle: "Ana m elele data ọrụ ugbo anyị",
    aiResponse: "Azịza AI",
    responseSubtitle: "Dabere na nkọwa gị na ebe ị nọ.",
    likelyIssue: "Nsogbu nwere ike ịbụ",
    immediateAction: "Ihe ị ga-eme ozugbo",
    prevention: "Mgbochi",
    riskLevel: "Ihe egwu",
    startNew: "Malite nyocha ọhụrụ",
    low: "Obere",
    medium: "N'etiti",
    high: "Nnukwu",
    whyAgriMind: "Gịnị kpatara AgriMind?",
    whyAgriMindText: "Emebere AgriMind Voice iji nye ndụmọdụ ọrụ ugbo obodo, na-azaghachi dabere na ụdị ihe ọkụkụ gị, ebe ị nọ, na ntinye asụsụ dị iche iche."
  }
};

const LANGUAGES: Language[] = ['English', 'Yoruba', 'Hausa', 'Igbo'];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [cropType, setCropType] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    
    try {
      const analysis = await analyzeCropIssue(cropType, location, message, language);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) return;
    
    setIsRecording(true);
    setShowVoiceModal(true);
    
    // Mock voice-to-text
    setTimeout(() => {
      setMessage(t.sampleVoiceMessage);
      setIsRecording(false);
      setShowVoiceModal(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-olive/20">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[100] bg-brand-cream flex flex-col items-center justify-center p-6 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-8 relative z-10"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="bg-brand-olive p-8 rounded-[40px] shadow-[0_20px_60px_rgba(90,90,64,0.3)]"
                >
                  <Leaf className="text-white w-20 h-20" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-brand-olive rounded-[40px] -z-10"
                />
              </div>
              
              <div className="text-center space-y-4">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-6xl font-bold text-brand-earth tracking-tight"
                >
                  AgriMind <span className="text-brand-olive">Voice</span>
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-brand-olive/60 font-medium max-w-sm mx-auto leading-relaxed"
                >
                  {t.tagline}
                </motion.p>
              </div>

              <div className="mt-12 flex gap-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -8, 0],
                      opacity: [0.2, 1, 0.2]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.2, 
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 bg-brand-olive rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-olive rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-clay rounded-full blur-[120px]" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* --- Navbar --- */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-brand-olive/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="bg-brand-olive p-2.5 rounded-2xl shadow-lg shadow-brand-olive/10">
                  <Leaf className="text-white w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-brand-earth tracking-tight">
                  AgriMind <span className="text-brand-olive">Voice</span>
                </h1>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-brand-cream border border-brand-olive/10 text-sm font-bold text-brand-earth hover:bg-white hover:border-brand-olive/30 hover:shadow-md transition-all duration-300">
                  <Globe className="w-4 h-4 text-brand-olive" />
                  {language}
                  <ChevronDown className="w-4 h-4 opacity-40 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-[24px] shadow-2xl border border-brand-olive/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50 overflow-hidden p-1.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                        language === lang 
                        ? 'bg-brand-cream text-brand-olive font-bold' 
                        : 'text-brand-earth/70 hover:bg-brand-cream/50 hover:text-brand-olive'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* --- Main Content --- */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              
              {/* --- Left Panel: Farmer Input --- */}
              <section className="space-y-8">
                <div className="organic-card p-8 lg:p-10 space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold tracking-tight">{t.farmerInput}</h2>
                    <p className="text-brand-olive/60 text-base leading-relaxed">{t.inputSubtitle}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="organic-label">{t.cropType}</label>
                        <div className="relative">
                          <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-olive/30" />
                          <select 
                            value={cropType}
                            onChange={(e) => setCropType(e.target.value)}
                            className="organic-select pl-12 pr-10"
                            required
                          >
                            <option value="">{t.selectCrop}</option>
                            <option value="maize">Maize</option>
                            <option value="cassava">Cassava</option>
                            <option value="yam">Yam</option>
                            <option value="rice">Rice</option>
                            <option value="cocoa">Cocoa</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-olive/30 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="organic-label">{t.location}</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-olive/30" />
                          <input 
                            type="text"
                            placeholder={t.locationPlaceholder}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="organic-input pl-12 w-full"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="organic-label">{t.messageLabel}</label>
                      <textarea 
                        placeholder={t.messagePlaceholder}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="organic-input w-full min-h-[160px] resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="button"
                        onClick={toggleRecording}
                        className={`flex-1 flex items-center justify-center gap-3 rounded-2xl py-4 font-bold transition-all duration-300 ${
                          isRecording 
                          ? 'bg-red-50 text-red-600 border-2 border-red-200 shadow-lg shadow-red-100' 
                          : 'bg-brand-cream text-brand-olive border border-brand-olive/10 hover:border-brand-olive/30 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                        {isRecording ? t.listening : t.voiceInput}
                      </button>

                      <button
                        type="submit"
                        disabled={isAnalyzing}
                        className="flex-1 organic-button flex items-center justify-center gap-3"
                      >
                        {isAnalyzing ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                        {isAnalyzing ? t.analyzing : t.submit}
                      </button>
                    </div>
                  </form>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="p-8 bg-brand-olive/[0.03] rounded-[32px] border border-brand-olive/5"
                >
                  <h3 className="font-bold text-brand-olive mb-3 flex items-center gap-2 text-lg">
                    <ShieldCheck className="w-5 h-5" />
                    {t.whyAgriMind}
                  </h3>
                  <p className="text-brand-olive/60 leading-relaxed">
                    {t.whyAgriMindText}
                  </p>
                </motion.div>
              </section>

              {/* --- Right Panel: AI Response --- */}
              <section className="space-y-8">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="organic-card p-8 border-red-200 bg-red-50/30 flex flex-col items-center text-center gap-4"
                    >
                      <div className="bg-red-100 p-4 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-red-900">Analysis Failed</h3>
                        <p className="text-red-700/80">{error}</p>
                      </div>
                      <button 
                        onClick={() => setError(null)}
                        className="text-sm font-bold text-red-600 hover:text-red-800 underline"
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  )}

                  {!result && !isAnalyzing && !error ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="organic-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px] border-dashed border-2 border-brand-olive/10 bg-transparent"
                    >
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="bg-brand-cream p-8 rounded-[40px] mb-8"
                      >
                        <Sprout className="w-16 h-16 text-brand-olive/20" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-brand-earth mb-3">{t.readyTitle}</h3>
                      <p className="text-brand-olive/50 max-w-sm text-lg">
                        {t.readySubtitle}
                      </p>
                    </motion.div>
                  ) : isAnalyzing ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="organic-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]"
                    >
                      <div className="relative w-32 h-32 mb-10">
                        <motion.div 
                          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                          className="absolute inset-0 bg-brand-olive rounded-full"
                        />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                          className="absolute inset-0 border-2 border-dashed border-brand-olive/20 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Leaf className="w-12 h-12 text-brand-olive" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-brand-earth mb-3 italic">{t.analyzingTitle}</h3>
                      <p className="text-brand-olive/50 text-lg">{t.analyzingSubtitle}</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="organic-card p-10 space-y-10 overflow-hidden relative"
                    >
                      {/* Risk Level Badge */}
                      <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-[32px] font-black text-xs uppercase tracking-[0.2em] text-white shadow-lg ${
                        result?.riskLevel === 'High' ? 'bg-red-500 shadow-red-200' : 
                        result?.riskLevel === 'Medium' ? 'bg-amber-500 shadow-amber-200' : 'bg-green-500 shadow-green-200'
                      }`}>
                        {result?.riskLevel === 'High' ? t.high : result?.riskLevel === 'Medium' ? t.medium : t.low} {t.riskLevel}
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-4xl font-bold tracking-tight">{t.aiResponse}</h2>
                        <p className="text-brand-olive/60 text-base">{t.responseSubtitle}</p>
                      </div>

                      <div className="space-y-8">
                        {/* Likely Issue */}
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex gap-6"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center shadow-inner">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="organic-label !mb-0">{t.likelyIssue}</h4>
                            <p className="text-2xl font-bold text-brand-earth leading-tight">{result?.issue}</p>
                          </div>
                        </motion.div>

                        {/* Immediate Action */}
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex gap-6"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-[24px] flex items-center justify-center shadow-inner">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="organic-label !mb-0">{t.immediateAction}</h4>
                            <p className="text-brand-earth text-lg leading-relaxed">{result?.action}</p>
                          </div>
                        </motion.div>

                        {/* Prevention */}
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="flex gap-6"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center shadow-inner">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="organic-label !mb-0">{t.prevention}</h4>
                            <p className="text-brand-earth text-lg leading-relaxed">{result?.prevention}</p>
                          </div>
                        </motion.div>
                      </div>

                      <div className="pt-8 border-t border-brand-olive/10 flex items-center justify-between">
                        <button 
                          onClick={() => setResult(null)}
                          className="text-base font-bold text-brand-olive hover:text-brand-earth transition-colors flex items-center gap-2 group"
                        >
                          <span className="group-hover:underline">{t.startNew}</span>
                        </button>
                        <div className="text-[10px] font-black tracking-[0.2em] bg-brand-cream px-4 py-2 rounded-full text-brand-olive/40 uppercase">
                          ID: #AMV-8821
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </main>

            {/* --- Footer --- */}
            <footer className="p-10 text-center border-t border-brand-olive/5">
              <p className="text-brand-olive/40 text-xs font-medium tracking-wide">
                &copy; 2026 AgriMind Voice. Empowering smallholder farmers across Nigeria.
              </p>
            </footer>

            {/* --- Voice Input Modal --- */}
            <AnimatePresence>
              {showVoiceModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-brand-earth/40 backdrop-blur-sm"
                    onClick={() => setShowVoiceModal(false)}
                  />
                  
                  <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="bg-white rounded-[40px] p-12 flex flex-col items-center gap-8 shadow-2xl relative z-10 max-w-sm w-full text-center"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-brand-olive rounded-full"
                      />
                      <div className="relative bg-brand-olive p-8 rounded-full shadow-lg shadow-brand-olive/20">
                        <Mic className="text-white w-12 h-12" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-brand-earth">{t.listening}</h3>
                      <p className="text-brand-olive/60 font-medium">
                        {language === 'English' ? 'Speak clearly into your microphone' : 
                         language === 'Yoruba' ? 'Sọrọ ni kedere sinu gbohungbohun rẹ' :
                         language === 'Hausa' ? 'Yi magana a fili cikin makirufo' :
                         'Kwuo okwu nke ọma n\'ime igwe okwu gị'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: [12, 32, 12],
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 0.6, 
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                          className="w-1.5 bg-brand-olive rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
