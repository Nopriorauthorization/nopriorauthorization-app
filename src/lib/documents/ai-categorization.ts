// Smart categorization logic for documents
export interface DocumentAnalysis {
  suggestedCategory: string;
  confidence: number;
  keywords: string[];
  reasoning: string;
}

// Comprehensive keyword patterns for medical document categorization
const CATEGORY_PATTERNS = {
  LAB: {
    keywords: [
      // Lab tests and results
      'lab', 'laboratory', 'blood work', 'bloodwork', 'test result', 'panel', 'workup',
      'cbc', 'chemistry', 'lipid', 'glucose', 'a1c', 'hemoglobin', 'cholesterol',
      'thyroid', 'tsh', 'hormone', 'vitamin', 'b12', 'folate', 'iron', 'ferritin',
      'creatinine', 'bun', 'liver function', 'ast', 'alt', 'bilirubin',
      'urinalysis', 'urine', 'culture', 'sensitivity', 'microbiology',
      'pathology', 'biopsy', 'histology', 'cytology'
    ],
    contexts: [
      'results', 'report', 'findings', 'values', 'levels', 'normal', 'abnormal',
      'elevated', 'decreased', 'negative', 'positive'
    ]
  },
  IMAGING: {
    keywords: [
      // Imaging studies
      'x-ray', 'xray', 'ct scan', 'cat scan', 'mri', 'ultrasound', 'sonogram',
      'mammogram', 'mammography', 'dexa', 'bone density', 'echocardiogram',
      'ekg', 'ecg', 'stress test', 'nuclear', 'pet scan', 'colonoscopy',
      'endoscopy', 'bronchoscopy', 'arthroscopy', 'imaging', 'radiology',
      'radiologist', 'scan', 'films', 'pictures'
    ],
    contexts: [
      'report', 'impression', 'findings', 'study', 'examination', 'procedure',
      'normal', 'abnormal', 'unremarkable', 'visualized'
    ]
  },
  VISIT_NOTE: {
    keywords: [
      // Visit documentation
      'visit', 'appointment', 'consultation', 'follow-up', 'followup',
      'office visit', 'clinic', 'progress note', 'soap note', 'assessment',
      'plan', 'treatment plan', 'discharge summary', 'hospital', 'admission',
      'evaluation', 'exam', 'examination', 'consultation', 'referral',
      'provider note', 'physician note', 'nursing note'
    ],
    contexts: [
      'chief complaint', 'history', 'physical', 'assessment', 'plan',
      'medications', 'allergies', 'vitals', 'review of systems'
    ]
  },
  DISCHARGE: {
    keywords: [
      // Discharge and care transitions  
      'discharge', 'hospital discharge', 'summary', 'discharge summary',
      'inpatient', 'admission', 'hospitalization', 'emergency room', 'er visit',
      'urgent care', 'surgery', 'procedure', 'operation', 'post-op', 'recovery',
      'instructions', 'care instructions', 'follow-up instructions'
    ],
    contexts: [
      'diagnosis', 'procedure', 'medications', 'instructions', 'follow-up',
      'discharged', 'stable condition', 'home', 'transferred'
    ]
  }
};

