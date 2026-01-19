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
    id: string;
  }[];
};

// Educational Content Library
type EducationalContent = {
  topicId: string;
  articles: {
    title: string;
    summary: string;
    keyPoints: string[];
  }[];
  trustedResources: {
    name: string;
    url: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
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
        id: 'birth-control',
        title: 'Birth Control & Contraception',
        description: 'Understanding your options, side effects, and effectiveness',
        commonTerms: ['IUD', 'Oral contraceptive', 'Depo-Provera', 'Nexplanon', 'Emergency contraception'],
        relatedTools: ['Treatment Decoder', 'Provider Finder', 'AI Health Insights']
      },
      {
        id: 'pregnancy',
        title: 'Pregnancy & Prenatal Care',
        description: 'From conception through delivery and postpartum',
        commonTerms: ['HCG levels', 'Prenatal vitamins', 'Ultrasound', 'Gestational diabetes', 'Preeclampsia'],
        relatedTools: ['Treatment Decoder', 'Timeline Tracker', 'Document Analysis']
      },
      {
        id: 'menstrual-health',
        title: 'Menstrual Health & PCOS',
        description: 'Period tracking, irregularities, and hormonal conditions',
        commonTerms: ['Amenorrhea', 'Dysmenorrhea', 'PCOS', 'Endometriosis', 'Fibroids'],
        relatedTools: ['Symptom Tracker', 'AI Health Insights', 'Provider Finder']
      },
      {
        id: 'menopause',
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
        id: 'prostate-health',
        title: 'Prostate Health',
        description: 'Screening, enlargement, and prostate-specific concerns',
        commonTerms: ['PSA test', 'BPH', 'Prostatitis', 'Digital rectal exam', 'Finasteride'],
        relatedTools: ['Treatment Decoder', 'Lab Result Analyzer', 'Provider Finder']
      },
      {
        id: 'testosterone-health',
        title: 'Testosterone & Hormone Health',
        description: 'Understanding low T, testing, and treatment options',
        commonTerms: ['Total testosterone', 'Free testosterone', 'TRT', 'Hypogonadism', 'SHBG'],
        relatedTools: ['Lab Decoder', 'AI Health Insights', 'Medication Guide']
      },
      {
        id: 'sexual-health-ed',
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
        id: 'anxiety-disorders',
        title: 'Anxiety & Panic Disorders',
        description: 'Symptoms, medications, and coping strategies',
        commonTerms: ['Generalized anxiety', 'Panic attack', 'SSRI', 'Benzodiazepine', 'CBT'],
        relatedTools: ['Crisis Center', 'Medication Decoder', 'Provider Finder']
      },
      {
        id: 'depression-disorders',
        title: 'Depression & Mood Disorders',
        description: 'Understanding depression, bipolar, and treatment options',
        commonTerms: ['Major depressive disorder', 'Antidepressant', 'SNRI', 'Mood stabilizer', 'PHQ-9'],
        relatedTools: ['Treatment Decoder', 'AI Health Insights', 'Crisis Resources']
      },
      {
        id: 'adhd-focus',
        title: 'ADHD & Focus',
        description: 'Diagnosis, stimulant medications, and management',
        commonTerms: ['ADHD', 'Adderall', 'Vyvanse', 'Methylphenidate', 'Strattera'],
        relatedTools: ['Medication Guide', 'Provider Finder', 'Treatment Decoder']
      },
      {
        id: 'sleep-disorders',
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
        id: 'diabetes-management',
        title: 'Diabetes Management',
        description: 'Type 1, Type 2, monitoring, and medications',
        commonTerms: ['HbA1c', 'Fasting glucose', 'Metformin', 'Insulin', 'CGM', 'Diabetic retinopathy'],
        relatedTools: ['Lab Decoder', 'Medication Tracker', 'AI Health Insights']
      },
      {
        id: 'heart-health',
        title: 'Heart Health & Blood Pressure',
        description: 'Hypertension, cholesterol, and cardiovascular care',
        commonTerms: ['Hypertension', 'LDL cholesterol', 'Statin', 'ACE inhibitor', 'Beta blocker'],
        relatedTools: ['Treatment Decoder', 'Vital Signs Tracker', 'Provider Finder']
      },
      {
        id: 'thyroid-disorders',
        title: 'Thyroid Disorders',
        description: 'Hypothyroid, hyperthyroid, and hormone replacement',
        commonTerms: ['TSH', 'T4', 'Levothyroxine', 'Hashimoto', 'Graves disease'],
        relatedTools: ['Lab Result Decoder', 'Medication Guide', 'AI Insights']
      },
      {
        id: 'autoimmune-conditions',
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
        id: 'sti-testing',
        title: 'STI Testing & Prevention',
        description: 'Screening, treatment, and prevention strategies',
        commonTerms: ['Chlamydia', 'Gonorrhea', 'HIV test', 'Syphilis', 'HPV vaccine', 'PrEP'],
        relatedTools: ['Lab Decoder', 'Provider Finder', 'Confidential Resources']
      },
      {
        id: 'birth-control-family-planning',
        title: 'Birth Control & Family Planning',
        description: 'All contraceptive options explained clearly',
        commonTerms: ['IUD insertion', 'Birth control pill', 'Nexplanon', 'Tubal ligation', 'Vasectomy'],
        relatedTools: ['Treatment Decoder', 'Provider Finder', 'Cost Estimator']
      },
      {
        id: 'sexual-wellness',
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
        id: 'cancer-screening',
        title: 'Cancer Screening',
        description: 'Mammograms, colonoscopy, skin checks, and early detection',
        commonTerms: ['Mammogram', 'Colonoscopy', 'PAP smear', 'PSA screening', 'Skin biopsy'],
        relatedTools: ['Test Result Decoder', 'Provider Finder', 'Timeline Tracker']
      },
      {
        id: 'vaccinations',
        title: 'Vaccinations & Immunizations',
        description: 'Adult vaccines, travel immunizations, and boosters',
        commonTerms: ['Flu shot', 'COVID vaccine', 'Tdap', 'HPV vaccine', 'Shingles vaccine'],
        relatedTools: ['Immunization Record', 'Provider Finder', 'Travel Health']
      },
      {
        id: 'annual-wellness',
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
        id: 'weight-management',
        title: 'Weight Management',
        description: 'Medications, nutrition, and sustainable approaches',
        commonTerms: ['GLP-1', 'Ozempic', 'Wegovy', 'Metformin', 'BMI', 'Bariatric surgery'],
        relatedTools: ['Medication Decoder', 'Provider Finder', 'Cost Calculator']
      },
      {
        id: 'sports-medicine',
        title: 'Sports Medicine & Injuries',
        description: 'Treating and preventing athletic injuries',
        commonTerms: ['ACL tear', 'Rotator cuff', 'Stress fracture', 'Physical therapy', 'MRI'],
        relatedTools: ['Imaging Decoder', 'Provider Finder', 'Recovery Tracker']
      },
      {
        id: 'nutrition-supplements',
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
        id: 'pediatric-vaccines',
        title: 'Pediatric Vaccinations',
        description: 'Childhood immunization schedules and safety',
        commonTerms: ['DTaP', 'MMR', 'Varicella', 'HPV vaccine', 'Meningococcal'],
        relatedTools: ['Vaccine Tracker', 'Provider Finder', 'Educational Resources']
      },
      {
        id: 'child-development',
        title: 'Growth & Development',
        description: 'Milestones, growth charts, and developmental screening',
        commonTerms: ['Growth percentile', 'Developmental delay', 'Well-child visit', 'Autism screening'],
        relatedTools: ['Growth Tracker', 'Pediatric Resources', 'Provider Network']
      },
      {
        id: 'childhood-conditions',
        title: 'Common Childhood Conditions',
        description: 'Ear infections, asthma, allergies, and pediatric care',
        commonTerms: ['Otitis media', 'Pediatric asthma', 'Food allergy', 'Strep throat', 'RSV'],
        relatedTools: ['Symptom Checker', 'Treatment Decoder', 'Provider Finder']
      }
    ]
  }
];

