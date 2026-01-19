"use client";

import React, { useState } from 'react';

// Medical term types
type MedicalTerm = {
  id: string;
  term: string;
  category: 'medication' | 'procedure' | 'diagnosis' | 'lab-test' | 'medical-code' | 'instruction';
  plainEnglish: string;
  details: string;
  examples?: string[];
  normalRange?: string;
  whyItMatters?: string;
};

// Decoded document types
type DecodedDocument = {
  id: string;
  type: 'prescription' | 'lab-result' | 'medical-bill' | 'discharge-summary';
  uploadDate: string;
  fileName: string;
  decodedTerms: {
    original: string;
    decoded: string;
    category: string;
    importance: 'high' | 'medium' | 'low';
  }[];
  summary: string;
  keyTakeaways: string[];
  actionItems?: string[];
};

// Health Directory Topic
type HealthTopic = {
  id: string;
  category: string;
  icon: string;
  color: string;
  topics: {
    title: string;
    description: string;
    commonTerms: string[];
    relatedTools: string[];
  }[];
};

// Health Directory - WebMD style categories
const healthDirectory: HealthTopic[] = [
  {
    id: 'womens-health',
    category: "Women's Health",
    icon: '👩',
    color: 'pink',
    topics: [
      {
        title: 'Birth Control & Contraception',
        description: 'Understanding your options, side effects, and effectiveness',
        commonTerms: ['IUD', 'Oral contraceptive', 'Depo-Provera', 'Nexplanon', 'Emergency contraception'],
        relatedTools: ['Treatment Decoder', 'Provider Finder', 'AI Health Insights']
      },
      {
        title: 'Pregnancy & Prenatal Care',
        description: 'From conception through delivery and postpartum',
        commonTerms: ['HCG levels', 'Prenatal vitamins', 'Ultrasound', 'Gestational diabetes', 'Preeclampsia'],
        relatedTools: ['Treatment Decoder', 'Timeline Tracker', 'Document Analysis']
      },
      {
        title: 'Menstrual Health & PCOS',
        description: 'Period tracking, irregularities, and hormonal conditions',
        commonTerms: ['Amenorrhea', 'Dysmenorrhea', 'PCOS', 'Endometriosis', 'Fibroids'],
        relatedTools: ['Symptom Tracker', 'AI Health Insights', 'Provider Finder']
      },
      {
        title: 'Menopause & Hormone Therapy',
        description: 'Navigating perimenopause, menopause, and HRT options',
        commonTerms: ['Hot flashes', 'HRT', 'Estrogen therapy', 'Bone density', 'Vaginal atrophy'],
        relatedTools: ['Treatment Decoder', 'Medication Tracker', 'AI Insights']
      }
    ]
  },
  {
    id: 'mens-health',
    category: "Men's Health",
    icon: '👨',
    color: 'blue',
    topics: [
      {
        title: 'Prostate Health',
        description: 'Screening, enlargement, and prostate-specific concerns',
        commonTerms: ['PSA test', 'BPH', 'Prostatitis', 'Digital rectal exam', 'Finasteride'],
        relatedTools: ['Treatment Decoder', 'Lab Result Analyzer', 'Provider Finder']
      },
      {
        title: 'Testosterone & Hormone Health',
        description: 'Understanding low T, testing, and treatment options',
        commonTerms: ['Total testosterone', 'Free testosterone', 'TRT', 'Hypogonadism', 'SHBG'],
        relatedTools: ['Lab Decoder', 'AI Health Insights', 'Medication Guide']
      },
      {
        title: 'Sexual Health & ED',
        description: 'Erectile dysfunction, STI screening, and reproductive health',
        commonTerms: ['Erectile dysfunction', 'Sildenafil', 'Tadalafil', 'STI panel', 'Viagra'],
        relatedTools: ['Treatment Decoder', 'Provider Finder', 'Confidential Resources']
      }
    ]
  },
  {
    id: 'mental-health',
    category: 'Mental Health & Well-Being',
    icon: '🧠',
    color: 'purple',
    topics: [
      {
        title: 'Anxiety & Panic Disorders',
        description: 'Symptoms, medications, and coping strategies',
        commonTerms: ['Generalized anxiety', 'Panic attack', 'SSRI', 'Benzodiazepine', 'CBT'],
        relatedTools: ['Crisis Center', 'Medication Decoder', 'Provider Finder']
      },
      {
        title: 'Depression & Mood Disorders',
        description: 'Understanding depression, bipolar, and treatment options',
        commonTerms: ['Major depressive disorder', 'Antidepressant', 'SNRI', 'Mood stabilizer', 'PHQ-9'],
        relatedTools: ['Treatment Decoder', 'AI Health Insights', 'Crisis Resources']
      },
      {
        title: 'ADHD & Focus',
        description: 'Diagnosis, stimulant medications, and management',
        commonTerms: ['ADHD', 'Adderall', 'Vyvanse', 'Methylphenidate', 'Strattera'],
        relatedTools: ['Medication Guide', 'Provider Finder', 'Treatment Decoder']
      },
      {
        title: 'Sleep Disorders',
        description: 'Insomnia, sleep apnea, and sleep medication',
        commonTerms: ['Insomnia', 'Sleep apnea', 'CPAP', 'Melatonin', 'Zolpidem'],
        relatedTools: ['Treatment Decoder', 'Symptom Tracker', 'AI Insights']
      }
    ]
  },
  {
    id: 'chronic-conditions',
    category: 'Chronic Conditions',
    icon: '💊',
    color: 'red',
    topics: [
      {
        title: 'Diabetes Management',
        description: 'Type 1, Type 2, monitoring, and medications',
        commonTerms: ['HbA1c', 'Fasting glucose', 'Metformin', 'Insulin', 'CGM', 'Diabetic retinopathy'],
        relatedTools: ['Lab Decoder', 'Medication Tracker', 'AI Health Insights']
      },
      {
        title: 'Heart Health & Blood Pressure',
        description: 'Hypertension, cholesterol, and cardiovascular care',
        commonTerms: ['Hypertension', 'LDL cholesterol', 'Statin', 'ACE inhibitor', 'Beta blocker'],
        relatedTools: ['Treatment Decoder', 'Vital Signs Tracker', 'Provider Finder']
      },
      {
        title: 'Thyroid Disorders',
        description: 'Hypothyroid, hyperthyroid, and hormone replacement',
        commonTerms: ['TSH', 'T4', 'Levothyroxine', 'Hashimoto', 'Graves disease'],
        relatedTools: ['Lab Result Decoder', 'Medication Guide', 'AI Insights']
      },
      {
        title: 'Autoimmune Conditions',
        description: 'Lupus, RA, Crohn\'s, and immune system disorders',
        commonTerms: ['Rheumatoid arthritis', 'Lupus', 'Crohn\'s', 'Biologics', 'Immunosuppressant'],
        relatedTools: ['Treatment Decoder', 'Document Analysis', 'Provider Network']
      }
    ]
  },
  {
    id: 'sexual-health',
    category: 'Sexual Health',
    icon: '❤️',
    color: 'rose',
    topics: [
      {
        title: 'STI Testing & Prevention',
        description: 'Screening, treatment, and prevention strategies',
        commonTerms: ['Chlamydia', 'Gonorrhea', 'HIV test', 'Syphilis', 'HPV vaccine', 'PrEP'],
        relatedTools: ['Lab Decoder', 'Provider Finder', 'Confidential Resources']
      },
      {
        title: 'Birth Control & Family Planning',
        description: 'All contraceptive options explained clearly',
        commonTerms: ['IUD insertion', 'Birth control pill', 'Nexplanon', 'Tubal ligation', 'Vasectomy'],
        relatedTools: ['Treatment Decoder', 'Provider Finder', 'Cost Estimator']
      },
      {
        title: 'Sexual Wellness',
        description: 'Libido, function, and sexual health concerns',
        commonTerms: ['Low libido', 'Painful intercourse', 'Erectile dysfunction', 'Hormone therapy'],
        relatedTools: ['Provider Finder', 'Treatment Decoder', 'Confidential Chat']
      }
    ]
  },
  {
    id: 'preventive-care',
    category: 'Preventive Care & Screening',
    icon: '🩺',
    color: 'green',
    topics: [
      {
        title: 'Cancer Screening',
        description: 'Mammograms, colonoscopy, skin checks, and early detection',
        commonTerms: ['Mammogram', 'Colonoscopy', 'PAP smear', 'PSA screening', 'Skin biopsy'],
        relatedTools: ['Test Result Decoder', 'Provider Finder', 'Timeline Tracker']
      },
      {
        title: 'Vaccinations & Immunizations',
        description: 'Adult vaccines, travel immunizations, and boosters',
        commonTerms: ['Flu shot', 'COVID vaccine', 'Tdap', 'HPV vaccine', 'Shingles vaccine'],
        relatedTools: ['Immunization Record', 'Provider Finder', 'Travel Health']
      },
      {
        title: 'Annual Wellness & Labs',
        description: 'Understanding routine bloodwork and physical exams',
        commonTerms: ['CBC', 'CMP', 'Lipid panel', 'Vitamin D', 'Annual physical'],
        relatedTools: ['Lab Result Decoder', 'Health Timeline', 'AI Insights']
      }
    ]
  },
  {
    id: 'diet-fitness',
    category: 'Diet & Fitness',
    icon: '🏃',
    color: 'orange',
    topics: [
      {
        title: 'Weight Management',
        description: 'Medications, nutrition, and sustainable approaches',
        commonTerms: ['GLP-1', 'Ozempic', 'Wegovy', 'Metformin', 'BMI', 'Bariatric surgery'],
        relatedTools: ['Medication Decoder', 'Provider Finder', 'Cost Calculator']
      },
      {
        title: 'Sports Medicine & Injuries',
        description: 'Treating and preventing athletic injuries',
        commonTerms: ['ACL tear', 'Rotator cuff', 'Stress fracture', 'Physical therapy', 'MRI'],
        relatedTools: ['Imaging Decoder', 'Provider Finder', 'Recovery Tracker']
      },
      {
        title: 'Nutrition & Supplements',
        description: 'Vitamins, deficiencies, and dietary guidance',
        commonTerms: ['Vitamin D deficiency', 'Iron deficiency', 'B12', 'Omega-3', 'Probiotics'],
        relatedTools: ['Lab Decoder', 'Supplement Guide', 'AI Nutrition Insights']
      }
    ]
  },
  {
    id: 'childrens-health',
    category: "Children's Health",
    icon: '👶',
    color: 'yellow',
    topics: [
      {
        title: 'Pediatric Vaccinations',
        description: 'Childhood immunization schedules and safety',
        commonTerms: ['DTaP', 'MMR', 'Varicella', 'HPV vaccine', 'Meningococcal'],
        relatedTools: ['Vaccine Tracker', 'Provider Finder', 'Educational Resources']
      },
      {
        title: 'Growth & Development',
        description: 'Milestones, growth charts, and developmental screening',
        commonTerms: ['Growth percentile', 'Developmental delay', 'Well-child visit', 'Autism screening'],
        relatedTools: ['Growth Tracker', 'Pediatric Resources', 'Provider Network']
      },
      {
        title: 'Common Childhood Conditions',
        description: 'Ear infections, asthma, allergies, and pediatric care',
        commonTerms: ['Otitis media', 'Pediatric asthma', 'Food allergy', 'Strep throat', 'RSV'],
        relatedTools: ['Symptom Checker', 'Treatment Decoder', 'Provider Finder']
      }
    ]
  }
];

