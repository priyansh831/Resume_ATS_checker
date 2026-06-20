import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AnalysisResult, FormattingTip } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  Info, 
  Sparkles, 
  ArrowLeft, 
  FileCheck, 
  Search,
  BookOpen,
  Briefcase,
  Layers,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AtsResultDashboardProps {
  result: AnalysisResult;
  onGoBack: () => void;
}

export default function AtsResultDashboard({ result, onGoBack }: AtsResultDashboardProps) {
  const [keywordTab, setKeywordTab] = useState<'all' | 'missing' | 'matched'>('missing');
  const [keywordSearch, setKeywordSearch] = useState('');

  useEffect(() => {
    if (result.score >= 75) {
      // Elegant, high-quality confetti splash for highly-optimized resumes!
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 50 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [result.score]);

  // Circle progress calculation (SVG radius 54, circumference 339.3)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  // Choose colors & labels based on score
  const getScoreDetails = (score: number) => {
    if (score >= 85) {
      return {
        color: 'text-emerald-500 stroke-emerald-500 border-emerald-100 bg-emerald-50/30',
        text: 'Highly Optimized',
        description: 'Elite rating. Your resume matches the job description perfectly and follows the best ATS layout practices.',
        sentiment: 'excellent'
      };
    } else if (score >= 70) {
      return {
        color: 'text-blue-600 stroke-blue-600 border-blue-100 bg-blue-50/20',
        text: 'Good Match',
        description: 'Solid keyword presence. Make some minor revisions to address missing key terms for better competitiveness.',
        sentiment: 'good'
      };
    } else if (score >= 45) {
      return {
        color: 'text-amber-500 stroke-amber-500 border-amber-100 bg-amber-50/20',
        text: 'Moderate Match',
        description: 'Medium risk. Key section templates are present, but you are missing several critical technical phrases required for priority screening.',
        sentiment: 'modest'
      };
    } else {
      return {
        color: 'text-red-500 stroke-red-500 border-red-100 bg-red-50/30',
        text: 'Critical Gaps',
        description: 'High risk of automatic rejection. Your file lack essential target keywords or layout structures required by recruiters.',
        sentiment: 'critical'
      };
    }
  };

  const details = getScoreDetails(result.score);

  // Filter keywords based on searched term & active tab
  const getFilteredKeywords = () => {
    const list = keywordTab === 'all' 
      ? result.jdKeywords 
      : keywordTab === 'matched' 
        ? result.matchedKeywords 
        : result.missingKeywords;

    if (!keywordSearch.trim()) return list;
    return list.filter(k => k.toLowerCase().includes(keywordSearch.toLowerCase()));
  };

  const filteredKeywords = getFilteredKeywords();

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* Header back bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <button
            onClick={onGoBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group mb-1.5"
            id="back-to-input-btn"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Analyze Another Resume
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-600" />
            ATS Scan Insights Report
          </h1>
        </div>
        <div className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-stretch sm:self-auto text-center truncate max-w-sm">
          Parsed: <span className="text-slate-750 font-mono font-semibold">{result.fileName}</span>
        </div>
      </div>

      {/* Hero row: radial gauge + metrics summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Score Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-sm">
          <div className="w-full text-center">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Overall ATS Compatibility
            </span>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className={details.color}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
              <span className="text-4xl font-extrabold tracking-tighter" id="radial-score-display">
                {result.score}
              </span>
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">
                / 100 Score
              </span>
            </div>
          </div>

          <div className="w-full">
            <div className={`mx-auto max-w-max px-3 py-1 text-xs font-semibold rounded-full border mb-3 ${details.color}`} id="score-sentiment-badge">
              {details.text}
            </div>
            <p className="text-xs text-slate-600 max-w-[280px] mx-auto leading-relaxed">
              {details.description}
            </p>
          </div>
        </div>

        {/* Triple score meter breakdown bar */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm gap-4">
          <div className="w-full">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">
              Score Breakdown Metrics
            </span>
            <p className="text-xs text-slate-505">
              Your resume is scored on three weighted components crucial to recruiting pipelines:
            </p>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* Metric 1: Keywords */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1">
                  <Fingerprint className="h-3.5 w-3.5 text-blue-500" />
                  Keyword Match Ratio (70% weight)
                </span>
                <span className="text-slate-900 font-mono" id="matches-metric-display">{result.keywordScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${result.keywordScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Found {result.matchedKeywords.length} out of {result.jdKeywords.length} target job post terms in current text.
              </p>
            </div>

            {/* Metric 2: Structure */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-emerald-500" />
                  Structural Section Headers (20% weight)
                </span>
                <span className="text-slate-900 font-mono" id="structural-metric-display">{result.structuralScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${result.structuralScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Presence of standard headers (Experience, Education, Skills, Contact) detected.
              </p>
            </div>

            {/* Metric 3: Best practices */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  Formatting Best Practices (10% weight)
                </span>
                <span className="text-slate-900 font-mono" id="formatting-metric-display">{result.formattingScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-amber-505 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${result.formattingScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Evaluates keyphrase naming, word density, and general parseability guidelines.
              </p>
            </div>

          </div>

          <div className="rounded-xl bg-blue-50/20 border border-blue-100 p-3 flex gap-2.5 items-start">
            <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-900 leading-relaxed font-sans">
              <span className="font-semibold">Match Insight:</span> For standard competitive application streams (like LinkedIn / Glassdoor), aim for an overall score above <span className="font-bold">75%</span> to pass automated thresholds comfortably.
            </p>
          </div>
        </div>

      </div>

      {/* Main content grid: Left - Word suggestions, Right - Formatting tip boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Keywords Optimizations Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Keyword Density & Optimization
              </h3>
              <p className="text-xs text-slate-500">
                Contextual terms found in target JD. Missing keywords represent parsing gaps.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative self-stretch sm:self-auto">
              <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                placeholder="Search keywords..."
                className="pl-8 pr-3 py-1 w-full sm:w-44 text-xs font-sans rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                id="keyword-search-input"
              />
            </div>
          </div>

          {/* Tabs header */}
          <div className="flex border-b border-slate-100 pb-1">
            <button
              onClick={() => setKeywordTab('missing')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 select-none ${
                keywordTab === 'missing' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              id="tab-missing-keywords"
            >
              Missing Critical ({result.missingKeywords.length})
            </button>
            <button
              onClick={() => setKeywordTab('matched')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 select-none ${
                keywordTab === 'matched' 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              id="tab-matched-keywords"
            >
              Found ({result.matchedKeywords.length})
            </button>
            <button
              onClick={() => setKeywordTab('all')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 select-none ${
                keywordTab === 'all' 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              id="tab-all-keywords"
            >
              All target ({result.jdKeywords.length})
            </button>
          </div>

          {/* Keywords rendering */}
          {filteredKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2 py-1 max-h-72 overflow-y-auto pr-1">
              {filteredKeywords.map((keyword, index) => {
                const isMissing = result.missingKeywords.includes(keyword);
                return (
                  <motion.div
                    key={`${keyword}-${index}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors select-none ${
                      isMissing
                        ? 'bg-red-50/50 text-red-800 border-red-100 hover:bg-red-50'
                        : 'bg-emerald-50/30 text-emerald-850 border-emerald-100/80 hover:bg-emerald-50/60'
                    }`}
                  >
                    <span>{keyword}</span>
                    <span className={`text-[9px] px-1 rounded-sm uppercase tracking-wide px-1.5 py-0.5 font-bold ${
                      isMissing ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-750'
                    }`}>
                      {isMissing ? 'Missing' : 'Matched'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Info className="h-6 w-6 mx-auto text-slate-300 mb-1.5" />
              <p className="text-xs">
                {keywordSearch ? "No matching keywords found for your search." : "No keywords in this category."}
              </p>
            </div>
          )}

          {keywordTab === 'missing' && result.missingKeywords.length > 0 && (
            <p className="text-[10px] text-slate-400 py-1.5 px-2 bg-slate-50 border border-slate-100/60 rounded-lg">
              💡 <span className="font-semibold text-slate-600">Action Tip:</span> We suggest embedding these missing skills directly inside relevant bullets of your experience or skills list. Avoid writing massive keyword-stuffing tables at the bottom of the page which recruiters look down on.
            </p>
          )}
        </div>

        {/* Framing & Best Practice tips list (Right column) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              ATS Standard Best Practices
            </h3>
            <p className="text-xs text-slate-500">
              Crucial structural and layout checks.
            </p>
          </div>

          <div className="flex flex-col gap-3.5" id="tips-checklist-container">
            {result.tips.map((tip) => (
              <div 
                key={tip.id} 
                className={`p-3.5 rounded-xl border flex gap-3 items-start transition-all ${
                  tip.isPassed 
                    ? 'bg-emerald-50/10 border-emerald-100/70' 
                    : 'bg-amber-50/10 border-amber-100/70'
                }`}
              >
                {tip.isPassed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : tip.impact === 'high' ? (
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-800">
                      {tip.title}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-md tracking-wider ${
                      tip.impact === "high" 
                        ? "bg-red-100 text-red-700" 
                        : tip.impact === "medium" 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-slate-100 text-slate-500"
                    }`}>
                      {tip.impact} severity
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {tip.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