// AI-powered document categorization
export function analyzeDocument(title: string, filename?: string): DocumentAnalysis {
  const text = `${title} ${filename || ''}`.toLowerCase();
  const words = text.split(/\s+/);
  
  const scores: Record<string, { score: number; matchedKeywords: string[]; reasoning: string[] }> = {
    LAB: { score: 0, matchedKeywords: [], reasoning: [] },
    IMAGING: { score: 0, matchedKeywords: [], reasoning: [] },
    VISIT_NOTE: { score: 0, matchedKeywords: [], reasoning: [] },
    DISCHARGE: { score: 0, matchedKeywords: [], reasoning: [] }
  };

  // Analyze each category
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    let categoryScore = 0;
    const matchedKeywords: string[] = [];
    const reasoning: string[] = [];

    // Check main keywords
    for (const keyword of patterns.keywords) {
      const keywordWords = keyword.split(' ');
      const isMultiWord = keywordWords.length > 1;
      
      if (isMultiWord) {
        // Multi-word phrase matching
        if (text.includes(keyword)) {
          categoryScore += 3; // Higher score for exact phrase matches
          matchedKeywords.push(keyword);
          reasoning.push(`Contains "${keyword}"`);
        }
      } else {
        // Single word matching
        if (words.includes(keyword)) {
          categoryScore += 2;
          matchedKeywords.push(keyword);
          reasoning.push(`Contains "${keyword}"`);
        }
      }
    }

    // Check contextual keywords (lower weight)
    for (const context of patterns.contexts) {
      if (text.includes(context)) {
        categoryScore += 1;
        matchedKeywords.push(context);
        reasoning.push(`Contextual match: "${context}"`);
      }
    }

    scores[category] = {
      score: categoryScore,
      matchedKeywords,
      reasoning
    };
  }

  // Find the highest scoring category
  const maxScore = Math.max(...Object.values(scores).map(s => s.score));
  const bestCategory = Object.entries(scores).find(([_, data]) => data.score === maxScore);

  if (!bestCategory || maxScore === 0) {
    return {
      suggestedCategory: 'OTHER',
      confidence: 0,
      keywords: [],
      reasoning: 'No specific medical document patterns detected'
    };
  }

  const [categoryName, categoryData] = bestCategory;
  
  // Calculate confidence based on score and keyword density
  const totalWords = words.length;
  const keywordDensity = categoryData.matchedKeywords.length / Math.max(totalWords, 1);
  const confidence = Math.min(95, Math.round((maxScore * 15) + (keywordDensity * 100)));

  return {
    suggestedCategory: categoryName,
    confidence,
    keywords: categoryData.matchedKeywords,
    reasoning: categoryData.reasoning.slice(0, 3).join('; ') // Top 3 reasons
  };
}

// Enhanced categorization with filename analysis
export function smartCategorize(title: string, filename?: string, mimeType?: string): DocumentAnalysis {
  const analysis = analyzeDocument(title, filename);
  
  // Boost confidence for certain file patterns
  if (filename) {
    const lowerFilename = filename.toLowerCase();
    
    // PDF reports are often lab or imaging
    if (mimeType === 'application/pdf') {
      if (lowerFilename.includes('lab') || lowerFilename.includes('result')) {
        if (analysis.suggestedCategory === 'LAB') {
          analysis.confidence = Math.min(95, analysis.confidence + 10);
        }
      }
      if (lowerFilename.includes('scan') || lowerFilename.includes('image') || lowerFilename.includes('xray')) {
        if (analysis.suggestedCategory === 'IMAGING') {
          analysis.confidence = Math.min(95, analysis.confidence + 10);
        }
      }
    }
    
    // Images are likely imaging studies
    if (mimeType?.startsWith('image/')) {
      if (analysis.suggestedCategory === 'IMAGING' || analysis.confidence < 30) {
        analysis.suggestedCategory = 'IMAGING';
        analysis.confidence = Math.max(analysis.confidence, 70);
        analysis.reasoning += '; Image file detected';
      }
    }
  }

  return analysis;
}

// Get category display info
export function getCategoryDisplay(category: string): { name: string; icon: string; color: string } {
  const displays: Record<string, { name: string; icon: string; color: string }> = {
    LAB: { name: 'Lab Results', icon: '🧪', color: 'green' },
    IMAGING: { name: 'Imaging', icon: '📊', color: 'blue' },
    VISIT_NOTE: { name: 'Visit Notes', icon: '📝', color: 'purple' },
    DISCHARGE: { name: 'Discharge', icon: '🏥', color: 'orange' },
    OTHER: { name: 'Other', icon: '📄', color: 'gray' }
  };
  
  return displays[category] || displays.OTHER;
}