// Medical dictionary
const medicalDictionary: MedicalTerm[] = [
  {
    id: 'term-1',
    term: 'HbA1c',
    category: 'lab-test',
    plainEnglish: 'Average Blood Sugar Over 3 Months',
    details: 'Hemoglobin A1c measures your average blood sugar levels over the past 2-3 months. It shows how well your diabetes is controlled.',
    normalRange: 'Below 5.7% (normal), 5.7-6.4% (prediabetes), 6.5%+ (diabetes)',
    whyItMatters: 'Higher levels mean increased risk of diabetes complications like nerve damage, kidney disease, and vision problems.',
    examples: ['A1c', 'Glycated hemoglobin', 'Glycohemoglobin']
  },
  {
    id: 'term-2',
    term: 'Metformin',
    category: 'medication',
    plainEnglish: 'First-Line Diabetes Medication',
    details: 'Metformin helps your body use insulin better and reduces sugar production in your liver. It\'s the most commonly prescribed diabetes medication.',
    whyItMatters: 'Helps control blood sugar, may help with weight loss, and has cardiovascular benefits.',
    examples: ['Glucophage', 'Fortamet', 'Glumetza']
  },
  {
    id: 'term-3',
    term: 'Lipid Panel',
    category: 'lab-test',
    plainEnglish: 'Cholesterol Test',
    details: 'Measures different types of fats in your blood including total cholesterol, LDL (bad cholesterol), HDL (good cholesterol), and triglycerides.',
    normalRange: 'Total <200 mg/dL, LDL <100 mg/dL, HDL >40 mg/dL (men) or >50 mg/dL (women)',
    whyItMatters: 'High cholesterol increases your risk of heart disease and stroke.',
    examples: ['Cholesterol panel', 'Fasting lipids', 'Lipid profile']
  },
  {
    id: 'term-4',
    term: 'CPT Code 99213',
    category: 'medical-code',
    plainEnglish: 'Standard Office Visit (Established Patient)',
    details: 'This is the billing code for a routine follow-up appointment with a doctor you\'ve seen before. Typically 20-29 minutes.',
    whyItMatters: 'Understanding billing codes helps you verify charges and know what you\'re paying for.',
    examples: ['Office visit level 3', 'Established patient visit']
  },
  {
    id: 'term-5',
    term: 'Lisinopril',
    category: 'medication',
    plainEnglish: 'Blood Pressure Medication (ACE Inhibitor)',
    details: 'Lisinopril relaxes blood vessels to lower blood pressure and reduce strain on your heart. Part of the ACE inhibitor family.',
    whyItMatters: 'Helps prevent heart attack, stroke, and kidney problems. Also used to treat heart failure.',
    examples: ['Prinivil', 'Zestril']
  },
  {
    id: 'term-6',
    term: 'BID',
    category: 'instruction',
    plainEnglish: 'Take Twice Daily',
    details: 'BID means "bis in die" in Latin - take this medication two times per day, usually morning and evening.',
    examples: ['Twice a day', 'Two times daily', 'b.i.d.']
  },
  {
    id: 'term-7',
    term: 'QD',
    category: 'instruction',
    plainEnglish: 'Take Once Daily',
    details: 'QD means "quaque die" in Latin - take this medication once per day, usually at the same time each day.',
    examples: ['Once daily', 'Once a day', 'q.d.']
  },
  {
    id: 'term-8',
    term: 'PRN',
    category: 'instruction',
    plainEnglish: 'Take As Needed',
    details: 'PRN means "pro re nata" in Latin - take this medication only when you need it, not on a regular schedule.',
    examples: ['As needed', 'As required', 'p.r.n.']
  },
  {
    id: 'term-9',
    term: 'TSH',
    category: 'lab-test',
    plainEnglish: 'Thyroid Function Test',
    details: 'Thyroid Stimulating Hormone test checks if your thyroid gland is working properly. Your thyroid controls metabolism, energy, and body temperature.',
    normalRange: '0.4 - 4.0 mIU/L (higher = underactive thyroid, lower = overactive thyroid)',
    whyItMatters: 'Thyroid problems can cause fatigue, weight changes, mood issues, and heart problems.',
    examples: ['Thyroid test', 'Thyrotropin']
  },
  {
    id: 'term-10',
    term: 'Atorvastatin',
    category: 'medication',
    plainEnglish: 'Cholesterol-Lowering Medication (Statin)',
    details: 'Atorvastatin blocks the production of cholesterol in your liver. It\'s one of the most commonly prescribed statins.',
    whyItMatters: 'Reduces risk of heart attack and stroke by lowering LDL (bad) cholesterol and triglycerides.',
    examples: ['Lipitor']
  },
  {
    id: 'term-11',
    term: 'CMP',
    category: 'lab-test',
    plainEnglish: 'Comprehensive Metabolic Panel',
    details: 'A blood test that measures 14 different substances including glucose, electrolytes, kidney function, and liver function.',
    normalRange: 'Multiple values - check individual components',
    whyItMatters: 'Gives a broad picture of your overall health, especially kidney and liver function.',
    examples: ['Metabolic panel', 'Chem-14', 'Chemistry panel']
  },
  {
    id: 'term-12',
    term: 'Semaglutide',
    category: 'medication',
    plainEnglish: 'GLP-1 Medication for Diabetes/Weight Loss',
    details: 'Semaglutide mimics a hormone that helps regulate blood sugar and appetite. Used for type 2 diabetes and weight management.',
    whyItMatters: 'Helps lower blood sugar, promotes weight loss, and may reduce cardiovascular risk.',
    examples: ['Ozempic', 'Wegovy', 'Rybelsus']
  },
  {
    id: 'term-13',
    term: 'Hypertension',
    category: 'diagnosis',
    plainEnglish: 'High Blood Pressure',
    details: 'Blood pressure consistently above 130/80 mmHg. The force of blood against artery walls is too high.',
    whyItMatters: 'Can damage blood vessels, heart, brain, and kidneys. Major risk factor for heart disease and stroke.',
    examples: ['HTN', 'Elevated blood pressure']
  },
  {
    id: 'term-14',
    term: 'Levothyroxine',
    category: 'medication',
    plainEnglish: 'Thyroid Hormone Replacement',
    details: 'Synthetic version of the thyroid hormone T4. Replaces the hormone when your thyroid doesn\'t make enough (hypothyroidism).',
    whyItMatters: 'Restores normal metabolism, energy levels, and body functions affected by low thyroid.',
    examples: ['Synthroid', 'Levoxyl', 'Unithroid']
  },
  {
    id: 'term-15',
    term: 'PO',
    category: 'instruction',
    plainEnglish: 'Take By Mouth',
    details: 'PO means "per os" in Latin - swallow this medication (as opposed to injection, topical, etc.).',
    examples: ['Oral', 'By mouth', 'Orally']
  }
];

