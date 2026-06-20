import { AnalysisResult, FormattingTip } from '../types';
import { CURATED_KEYWORDS, STOP_WORDS } from '../keywordsData';

// Dynamic PDF.js script loader (avoids server bundling node errors inside Vite)
export const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjsLib);
      } else {
        reject(new Error('pdfjsLib is not available after script loading.'));
      }
    };
    script.onerror = (e) => reject(new Error('Failed to load PDF parsing library from CDN.'));
    document.head.appendChild(script);
  });
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const pdfjsLib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
};

// Check if a specific keyword matches in text with smart boundaries (works for special chars too)
export const matchKeyword = (text: string, keyword: string): boolean => {
  const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const startBoundary = /^[a-zA-Z0-9]/.test(keyword) ? '\\b' : '';
  const endBoundary = /[a-zA-Z0-9]$/.test(keyword) ? '\\b' : '';
  const regex = new RegExp(startBoundary + escaped + endBoundary, 'i');
  return regex.test(text);
};

export const analyzeResume = (fileName: string, resumeText: string, jdText: string): AnalysisResult => {
  // 1. Keyword Extraction from Job Description
  const lowercaseJd = jdText.toLowerCase();
  const matchedCurated = new Set<string>();

  // Check curated keywords
  for (const keyword of CURATED_KEYWORDS) {
    if (matchKeyword(lowercaseJd, keyword)) {
      matchedCurated.add(keyword);
    }
  }

  // Check proper nouns and capitalized words in Job Description
  const words = jdText.split(/[\s,.;:!?()"/]+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length > 2 && /^[A-Z][a-zA-Z0-9\-+]*$/.test(word)) {
      const lowerWord = word.toLowerCase();
      if (!STOP_WORDS.has(lowerWord)) {
        // Is it already matched in curated keywords?
        const isMatchedCurated = Array.from(matchedCurated).some(
          (k) => k.toLowerCase() === lowerWord
        );
        if (!isMatchedCurated) {
          // Keep the original capitalized spelling as a fallback custom term
          matchedCurated.add(word);
        }
      }
    }
  }

  const jdKeywordsList = Array.from(matchedCurated).sort((a, b) => a.localeCompare(b));

  // 2. Keyword Matching in Resume
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of jdKeywordsList) {
    if (matchKeyword(resumeText, keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const keywordMatchesRatio = jdKeywordsList.length > 0 
    ? (matchedKeywords.length / jdKeywordsList.length) * 100 
    : 100;

  // 3. Section Headers Check
  const sectionsToCheck = [
    {
      id: "experience",
      name: "Experience",
      keywords: ["experience", "employment", "professional history", "work history", "career history", "positions held"],
      regex: /\b(experience|history|employment|professional history|work history|professional experience|career history|positions held)\b/i
    },
    {
      id: "education",
      name: "Education",
      keywords: ["education", "academic", "university", "degree", "college", "schooling"],
      regex: /\b(education|academic|university|degree|college|educational history|schooling)\b/i
    },
    {
      id: "skills",
      name: "Skills",
      keywords: ["skills", "technical skills", "competencies", "expertise", "technologies", "proficiencies"],
      regex: /\b(skills|technical skills|key skills|core competencies|expertise|technologies|proficiencies)\b/i
    },
    {
      id: "contact",
      name: "Contact Information",
      keywords: ["contact", "email", "phone", "profile", "website", "linkedin", "address", "portfolio"],
      regex: /\b(contact|email|phone|profile|website|links|linkedin|address|portfolio)\b/i
    }
  ];

  const sectionsFound: string[] = [];
  const sectionsMissing: string[] = [];

  for (const sec of sectionsToCheck) {
    if (sec.regex.test(resumeText)) {
      sectionsFound.push(sec.name);
    } else {
      sectionsMissing.push(sec.name);
    }
  }

  const sectionsRatio = (sectionsFound.length / sectionsToCheck.length) * 100;

  // 4. File Name Check
  const lowerFileName = fileName.toLowerCase();
  let fileNamePassed = true;
  let fileNameMsg = `File name '${fileName}' is professionally structured.`;

  if (lowerFileName === "resume.pdf" || lowerFileName === "cv.pdf" || lowerFileName === "document.pdf" || lowerFileName === "untitled.pdf") {
    fileNamePassed = false;
    fileNameMsg = "Rename your file to include your name (e.g., 'Firstname_Lastname_Resume.pdf') so reviewers can search for it easily.";
  } else if (!lowerFileName.endsWith('.pdf')) {
    fileNamePassed = false;
    fileNameMsg = "The file is not a PDF. Convert your resume to .pdf format for maximum ATS compliance.";
  }

  // 5. Word Count Check
  const resumeWords = resumeText.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = resumeWords.length;
  let wordCountStatus: 'too_short' | 'perfect' | 'too_long' = 'perfect';
  let wordCountMsg = `Perfect word count (${wordCount} words)! Lies within the industry standard 400-1000 words.`;

  if (wordCount < 300) {
    wordCountStatus = 'too_short';
    wordCountMsg = `Your resume has only ${wordCount} words. Expand on your achievements, metrics, and bullet details to increase keyphrase weight.`;
  } else if (wordCount > 1200) {
    wordCountStatus = 'too_long';
    wordCountMsg = `Your resume has ${wordCount} words. While comprehensive, this exceeds the optimal length for rapid reading. Trim filler words.`;
  }

  // 6. Generate Formatting & Best Practice Tips
  const tips: FormattingTip[] = [];

  // Tip 1: File name
  tips.push({
    id: "fileName",
    title: "Filename Professionalism",
    category: "formatting",
    message: fileNameMsg,
    isPassed: fileNamePassed,
    impact: "medium"
  });

  // Tip 2: Section headers
  tips.push({
    id: "sectionHeaders",
    title: "Essential Section Headers",
    category: "structure",
    message: sectionsMissing.length === 0 
      ? "All essential ATS headers (Experience, Education, Skills, Contact) are clearly detectable in your resume."
      : `Missing essential headers: ${sectionsMissing.join(", ")}. Standard high-contrast headers guide ATS parser systems accurately.`,
    isPassed: sectionsMissing.length === 0,
    impact: "high"
  });

  // Tip 3: Word count
  tips.push({
    id: "wordCount",
    title: "Resume Word Density",
    category: "formatting",
    message: wordCountMsg,
    isPassed: wordCountStatus === 'perfect',
    impact: "high"
  });

  // Tip 4: Missing keywords suggestion
  const missingKeywordsRatio = jdKeywordsList.length > 0 ? (missingKeywords.length / jdKeywordsList.length) : 0;
  tips.push({
    id: "keywordMatchTip",
    title: "Job Keyword Contextualization",
    category: "keywords",
    message: missingKeywords.length === 0 
      ? "Stellar job optimization! Your resume includes all primary tech terms from the job post."
      : `You are missing ${missingKeywords.length} critical keywords. We highly recommend incorporating them naturally into your bullet points.`,
    isPassed: missingKeywordsRatio < 0.25, // Pass if missing < 25% of words
    impact: "high"
  });

  // Tip 5: Contact info check (check if email and phone numbers are present in the text)
  // Simple regex for email and potential phone pattern
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const contactPassed = hasEmail && hasPhone;
  let contactMsg = "Both email address and phone number are present in your text.";
  if (!hasEmail && !hasPhone) {
    contactMsg = "Action Required: No phone number or email address found. Ensure your header contains proper contact links.";
  } else if (!hasEmail) {
    contactMsg = "Missing Email: An accessible professional email address was not parsed in your contact sections.";
  } else if (!hasPhone) {
    contactMsg = "Missing Phone Number: We couldn't parse a standardized telephone contact string.";
  }

  tips.push({
    id: "contactInfo",
    title: "Contact Details Completeness",
    category: "structure",
    message: contactMsg,
    isPassed: contactPassed,
    impact: "high"
  });

  // Tip 6: Avoid graphs, columns, tables
  const likelyHasColumns = resumeText.includes(" | ") || resumeText.match(/\t/) || resumeText.length < 50; // heuristic
  tips.push({
    id: "parsableLayout",
    title: "Structural Layout Parseability",
    category: "formatting",
    message: "Avoid placing essential info inside intricate double columns, tables, graphic bars, or text box assets as simple ATS scripts often read them out of order.",
    isPassed: true, // Warn passive
    impact: "medium"
  });

  // Calculate Weighted Formatting Score
  const passedTips = tips.filter(t => t.isPassed).length;
  const formattingScore = (passedTips / tips.length) * 100;

  // Final ATS Score out of 100
  // Weights: Keyword Match: 70%, Structural Section Headers: 20%, Formatting & Professional best practices: 10%
  const finalScoreRaw = (keywordMatchesRatio * 0.70) + (sectionsRatio * 0.20) + (formattingScore * 0.10);
  const score = Math.round(Math.min(100, Math.max(0, finalScoreRaw)));

  return {
    score,
    keywordScore: Math.round(keywordMatchesRatio),
    structuralScore: Math.round(sectionsRatio),
    formattingScore: Math.round(formattingScore),
    jdKeywords: jdKeywordsList,
    matchedKeywords,
    missingKeywords,
    sectionsFound,
    sectionsMissing,
    fileName,
    fileNamePassed,
    wordCount,
    wordCountStatus,
    tips
  };
};