// Educational Content Library - Plain-English guides for each health topic
const contentLibrary: EducationalContent[] = [
  {
    topicId: 'birth-control',
    articles: [
      {
        title: 'Birth Control Options: What You Need to Know',
        summary: 'A complete guide to all contraceptive methods, from IUDs to pills to permanent options.',
        keyPoints: [
          'IUDs are 99% effective and last 3-12 years depending on type',
          'Birth control pills must be taken daily at the same time',
          'Emergency contraception (Plan B) works best within 24 hours',
          'Many options are covered 100% by insurance under the ACA',
          'You don\'t need parental consent if you\'re 18+ in most states'
        ]
      },
      {
        title: 'Understanding Birth Control Side Effects',
        summary: 'What\'s normal, what\'s not, and when to call your doctor.',
        keyPoints: [
          'Spotting is common in the first 3 months of starting hormonal BC',
          'Mood changes should be discussed with your provider',
          'Severe headaches or leg pain need immediate medical attention',
          'IUD insertion cramping usually resolves within 24-48 hours',
          'Non-hormonal options exist (copper IUD, condoms, diaphragm)'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'Planned Parenthood - Birth Control Guide',
        url: 'https://www.plannedparenthood.org/learn/birth-control',
        description: 'Compare all birth control methods with effectiveness rates'
      },
      {
        name: 'Bedsider Birth Control Support Network',
        url: 'https://www.bedsider.org',
        description: 'Interactive tool to find the best birth control for your lifestyle'
      },
      {
        name: 'CDC Contraceptive Effectiveness',
        url: 'https://www.cdc.gov/reproductivehealth/contraception/index.htm',
        description: 'Evidence-based information on contraceptive effectiveness'
      }
    ],
    faqs: [
      {
        question: 'Can I get birth control without my parents knowing?',
        answer: 'If you\'re 18+, yes - your healthcare is confidential. If you\'re under 18, laws vary by state, but many states allow minors to consent to contraceptive services. Planned Parenthood and similar clinics offer confidential services regardless of age.'
      },
      {
        question: 'Does insurance cover birth control?',
        answer: 'Under the Affordable Care Act (ACA), most insurance plans must cover FDA-approved contraceptives without copay. This includes pills, IUDs, implants, rings, and patches. If you\'re denied coverage, you can appeal.'
      },
      {
        question: 'What if I miss a birth control pill?',
        answer: 'Take it as soon as you remember. If you miss 2+ pills, use backup contraception (condoms) for 7 days. Consider emergency contraception if you had unprotected sex in the last 5 days.'
      }
    ]
  },
  {
    topicId: 'pregnancy',
    articles: [
      {
        title: 'Your First Trimester: What to Expect',
        summary: 'Week-by-week guide to early pregnancy symptoms, tests, and prenatal care.',
        keyPoints: [
          'First prenatal visit typically happens at 8-10 weeks',
          'Morning sickness affects 70-80% of pregnant people',
          'Prenatal vitamins with folic acid reduce birth defect risk by 70%',
          'First ultrasound confirms due date and heartbeat',
          'Most miscarriages happen in first trimester - it\'s not your fault'
        ]
      },
      {
        title: 'Prenatal Testing: What\'s Required vs Optional',
        summary: 'Understanding genetic screening, glucose tests, and ultrasounds.',
        keyPoints: [
          'NIPT (cell-free DNA) can screen for genetic conditions at 10 weeks',
          'Glucose tolerance test screens for gestational diabetes at 24-28 weeks',
          'Anatomy ultrasound at 20 weeks checks baby\'s development',
          'Group B strep test happens at 35-37 weeks',
          'You can decline any test - ask questions first'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'March of Dimes Pregnancy Guide',
        url: 'https://www.marchofdimes.org/find-support/topics/pregnancy',
        description: 'Week-by-week pregnancy guide with science-backed information'
      },
      {
        name: 'ACOG Patient Education',
        url: 'https://www.acog.org/womens-health/faqs',
        description: 'American College of Obstetricians and Gynecologists resources'
      },
      {
        name: 'CDC Pregnancy Information',
        url: 'https://www.cdc.gov/pregnancy/index.html',
        description: 'Health guidance for before, during, and after pregnancy'
      }
    ],
    faqs: [
      {
        question: 'When should I take a pregnancy test?',
        answer: 'For most accurate results, wait until the first day of your missed period. Tests detect HCG hormone which doubles every 48-72 hours in early pregnancy. If negative but still no period, test again in 3-4 days.'
      },
      {
        question: 'What prenatal vitamins should I take?',
        answer: 'Look for one with at least 400-800 mcg of folic acid, plus iron, calcium, and vitamin D. Start taking prenatal vitamins before trying to conceive if possible. Many generic versions work just as well as name brands.'
      },
      {
        question: 'Is it normal to have cramping in early pregnancy?',
        answer: 'Mild cramping is normal as your uterus expands. However, severe cramping with bleeding, especially on one side, needs immediate medical evaluation to rule out ectopic pregnancy or miscarriage.'
      }
    ]
  },
  {
    topicId: 'menstrual-health',
    articles: [
      {
        title: 'Understanding Your Menstrual Cycle',
        summary: 'A complete guide to what\'s normal, tracking your cycle, and recognizing problems.',
        keyPoints: [
          'Normal cycles range from 21-35 days; bleeding typically lasts 2-7 days',
          'PCOS affects 1 in 10 women and causes irregular periods and ovarian cysts',
          'Endometriosis causes severe pain and affects 10% of reproductive-age women',
          'Track your cycle for 3+ months to identify patterns and irregularities',
          'Severe pain that interferes with daily life is NOT normal - seek help'
        ]
      },
      {
        title: 'PCOS: Diagnosis and Management',
        summary: 'What you need to know about polycystic ovary syndrome.',
        keyPoints: [
          'Diagnosed with 2 of 3: irregular periods, high androgens, polycystic ovaries',
          'Can cause fertility issues, weight gain, acne, and excess hair growth',
          'Managed with birth control, metformin, lifestyle changes',
          'Increases risk of diabetes and heart disease - regular screening important',
          'Many people with PCOS can still get pregnant with treatment'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'ACOG - Menstrual Health',
        url: 'https://www.acog.org/womens-health/faqs/abnormal-uterine-bleeding',
        description: 'Expert guidance on period problems and when to see a doctor'
      },
      {
        name: 'PCOS Awareness Association',
        url: 'https://www.pcosaa.org',
        description: 'Support, education, and resources for PCOS management'
      },
      {
        name: 'Endometriosis Foundation',
        url: 'https://www.endofound.org',
        description: 'Information on symptoms, diagnosis, and treatment options'
      }
    ],
    faqs: [
      {
        question: 'How much bleeding is too much during my period?',
        answer: 'Soaking through a pad or tampon every hour for several hours, bleeding for more than 7 days, or passing clots larger than a quarter are signs of heavy bleeding. This can lead to anemia and should be evaluated by a doctor.'
      },
      {
        question: 'Is it normal for periods to be irregular?',
        answer: 'Some variation is normal, especially in the first few years after starting periods or approaching menopause. However, consistently irregular cycles (varying by more than 7-9 days) may indicate PCOS, thyroid issues, or other conditions worth investigating.'
      },
      {
        question: 'Can I get pregnant with PCOS?',
        answer: 'Yes! While PCOS can make it harder to conceive, many people with PCOS successfully get pregnant with lifestyle changes, medications like metformin or letrozole, or fertility treatments. Early diagnosis and management improve chances.'
      }
    ]
  },
  {
    topicId: 'menopause',
    articles: [
      {
        title: 'Navigating Perimenopause and Menopause',
        summary: 'Understanding the transition, symptoms, and treatment options.',
        keyPoints: [
          'Perimenopause starts 4-10 years before menopause (average age 51)',
          'Hot flashes affect 75% of women and can last 7+ years',
          'Hormone replacement therapy (HRT) is safe for most women under 60',
          'Vaginal dryness, mood changes, and sleep issues are common and treatable',
          'Bone density screening recommended - menopause increases osteoporosis risk'
        ]
      },
      {
        title: 'Hormone Replacement Therapy: Risks and Benefits',
        summary: 'Making an informed decision about HRT.',
        keyPoints: [
          'HRT relieves hot flashes, improves sleep, and prevents bone loss',
          'Lowest dose for shortest time is current recommendation',
          'Small increased risk of blood clots and breast cancer with long-term use',
          'Bioidentical hormones aren\'t necessarily safer than FDA-approved HRT',
          'Non-hormonal options exist: SSRIs, gabapentin, lifestyle changes'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'North American Menopause Society',
        url: 'https://www.menopause.org',
        description: 'Evidence-based information on menopause and treatment options'
      },
      {
        name: 'NIH Menopause Information',
        url: 'https://www.nia.nih.gov/health/menopause',
        description: 'Comprehensive guide to symptoms, treatments, and health after menopause'
      },
      {
        name: 'Menopause HRT Decision Tool',
        url: 'https://www.mayoclinic.org/diseases-conditions/menopause/in-depth/hormone-therapy/art-20046372',
        description: 'Mayo Clinic guide to deciding if HRT is right for you'
      }
    ],
    faqs: [
      {
        question: 'When should I consider hormone replacement therapy?',
        answer: 'Consider HRT if hot flashes or vaginal symptoms significantly affect your quality of life. It\'s most effective when started within 10 years of menopause or before age 60. Discuss your personal risk factors with your doctor - family history of breast cancer or blood clots may affect recommendations.'
      },
      {
        question: 'Are bioidentical hormones safer than traditional HRT?',
        answer: 'No. "Bioidentical" is a marketing term - all hormone therapy carries similar risks. FDA-approved HRT is well-studied and regulated. Compounded bioidentical hormones aren\'t FDA-approved and may have inconsistent dosing. Stick with FDA-approved options.'
      },
      {
        question: 'Will menopause affect my sex life?',
        answer: 'Vaginal dryness and decreased libido are common but treatable. Vaginal estrogen cream, lubricants, and moisturizers help with dryness. Some women experience increased libido after menopause due to no pregnancy concerns. Communication with partners and healthcare providers is key.'
      }
    ]
  },
  {
    topicId: 'prostate-health',
    articles: [
      {
        title: 'Prostate Screening: PSA Tests Explained',
        summary: 'Understanding prostate-specific antigen testing and what results mean.',
        keyPoints: [
          'PSA screening typically starts at age 50 (45 for high-risk individuals)',
          'Elevated PSA doesn\'t always mean cancer - BPH and infections also raise levels',
          'PSA velocity (how fast it rises) is more important than single number',
          'Digital rectal exam (DRE) should accompany PSA test for complete screening',
          'Discuss screening frequency with doctor based on results and risk factors'
        ]
      },
      {
        title: 'Benign Prostatic Hyperplasia (BPH): Treatment Options',
        summary: 'Managing enlarged prostate and urinary symptoms.',
        keyPoints: [
          'BPH affects 50% of men by age 60, 90% by age 85',
          'Symptoms: weak stream, frequent urination, difficulty starting/stopping',
          'Medications like finasteride and tamsulosin can shrink prostate and relax muscles',
          'Minimally invasive procedures available if medications don\'t help',
          'BPH doesn\'t increase cancer risk but can coexist with it'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Urological Association',
        url: 'https://www.urologyhealth.org/urologic-conditions/prostate-enlargement',
        description: 'Expert guidance on prostate health, screening, and treatment'
      },
      {
        name: 'CDC Prostate Cancer Screening',
        url: 'https://www.cdc.gov/cancer/prostate/basic_info/screening.htm',
        description: 'Evidence-based recommendations for PSA screening'
      },
      {
        name: 'Prostate Cancer Foundation',
        url: 'https://www.pcf.org',
        description: 'Research updates, treatment options, and patient support'
      }
    ],
    faqs: [
      {
        question: 'What PSA level should worry me?',
        answer: 'There\'s no single cutoff - it depends on age and risk factors. Generally, PSA under 4 ng/mL is considered normal, but younger men should have lower levels. More important is the trend: rapid increases over time (PSA velocity) are more concerning than a single elevated reading.'
      },
      {
        question: 'Do I need a prostate biopsy if my PSA is high?',
        answer: 'Not always. Your doctor will consider PSA level, rate of change, DRE findings, age, and family history. Additional tests like multiparametric MRI or 4K score test can help determine if biopsy is necessary. Many elevated PSA results are due to BPH or prostatitis, not cancer.'
      },
      {
        question: 'Can medications for BPH affect PSA levels?',
        answer: 'Yes. Finasteride and dutasteride (5-alpha reductase inhibitors) can reduce PSA levels by about 50%. Your doctor should account for this when interpreting results. Alpha-blockers like tamsulosin don\'t significantly affect PSA.'
      }
    ]
  },
  {
    topicId: 'testosterone-health',
    articles: [
      {
        title: 'Low Testosterone: Symptoms and Testing',
        summary: 'When to get tested and what normal levels look like.',
        keyPoints: [
          'Normal total testosterone: 300-1000 ng/dL (varies by lab and age)',
          'Symptoms: low libido, fatigue, decreased muscle mass, mood changes',
          'Test in morning (levels highest 7-10 AM); repeat if low to confirm',
          'Free testosterone and SHBG tests provide complete picture',
          'Many symptoms of low T overlap with depression, sleep apnea, thyroid issues'
        ]
      },
      {
        title: 'Testosterone Replacement Therapy: What You Need to Know',
        summary: 'TRT options, benefits, and risks.',
        keyPoints: [
          'Available as injections, gels, patches, or pellets - each has pros/cons',
          'Can improve energy, libido, muscle mass, and mood in men with true deficiency',
          'May worsen sleep apnea and increase red blood cell count',
          'Can reduce sperm count - not recommended if trying to conceive',
          'Regular monitoring of PSA, blood counts, and testosterone levels required'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'Endocrine Society - Low Testosterone',
        url: 'https://www.hormone.org/diseases-and-conditions/mens-health/low-testosterone',
        description: 'Evidence-based information on diagnosis and treatment'
      },
      {
        name: 'American Urological Association - TRT Guidelines',
        url: 'https://www.auanet.org/guidelines/guidelines/testosterone-deficiency-guideline',
        description: 'Clinical guidelines for testosterone therapy'
      },
      {
        name: 'Mayo Clinic - Male Hypogonadism',
        url: 'https://www.mayoclinic.org/diseases-conditions/male-hypogonadism',
        description: 'Comprehensive guide to causes, symptoms, and treatments'
      }
    ],
    faqs: [
      {
        question: 'Will TRT help me build muscle and lose weight?',
        answer: 'If you have true testosterone deficiency, TRT can help increase muscle mass and reduce body fat - but only when combined with exercise and proper nutrition. It\'s not a shortcut or bodybuilding supplement. Men with normal testosterone levels won\'t see benefits and risk side effects.'
      },
      {
        question: 'Can I still have children while on TRT?',
        answer: 'TRT typically reduces or stops sperm production. If you want to preserve fertility, discuss options like HCG therapy or clomiphene instead of traditional TRT. If already on TRT and want to conceive, you may need to stop temporarily and work with a fertility specialist.'
      },
      {
        question: 'Is "low T" from TV ads the same as medical hypogonadism?',
        answer: 'Often no. Many "Low T clinics" market to men with normal aging changes, not true deficiency. Get properly tested by a primary care doctor or endocrinologist first. Symptoms like fatigue can have many causes - don\'t assume it\'s testosterone without proper evaluation.'
      }
    ]
  },
  {
    topicId: 'sexual-health-ed',
    articles: [
      {
        title: 'Erectile Dysfunction: Causes and Treatments',
        summary: 'Understanding ED and evidence-based solutions.',
        keyPoints: [
          'Affects 50% of men aged 40-70; often first sign of heart disease',
          'Common causes: diabetes, high blood pressure, low testosterone, psychological factors',
          'Medications like sildenafil (Viagra) and tadalafil (Cialis) work for 70% of men',
          'Lifestyle changes (exercise, weight loss, quit smoking) can improve function',
          'Always see doctor first - ED can signal serious cardiovascular issues'
        ]
      },
      {
        title: 'STI Prevention and Testing for Men',
        summary: 'What tests you need and when.',
        keyPoints: [
          'Annual STI screening recommended for sexually active gay/bisexual men',
          'Heterosexual men: test if new partner, multiple partners, or symptoms',
          'Full panel includes HIV, syphilis, gonorrhea, chlamydia, hepatitis',
          'Many STIs are asymptomatic - testing is prevention',
          'PrEP available for HIV prevention in high-risk individuals'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'Sexual Medicine Society of North America',
        url: 'https://www.smsna.org/patients',
        description: 'Patient education on erectile dysfunction and sexual health'
      },
      {
        name: 'CDC - STI Testing Recommendations',
        url: 'https://www.cdc.gov/std/prevention/screeningreccs.htm',
        description: 'Evidence-based STI screening guidelines'
      },
      {
        name: 'American Urological Association - ED',
        url: 'https://www.urologyhealth.org/urologic-conditions/erectile-dysfunction',
        description: 'Comprehensive ED information and treatment options'
      }
    ],
    faqs: [
      {
        question: 'Are ED medications safe? Do I need a prescription?',
        answer: 'Viagra, Cialis, and similar medications are safe for most men when prescribed by a doctor. They can be dangerous if you take nitrates for heart disease or have severe cardiovascular issues. Always get a prescription - online pills without prescription may be counterfeit or dangerous.'
      },
      {
        question: 'How often should I get tested for STIs?',
        answer: 'Depends on your risk: sexually active gay/bisexual men should test every 3-6 months. For others, test annually if you have multiple partners, before new partner, if partner has STI, or if you have symptoms. More frequent testing if very sexually active.'
      },
      {
        question: 'Can ED be cured or is it permanent?',
        answer: 'Often yes! If caused by lifestyle factors (obesity, smoking, diabetes), improvements in these areas can restore function. If caused by medication side effects, switching drugs may help. Psychological ED responds well to therapy. Even if underlying cause can\'t be fixed, treatments are highly effective.'
      }
    ]
  },
  {
    topicId: 'anxiety-disorders',
    articles: [
      {
        title: 'Understanding Anxiety and Panic Attacks',
        summary: 'Recognizing symptoms and getting effective treatment.',
        keyPoints: [
          'Anxiety disorders are the most common mental health condition (affects 40 million adults)',
          'Panic attacks peak within 10 minutes; symptoms include racing heart, sweating, feeling of doom',
          'SSRIs and SNRIs are first-line medications; benzodiazepines for short-term only',
          'Cognitive behavioral therapy (CBT) is as effective as medication long-term',
          'Untreated anxiety increases risk of depression, substance abuse, physical health problems'
        ]
      },
      {
        title: 'Anxiety Medications: What Works and What to Avoid',
        summary: 'Evidence-based guide to medication options.',
        keyPoints: [
          'SSRIs (like Lexapro, Zoloft) take 4-6 weeks to work but no addiction risk',
          'Benzodiazepines (Xanax, Ativan) work fast but highly addictive - use sparingly',
          'Buspirone and hydroxyzine are non-addictive alternatives',
          'Beta-blockers can help with physical symptoms (racing heart, tremors)',
          'Therapy plus medication works better than either alone for severe anxiety'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'Anxiety & Depression Association of America',
        url: 'https://adaa.org',
        description: 'Find therapists, support groups, and evidence-based treatment info'
      },
      {
        name: 'NIMH - Anxiety Disorders',
        url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
        description: 'National Institute of Mental Health research and resources'
      },
      {
        name: 'Crisis Text Line',
        url: 'https://www.crisistextline.org',
        description: 'Text HOME to 741741 for free 24/7 crisis support'
      }
    ],
    faqs: [
      {
        question: 'How do I know if it\'s normal stress or an anxiety disorder?',
        answer: 'Anxiety disorder is diagnosed when worry is excessive, difficult to control, lasts 6+ months, and interferes with daily life (work, relationships, sleep). Physical symptoms like racing heart, muscle tension, and fatigue are also common. If anxiety stops you from doing things you want/need to do, it\'s time to get help.'
      },
      {
        question: 'Will I have to take anxiety medication forever?',
        answer: 'Not necessarily. Many people take SSRIs for 1-2 years, then slowly taper off while continuing therapy. Some need longer-term treatment. The goal is finding the minimum effective treatment - which might be therapy alone, medication alone, or both. Work with your doctor on a plan that\'s right for you.'
      },
      {
        question: 'Can I get addicted to Xanax or Ativan?',
        answer: 'Yes. Benzodiazepines are highly addictive with regular use. They\'re appropriate for occasional panic attacks but not daily anxiety. If you\'ve been taking them daily for weeks, don\'t stop suddenly - withdrawal can be dangerous. Work with your doctor to switch to an SSRI and taper benzos safely.'
      }
    ]
  },
  {
    topicId: 'depression-disorders',
    articles: [
      {
        title: 'Depression: Symptoms, Types, and Treatment',
        summary: 'Recognizing depression and finding effective help.',
        keyPoints: [
          'Major depression affects 21 million US adults; symptoms last 2+ weeks',
          'Classic signs: persistent sadness, loss of interest, sleep/appetite changes, fatigue',
          'Antidepressants work for 60-70% of people; may need to try 2-3 to find right one',
          'Therapy (especially CBT) is as effective as medication for mild-moderate depression',
          'Exercise, sleep, and social connection are powerful complementary treatments'
        ]
      },
      {
        title: 'Antidepressants: Finding the Right Medication',
        summary: 'What to expect when starting treatment.',
        keyPoints: [
          'Takes 4-6 weeks to feel full effects; don\'t stop if no immediate improvement',
          'SSRIs (Prozac, Zoloft) are first-line; fewest side effects',
          'SNRIs (Effexor, Cymbalta) may work better if SSRIs don\'t',
          'Common early side effects: nausea, headache, sleep changes - usually improve',
          'Never stop antidepressants suddenly - must taper to avoid withdrawal'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'National Alliance on Mental Illness (NAMI)',
        url: 'https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression',
        description: 'Support groups, helpline, and comprehensive depression resources'
      },
      {
        name: 'NIMH - Depression',
        url: 'https://www.nimh.nih.gov/health/topics/depression',
        description: 'Research-based information on types, treatments, and finding help'
      },
      {
        name: '988 Suicide & Crisis Lifeline',
        url: 'https://988lifeline.org',
        description: 'Call or text 988 for free, confidential crisis support 24/7'
      }
    ],
    faqs: [
      {
        question: 'How do I know if I\'m just sad or actually depressed?',
        answer: 'Depression lasts most of the day, nearly every day, for at least 2 weeks. You lose interest in things you usually enjoy, have trouble functioning at work/school, experience physical symptoms (fatigue, sleep/appetite changes). Sadness from a specific event usually improves with time. If you\'re unsure, take the PHQ-9 screening quiz or see a doctor.'
      },
      {
        question: 'Will antidepressants change my personality?',
        answer: 'No. Effective antidepressants help you feel like yourself again, not like a different person. If you feel emotionally "flat" or unlike yourself, you may need a dose adjustment or different medication. The goal is to lift depression while maintaining your authentic self.'
      },
      {
        question: 'Can I stop taking antidepressants once I feel better?',
        answer: 'Don\'t stop without talking to your doctor. For first episode, typically stay on medication 6-12 months after feeling better. For recurrent depression, may need longer-term treatment. Always taper slowly over weeks-months to prevent withdrawal symptoms and relapse.'
      }
    ]
  },
  {
    topicId: 'adhd',
    articles: [
      {
        title: 'Adult ADHD: Diagnosis and Management',
        summary: 'Understanding ADHD beyond childhood.',
        keyPoints: [
          'Adult ADHD affects 4.4% of adults; many diagnosed for first time as adults',
          'Symptoms: inattention, disorganization, procrastination, impulsivity, restlessness',
          'Stimulants (Adderall, Ritalin) improve focus in 70-80% of people',
          'Non-stimulant options (Strattera, Wellbutrin) available for those who can\'t take stimulants',
          'Behavioral strategies essential: timers, reminders, organization systems, routines'
        ]
      },
      {
        title: 'ADHD Medications: Stimulants vs Non-Stimulants',
        summary: 'Choosing the right treatment approach.',
        keyPoints: [
          'Stimulants work within 30-60 minutes; effects last 4-12 hours depending on type',
          'Short-acting (immediate release) allows flexible dosing; long-acting provides all-day coverage',
          'Side effects: decreased appetite, sleep problems, increased heart rate',
          'Non-stimulants take weeks to work but no abuse potential',
          'Therapy helps develop coping strategies medication can\'t address'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'CHADD - Children and Adults with ADHD',
        url: 'https://chadd.org',
        description: 'Support groups, education, and advocacy for ADHD'
      },
      {
        name: 'ADHD Coaches Organization',
        url: 'https://www.adhdcoaches.org',
        description: 'Find ADHD-specialized coaches and strategies for daily management'
      },
      {
        name: 'ADDitude Magazine',
        url: 'https://www.additudemag.com',
        description: 'Practical tips, treatment updates, and ADHD community'
      }
    ],
    faqs: [
      {
        question: 'Can you develop ADHD as an adult or is it always childhood-onset?',
        answer: 'ADHD always begins in childhood, but many people aren\'t diagnosed until adulthood when demands increase or coping strategies stop working. If you had no symptoms before age 12, it may be something else (anxiety, depression, sleep disorder) that mimics ADHD. Proper evaluation is important.'
      },
      {
        question: 'Are ADHD stimulants addictive?',
        answer: 'When taken as prescribed for ADHD, risk of addiction is low. Stimulants normalize brain function in people with ADHD rather than creating a "high." However, they are controlled substances because of abuse potential in people without ADHD. Never share your medication or take more than prescribed.'
      },
      {
        question: 'Will ADHD medication help me focus better at work even if I don\'t have ADHD?',
        answer: 'Stimulants can improve focus in anyone short-term, but without ADHD you risk side effects (anxiety, sleep problems, increased blood pressure) without treating an actual condition. Using stimulants without ADHD is unnecessary and potentially harmful. Try non-medication strategies first: better sleep, exercise, time management techniques.'
      }
    ]
  },
  {
    topicId: 'sleep-disorders',
    articles: [
      {
        title: 'Insomnia: When to Worry and How to Fix It',
        summary: 'Addressing sleep problems before they become chronic.',
        keyPoints: [
          'Short-term insomnia is normal; chronic insomnia (3+ nights/week for 3+ months) needs treatment',
          'Sleep hygiene: same sleep schedule, cool dark room, no screens 1 hour before bed',
          'CBT for insomnia (CBT-I) is more effective long-term than sleeping pills',
          'Melatonin helps with circadian rhythm issues; doesn\'t work for all insomnia types',
          'Many medical conditions cause insomnia: sleep apnea, restless legs, anxiety, pain'
        ]
      },
      {
        title: 'Sleep Apnea: Silent Danger to Your Health',
        summary: 'Recognizing and treating obstructive sleep apnea.',
        keyPoints: [
          'Affects 25 million Americans; increases risk of heart attack, stroke, diabetes',
          'Symptoms: loud snoring, gasping during sleep, morning headaches, daytime fatigue',
          'Sleep study (polysomnography) confirms diagnosis',
          'CPAP machine is gold standard treatment; alternatives include oral appliances, weight loss',
          'Untreated sleep apnea shortens lifespan - treatment is essential'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Academy of Sleep Medicine',
        url: 'https://sleepeducation.org',
        description: 'Find sleep specialists and evidence-based sleep disorder information'
      },
      {
        name: 'National Sleep Foundation',
        url: 'https://www.thensf.org',
        description: 'Sleep health resources, tips, and research updates'
      },
      {
        name: 'CBT-I Coach App',
        url: 'https://www.va.gov/mobile/app/cbt-i-coach',
        description: 'Free app for cognitive behavioral therapy for insomnia'
      }
    ],
    faqs: [
      {
        question: 'Are sleeping pills safe for long-term use?',
        answer: 'Generally no. Ambien, Lunesta, and benzodiazepines lose effectiveness with regular use, can be addictive, and worsen sleep long-term. They\'re appropriate for short-term use (days-weeks) during acute stress. For chronic insomnia, CBT-I is safer and more effective. If you\'ve been on sleeping pills long-term, talk to your doctor about tapering safely.'
      },
      {
        question: 'How do I know if I have sleep apnea?',
        answer: 'Common signs: loud snoring, witnessed breathing pauses during sleep, gasping/choking at night, morning headaches, extreme daytime sleepiness, waking unrefreshed. Risk factors: obesity, large neck circumference, older age, male. If your partner notices breathing pauses or you have unexplained fatigue, ask your doctor about a sleep study.'
      },
      {
        question: 'Does melatonin actually work for sleep?',
        answer: 'Melatonin helps with circadian rhythm issues (jet lag, shift work, delayed sleep phase) but doesn\'t work for all insomnia types. Take 0.5-3mg 30-60 minutes before desired sleep time. More is not better - high doses can cause grogginess. It\'s generally safe but not regulated by FDA. If insomnia continues after 2 weeks, see a doctor.'
      }
    ]
  },
  {
    topicId: 'diabetes-management',
    articles: [
      {
        title: 'Type 2 Diabetes: Prevention and Management',
        summary: 'Taking control of your blood sugar.',
        keyPoints: [
          'HbA1c goal is usually under 7%; individualized based on age and health',
          'Weight loss of 5-10% can significantly improve blood sugar control',
          'Metformin is first-line medication; newer drugs like GLP-1s very effective',
          'Check feet daily, get annual eye exams, monitor kidney function',
          'Good control prevents complications: neuropathy, retinopathy, kidney disease, heart disease'
        ]
      },
      {
        title: 'Understanding Your Diabetes Labs',
        summary: 'What HbA1c, fasting glucose, and other tests mean.',
        keyPoints: [
          'Fasting glucose: under 100 normal, 100-125 prediabetes, 126+ diabetes',
          'HbA1c: under 5.7% normal, 5.7-6.4% prediabetes, 6.5%+ diabetes',
          'Random glucose over 200 with symptoms suggests diabetes',
          'Monitor kidney function (eGFR, microalbumin) and cholesterol annually',
          'Continuous glucose monitors (CGMs) now available for better tracking'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Diabetes Association',
        url: 'https://diabetes.org',
        description: 'Comprehensive diabetes education, meal planning, support groups'
      },
      {
        name: 'CDC Diabetes Prevention Program',
        url: 'https://www.cdc.gov/diabetes/prevention',
        description: 'Free lifestyle change program to prevent type 2 diabetes'
      },
      {
        name: 'Diabetes Daily',
        url: 'https://www.diabetesdaily.com',
        description: 'Community support, recipes, and practical diabetes management tips'
      }
    ],
    faqs: [
      {
        question: 'Can type 2 diabetes be reversed?',
        answer: 'Type 2 diabetes can go into remission with significant weight loss, diet changes, and exercise. Some people achieve normal blood sugar without medication. However, it requires ongoing lifestyle maintenance - diabetes can return if old habits resume. "Reversal" is possible but "cure" is not - you\'ll always need monitoring.'
      },
      {
        question: 'Do I really need to check my blood sugar if I feel fine?',
        answer: 'Yes. You can have dangerously high blood sugar without symptoms until complications develop. Regular monitoring helps you understand how food, activity, and medications affect your levels. Early detection of high blood sugar allows treatment adjustments before permanent damage occurs. Check as often as your doctor recommends.'
      },
      {
        question: 'Are newer diabetes drugs like Ozempic worth the cost?',
        answer: 'GLP-1 agonists (Ozempic, Mounjaro, Trulicity) are very effective for blood sugar control AND weight loss. They also protect heart and kidneys. High cost is a barrier, but many insurance plans now cover them. If metformin alone isn\'t enough and you have cardiovascular disease or need to lose weight, GLP-1s are worth discussing with your doctor.'
      }
    ]
  },
  {
    topicId: 'heart-health',
    articles: [
      {
        title: 'High Blood Pressure: The Silent Killer',
        summary: 'Why blood pressure matters and how to control it.',
        keyPoints: [
          'Normal BP is under 120/80; hypertension is 130/80 or higher',
          'Often no symptoms until damage occurs (heart attack, stroke, kidney failure)',
          'Lifestyle changes can lower BP 5-20 points: weight loss, DASH diet, exercise, limit alcohol/salt',
          'Multiple medication classes available; may need combination therapy',
          'Home monitoring recommended - "white coat hypertension" is real'
        ]
      },
      {
        title: 'Cholesterol and Heart Disease Prevention',
        summary: 'Understanding lipid panels and statin therapy.',
        keyPoints: [
          'LDL ("bad" cholesterol) should be under 100; under 70 if high cardiovascular risk',
          'HDL ("good" cholesterol) over 40 for men, over 50 for women',
          'Statins reduce heart attack/stroke risk by 25-35%',
          'Side effects (muscle aches) affect 5-10%; usually manageable',
          '10-year cardiovascular risk calculator helps determine if medication needed'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Heart Association',
        url: 'https://www.heart.org',
        description: 'Heart-healthy recipes, BP tracking tools, research updates'
      },
      {
        name: 'Million Hearts Initiative',
        url: 'https://millionhearts.hhs.gov',
        description: 'Free resources for preventing heart attacks and strokes'
      },
      {
        name: 'CardioSmart',
        url: 'https://www.cardiosmart.org',
        description: 'American College of Cardiology patient education'
      }
    ],
    faqs: [
      {
        question: 'Can I stop taking blood pressure medication if my BP is normal?',
        answer: 'No - your BP is normal BECAUSE of the medication. Stopping will cause it to rise again. If you want to reduce medication, focus on lifestyle changes (weight loss, exercise, diet) and work with your doctor to slowly reduce doses. Some people can eventually stop, but most need lifelong treatment.'
      },
      {
        question: 'Do I need to take a statin if my cholesterol is only slightly high?',
        answer: 'Depends on your overall cardiovascular risk, not just cholesterol number. Online risk calculators consider age, BP, smoking, diabetes, family history. If 10-year risk is over 7.5%, statins are usually recommended even with borderline cholesterol. Discuss your personal risk with your doctor.'
      },
      {
        question: 'Will taking a baby aspirin daily prevent heart attacks?',
        answer: 'Maybe. Daily aspirin is no longer universally recommended for prevention. It\'s beneficial if you\'ve already had a heart attack or stroke (secondary prevention). For people without cardiovascular disease, bleeding risks may outweigh benefits, especially if you\'re over 60. Discuss with your doctor based on your specific risk factors.'
      }
    ]
  },
  {
    topicId: 'thyroid-conditions',
    articles: [
      {
        title: 'Understanding Hypothyroidism and Hyperthyroidism',
        summary: 'Your thyroid controls metabolism, energy, weight, mood, and more. Learn what happens when it\'s underactive or overactive.',
        keyPoints: [
          'Hypothyroidism (underactive) causes fatigue, weight gain, cold sensitivity, depression, constipation',
          'Hyperthyroidism (overactive) causes anxiety, weight loss, rapid heartbeat, heat intolerance, tremors',
          'TSH test is primary screening; normal range is 0.4-4.0 (some say 0.5-3.0 is optimal)',
          'Levothyroxine for hypothyroidism must be taken consistently, same time daily, on empty stomach',
          'Hashimoto\'s (autoimmune hypothyroidism) and Graves\' disease (autoimmune hyperthyroidism) are most common causes'
        ]
      },
      {
        title: 'Managing Thyroid Disease Long-Term',
        summary: 'Thyroid conditions are usually lifelong but very treatable with proper monitoring.',
        keyPoints: [
          'Annual TSH checks needed once stable; more frequent when adjusting medication',
          'Symptoms matter more than lab values - tell your doctor if you still feel off',
          'Pregnancy requires medication adjustments; TSH should be under 2.5',
          'Many medications and supplements interfere with thyroid absorption (calcium, iron, biotin)',
          'Thyroid nodules are common (50% of people over 60); most are benign but need ultrasound evaluation'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Thyroid Association',
        url: 'https://www.thyroid.org',
        description: 'Evidence-based patient guides, thyroid disease FAQs, and treatment guidelines'
      },
      {
        name: 'National Institute of Diabetes and Digestive and Kidney Diseases',
        url: 'https://www.niddk.nih.gov/health-information/endocrine-diseases/thyroid-disease',
        description: 'Comprehensive thyroid information from NIH'
      },
      {
        name: 'Thyroid Cancer Survivors\' Association',
        url: 'https://www.thyca.org',
        description: 'Support and education for thyroid cancer patients'
      }
    ],
    faqs: [
      {
        question: 'Why do I still feel tired even though my TSH is "normal"?',
        answer: 'TSH ranges are broad, and "normal" doesn\'t mean optimal for you. Some people feel better with TSH closer to 1-2 rather than 3-4. Also, TSH doesn\'t show the full picture - Free T3 and Free T4 levels matter. Discuss testing full thyroid panel and adjusting your dose based on symptoms, not just TSH numbers.'
      },
      {
        question: 'Can I stop taking levothyroxine if I feel better?',
        answer: 'No. You feel better BECAUSE you\'re taking it. Hypothyroidism is usually permanent. Stopping will cause symptoms to return within weeks. If you had temporary thyroiditis or pregnancy-related thyroid issues, your doctor might trial stopping after 6-12 months, but only with close monitoring.'
      },
      {
        question: 'Should I avoid certain foods with thyroid disease?',
        answer: 'Most people don\'t need dietary restrictions. Very large amounts of raw cruciferous vegetables (kale, broccoli) or soy might interfere with thyroid function, but normal consumption is fine. More important: take thyroid medication on empty stomach, wait 30-60 minutes before coffee or food, and avoid taking it with calcium or iron supplements.'
      }
    ]
  },
  {
    topicId: 'autoimmune-conditions',
    articles: [
      {
        title: 'Understanding Autoimmune Disease',
        summary: 'When your immune system attacks your own body. Common conditions include lupus, rheumatoid arthritis, MS, Crohn\'s, and type 1 diabetes.',
        keyPoints: [
          'Over 80 different autoimmune diseases affect 50+ million Americans, mostly women',
          'Genetic predisposition plus environmental triggers (infection, stress, hormones) cause onset',
          'Symptoms often wax and wane - "flares" followed by periods of remission',
          'Blood tests (ANA, RF, anti-CCP, ESR, CRP) help diagnose but aren\'t always definitive',
          'Many people have multiple autoimmune conditions - having one increases risk for others'
        ]
      },
      {
        title: 'Treatment and Living with Autoimmune Disease',
        summary: 'Managing chronic autoimmune conditions requires personalized treatment plans.',
        keyPoints: [
          'Treatment goals: reduce inflammation, prevent organ damage, maintain quality of life',
          'Immunosuppressants (methotrexate, biologics) target overactive immune response',
          'Biologics (Humira, Enbrel, Remicade) revolutionized treatment but require infection monitoring',
          'Lifestyle factors matter: stress management, sleep, anti-inflammatory diet, moderate exercise',
          'Disability accommodations may be needed even if you "don\'t look sick"'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Autoimmune Related Diseases Association',
        url: 'https://www.aarda.org',
        description: 'Patient education, research updates, and advocacy for all autoimmune diseases'
      },
      {
        name: 'National Institute of Arthritis and Musculoskeletal and Skin Diseases',
        url: 'https://www.niams.nih.gov',
        description: 'NIH research and information on autoimmune conditions'
      },
      {
        name: 'Global Autoimmune Institute',
        url: 'https://www.autoimmuneinstitute.org',
        description: 'Evidence-based resources and clinical trial information'
      }
    ],
    faqs: [
      {
        question: 'Can autoimmune disease be cured?',
        answer: 'Not yet. Current treatments manage symptoms and slow progression, but don\'t cure the underlying immune dysfunction. Some people achieve long-term remission (no active disease), especially with early aggressive treatment. Research into immune tolerance therapies shows promise for future cures.'
      },
      {
        question: 'Will taking immunosuppressants make me constantly sick?',
        answer: 'Not necessarily. While infection risk increases, most people don\'t get sick more often. Key is balance - enough suppression to control disease, not so much that you can\'t fight infections. Stay current on vaccines (especially flu, pneumonia, shingles), practice good hygiene, and know when to call your doctor (fever, unusual symptoms).'
      },
      {
        question: 'Should I try an elimination diet or go gluten-free?',
        answer: 'Dietary changes help some people but aren\'t a substitute for medical treatment. Anti-inflammatory eating (Mediterranean diet, omega-3s) has modest benefits. Gluten-free is essential only for celiac disease. If you want to try elimination diet, work with a registered dietitian and continue your medications. Don\'t rely on unproven "cures" promoted online.'
      }
    ]
  },
  {
    topicId: 'sti-testing',
    articles: [
      {
        title: 'STI Testing: What You Need to Know',
        summary: 'Regular screening is important for sexually active people, even in monogamous relationships.',
        keyPoints: [
          'CDC recommends annual testing for sexually active people under 25, and anyone with new/multiple partners',
          'Standard panel tests for chlamydia, gonorrhea, syphilis, HIV; add HSV and trichomoniasis if symptomatic',
          'Most STIs have no symptoms - you can have and transmit infections without knowing',
          'Testing methods vary: urine sample for chlamydia/gonorrhea, blood test for HIV/syphilis/herpes',
          'Many health departments offer free/low-cost confidential testing; at-home kits also available'
        ]
      },
      {
        title: 'Understanding Results and Treatment',
        summary: 'Positive results are common and almost always treatable.',
        keyPoints: [
          'Chlamydia and gonorrhea cure with antibiotics (single dose or short course)',
          'Syphilis is curable with penicillin if caught early; requires multiple injections if advanced',
          'HIV is not curable but highly manageable - people on treatment live normal lifespans',
          'Herpes and HPV are viral infections that can\'t be cured but symptoms are manageable',
          'Partner notification is crucial - recent partners need testing even if they have no symptoms'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'CDC STI Treatment Guidelines',
        url: 'https://www.cdc.gov/std/treatment-guidelines',
        description: 'Evidence-based screening and treatment recommendations'
      },
      {
        name: 'Planned Parenthood',
        url: 'https://www.plannedparenthood.org/learn/stds-hiv-safer-sex',
        description: 'STI information and testing location finder'
      },
      {
        name: 'GetTested',
        url: 'https://gettested.cdc.gov',
        description: 'CDC tool to find free or low-cost testing sites near you'
      }
    ],
    faqs: [
      {
        question: 'How soon after exposure can I get tested?',
        answer: 'Depends on the infection. Chlamydia/gonorrhea can be detected 1-5 days after exposure. HIV window period is 18-45 days for antibody tests, 10-33 days for antigen/antibody combo tests. Syphilis takes 1-4 weeks. Herpes is tricky - blood tests may not turn positive for 12-16 weeks. If you had recent exposure, retest at 3 months to be sure.'
      },
      {
        question: 'Can I get STIs from oral sex?',
        answer: 'Yes. Chlamydia, gonorrhea, syphilis, herpes, and HPV can all be transmitted through oral sex. Throat gonorrhea is increasingly common and often has no symptoms. Use barriers (condoms, dental dams) for safer oral sex, and include throat/rectal testing if you have oral or anal sex.'
      },
      {
        question: 'If my partner and I both tested negative, do we still need condoms?',
        answer: 'Depends on your agreement and risk tolerance. If you both tested negative, are monogamous, and trust each other, you could stop using condoms (but consider other birth control if needed). However, "monogamous" is subjective, and people sometimes lie or cheat. Discuss boundaries openly and retest if anything changes.'
      }
    ]
  },
  {
    topicId: 'sexual-health-bc',
    articles: [
      {
        title: 'Birth Control Methods Compared',
        summary: 'From IUDs to pills to sterilization - finding what works for your body and lifestyle.',
        keyPoints: [
          'IUDs are most effective (99%+) and last 3-12 years; hormonal vs copper options available',
          'Pills/patch/ring are 91% effective with typical use (99% with perfect use); require daily/weekly attention',
          'Depo shot is 94% effective, given every 3 months; may cause irregular bleeding and bone density concerns',
          'Implant (Nexplanon) is 99% effective, lasts 3 years, single rod in upper arm',
          'Condoms are only method that prevents STIs; use with other birth control for dual protection'
        ]
      },
      {
        title: 'Managing Side Effects and Switching Methods',
        summary: 'Finding the right birth control often requires trial and adjustment.',
        keyPoints: [
          'Hormonal side effects (mood changes, weight gain, acne) vary by person and hormone type',
          'Progestin-only options (mini-pill, hormonal IUD, implant) good if estrogen causes problems',
          'Irregular bleeding common in first 3-6 months with any new method; usually stabilizes',
          'Copper IUD is hormone-free option but may increase period heaviness/cramping',
          'Emergency contraception (Plan B, Ella, copper IUD) available if regular method fails'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'Bedsider Birth Control Support Network',
        url: 'https://www.bedsider.org',
        description: 'Unbiased birth control information and method comparison tools'
      },
      {
        name: 'CDC Contraception Guide',
        url: 'https://www.cdc.gov/reproductivehealth/contraception',
        description: 'Medical eligibility criteria and effectiveness rates'
      },
      {
        name: 'Power to Decide',
        url: 'https://powertodecide.org/what-we-do/access/birth-control-access',
        description: 'Information on accessing affordable birth control'
      }
    ],
    faqs: [
      {
        question: 'Will birth control make me gain weight?',
        answer: 'Maybe, but probably not much. Large studies show most hormonal methods don\'t cause significant weight gain. Depo shot is the exception - average 5-8 lb gain over 2 years. Some people experience appetite changes or water retention with pills. If you gain more than 5-10 lbs, talk to your provider about switching methods.'
      },
      {
        question: 'Can I skip my period by skipping placebo pills?',
        answer: 'Yes, it\'s safe with most combination pills (contains estrogen). Take active pills continuously and skip placebo week. This is called extended cycling or continuous use. You may have breakthrough bleeding initially. Progestin-only pills don\'t have placebo weeks. Discuss with your provider if you want to skip periods regularly.'
      },
      {
        question: 'How quickly can I get pregnant after stopping birth control?',
        answer: 'Most methods: immediately. Pills, patch, ring, implant, IUD - fertility returns within 1-2 cycles after stopping. Depo shot is the outlier - may take 6-12 months for fertility to return after last shot. If you don\'t want pregnancy, use backup method immediately when stopping.'
      }
    ]
  },
  {
    topicId: 'sexual-wellness',
    articles: [
      {
        title: 'Sexual Health Beyond Disease Prevention',
        summary: 'Pleasure, desire, communication, and function are all part of sexual wellness.',
        keyPoints: [
          'Low libido affects 40% of women and 15% of men; causes include hormones, medications, stress, relationship issues',
          'Painful sex (dyspareunia) is common but not normal - causes include dryness, infections, endometriosis, pelvic floor dysfunction',
          'Erectile dysfunction affects 40% of men over 40; often first sign of cardiovascular disease',
          'Medications (Viagra, Cialis) help ED but don\'t address underlying causes (diabetes, low testosterone, depression)',
          'Pelvic floor physical therapy helps many sexual dysfunction issues in both men and women'
        ]
      },
      {
        title: 'Talking to Your Doctor About Sex',
        summary: 'Sexual problems are medical issues, not personal failures.',
        keyPoints: [
          'Doctors should ask about sexual health but often don\'t - you may need to bring it up',
          'Be specific about symptoms: pain location/timing, duration of desire changes, relationship impact',
          'Many medications affect sexual function (antidepressants, blood pressure meds, hormonal contraception)',
          'Hormone testing may be needed: testosterone, estrogen, thyroid, prolactin',
          'Sex therapy helps with psychological barriers, communication issues, trauma history'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Association of Sexuality Educators, Counselors and Therapists',
        url: 'https://www.aasect.org',
        description: 'Find certified sex therapists and evidence-based information'
      },
      {
        name: 'International Society for Sexual Medicine',
        url: 'https://www.issm.info',
        description: 'Patient guides on sexual dysfunction and treatment options'
      },
      {
        name: 'North American Menopause Society',
        url: 'https://www.menopause.org/for-women/sexual-health-menopause-online',
        description: 'Resources for menopause-related sexual changes'
      }
    ],
    faqs: [
      {
        question: 'Is it normal for desire to decrease in long-term relationships?',
        answer: 'Common, yes. Normal, debatable. Novelty and excitement naturally fade, but healthy relationships maintain intimacy through effort. Desire discrepancy (one partner wants more/less sex) is the most common sexual issue couples face. Solutions include scheduling intimacy, trying new things, couples therapy, and honest communication about needs.'
      },
      {
        question: 'Can I use CBD or marijuana for better sex?',
        answer: 'Maybe. Some people report cannabis increases relaxation and sensation, but research is limited. CBD products marketed for sex aren\'t FDA-regulated and may not contain what they claim. Small amounts of alcohol can reduce inhibition, but more impairs function. No substance replaces communication and addressing underlying issues.'
      },
      {
        question: 'At what age should I expect sexual function to decline?',
        answer: 'There\'s no set age - many people enjoy sex well into their 80s. Changes are normal (slower arousal, need more stimulation, erectile firmness decreases) but don\'t mean sex ends. Maintaining cardiovascular health, managing chronic conditions, staying sexually active, and adjusting expectations helps maintain sexual function throughout life.'
      }
    ]
  },
  {
    topicId: 'cancer-screening',
    articles: [
      {
        title: 'Cancer Screening Guidelines by Age',
        summary: 'Early detection saves lives. Know when to start screening and how often to repeat.',
        keyPoints: [
          'Mammograms: start at 40-50 (depending on risk), every 1-2 years; high-risk may need earlier/additional screening',
          'Cervical cancer: Pap smear starting age 21, every 3 years; add HPV test at 30, can extend to every 5 years',
          'Colorectal: start at 45 (or earlier with family history), colonoscopy every 10 years or stool test annually',
          'Lung cancer: low-dose CT scan annually for ages 50-80 with 20+ pack-year smoking history',
          'Prostate: discuss PSA testing starting at 50 (45 if Black or family history); controversial due to overtreatment'
        ]
      },
      {
        title: 'Understanding Screening Results',
        summary: 'Abnormal screening results don\'t always mean cancer.',
        keyPoints: [
          'False positives are common - abnormal result requiring follow-up that turns out benign',
          'BIRADS score on mammogram: 0=needs more imaging, 1-2=normal, 3=probably benign/recheck 6 months, 4-5=biopsy needed',
          'Abnormal Pap: usually HPV-related cell changes; most resolve on their own with repeat testing',
          'Colonoscopy polyp removal is prevention - polyps take 10+ years to become cancer',
          'Liquid biopsies and advanced screening tests (Cologuard, Galleri) are emerging but not yet standard'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Cancer Society Screening Guidelines',
        url: 'https://www.cancer.org/health-care-professionals/american-cancer-society-prevention-early-detection-guidelines.html',
        description: 'Comprehensive screening recommendations for all cancer types'
      },
      {
        name: 'U.S. Preventive Services Task Force',
        url: 'https://www.uspreventiveservicestaskforce.org',
        description: 'Evidence-based screening guidelines used by most insurance'
      },
      {
        name: 'National Cancer Institute',
        url: 'https://www.cancer.gov/about-cancer/screening',
        description: 'Detailed information on screening tests and what results mean'
      }
    ],
    faqs: [
      {
        question: 'Should I get genetic testing for cancer risk?',
        answer: 'Maybe, if you have strong family history (multiple relatives with cancer, especially young age at diagnosis). BRCA testing is covered if you meet criteria. Direct-to-consumer genetic tests (23andMe) screen limited variants and miss most mutations. Meet with genetic counselor first to determine if testing is appropriate and understand implications.'
      },
      {
        question: 'Can I skip mammograms if I have no family history?',
        answer: 'No. Only 10-15% of breast cancers occur in people with family history. Most diagnoses are in people with no known risk factors. While family history increases your risk and may warrant earlier screening, everyone with breast tissue needs regular mammograms starting at 40-50.'
      },
      {
        question: 'Is a colonoscopy really necessary or can I just do the stool test?',
        answer: 'Both are valid options. Colonoscopy is gold standard - detects AND removes polyps in one procedure, only needed every 10 years if normal. Stool tests (FIT, Cologuard) are less invasive but must be done annually or every 3 years, and positive results require colonoscopy anyway. Your choice depends on preference, access, and risk factors.'
      }
    ]
  },
  {
    topicId: 'vaccinations',
    articles: [
      {
        title: 'Adult Vaccine Schedule',
        summary: 'Vaccines aren\'t just for kids. Stay protected throughout life.',
        keyPoints: [
          'Flu shot annually for everyone 6 months+; high-dose version available for 65+',
          'COVID boosters recommended based on age, risk factors, and timing of last dose',
          'Tdap (tetanus, diphtheria, pertussis) every 10 years; especially important during pregnancy',
          'Shingles vaccine (Shingrix) recommended at age 50; two doses, 90% effective at preventing shingles',
          'Pneumonia vaccines (Prevnar, Pneumovax) for 65+ and younger with chronic conditions'
        ]
      },
      {
        title: 'Vaccine Safety and Effectiveness',
        summary: 'Addressing common concerns with scientific evidence.',
        keyPoints: [
          'Vaccines undergo rigorous testing; monitored continuously after approval via VAERS',
          'Side effects are usually mild (sore arm, fatigue, low fever) and resolve in 1-2 days',
          'Serious allergic reactions are extremely rare (1-2 per million doses)',
          'You cannot get the disease from inactivated or mRNA vaccines; may feel mildly ill as immune system responds',
          'Vaccine effectiveness varies: flu 40-60%, COVID 50-90%, shingles 90%, measles 97%'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'CDC Adult Vaccine Schedule',
        url: 'https://www.cdc.gov/vaccines/schedules/hcp/imz/adult.html',
        description: 'Comprehensive vaccine recommendations by age and condition'
      },
      {
        name: 'Immunization Action Coalition',
        url: 'https://www.immunize.org',
        description: 'Patient-friendly vaccine information sheets and clinic locator'
      },
      {
        name: 'VaccineFinder',
        url: 'https://www.vaccines.gov',
        description: 'Find vaccines near you, including free or low-cost options'
      }
    ],
    faqs: [
      {
        question: 'Can I get multiple vaccines at the same time?',
        answer: 'Yes, it\'s safe and recommended. Getting multiple vaccines in one visit doesn\'t overwhelm your immune system - you encounter far more antigens in daily life. It reduces number of appointments and ensures you stay up to date. Most common combo: flu + COVID, or Tdap + shingles.'
      },
      {
        question: 'Do vaccines cause autism?',
        answer: 'No. This myth originated from a fraudulent 1998 study that was retracted. Dozens of large studies involving millions of children have found no link between vaccines and autism. The original researcher lost his medical license for data falsification. Autism is genetic/developmental, present from birth, just diagnosed later in childhood.'
      },
      {
        question: 'Why do I need a flu shot every year?',
        answer: 'Flu viruses mutate rapidly. Each year\'s vaccine targets 3-4 strains predicted to circulate that season. Also, flu immunity wanes over 6-12 months. Even if vaccine doesn\'t perfectly match circulating strains, it reduces severity and hospitalization risk. Best time to get it: September-October before flu season peaks.'
      }
    ]
  },
  {
    topicId: 'annual-labs',
    articles: [
      {
        title: 'What Tests Should Be in Your Annual Physical',
        summary: 'Not all lab tests are necessary for everyone. Know what you actually need.',
        keyPoints: [
          'Complete Blood Count (CBC) checks for anemia, infection, blood disorders',
          'Comprehensive Metabolic Panel (CMP) tests kidney/liver function, electrolytes, blood sugar',
          'Lipid panel (cholesterol) every 4-6 years if normal; more often if high or on medication',
          'Hemoglobin A1c for diabetes screening if overweight, family history, or other risk factors',
          'Thyroid (TSH) only if symptomatic or high-risk; not needed for routine screening in healthy adults'
        ]
      },
      {
        title: 'Understanding Your Lab Results',
        summary: 'Reference ranges are guidelines, not absolutes.',
        keyPoints: [
          'Reference ranges represent middle 95% of population - being outside doesn\'t always mean abnormal',
          'Trends matter more than single values - compare to your previous results',
          'Time of day, hydration, recent meals, exercise all affect lab values',
          'Borderline results often warrant repeat testing before making treatment decisions',
          'Direct access to results via patient portal is empowering but can cause anxiety - follow up with doctor'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'Lab Tests Online',
        url: 'https://labtestsonline.org',
        description: 'AACC resource explaining what lab tests mean and why they\'re ordered'
      },
      {
        name: 'MedlinePlus Lab Test Information',
        url: 'https://medlineplus.gov/lab-tests',
        description: 'NIH guide to common lab tests and interpreting results'
      },
      {
        name: 'U.S. Preventive Services Task Force',
        url: 'https://www.uspreventiveservicestaskforce.org',
        description: 'Evidence-based screening recommendations by age and risk'
      }
    ],
    faqs: [
      {
        question: 'Do I really need fasting labs?',
        answer: 'Depends on the test. Fasting (8-12 hours, water only) is required for accurate glucose and triglycerides. Cholesterol (LDL, HDL) can now be measured non-fasting for most people. If your doctor orders "fasting labs," confirm which tests require it. Taking usual medications with water is typically fine.'
      },
      {
        question: 'Should I get vitamin D and B12 levels checked?',
        answer: 'Only if you have symptoms (fatigue, weakness, numbness) or risk factors (vegan for B12, limited sun exposure for vitamin D, darker skin, obesity). Routine screening isn\'t recommended for healthy adults. Low levels are common and don\'t always need treatment. If you\'re already taking supplements, testing isn\'t useful.'
      },
      {
        question: 'Can I order my own lab tests without a doctor?',
        answer: 'In most states, yes. Direct-to-consumer lab testing is available (Quest, LabCorp, WellnessFX), but you pay out of pocket. Downsides: no one to interpret results, may lead to unnecessary worry or follow-up, insurance won\'t cover it. Better to work with a doctor who can order appropriate tests and explain what they mean.'
      }
    ]
  },
  {
    topicId: 'weight-management',
    articles: [
      {
        title: 'Evidence-Based Weight Loss Strategies',
        summary: 'Sustainable weight management goes beyond "eat less, move more."',
        keyPoints: [
          'Modest weight loss (5-10% of body weight) significantly improves health markers even if you\'re still overweight',
          'Calorie deficit is required for weight loss, but quality of food matters for health and satiety',
          'No single diet is superior - Mediterranean, low-carb, intermittent fasting all work if you can stick to them',
          'Weight loss medications (Wegovy, Ozempic, Contrave) are effective tools, not cheating, especially for BMI 30+',
          'Bariatric surgery is most effective treatment for severe obesity (BMI 40+ or 35+ with complications)'
        ]
      },
      {
        title: 'Why Weight Loss Is Hard and What Actually Helps',
        summary: 'Biology, not willpower, makes maintaining weight loss difficult.',
        keyPoints: [
          'Metabolism slows 10-15% after weight loss; body fights to regain weight (leptin resistance)',
          'Genetics account for 40-70% of weight variation; some people have much harder time losing',
          'Sleep deprivation, stress, and certain medications promote weight gain',
          'Sustainable weight loss averages 1-2 lbs/week; faster loss is mostly water/muscle',
          'Maintenance is lifelong - most people regain weight without continued effort (tracking, exercise, support)'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'National Institute of Diabetes and Digestive and Kidney Diseases',
        url: 'https://www.niddk.nih.gov/health-information/weight-management',
        description: 'Evidence-based weight loss information from NIH'
      },
      {
        name: 'The Obesity Society',
        url: 'https://www.obesity.org',
        description: 'Scientific resources and treatment guidelines'
      },
      {
        name: 'Academy of Nutrition and Dietetics',
        url: 'https://www.eatright.org',
        description: 'Find registered dietitians and evidence-based nutrition info'
      }
    ],
    faqs: [
      {
        question: 'Are weight loss medications safe for long-term use?',
        answer: 'Yes, for most people. Newer GLP-1 medications (Wegovy, Ozempic, Mounjaro) have good safety profiles and are approved for long-term use. Common side effects: nausea, constipation, usually improve over time. Serious risks are rare. Like any chronic condition medication, benefits usually outweigh risks for people with obesity. Weight typically returns when stopped.'
      },
      {
        question: 'Why do I keep losing and regaining the same 20 pounds?',
        answer: 'Weight cycling (yo-yo dieting) is extremely common because restrictive diets aren\'t sustainable. After weight loss, your body increases hunger hormones and decreases metabolism, making maintenance very difficult. Solution: slower weight loss, smaller calorie deficit, strength training to preserve muscle, focus on sustainable habits rather than short-term diets, consider maintenance breaks during weight loss.'
      },
      {
        question: 'Is it possible to be "healthy at any size"?',
        answer: 'Complicated. You can have good metabolic health (normal BP, blood sugar, cholesterol) while overweight - called "metabolically healthy obesity." However, excess weight still increases long-term risk for diabetes, heart disease, joint problems, and cancer. Health-promoting behaviors (exercise, nutritious food, stress management, sleep) benefit everyone regardless of weight. Weight stigma and repeated dieting also harm health.'
      }
    ]
  },
  {
    topicId: 'sports-medicine',
    articles: [
      {
        title: 'Common Sports Injuries and Treatment',
        summary: 'From sprains to stress fractures, knowing when to rest and when to seek care.',
        keyPoints: [
          'RICE (rest, ice, compression, elevation) for acute injuries; add "P" for protection (brace, crutches)',
          'Sprains (ligament) vs strains (muscle/tendon) treated similarly but healing time varies',
          'Most injuries heal with conservative treatment; surgery reserved for complete tears or failed rehab',
          'Return to play too soon increases re-injury risk and can cause chronic problems',
          'Physical therapy accelerates recovery and prevents future injuries through strengthening and biomechanics correction'
        ]
      },
      {
        title: 'Injury Prevention and Performance',
        summary: 'Stay active safely with proper training and recovery.',
        keyPoints: [
          'Warm-up and cool-down reduce injury risk; dynamic stretching before, static stretching after',
          'Progressive overload: increase training volume/intensity no more than 10% per week',
          'Cross-training prevents overuse injuries and improves overall fitness',
          'Rest days are essential - muscles grow during recovery, not during workout',
          'Proper nutrition (protein, carbs, hydration) and sleep are performance enhancers'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American College of Sports Medicine',
        url: 'https://www.acsm.org',
        description: 'Exercise guidelines, injury prevention, and fitness resources'
      },
      {
        name: 'American Academy of Orthopaedic Surgeons',
        url: 'https://orthoinfo.aaos.org',
        description: 'Patient guides on sports injuries and treatment options'
      },
      {
        name: 'Stop Sports Injuries',
        url: 'https://www.stopsportsinjuries.org',
        description: 'Sport-specific injury prevention programs and tips'
      }
    ],
    faqs: [
      {
        question: 'Should I use ice or heat for an injury?',
        answer: 'Ice for acute injuries (first 48-72 hours) to reduce swelling and pain - 15-20 minutes every 2-3 hours. Heat for chronic pain and muscle tightness to increase blood flow and flexibility. Never ice or heat numb skin or use for more than 20 minutes at a time. Some new research questions ice benefits, but it still helps pain control.'
      },
      {
        question: 'When should I see a doctor for a sports injury vs treating at home?',
        answer: 'See a doctor if: unable to bear weight, severe pain/swelling, joint deformity, numbness/tingling, no improvement after 3-5 days of RICE, or if you heard a "pop" during injury. For minor sprains/strains with gradual onset, home treatment is fine. When in doubt, get it checked - early diagnosis prevents chronic problems.'
      },
      {
        question: 'Can I exercise through pain or will that make it worse?',
        answer: 'Depends on the pain. Muscle soreness (DOMS) 24-48 hours after new exercise is normal and safe to work through. Sharp pain, joint pain, or pain that worsens during activity signals injury and requires rest. General rule: if pain is 3/10 or less and doesn\'t increase during/after exercise, modified activity is okay. Pain above 5/10 or that increases means stop and rest.'
      }
    ]
  },
  {
    topicId: 'nutrition-counseling',
    articles: [
      {
        title: 'Evidence-Based Nutrition Fundamentals',
        summary: 'Cutting through diet trends to focus on what actually matters for health.',
        keyPoints: [
          'No single "perfect" diet - Mediterranean, DASH, whole-food plant-based all supported by evidence',
          'Eating mostly whole foods (vegetables, fruits, whole grains, lean proteins, healthy fats) is the common thread',
          'Processed foods aren\'t poison but shouldn\'t be dietary foundation; aim for 80/20 balance',
          'Micronutrients matter: variety ensures adequate vitamins/minerals without needing supplements',
          'Individual needs vary based on age, activity level, health conditions, genetics, preferences'
        ]
      },
      {
        title: 'When to See a Registered Dietitian',
        summary: 'Medical nutrition therapy for chronic conditions and personalized guidance.',
        keyPoints: [
          'RDs provide evidence-based advice; nutritionists/health coaches have less regulated credentials',
          'Insurance covers nutrition counseling for diabetes, kidney disease, eating disorders, pregnancy',
          'Personalized plans more effective than generic advice - considers food preferences, culture, budget',
          'Common reasons to see RD: diabetes management, GI issues, food allergies, weight concerns, sports nutrition',
          'Virtual appointments widely available; many RDs offer superbill for insurance reimbursement'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'Academy of Nutrition and Dietetics',
        url: 'https://www.eatright.org',
        description: 'Find registered dietitians and evidence-based nutrition information'
      },
      {
        name: 'USDA MyPlate',
        url: 'https://www.myplate.gov',
        description: 'Practical food guidelines and meal planning tools'
      },
      {
        name: 'Harvard Nutrition Source',
        url: 'https://www.hsph.harvard.edu/nutritionsource',
        description: 'Research-based nutrition guidance from Harvard School of Public Health'
      }
    ],
    faqs: [
      {
        question: 'Do I need to take a multivitamin?',
        answer: 'Most healthy adults eating varied diet don\'t need one. Exceptions: prenatal vitamins during pregnancy/trying to conceive, vitamin D in northern climates or darker skin, B12 for vegans, calcium/vitamin D for osteoporosis risk. Taking multivitamin won\'t hurt (choose one with ~100% DV, not megadoses) but won\'t compensate for poor diet.'
      },
      {
        question: 'Are organic foods worth the extra cost?',
        answer: 'Nutritionally, minimal difference between organic and conventional. Organic reduces pesticide exposure, but conventional produce is safe and far better than not eating fruits/vegetables. If budget allows, prioritize organic for "Dirty Dozen" (strawberries, spinach, apples). For most people, eating MORE produce (organic or not) matters more than eating organic specifically.'
      },
      {
        question: 'Should I avoid gluten/dairy/sugar even if I don\'t have an allergy?',
        answer: 'No medical reason to unless you have diagnosed celiac disease, lactose intolerance, or diabetes. Eliminating food groups can lead to nutrient deficiencies and disordered eating. If you feel better avoiding something, that\'s valid, but "everyone should avoid X" is diet culture, not science. Moderation and variety are healthier than restriction for most people.'
      }
    ]
  },
  {
    topicId: 'pediatric-vaccines',
    articles: [
      {
        title: 'Childhood Vaccine Schedule Explained',
        summary: 'Why vaccines are given when they are, and what each one prevents.',
        keyPoints: [
          'Birth to 2 years: most critical period for immunity; children receive 10+ vaccines protecting against 14+ diseases',
          'Multiple doses needed for full immunity - DTaP requires 5 doses, polio 4 doses by age 6',
          'Timing is based on when antibodies from mother wear off and child\'s immune system can respond',
          'Combination vaccines (DTaP, MMR) reduce number of shots while providing same protection',
          'Catch-up schedules available if vaccines delayed; never too late to start'
        ]
      },
      {
        title: 'Vaccine Safety for Children',
        summary: 'Addressing parent concerns with scientific evidence.',
        keyPoints: [
          'Vaccine ingredients (aluminum, formaldehyde) are in tiny amounts; far less than in food/environment',
          'Immune systems can handle multiple vaccines - babies encounter thousands of antigens daily',
          'Serious reactions extremely rare; monitoring systems (VAERS, VSD) track safety continuously',
          'Delaying or spreading out vaccines leaves children vulnerable during most dangerous time',
          'Unvaccinated children have 20x+ higher risk of vaccine-preventable diseases'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'CDC Childhood Vaccine Schedule',
        url: 'https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html',
        description: 'Official immunization schedule from birth through 18 years'
      },
      {
        name: 'Vaccine Education Center at CHOP',
        url: 'https://www.chop.edu/centers-programs/vaccine-education-center',
        description: 'Comprehensive, science-based vaccine information for parents'
      },
      {
        name: 'AAP HealthyChildren.org',
        url: 'https://www.healthychildren.org/English/safety-prevention/immunizations',
        description: 'American Academy of Pediatrics vaccine resources'
      }
    ],
    faqs: [
      {
        question: 'Can I delay or spread out vaccines instead of following the schedule?',
        answer: 'Not recommended. The CDC schedule is designed to protect children when they\'re most vulnerable. Alternative schedules leave children unprotected for longer and require more office visits and shots overall. No evidence that spreading vaccines is safer - children\'s immune systems easily handle multiple vaccines simultaneously. Delaying puts child and community at risk.'
      },
      {
        question: 'Why does my baby need Hep B vaccine on day 1 if I don\'t have Hepatitis B?',
        answer: 'Several reasons: Hep B is hard to detect (many people don\'t know they have it), testing isn\'t perfect, hospital exposures can occur, and vaccine provides better protection when given early. Hep B infection in infancy causes chronic disease 90% of the time. Vaccinating all babies ensures none slip through cracks, regardless of mother\'s status.'
      },
      {
        question: 'Do vaccines contain aborted fetal tissue?',
        answer: 'No. Some vaccines (MMR, varicella, Hep A) are grown in lab-cultured cells descended from two elective abortions in the 1960s. No fetal tissue is in the vaccines themselves. These cell lines have been used for decades to develop many medications (Tylenol, ibuprofen, aspirin). Major religious leaders (including Catholic, Orthodox Jewish) have stated these vaccines are morally acceptable.'
      }
    ]
  },
  {
    topicId: 'child-development',
    articles: [
      {
        title: 'Developmental Milestones by Age',
        summary: 'What to expect and when to be concerned about delays.',
        keyPoints: [
          'Milestones are guidelines, not absolutes - wide range of normal timing',
          'Concerns: no babbling by 12 months, no words by 16 months, no 2-word phrases by 24 months',
          'Gross motor: walking by 15-18 months; fine motor: scribbling by 18 months, using utensils by 24 months',
          'Social/emotional: responsive smile by 3 months, stranger anxiety 6-12 months, pretend play by 2 years',
          'Regression (losing previously acquired skills) always warrants evaluation'
        ]
      },
      {
        title: 'Supporting Healthy Development',
        summary: 'What parents can do to promote cognitive, physical, and emotional growth.',
        keyPoints: [
          'Responsive parenting (reacting to baby\'s cues) builds secure attachment and brain development',
          'Talk, read, sing constantly - language exposure matters more than educational toys',
          'Tummy time from birth builds motor skills; limit container time (swings, bouncers)',
          'Screen time under 18 months not recommended (except video chatting); limit after 2 years',
          'Early intervention for delays is highly effective - don\'t "wait and see" if concerned'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'CDC Developmental Milestones',
        url: 'https://www.cdc.gov/ncbddd/actearly/milestones',
        description: 'Milestone checklists and free milestone tracker app'
      },
      {
        name: 'Zero to Three',
        url: 'https://www.zerotothree.org',
        description: 'Early childhood development resources for parents'
      },
      {
        name: 'American Academy of Pediatrics HealthyChildren',
        url: 'https://www.healthychildren.org/English/ages-stages',
        description: 'Age-specific development information and parenting tips'
      }
    ],
    faqs: [
      {
        question: 'My child isn\'t talking as much as other kids their age. Should I be worried?',
        answer: 'Language development varies widely. Red flags: no words by 16 months, fewer than 50 words or no 2-word phrases by 24 months, difficulty understanding simple directions, not interested in social interaction. If concerned, request speech evaluation - don\'t wait until age 3. Early intervention (before age 3) is most effective. Boys often talk later than girls, but significant delays still need evaluation.'
      },
      {
        question: 'Is it normal for my toddler to have tantrums every day?',
        answer: 'Yes. Peak tantrum age is 18 months to 3 years. Toddlers have big emotions but limited language and self-regulation skills. Normal tantrums last a few minutes, child can be consoled eventually, not hurting self/others. Concerning: multiple hour-long tantrums daily, child unreachable during tantrum, aggressive to self/others, tantrums increasing in frequency/severity past age 4.'
      },
      {
        question: 'How much screen time is okay for my young child?',
        answer: 'AAP recommends: under 18 months avoid screens (except video chat), 18-24 months high-quality programming with co-viewing only, ages 2-5 limit to 1 hour/day of quality content. Reality: most families exceed this. Prioritize interactive play, reading, outdoor time. If using screens, watch together and talk about what you see. Avoid screens during meals and 1 hour before bed.'
      }
    ]
  },
  {
    topicId: 'childhood-conditions',
    articles: [
      {
        title: 'Common Childhood Illnesses and When to Seek Care',
        summary: 'From ear infections to RSV, knowing what\'s normal and what needs urgent attention.',
        keyPoints: [
          'Ear infections: most common reason kids see doctor; not all need antibiotics (watchful waiting often appropriate)',
          'Respiratory infections (cold, croup, RSV, bronchiolitis): viral, can\'t treat with antibiotics, supportive care at home',
          'Fever itself isn\'t dangerous; focus on child\'s behavior more than number on thermometer',
          'Seek urgent care for: under 3 months with fever 100.4+, difficulty breathing, severe dehydration, lethargy/inconsolable',
          'Chronic conditions (asthma, ADHD, allergies) affect 1 in 4 children; manageable with proper treatment'
        ]
      },
      {
        title: 'Managing Chronic Childhood Conditions',
        summary: 'Asthma, allergies, ADHD, and other long-term health needs.',
        keyPoints: [
          'Asthma: affects 1 in 12 kids; controller medication daily prevents attacks, rescue inhaler for acute symptoms',
          'Food allergies: 1 in 13 children; strict avoidance required, carry epinephrine auto-injector (EpiPen)',
          'ADHD: medication helps 70-80% of children; behavioral therapy important, especially for young kids',
          'Eczema: moisturize constantly, topical steroids for flares, identify and avoid triggers',
          'School accommodations (504 plans, IEPs) ensure children get necessary support'
        ]
      }
    ],
    trustedResources: [
      {
        name: 'American Academy of Pediatrics HealthyChildren',
        url: 'https://www.healthychildren.org',
        description: 'Comprehensive information on childhood illnesses and conditions'
      },
      {
        name: 'KidsHealth from Nemours',
        url: 'https://kidshealth.org/en/parents',
        description: 'Parent-friendly health information reviewed by pediatricians'
      },
      {
        name: 'CDC Child Health',
        url: 'https://www.cdc.gov/parents',
        description: 'Illness prevention, safety, and child health resources'
      }
    ],
    faqs: [
      {
        question: 'How high is too high for a fever in children?',
        answer: 'No specific number in older kids - focus on how child looks/acts. Under 3 months: any fever 100.4+ needs immediate evaluation. 3-36 months: fever over 102.2 without obvious source (like cold symptoms) may need evaluation. Fevers over 104 are uncomfortable but not dangerous if child is responsive. Seek care if fever lasts more than 3 days, child is lethargic/not drinking, or you\'re worried.'
      },
      {
        question: 'Does my child really need antibiotics for every ear infection?',
        answer: 'No. Many ear infections are viral or resolve on their own. "Watchful waiting" (48-72 hours of symptom management without antibiotics) is appropriate for kids over 6 months with mild symptoms. Antibiotics are needed if: under 6 months, severe pain/fever over 102.2, symptoms worsen or don\'t improve after 2-3 days, or recurrent infections. Overuse of antibiotics contributes to resistance.'
      },
      {
        question: 'When should I consider medication for my child\'s ADHD?',
        answer: 'If ADHD symptoms significantly impact school performance, friendships, family relationships, or safety, medication is worth considering. For preschoolers, behavior therapy should be tried first. For school-age kids, combination of medication and therapy is most effective. Medication doesn\'t change personality - helps child access skills they already have. Try it, assess benefits vs side effects, adjust as needed. Many kids benefit tremendously.'
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
  const [showEducationalContent, setShowEducationalContent] = useState(false);

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
            <div className="grid gap-4 md:grid-cols-2 mb-8">
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
              
              <button 
                onClick={() => setShowEducationalContent(!showEducationalContent)}
                className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition text-left"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold mb-1">Educational Resources</div>
                <div className="text-sm text-gray-400">
                  {showEducationalContent ? 'Hide articles and guides' : 'Learn more with plain-English articles'}
                </div>
              </button>
            </div>

            {/* Educational Content Section */}
            {showEducationalContent && (() => {
              const content = contentLibrary.find(c => c.topicId === topicDetail.id);
              if (!content) return null;

              return (
                <div className="space-y-6">
                  {/* Articles */}
                  <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      📖 Plain-English Articles
                    </h3>
                    <div className="space-y-4">
                      {content.articles.map((article, idx) => (
                        <div key={idx} className="rounded-lg bg-white/5 p-5 border border-white/10">
                          <h4 className="text-xl font-semibold text-white mb-2">{article.title}</h4>
                          <p className="text-gray-300 mb-4">{article.summary}</p>
                          <div className="space-y-2">
                            <div className="font-semibold text-orange-400">Key Points:</div>
                            <ul className="space-y-2">
                              {article.keyPoints.map((point, pIdx) => (
                                <li key={pIdx} className="flex gap-2 text-gray-300">
                                  <span className="text-orange-400">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trusted Resources */}
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      🔗 Trusted Resources & Links
                    </h3>
                    <div className="space-y-3">
                      {content.trustedResources.map((resource, idx) => (
                        <a 
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg bg-white/5 p-4 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-400 group-hover:text-blue-300 mb-1">
                                {resource.name} →
                              </h4>
                              <p className="text-sm text-gray-400">{resource.description}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      ❓ Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      {content.faqs.map((faq, idx) => (
                        <div key={idx} className="rounded-lg bg-white/5 p-5 border border-white/10">
                          <h4 className="font-semibold text-purple-400 mb-2">{faq.question}</h4>
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
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