// Sample decoded documents
const sampleDecodedDocs: DecodedDocument[] = [
  {
    id: 'doc-1',
    type: 'prescription',
    uploadDate: '2026-01-15',
    fileName: 'Prescription_Metformin.pdf',
    decodedTerms: [
      {
        original: 'Metformin 1000mg',
        decoded: 'Diabetes medication to help control blood sugar - 1000 milligram dose',
        category: 'medication',
        importance: 'high'
      },
      {
        original: 'BID',
        decoded: 'Take twice daily (morning and evening)',
        category: 'instruction',
        importance: 'high'
      },
      {
        original: 'PO',
        decoded: 'Swallow by mouth (not injection or other method)',
        category: 'instruction',
        importance: 'medium'
      },
      {
        original: 'Dispense: 180',
        decoded: 'You\'ll receive 180 pills (90-day supply for twice-daily dosing)',
        category: 'instruction',
        importance: 'low'
      }
    ],
    summary: 'This prescription is for Metformin, a common first-line medication for type 2 diabetes. You\'ll take 1000mg twice per day with meals.',
    keyTakeaways: [
      'Take with food to reduce stomach upset',
      'Don\'t skip doses - consistency is important for blood sugar control',
      'Common side effects: nausea, diarrhea (usually improve after 1-2 weeks)',
      'You have 5 refills available'
    ],
    actionItems: [
      'Set reminders to take medication morning and evening',
      'Monitor blood sugar as directed by your doctor',
      'Call pharmacy before your 90-day supply runs out to refill'
    ]
  },
  {
    id: 'doc-2',
    type: 'lab-result',
    uploadDate: '2026-01-12',
    fileName: 'Lab_Results_HbA1c.pdf',
    decodedTerms: [
      {
        original: 'HbA1c: 6.2%',
        decoded: 'Your 3-month average blood sugar is in the prediabetes range (5.7-6.4%)',
        category: 'lab-test',
        importance: 'high'
      },
      {
        original: 'Fasting Glucose: 105 mg/dL',
        decoded: 'Your blood sugar after fasting is slightly elevated (normal is 70-100 mg/dL)',
        category: 'lab-test',
        importance: 'high'
      },
      {
        original: 'TSH: 2.1 mIU/L',
        decoded: 'Your thyroid function is normal (normal range: 0.4-4.0)',
        category: 'lab-test',
        importance: 'medium'
      },
      {
        original: 'LDL: 118 mg/dL',
        decoded: 'Your "bad" cholesterol is slightly elevated (optimal is <100 mg/dL)',
        category: 'lab-test',
        importance: 'medium'
      }
    ],
    summary: 'Your lab results show prediabetes (HbA1c 6.2%) and slightly elevated cholesterol. These are early warning signs that can be improved with lifestyle changes.',
    keyTakeaways: [
      'You\'re in the prediabetes range - not diabetic yet, but at increased risk',
      'Lifestyle changes now can prevent or delay type 2 diabetes',
      'Thyroid function is normal - no concerns there',
      'LDL cholesterol could be improved with diet and exercise'
    ],
    actionItems: [
      'Discuss prediabetes management plan with your doctor',
      'Consider meeting with a nutritionist for meal planning',
      'Aim for 150 minutes of moderate exercise per week',
      'Recheck HbA1c in 3 months to track progress'
    ]
  },
  {
    id: 'doc-3',
    type: 'medical-bill',
    uploadDate: '2026-01-08',
    fileName: 'Medical_Bill_Office_Visit.pdf',
    decodedTerms: [
      {
        original: 'CPT 99213',
        decoded: 'Standard office visit with established patient (20-29 minutes)',
        category: 'medical-code',
        importance: 'high'
      },
      {
        original: 'CPT 80053',
        decoded: 'Comprehensive metabolic panel (blood test for kidney/liver function)',
        category: 'medical-code',
        importance: 'medium'
      },
      {
        original: 'CPT 83036',
        decoded: 'Hemoglobin A1c test (diabetes blood test)',
        category: 'medical-code',
        importance: 'medium'
      },
      {
        original: 'ICD-10: E11.9',
        decoded: 'Diagnosis code for Type 2 Diabetes',
        category: 'medical-code',
        importance: 'medium'
      }
    ],
    summary: 'This bill is for a routine diabetes follow-up visit with lab work to monitor your blood sugar and overall health.',
    keyTakeaways: [
      'Office visit charge: $150 (typically covered by insurance with copay)',
      'Lab work charges: $85 total for both blood tests',
      'Your insurance should cover most of this (check your EOB)',
      'Total billed: $235'
    ],
    actionItems: [
      'Review your insurance Explanation of Benefits (EOB) when it arrives',
      'Verify your copay amount matches what you paid',
      'Contact billing office if charges seem incorrect',
      'Keep for your records and tax deductions if applicable'
    ]
  }
];

