import React from 'react';
import { SAMPLE_PRESETS } from '../keywordsData';
import { FileText, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const handlePresetSelect = (text: string) => {
    onChange(text);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          2. Job Description
        </h2>
        <div className="text-xs text-slate-400 font-medium">
          {getWordCount(value)} words • {value.length} characters
        </div>
      </div>

      {/* Preset Suggestions */}
      <div className="mb-3">
        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mb-2">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          Or choose a quick demo template:
        </p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset.text)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-755 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer font-sans select-none"
              id={`preset-${preset.id}`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste your target job post details here. The keywords engine will scan text structures for frontend/backend languages, databases, cloud, certifications, project frameworks, and soft skills...`}
          className="w-full h-56 p-4 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans placeholder-slate-400 text-slate-800 transition-all shadow-sm resize-y min-h-[160px] outline-none"
          id="job-description-textarea"
        />
        {value.length === 0 && (
          <div className="absolute top-4 left-4 right-4 pointer-events-none flex flex-col items-center justify-center h-48 text-center text-slate-300">
            <FileText className="h-10 w-10 text-slate-200 mb-2" />
          </div>
        )}
      </div>
    </div>
  );
}
