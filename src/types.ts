export interface FormattingTip {
  id: string;
  title: string;
  category: 'formatting' | 'keywords' | 'structure';
  message: string;
  isPassed: boolean;
  impact: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  score: number;
  keywordScore: number;
  structuralScore: number;
  formattingScore: number;
  
  jdKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  
  sectionsFound: string[];
  sectionsMissing: string[];
  
  fileName: string;
  fileNamePassed: boolean;
  
  wordCount: number;
  wordCountStatus: 'too_short' | 'perfect' | 'too_long';
  
  tips: FormattingTip[];
}

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  text: string;
}