export default function TreatmentDecoder() {
  const [activeTab, setActiveTab] = useState<'decoder' | 'dictionary' | 'documents' | 'directory'>('decoder');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredDictionary = medicalDictionary.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.plainEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedDocument = sampleDecodedDocs.find(doc => doc.id === selectedDoc);

  const renderDecoder = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-12 text-center hover:border-blue-500/50 hover:bg-blue-500/10 transition cursor-pointer">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold text-white mb-2">Upload or Scan Medical Document</h3>
        <p className="text-gray-400 mb-6">
          Prescription, lab result, medical bill, or discharge summary
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition font-semibold">
            📁 Choose File
          </button>
          <button className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition font-semibold">
            📷 Take Photo
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Supports PDF, JPG, PNG • Your documents are private and encrypted
        </p>
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">🔍 How Treatment Decoder Works</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-3xl mb-2">1️⃣</div>
            <div className="font-semibold mb-1">Upload Document</div>
            <p className="text-sm text-gray-400">
              Take a photo or upload a PDF of your medical document
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-3xl mb-2">2️⃣</div>
            <div className="font-semibold mb-1">AI Analyzes</div>
            <p className="text-sm text-gray-400">
              Our AI extracts medical terms, codes, and complex language
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-3xl mb-2">3️⃣</div>
            <div className="font-semibold mb-1">Get Plain English</div>
            <p className="text-sm text-gray-400">
              Receive clear explanations, action items, and what it means for you
            </p>
          </div>
        </div>
      </div>

      {/* Sample Documents */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">📄 Recently Decoded Documents</h3>
        <div className="space-y-3">
          {sampleDecodedDocs.map(doc => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {doc.type === 'prescription' && '💊'}
                    {doc.type === 'lab-result' && '🧪'}
                    {doc.type === 'medical-bill' && '💰'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{doc.fileName}</div>
                    <div className="text-sm text-gray-400">
                      {doc.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {doc.uploadDate}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {doc.decodedTerms.length} terms decoded
                    </div>
                  </div>
                </div>
                <div className="text-blue-400">→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDictionary = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search medical terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All Categories</option>
            <option value="medication">Medications</option>
            <option value="lab-test">Lab Tests</option>
            <option value="diagnosis">Diagnoses</option>
            <option value="procedure">Procedures</option>
            <option value="medical-code">Medical Codes</option>
            <option value="instruction">Instructions</option>
          </select>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          {filteredDictionary.length} terms found
        </div>
      </div>

      {/* Medical Terms */}
      <div className="space-y-3">
        {filteredDictionary.map(term => (
          <div
            key={term.id}
            className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/30 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{term.term}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    term.category === 'medication' ? 'bg-green-500/20 text-green-400' :
                    term.category === 'lab-test' ? 'bg-blue-500/20 text-blue-400' :
                    term.category === 'diagnosis' ? 'bg-red-500/20 text-red-400' :
                    term.category === 'procedure' ? 'bg-purple-500/20 text-purple-400' :
                    term.category === 'medical-code' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {term.category.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-blue-400 font-semibold mb-2">
                  💬 {term.plainEnglish}
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{term.details}</p>

            {term.normalRange && (
              <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-sm font-semibold text-blue-400 mb-1">Normal Range:</div>
                <div className="text-sm text-gray-300">{term.normalRange}</div>
              </div>
            )}

            {term.whyItMatters && (
              <div className="mb-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="text-sm font-semibold text-purple-400 mb-1">Why It Matters:</div>
                <div className="text-sm text-gray-300">{term.whyItMatters}</div>
              </div>
            )}

            {term.examples && term.examples.length > 0 && (
              <div className="text-sm text-gray-400">
                <span className="font-semibold">Also known as:</span> {term.examples.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {selectedDocument ? (
        <div>
          <button
            onClick={() => setSelectedDoc(null)}
            className="mb-6 text-blue-400 hover:text-blue-300 transition flex items-center gap-2"
          >
            ← Back to Documents
          </button>

          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl">
                {selectedDocument.type === 'prescription' && '💊'}
                {selectedDocument.type === 'lab-result' && '🧪'}
                {selectedDocument.type === 'medical-bill' && '💰'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedDocument.fileName}</h2>
                <div className="text-gray-400">
                  {selectedDocument.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • Uploaded {selectedDocument.uploadDate}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="text-sm font-semibold text-blue-400 mb-2">📝 Summary</div>
              <p className="text-gray-300">{selectedDocument.summary}</p>
            </div>

            {/* Decoded Terms */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">🔍 Decoded Terms</h3>
              <div className="space-y-3">
                {selectedDocument.decodedTerms.map((term, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      term.importance === 'high' ? 'bg-red-500/10 border-red-500/30' :
                      term.importance === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-gray-500/10 border-gray-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-mono text-sm text-gray-400">{term.original}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        term.importance === 'high' ? 'bg-red-500/20 text-red-400' :
                        term.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {term.importance}
                      </span>
                    </div>
                    <div className="text-white">💬 {term.decoded}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">💡 Key Takeaways</h3>
              <ul className="space-y-2">
                {selectedDocument.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400">✓</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            {selectedDocument.actionItems && selectedDocument.actionItems.length > 0 && (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">⚡ Action Items</h3>
                <ul className="space-y-2">
                  {selectedDocument.actionItems.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="text-purple-400">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sampleDecodedDocs.map(doc => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/30 hover:bg-white/10 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {doc.type === 'prescription' && '💊'}
                    {doc.type === 'lab-result' && '🧪'}
                    {doc.type === 'medical-bill' && '💰'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{doc.fileName}</h3>
                    <div className="text-sm text-gray-400 mb-2">
                      {doc.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {doc.uploadDate}
                    </div>
                    <div className="text-sm text-gray-300">{doc.summary}</div>
                    <div className="mt-3 flex gap-2">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        {doc.decodedTerms.length} terms
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                        {doc.keyTakeaways.length} takeaways
                      </span>
                      {doc.actionItems && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                          {doc.actionItems.length} actions
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-blue-400 text-xl">→</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDirectory = () => {
    if (selectedTopic) {
      const topic = healthDirectory.find(d => d.topics.some(t => t.title === selectedTopic));
      const topicDetail = topic?.topics.find(t => t.title === selectedTopic);
      
      if (!topicDetail) return null;

      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedTopic(null)}
            className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2"
          >
            ← Back to Health Directory
          </button>

          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-bold text-white mb-4">{topicDetail.title}</h2>
            <p className="text-gray-300 text-lg mb-6">{topicDetail.description}</p>

            {/* Common Terms */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Common Medical Terms You'll See</h3>
              <div className="flex flex-wrap gap-2">
                {topicDetail.commonTerms.map((term, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
                    {term}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Tools That Can Help</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {topicDetail.relatedTools.map((tool, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="font-semibold text-purple-400">{tool}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
              <button className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition text-left">
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-semibold mb-1">Decode a Document</div>
                <div className="text-sm text-gray-400">Upload lab results or prescriptions related to this topic</div>
              </button>
              
              <button className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition text-left">
                <div className="text-2xl mb-2">📍</div>
                <div className="font-semibold mb-1">Find a Specialist</div>
                <div className="text-sm text-gray-400">Locate providers who specialize in {topicDetail.title.toLowerCase()}</div>
              </button>
              
              <button className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition text-left">
                <div className="text-2xl mb-2">💬</div>
                <div className="font-semibold mb-1">Ask Beau-Tox AI</div>
                <div className="text-sm text-gray-400">Get personalized guidance about this topic</div>
              </button>
              
              <button className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition text-left">
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold mb-1">Educational Resources</div>
                <div className="text-sm text-gray-400">Learn more with plain-English articles</div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-900/20 via-gray-900/50 to-black p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🏥</span>
            <h2 className="text-3xl font-bold text-white">Health Directory</h2>
          </div>
          <p className="text-gray-300 text-lg">
            Browse health topics organized like WebMD - find what you need, decode what you see, understand what it means.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-6">
          {healthDirectory.map(directory => {
            const colorClasses = {
              pink: 'from-pink-500/10 to-pink-600/10 border-pink-500/30',
              blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30',
              purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30',
              red: 'from-red-500/10 to-red-600/10 border-red-500/30',
              rose: 'from-rose-500/10 to-rose-600/10 border-rose-500/30',
              green: 'from-green-500/10 to-green-600/10 border-green-500/30',
              orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/30',
              yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30'
            };

            return (
              <div key={directory.id} className={`rounded-xl border bg-gradient-to-br p-6 ${colorClasses[directory.color as keyof typeof colorClasses]}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{directory.icon}</span>
                  <h3 className="text-2xl font-bold text-white">{directory.category}</h3>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {directory.topics.map(topic => (
                    <button
                      key={topic.title}
                      onClick={() => setSelectedTopic(topic.title)}
                      className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition text-left"
                    >
                      <div className="font-semibold text-white mb-1">{topic.title}</div>
                      <div className="text-sm text-gray-400">{topic.description}</div>
                      <div className="mt-2 text-xs text-blue-400">
                        {topic.commonTerms.length} common terms →
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/10">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="font-semibold text-white mb-2">How to use the Health Directory</h4>
              <p className="text-gray-300 text-sm">
                Click any topic to see common medical terms, related tools, and quick actions. Upload documents, find specialists, or chat with Beau-Tox AI to get personalized help.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔍</span>
            <div>
              <h1 className="text-3xl font-bold">Treatment Decoder</h1>
              <p className="text-gray-400">Translate medical jargon into plain English instantly</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
          {[
            { id: 'decoder', label: 'Upload & Decode', icon: '📸' },
            { id: 'directory', label: 'Health Directory', icon: '🏥' },
            { id: 'dictionary', label: 'Medical Dictionary', icon: '📚' },
            { id: 'documents', label: 'Your Documents', icon: '📄' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'decoder' && renderDecoder()}
        {activeTab === 'directory' && renderDirectory()}
        {activeTab === 'dictionary' && renderDictionary()}
        {activeTab === 'documents' && renderDocuments()}
      </div>
    </div>
  );
}
