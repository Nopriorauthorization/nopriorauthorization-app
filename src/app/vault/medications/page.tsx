"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiSearch,
  FiPlus,
  FiAlertTriangle,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiChevronRight,
  FiInfo,
  FiShield,
  FiX,
  FiMessageCircle,
  FiBookOpen,
  FiActivity,
  FiHeart,
  FiZap,
  FiDroplet,
  FiThermometer,
  FiEye,
  FiSun,
} from "react-icons/fi";

// =============================================================================
// MEDICATION DECODER™ - WebMD-Style Interactive Health Tools
// Educational medication information - NOT medical advice
// =============================================================================

// Navigation tabs for the tool
const TOOL_TABS = [
  { id: "drugs", label: "Drugs A-Z", icon: "💊", description: "Browse medications" },
  { id: "symptoms", label: "Symptom Checker", icon: "🩺", description: "Check your symptoms" },
  { id: "interactions", label: "Interaction Checker", icon: "⚠️", description: "Check drug interactions" },
  { id: "supplements", label: "Vitamins & Supplements", icon: "🌿", description: "Browse supplements" },
  { id: "conditions", label: "Health Topics", icon: "📚", description: "Browse conditions" },
];

// =============================================================================
// COMPREHENSIVE MEDICATION DATABASE
// =============================================================================
const MEDICATIONS_DATABASE: MedicationEntry[] = [
  // A
  { name: "Acetaminophen", genericName: "Acetaminophen", brandNames: ["Tylenol", "Panadol"], category: "Pain Relief", letter: "A", uses: ["Pain", "Fever"], warnings: ["Liver damage with alcohol"] },
  { name: "Adderall", genericName: "Amphetamine/Dextroamphetamine", brandNames: ["Adderall", "Adderall XR"], category: "ADHD", letter: "A", uses: ["ADHD", "Narcolepsy"], warnings: ["Controlled substance", "Heart problems"] },
  { name: "Albuterol", genericName: "Albuterol", brandNames: ["ProAir", "Ventolin", "Proventil"], category: "Respiratory", letter: "A", uses: ["Asthma", "COPD", "Bronchospasm"], warnings: ["Heart palpitations", "Tremors"] },
  { name: "Amlodipine", genericName: "Amlodipine", brandNames: ["Norvasc"], category: "Blood Pressure", letter: "A", uses: ["High blood pressure", "Angina"], warnings: ["Swelling", "Dizziness"] },
  { name: "Amoxicillin", genericName: "Amoxicillin", brandNames: ["Amoxil", "Moxatag"], category: "Antibiotic", letter: "A", uses: ["Bacterial infections", "Ear infections", "Strep throat"], warnings: ["Allergic reactions", "Diarrhea"] },
  { name: "Atorvastatin", genericName: "Atorvastatin", brandNames: ["Lipitor"], category: "Cholesterol", letter: "A", uses: ["High cholesterol", "Heart disease prevention"], warnings: ["Muscle pain", "Liver problems"] },
  { name: "Azithromycin", genericName: "Azithromycin", brandNames: ["Zithromax", "Z-Pack"], category: "Antibiotic", letter: "A", uses: ["Respiratory infections", "Skin infections"], warnings: ["Heart rhythm issues", "Diarrhea"] },
  
  // B
  { name: "Benzonatate", genericName: "Benzonatate", brandNames: ["Tessalon"], category: "Cough", letter: "B", uses: ["Cough suppression"], warnings: ["Choking hazard if chewed", "Numbness"] },
  { name: "Bupropion", genericName: "Bupropion", brandNames: ["Wellbutrin", "Zyban"], category: "Antidepressant", letter: "B", uses: ["Depression", "Smoking cessation"], warnings: ["Seizure risk", "Anxiety"] },
  
  // C
  { name: "Carvedilol", genericName: "Carvedilol", brandNames: ["Coreg"], category: "Heart", letter: "C", uses: ["Heart failure", "High blood pressure"], warnings: ["Dizziness", "Fatigue"] },
  { name: "Cephalexin", genericName: "Cephalexin", brandNames: ["Keflex"], category: "Antibiotic", letter: "C", uses: ["Skin infections", "UTIs", "Respiratory infections"], warnings: ["Allergic reactions", "Diarrhea"] },
  { name: "Ciprofloxacin", genericName: "Ciprofloxacin", brandNames: ["Cipro"], category: "Antibiotic", letter: "C", uses: ["UTIs", "Respiratory infections"], warnings: ["Tendon damage", "Sun sensitivity"] },
  { name: "Citalopram", genericName: "Citalopram", brandNames: ["Celexa"], category: "Antidepressant", letter: "C", uses: ["Depression", "Anxiety"], warnings: ["Suicidal thoughts in youth", "Serotonin syndrome"] },
  { name: "Clonazepam", genericName: "Clonazepam", brandNames: ["Klonopin"], category: "Anxiety", letter: "C", uses: ["Anxiety", "Seizures", "Panic disorder"], warnings: ["Dependence", "Drowsiness"] },
  { name: "Cyclobenzaprine", genericName: "Cyclobenzaprine", brandNames: ["Flexeril"], category: "Muscle Relaxant", letter: "C", uses: ["Muscle spasms", "Back pain"], warnings: ["Drowsiness", "Dry mouth"] },
  
  // D
  { name: "Diazepam", genericName: "Diazepam", brandNames: ["Valium"], category: "Anxiety", letter: "D", uses: ["Anxiety", "Muscle spasms", "Seizures"], warnings: ["Dependence", "Drowsiness"] },
  { name: "Duloxetine", genericName: "Duloxetine", brandNames: ["Cymbalta"], category: "Antidepressant", letter: "D", uses: ["Depression", "Anxiety", "Nerve pain", "Fibromyalgia"], warnings: ["Liver problems", "Suicidal thoughts"] },
  
  // E
  { name: "Escitalopram", genericName: "Escitalopram", brandNames: ["Lexapro"], category: "Antidepressant", letter: "E", uses: ["Depression", "Anxiety"], warnings: ["Suicidal thoughts", "Serotonin syndrome"] },
  { name: "Esomeprazole", genericName: "Esomeprazole", brandNames: ["Nexium"], category: "Acid Reflux", letter: "E", uses: ["GERD", "Ulcers", "Acid reflux"], warnings: ["Bone fractures", "B12 deficiency"] },
  
  // F
  { name: "Fluoxetine", genericName: "Fluoxetine", brandNames: ["Prozac", "Sarafem"], category: "Antidepressant", letter: "F", uses: ["Depression", "OCD", "Panic disorder", "Bulimia"], warnings: ["Suicidal thoughts", "Serotonin syndrome"] },
  { name: "Fluticasone", genericName: "Fluticasone", brandNames: ["Flonase", "Flovent"], category: "Allergy", letter: "F", uses: ["Allergies", "Asthma"], warnings: ["Nosebleeds", "Throat irritation"] },
  { name: "Furosemide", genericName: "Furosemide", brandNames: ["Lasix"], category: "Diuretic", letter: "F", uses: ["Edema", "Heart failure", "High blood pressure"], warnings: ["Dehydration", "Electrolyte imbalance"] },
  
  // G
  { name: "Gabapentin", genericName: "Gabapentin", brandNames: ["Neurontin", "Gralise"], category: "Nerve Pain", letter: "G", uses: ["Nerve pain", "Seizures", "Restless legs"], warnings: ["Drowsiness", "Dizziness"] },
  
  // H
  { name: "Hydrochlorothiazide", genericName: "Hydrochlorothiazide", brandNames: ["Microzide"], category: "Blood Pressure", letter: "H", uses: ["High blood pressure", "Edema"], warnings: ["Electrolyte imbalance", "Sun sensitivity"] },
  { name: "Hydrocodone", genericName: "Hydrocodone/Acetaminophen", brandNames: ["Vicodin", "Norco"], category: "Pain Relief", letter: "H", uses: ["Moderate to severe pain"], warnings: ["Addiction risk", "Respiratory depression"] },
  { name: "Hydroxyzine", genericName: "Hydroxyzine", brandNames: ["Vistaril", "Atarax"], category: "Anxiety", letter: "H", uses: ["Anxiety", "Itching", "Nausea"], warnings: ["Drowsiness", "Dry mouth"] },
  
  // I
  { name: "Ibuprofen", genericName: "Ibuprofen", brandNames: ["Advil", "Motrin"], category: "Pain Relief", letter: "I", uses: ["Pain", "Fever", "Inflammation"], warnings: ["Stomach bleeding", "Kidney problems"] },
  
  // L
  { name: "Lamotrigine", genericName: "Lamotrigine", brandNames: ["Lamictal"], category: "Seizure/Mood", letter: "L", uses: ["Seizures", "Bipolar disorder"], warnings: ["Serious rash", "Stevens-Johnson syndrome"] },
  { name: "Levothyroxine", genericName: "Levothyroxine", brandNames: ["Synthroid", "Levoxyl"], category: "Thyroid", letter: "L", uses: ["Hypothyroidism", "Thyroid cancer"], warnings: ["Heart problems", "Bone loss"] },
  { name: "Lisinopril", genericName: "Lisinopril", brandNames: ["Prinivil", "Zestril"], category: "Blood Pressure", letter: "L", uses: ["High blood pressure", "Heart failure"], warnings: ["Dry cough", "Angioedema"] },
  { name: "Lorazepam", genericName: "Lorazepam", brandNames: ["Ativan"], category: "Anxiety", letter: "L", uses: ["Anxiety", "Insomnia", "Seizures"], warnings: ["Dependence", "Drowsiness"] },
  { name: "Losartan", genericName: "Losartan", brandNames: ["Cozaar"], category: "Blood Pressure", letter: "L", uses: ["High blood pressure", "Kidney protection"], warnings: ["Dizziness", "High potassium"] },
  
  // M
  { name: "Meloxicam", genericName: "Meloxicam", brandNames: ["Mobic"], category: "Pain Relief", letter: "M", uses: ["Arthritis", "Pain", "Inflammation"], warnings: ["Stomach bleeding", "Heart attack risk"] },
  { name: "Metformin", genericName: "Metformin", brandNames: ["Glucophage", "Glumetza"], category: "Diabetes", letter: "M", uses: ["Type 2 diabetes", "PCOS"], warnings: ["Lactic acidosis", "B12 deficiency"] },
  { name: "Metoprolol", genericName: "Metoprolol", brandNames: ["Lopressor", "Toprol XL"], category: "Heart", letter: "M", uses: ["High blood pressure", "Heart failure", "Angina"], warnings: ["Slow heart rate", "Fatigue"] },
  { name: "Montelukast", genericName: "Montelukast", brandNames: ["Singulair"], category: "Allergy/Asthma", letter: "M", uses: ["Asthma", "Allergies"], warnings: ["Mood changes", "Sleep problems"] },
  
  // N
  { name: "Naproxen", genericName: "Naproxen", brandNames: ["Aleve", "Naprosyn"], category: "Pain Relief", letter: "N", uses: ["Pain", "Inflammation", "Arthritis"], warnings: ["Stomach bleeding", "Heart attack risk"] },
  
  // O
  { name: "Omeprazole", genericName: "Omeprazole", brandNames: ["Prilosec"], category: "Acid Reflux", letter: "O", uses: ["GERD", "Ulcers", "H. pylori"], warnings: ["Bone fractures", "C. diff infection"] },
  { name: "Ondansetron", genericName: "Ondansetron", brandNames: ["Zofran"], category: "Nausea", letter: "O", uses: ["Nausea", "Vomiting"], warnings: ["Heart rhythm changes", "Constipation"] },
  { name: "Oxycodone", genericName: "Oxycodone", brandNames: ["OxyContin", "Percocet"], category: "Pain Relief", letter: "O", uses: ["Severe pain"], warnings: ["Addiction", "Respiratory depression"] },
  
  // P
  { name: "Pantoprazole", genericName: "Pantoprazole", brandNames: ["Protonix"], category: "Acid Reflux", letter: "P", uses: ["GERD", "Erosive esophagitis"], warnings: ["Bone fractures", "B12 deficiency"] },
  { name: "Prednisone", genericName: "Prednisone", brandNames: ["Deltasone"], category: "Steroid", letter: "P", uses: ["Inflammation", "Allergic reactions", "Autoimmune conditions"], warnings: ["Bone loss", "Blood sugar increase"] },
  { name: "Pregabalin", genericName: "Pregabalin", brandNames: ["Lyrica"], category: "Nerve Pain", letter: "P", uses: ["Nerve pain", "Fibromyalgia", "Seizures"], warnings: ["Dizziness", "Weight gain"] },
  { name: "Propranolol", genericName: "Propranolol", brandNames: ["Inderal"], category: "Heart", letter: "P", uses: ["High blood pressure", "Tremors", "Anxiety", "Migraines"], warnings: ["Slow heart rate", "Fatigue"] },
  
  // Q
  { name: "Quetiapine", genericName: "Quetiapine", brandNames: ["Seroquel"], category: "Mental Health", letter: "Q", uses: ["Schizophrenia", "Bipolar disorder", "Depression"], warnings: ["Weight gain", "Diabetes risk"] },
  
  // R
  { name: "Rosuvastatin", genericName: "Rosuvastatin", brandNames: ["Crestor"], category: "Cholesterol", letter: "R", uses: ["High cholesterol", "Heart disease prevention"], warnings: ["Muscle pain", "Liver problems"] },
  
  // S
  { name: "Sertraline", genericName: "Sertraline", brandNames: ["Zoloft"], category: "Antidepressant", letter: "S", uses: ["Depression", "Anxiety", "PTSD", "OCD"], warnings: ["Suicidal thoughts", "Serotonin syndrome"] },
  { name: "Simvastatin", genericName: "Simvastatin", brandNames: ["Zocor"], category: "Cholesterol", letter: "S", uses: ["High cholesterol"], warnings: ["Muscle pain", "Grapefruit interaction"] },
  { name: "Spironolactone", genericName: "Spironolactone", brandNames: ["Aldactone"], category: "Diuretic", letter: "S", uses: ["Heart failure", "High blood pressure", "Acne"], warnings: ["High potassium", "Breast tenderness"] },
  
  // T
  { name: "Tamsulosin", genericName: "Tamsulosin", brandNames: ["Flomax"], category: "Prostate", letter: "T", uses: ["Enlarged prostate (BPH)"], warnings: ["Dizziness", "Abnormal ejaculation"] },
  { name: "Topiramate", genericName: "Topiramate", brandNames: ["Topamax"], category: "Seizure/Migraine", letter: "T", uses: ["Seizures", "Migraines", "Weight loss"], warnings: ["Cognitive effects", "Kidney stones"] },
  { name: "Tramadol", genericName: "Tramadol", brandNames: ["Ultram"], category: "Pain Relief", letter: "T", uses: ["Moderate pain"], warnings: ["Seizure risk", "Dependence"] },
  { name: "Trazodone", genericName: "Trazodone", brandNames: ["Desyrel"], category: "Sleep/Depression", letter: "T", uses: ["Insomnia", "Depression"], warnings: ["Priapism", "Drowsiness"] },
  
  // V
  { name: "Venlafaxine", genericName: "Venlafaxine", brandNames: ["Effexor"], category: "Antidepressant", letter: "V", uses: ["Depression", "Anxiety", "Panic disorder"], warnings: ["Blood pressure increase", "Withdrawal symptoms"] },
  
  // W
  { name: "Warfarin", genericName: "Warfarin", brandNames: ["Coumadin", "Jantoven"], category: "Blood Thinner", letter: "W", uses: ["Blood clots", "Stroke prevention"], warnings: ["Bleeding risk", "Many drug interactions"] },
  
  // X
  { name: "Xanax", genericName: "Alprazolam", brandNames: ["Xanax"], category: "Anxiety", letter: "X", uses: ["Anxiety", "Panic disorder"], warnings: ["Dependence", "Drowsiness"] },
  
  // Z
  { name: "Zolpidem", genericName: "Zolpidem", brandNames: ["Ambien"], category: "Sleep", letter: "Z", uses: ["Insomnia"], warnings: ["Sleep behaviors", "Dependence"] },
];

// =============================================================================
// VITAMINS & SUPPLEMENTS DATABASE
// =============================================================================
const SUPPLEMENTS_DATABASE: SupplementEntry[] = [
  { name: "Vitamin A", category: "Vitamin", benefits: ["Vision", "Immune function", "Skin health"], dosage: "700-900 mcg daily", warnings: ["Toxicity at high doses", "Avoid in pregnancy (high doses)"], letter: "A" },
  { name: "Vitamin B12", category: "Vitamin", benefits: ["Energy", "Nerve function", "Red blood cell formation"], dosage: "2.4 mcg daily", warnings: ["Generally safe", "May interact with some medications"], letter: "B" },
  { name: "Vitamin C", category: "Vitamin", benefits: ["Immune support", "Antioxidant", "Collagen production"], dosage: "65-90 mg daily", warnings: ["High doses may cause GI upset", "Kidney stone risk"], letter: "C" },
  { name: "Vitamin D", category: "Vitamin", benefits: ["Bone health", "Immune function", "Mood support"], dosage: "600-800 IU daily", warnings: ["Toxicity at very high doses", "May increase calcium"], letter: "D" },
  { name: "Vitamin E", category: "Vitamin", benefits: ["Antioxidant", "Skin health", "Immune function"], dosage: "15 mg daily", warnings: ["May increase bleeding risk", "Avoid before surgery"], letter: "E" },
  { name: "Vitamin K", category: "Vitamin", benefits: ["Blood clotting", "Bone health"], dosage: "90-120 mcg daily", warnings: ["Interacts with blood thinners"], letter: "K" },
  { name: "Omega-3 Fish Oil", category: "Fatty Acid", benefits: ["Heart health", "Brain function", "Anti-inflammatory"], dosage: "250-500 mg EPA+DHA daily", warnings: ["May increase bleeding", "Fish taste/burps"], letter: "O" },
  { name: "Magnesium", category: "Mineral", benefits: ["Muscle function", "Sleep", "Stress relief", "Bone health"], dosage: "310-420 mg daily", warnings: ["May cause diarrhea", "Kidney caution"], letter: "M" },
  { name: "Zinc", category: "Mineral", benefits: ["Immune support", "Wound healing", "Taste/smell"], dosage: "8-11 mg daily", warnings: ["Nausea if taken without food", "May affect copper absorption"], letter: "Z" },
  { name: "Iron", category: "Mineral", benefits: ["Red blood cell production", "Energy", "Oxygen transport"], dosage: "8-18 mg daily", warnings: ["Constipation", "Toxicity risk"], letter: "I" },
  { name: "Calcium", category: "Mineral", benefits: ["Bone health", "Muscle function", "Heart rhythm"], dosage: "1000-1200 mg daily", warnings: ["Kidney stone risk", "May affect heart"], letter: "C" },
  { name: "Probiotics", category: "Digestive", benefits: ["Gut health", "Immune support", "Digestion"], dosage: "1-10 billion CFU daily", warnings: ["May cause bloating initially"], letter: "P" },
  { name: "Turmeric/Curcumin", category: "Herbal", benefits: ["Anti-inflammatory", "Antioxidant", "Joint health"], dosage: "500-2000 mg daily", warnings: ["May thin blood", "Gallbladder caution"], letter: "T" },
  { name: "Ashwagandha", category: "Adaptogen", benefits: ["Stress relief", "Energy", "Sleep", "Hormone balance"], dosage: "300-600 mg daily", warnings: ["Thyroid interaction", "Avoid in pregnancy"], letter: "A" },
  { name: "Melatonin", category: "Sleep", benefits: ["Sleep onset", "Jet lag", "Circadian rhythm"], dosage: "0.5-5 mg before bed", warnings: ["Drowsiness", "May affect hormones"], letter: "M" },
  { name: "Collagen", category: "Protein", benefits: ["Skin elasticity", "Joint health", "Hair/nails"], dosage: "2.5-15 g daily", warnings: ["Generally safe", "May cause fullness"], letter: "C" },
  { name: "CoQ10", category: "Antioxidant", benefits: ["Heart health", "Energy production", "Antioxidant"], dosage: "100-200 mg daily", warnings: ["May lower blood pressure", "Statin interaction"], letter: "C" },
  { name: "B-Complex", category: "Vitamin", benefits: ["Energy", "Metabolism", "Nerve function"], dosage: "As directed", warnings: ["May cause bright yellow urine", "Generally safe"], letter: "B" },
];

// =============================================================================
// HEALTH CONDITIONS DATABASE
// =============================================================================
const CONDITIONS_DATABASE: ConditionEntry[] = [
  { name: "Anxiety", category: "Mental Health", symptoms: ["Worry", "Restlessness", "Rapid heartbeat", "Difficulty concentrating"], commonMedications: ["Sertraline", "Escitalopram", "Buspirone", "Lorazepam"], letter: "A" },
  { name: "Asthma", category: "Respiratory", symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing"], commonMedications: ["Albuterol", "Fluticasone", "Montelukast"], letter: "A" },
  { name: "Arthritis", category: "Musculoskeletal", symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced range of motion"], commonMedications: ["Ibuprofen", "Naproxen", "Meloxicam", "Methotrexate"], letter: "A" },
  { name: "Depression", category: "Mental Health", symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep changes", "Appetite changes"], commonMedications: ["Sertraline", "Fluoxetine", "Bupropion", "Duloxetine"], letter: "D" },
  { name: "Diabetes Type 2", category: "Metabolic", symptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision"], commonMedications: ["Metformin", "Glipizide", "Jardiance", "Ozempic"], letter: "D" },
  { name: "GERD", category: "Digestive", symptoms: ["Heartburn", "Acid reflux", "Chest pain", "Difficulty swallowing"], commonMedications: ["Omeprazole", "Pantoprazole", "Famotidine"], letter: "G" },
  { name: "High Blood Pressure", category: "Cardiovascular", symptoms: ["Often no symptoms", "Headaches", "Shortness of breath", "Nosebleeds"], commonMedications: ["Lisinopril", "Amlodipine", "Losartan", "Metoprolol"], letter: "H" },
  { name: "High Cholesterol", category: "Cardiovascular", symptoms: ["Usually no symptoms", "Detected by blood test"], commonMedications: ["Atorvastatin", "Rosuvastatin", "Simvastatin"], letter: "H" },
  { name: "Hypothyroidism", category: "Endocrine", symptoms: ["Fatigue", "Weight gain", "Cold intolerance", "Dry skin", "Depression"], commonMedications: ["Levothyroxine"], letter: "H" },
  { name: "Insomnia", category: "Sleep", symptoms: ["Difficulty falling asleep", "Waking frequently", "Daytime fatigue", "Irritability"], commonMedications: ["Trazodone", "Zolpidem", "Melatonin"], letter: "I" },
  { name: "Migraine", category: "Neurological", symptoms: ["Severe headache", "Nausea", "Light sensitivity", "Aura"], commonMedications: ["Sumatriptan", "Topiramate", "Propranolol"], letter: "M" },
  { name: "Osteoporosis", category: "Musculoskeletal", symptoms: ["Often no symptoms until fracture", "Back pain", "Loss of height"], commonMedications: ["Alendronate", "Calcium", "Vitamin D"], letter: "O" },
  { name: "PCOS", category: "Reproductive", symptoms: ["Irregular periods", "Excess hair growth", "Acne", "Weight gain"], commonMedications: ["Metformin", "Birth control", "Spironolactone"], letter: "P" },
  { name: "UTI", category: "Urinary", symptoms: ["Burning urination", "Frequent urination", "Cloudy urine", "Pelvic pain"], commonMedications: ["Ciprofloxacin", "Nitrofurantoin", "Trimethoprim"], letter: "U" },
];

// =============================================================================
// SYMPTOM CHECKER DATA
// =============================================================================
const SYMPTOMS_DATABASE: SymptomEntry[] = [
  { symptom: "Headache", bodyArea: "Head", possibleConditions: ["Migraine", "Tension headache", "Sinusitis", "High blood pressure"], urgency: "low" },
  { symptom: "Chest pain", bodyArea: "Chest", possibleConditions: ["GERD", "Anxiety", "Muscle strain", "Heart issues"], urgency: "high" },
  { symptom: "Fatigue", bodyArea: "General", possibleConditions: ["Depression", "Hypothyroidism", "Anemia", "Diabetes", "Sleep apnea"], urgency: "low" },
  { symptom: "Shortness of breath", bodyArea: "Chest", possibleConditions: ["Asthma", "Anxiety", "Heart failure", "COPD"], urgency: "medium" },
  { symptom: "Nausea", bodyArea: "Stomach", possibleConditions: ["GERD", "Gastritis", "Pregnancy", "Medication side effect"], urgency: "low" },
  { symptom: "Dizziness", bodyArea: "Head", possibleConditions: ["Low blood pressure", "Inner ear issues", "Dehydration", "Medication side effect"], urgency: "medium" },
  { symptom: "Joint pain", bodyArea: "Joints", possibleConditions: ["Arthritis", "Injury", "Gout", "Lupus"], urgency: "low" },
  { symptom: "Anxiety/Nervousness", bodyArea: "Mental", possibleConditions: ["Anxiety disorder", "Hyperthyroidism", "Medication side effect"], urgency: "low" },
  { symptom: "Difficulty sleeping", bodyArea: "Mental", possibleConditions: ["Insomnia", "Anxiety", "Sleep apnea", "Depression"], urgency: "low" },
  { symptom: "Heartburn", bodyArea: "Chest", possibleConditions: ["GERD", "Gastritis", "Hiatal hernia"], urgency: "low" },
  { symptom: "Frequent urination", bodyArea: "Urinary", possibleConditions: ["Diabetes", "UTI", "Enlarged prostate", "Overactive bladder"], urgency: "low" },
  { symptom: "Weight gain", bodyArea: "General", possibleConditions: ["Hypothyroidism", "PCOS", "Medication side effect", "Cushing's syndrome"], urgency: "low" },
  { symptom: "Hair loss", bodyArea: "Skin/Hair", possibleConditions: ["Hypothyroidism", "Alopecia", "Stress", "Nutrient deficiency"], urgency: "low" },
  { symptom: "Muscle pain", bodyArea: "Muscles", possibleConditions: ["Fibromyalgia", "Statin side effect", "Overexertion", "Infection"], urgency: "low" },
  { symptom: "Numbness/Tingling", bodyArea: "Nerves", possibleConditions: ["Diabetes (neuropathy)", "B12 deficiency", "Carpal tunnel", "MS"], urgency: "medium" },
  { symptom: "Skin rash", bodyArea: "Skin/Hair", possibleConditions: ["Allergic reaction", "Eczema", "Psoriasis", "Medication reaction"], urgency: "medium" },
  { symptom: "Swelling in legs", bodyArea: "Extremities", possibleConditions: ["Heart failure", "Kidney disease", "Medication side effect", "DVT"], urgency: "medium" },
  { symptom: "Cough", bodyArea: "Respiratory", possibleConditions: ["Cold/flu", "Asthma", "GERD", "ACE inhibitor side effect"], urgency: "low" },
  { symptom: "Abdominal pain", bodyArea: "Stomach", possibleConditions: ["Gastritis", "IBS", "Gallstones", "Appendicitis"], urgency: "medium" },
  { symptom: "Depression/Sadness", bodyArea: "Mental", possibleConditions: ["Depression", "Hypothyroidism", "Grief", "Medication side effect"], urgency: "medium" },
];

// =============================================================================
// TYPES
// =============================================================================
interface MedicationEntry {
  name: string;
  genericName: string;
  brandNames: string[];
  category: string;
  letter: string;
  uses: string[];
  warnings: string[];
}

interface SupplementEntry {
  name: string;
  category: string;
  benefits: string[];
  dosage: string;
  warnings: string[];
  letter: string;
}

interface ConditionEntry {
  name: string;
  category: string;
  symptoms: string[];
  commonMedications: string[];
  letter: string;
}

interface SymptomEntry {
  symptom: string;
  bodyArea: string;
  possibleConditions: string[];
  urgency: "low" | "medium" | "high";
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MedicationDecoderPage() {
  const [activeTab, setActiveTab] = useState("drugs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MedicationEntry | SupplementEntry | ConditionEntry | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [interactionMeds, setInteractionMeds] = useState<string[]>([]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="min-h-screen bg-black">
      {/* Disclaimer Banner */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-sm text-purple-200">
            <FiInfo className="inline-block mr-2" />
            <strong>Educational information only.</strong> This is not medical advice. Always consult your provider or pharmacist.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-black" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                <FiShield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
              Medication Decoder™
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Your complete health reference. Search medications, check symptoms, explore supplements.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
            {TOOL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedItem(null);
                  setSelectedLetter(null);
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "drugs" && (
            <DrugsBrowser
              key="drugs"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLetter={selectedLetter}
              setSelectedLetter={setSelectedLetter}
              selectedItem={selectedItem as MedicationEntry}
              setSelectedItem={setSelectedItem}
              alphabet={alphabet}
            />
          )}
          {activeTab === "symptoms" && (
            <SymptomChecker
              key="symptoms"
              selectedSymptoms={selectedSymptoms}
              setSelectedSymptoms={setSelectedSymptoms}
            />
          )}
          {activeTab === "interactions" && (
            <InteractionChecker
              key="interactions"
              interactionMeds={interactionMeds}
              setInteractionMeds={setInteractionMeds}
            />
          )}
          {activeTab === "supplements" && (
            <SupplementsBrowser
              key="supplements"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLetter={selectedLetter}
              setSelectedLetter={setSelectedLetter}
              selectedItem={selectedItem as SupplementEntry}
              setSelectedItem={setSelectedItem}
              alphabet={alphabet}
            />
          )}
          {activeTab === "conditions" && (
            <ConditionsBrowser
              key="conditions"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLetter={selectedLetter}
              setSelectedLetter={setSelectedLetter}
              selectedItem={selectedItem as ConditionEntry}
              setSelectedItem={setSelectedItem}
              alphabet={alphabet}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <FiShield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Important Safety Information</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Medication Decoder™ provides educational information from publicly available sources including FDA drug labels, NIH, and MedlinePlus. 
                This information is not a substitute for professional medical advice, diagnosis, or treatment. 
                <strong className="text-gray-300"> Always consult your healthcare provider or pharmacist</strong> before making medication decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// DRUGS A-Z BROWSER
// =============================================================================
function DrugsBrowser({
  searchQuery,
  setSearchQuery,
  selectedLetter,
  setSelectedLetter,
  selectedItem,
  setSelectedItem,
  alphabet,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLetter: string | null;
  setSelectedLetter: (l: string | null) => void;
  selectedItem: MedicationEntry | null;
  setSelectedItem: (item: MedicationEntry | SupplementEntry | ConditionEntry | null) => void;
  alphabet: string[];
}) {
  const filteredMeds = useMemo(() => {
    let meds = MEDICATIONS_DATABASE;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      meds = meds.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandNames.some(b => b.toLowerCase().includes(q)) ||
        m.category.toLowerCase().includes(q)
      );
    } else if (selectedLetter) {
      meds = meds.filter(m => m.letter === selectedLetter);
    }
    return meds;
  }, [searchQuery, selectedLetter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedLetter(null);
          }}
          placeholder="Search medications by name, brand, or condition..."
          className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-lg"
        />
      </div>

      {/* A-Z Navigation */}
      <div className="flex flex-wrap gap-1 justify-center">
        <button
          onClick={() => {
            setSelectedLetter(null);
            setSearchQuery("");
          }}
          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
            !selectedLetter && !searchQuery
              ? "bg-purple-500 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          All
        </button>
        {alphabet.map((letter) => {
          const hasMeds = MEDICATIONS_DATABASE.some(m => m.letter === letter);
          return (
            <button
              key={letter}
              onClick={() => {
                setSelectedLetter(letter);
                setSearchQuery("");
              }}
              disabled={!hasMeds}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                selectedLetter === letter
                  ? "bg-purple-500 text-white"
                  : hasMeds
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "bg-gray-900 text-gray-700 cursor-not-allowed"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Medication List */}
        <div className="lg:col-span-1 bg-gray-900/30 border border-gray-700/50 rounded-2xl p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-white font-semibold mb-4 sticky top-0 bg-gray-900/90 py-2">
            {searchQuery ? `Search Results (${filteredMeds.length})` : selectedLetter ? `Medications - ${selectedLetter}` : `All Medications (${filteredMeds.length})`}
          </h3>
          <div className="space-y-2">
            {filteredMeds.map((med) => (
              <button
                key={med.name}
                onClick={() => setSelectedItem(med)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedItem?.name === med.name
                    ? "bg-purple-500/30 border border-purple-500/50"
                    : "bg-black/20 border border-transparent hover:bg-black/40 hover:border-gray-700"
                }`}
              >
                <p className="text-white font-medium">{med.name}</p>
                <p className="text-gray-400 text-sm">{med.category}</p>
              </button>
            ))}
            {filteredMeds.length === 0 && (
              <p className="text-gray-500 text-center py-8">No medications found</p>
            )}
          </div>
        </div>

        {/* Medication Detail */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <MedicationDetail medication={selectedItem as MedicationEntry} />
          ) : (
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-12 text-center">
              <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Medication</h3>
              <p className="text-gray-400">Choose from the list or search to see detailed information</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// MEDICATION DETAIL COMPONENT
// =============================================================================
function MedicationDetail({ medication }: { medication: MedicationEntry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 space-y-6"
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">{medication.name}</h2>
            <p className="text-purple-300 mt-1">{medication.genericName}</p>
          </div>
          <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
            {medication.category}
          </span>
        </div>
        <p className="text-gray-400 mt-2">Brand names: {medication.brandNames.join(", ")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" />
            Common Uses
          </h3>
          <ul className="space-y-2">
            {medication.uses.map((use, idx) => (
              <li key={idx} className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                {use}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5" />
            Important Warnings
          </h3>
          <ul className="space-y-2">
            {medication.warnings.map((warning, idx) => (
              <li key={idx} className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <p className="text-blue-200 text-sm">
          <FiInfo className="inline-block mr-2" />
          This is general information. Your doctor prescribed this for your specific condition. 
          Always follow your healthcare provider's instructions.
        </p>
      </div>

      <Link
        href={`/chat?mascot=harmony&source=medications&medication=${encodeURIComponent(medication.name)}`}
        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
      >
        <FiMessageCircle className="w-5 h-5" />
        Ask Harmony about {medication.name}
      </Link>
    </motion.div>
  );
}

// =============================================================================
// SYMPTOM CHECKER
// =============================================================================
function SymptomChecker({
  selectedSymptoms,
  setSelectedSymptoms,
}: {
  selectedSymptoms: string[];
  setSelectedSymptoms: (s: string[]) => void;
}) {
  const [showResults, setShowResults] = useState(false);

  const bodyAreas = [...new Set(SYMPTOMS_DATABASE.map(s => s.bodyArea))];

  const possibleConditions = useMemo(() => {
    if (selectedSymptoms.length === 0) return [];
    
    const conditionCounts: Record<string, number> = {};
    selectedSymptoms.forEach(symptom => {
      const symptomData = SYMPTOMS_DATABASE.find(s => s.symptom === symptom);
      if (symptomData) {
        symptomData.possibleConditions.forEach(condition => {
          conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        });
      }
    });

    return Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([condition, count]) => ({
        condition,
        matchCount: count,
        matchPercentage: Math.round((count / selectedSymptoms.length) * 100),
      }));
  }, [selectedSymptoms]);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Warning */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <FiAlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-300 font-semibold">Important Notice</h3>
            <p className="text-red-200 text-sm mt-1">
              This symptom checker is for educational purposes only and does not provide medical diagnoses. 
              <strong> If you're experiencing a medical emergency, call 911 immediately.</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Symptom Selection */}
        <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Select Your Symptoms</h3>
          
          {bodyAreas.map((area) => (
            <div key={area} className="mb-6">
              <h4 className="text-purple-300 font-medium mb-3 flex items-center gap-2">
                {area === "Head" && <FiThermometer className="w-4 h-4" />}
                {area === "Chest" && <FiHeart className="w-4 h-4" />}
                {area === "Stomach" && <FiDroplet className="w-4 h-4" />}
                {area === "Mental" && <FiZap className="w-4 h-4" />}
                {area === "General" && <FiActivity className="w-4 h-4" />}
                {area}
              </h4>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS_DATABASE.filter(s => s.bodyArea === area).map((symptom) => (
                  <button
                    key={symptom.symptom}
                    onClick={() => toggleSymptom(symptom.symptom)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedSymptoms.includes(symptom.symptom)
                        ? "bg-purple-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {symptom.symptom}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {selectedSymptoms.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Selected: {selectedSymptoms.length} symptoms</span>
                <button
                  onClick={() => setSelectedSymptoms([])}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Clear all
                </button>
              </div>
              <button
                onClick={() => setShowResults(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                Check Symptoms
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Possible Conditions</h3>
          
          {selectedSymptoms.length === 0 ? (
            <div className="text-center py-12">
              <FiThermometer className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select symptoms to see possible conditions</p>
            </div>
          ) : possibleConditions.length > 0 ? (
            <div className="space-y-3">
              {possibleConditions.slice(0, 10).map((result, idx) => (
                <div
                  key={result.condition}
                  className="bg-black/30 rounded-xl p-4 border border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{result.condition}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.matchPercentage >= 50
                        ? "bg-green-500/20 text-green-300"
                        : result.matchPercentage >= 25
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}>
                      {result.matchCount} symptom{result.matchCount > 1 ? "s" : ""} match
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${result.matchPercentage}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 mt-6">
                <p className="text-blue-200 text-sm">
                  <FiInfo className="inline-block mr-2" />
                  These are educational possibilities only. Please consult a healthcare provider for proper diagnosis.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No matching conditions found</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// INTERACTION CHECKER
// =============================================================================
function InteractionChecker({
  interactionMeds,
  setInteractionMeds,
}: {
  interactionMeds: string[];
  setInteractionMeds: (m: string[]) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return MEDICATIONS_DATABASE
      .filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.brandNames.some(b => b.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchQuery]);

  const addMed = (name: string) => {
    if (!interactionMeds.includes(name)) {
      setInteractionMeds([...interactionMeds, name]);
    }
    setSearchQuery("");
  };

  const removeMed = (name: string) => {
    setInteractionMeds(interactionMeds.filter(m => m !== name));
  };

  // Simple interaction database (in production, use a real API)
  const knownInteractions: Record<string, string[]> = {
    "Warfarin": ["Ibuprofen", "Naproxen", "Aspirin", "Vitamin E", "Fish Oil"],
    "Lisinopril": ["Potassium supplements", "Spironolactone", "Ibuprofen"],
    "Metformin": ["Alcohol", "Contrast dye"],
    "Sertraline": ["Tramadol", "MAOIs", "St. John's Wort"],
    "Atorvastatin": ["Grapefruit", "Erythromycin", "Clarithromycin"],
  };

  const foundInteractions = useMemo(() => {
    const interactions: Array<{ med1: string; med2: string; warning: string }> = [];
    
    interactionMeds.forEach((med1, i) => {
      interactionMeds.forEach((med2, j) => {
        if (i >= j) return;
        
        // Check if there's a known interaction
        if (knownInteractions[med1]?.includes(med2)) {
          interactions.push({
            med1,
            med2,
            warning: `${med1} may interact with ${med2}. Consult your pharmacist.`,
          });
        }
        if (knownInteractions[med2]?.includes(med1)) {
          interactions.push({
            med1: med2,
            med2: med1,
            warning: `${med2} may interact with ${med1}. Consult your pharmacist.`,
          });
        }
      });
    });

    return interactions;
  }, [interactionMeds]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Medications */}
        <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Check Drug Interactions</h3>
          <p className="text-gray-400 text-sm mb-4">Add medications to check for potential interactions</p>

          {/* Search */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medication..."
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-4 space-y-2">
              {searchResults.map((med) => (
                <button
                  key={med.name}
                  onClick={() => addMed(med.name)}
                  className="w-full text-left p-3 bg-black/30 rounded-lg hover:bg-black/50 transition"
                >
                  <p className="text-white">{med.name}</p>
                  <p className="text-gray-400 text-sm">{med.brandNames.join(", ")}</p>
                </button>
              ))}
            </div>
          )}

          {/* Selected Medications */}
          <div className="flex flex-wrap gap-2 mt-4">
            {interactionMeds.map((med) => (
              <span
                key={med}
                className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg flex items-center gap-2"
              >
                {med}
                <button
                  onClick={() => removeMed(med)}
                  className="hover:text-white transition"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>

          {interactionMeds.length < 2 && (
            <p className="text-gray-500 text-sm mt-4">Add at least 2 medications to check interactions</p>
          )}
        </div>

        {/* Results */}
        <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Interaction Results</h3>

          {interactionMeds.length < 2 ? (
            <div className="text-center py-12">
              <FiAlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Add medications to check for interactions</p>
            </div>
          ) : foundInteractions.length > 0 ? (
            <div className="space-y-4">
              {foundInteractions.map((interaction, idx) => (
                <div
                  key={idx}
                  className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-orange-300 font-medium">
                        {interaction.med1} + {interaction.med2}
                      </h4>
                      <p className="text-orange-200/70 text-sm mt-1">{interaction.warning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h4 className="text-green-300 font-semibold">No Major Interactions Found</h4>
              <p className="text-green-200/70 text-sm mt-2">
                Based on our database, no major interactions were detected. 
                Always verify with your pharmacist.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SUPPLEMENTS BROWSER
// =============================================================================
function SupplementsBrowser({
  searchQuery,
  setSearchQuery,
  selectedLetter,
  setSelectedLetter,
  selectedItem,
  setSelectedItem,
  alphabet,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLetter: string | null;
  setSelectedLetter: (l: string | null) => void;
  selectedItem: SupplementEntry | null;
  setSelectedItem: (item: MedicationEntry | SupplementEntry | ConditionEntry | null) => void;
  alphabet: string[];
}) {
  const filteredSupplements = useMemo(() => {
    let supplements = SUPPLEMENTS_DATABASE;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      supplements = supplements.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.benefits.some(b => b.toLowerCase().includes(q))
      );
    } else if (selectedLetter) {
      supplements = supplements.filter(s => s.letter === selectedLetter);
    }
    return supplements;
  }, [searchQuery, selectedLetter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedLetter(null);
          }}
          placeholder="Search vitamins and supplements..."
          className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-lg"
        />
      </div>

      {/* Results */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-900/30 border border-gray-700/50 rounded-2xl p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-white font-semibold mb-4">Vitamins & Supplements</h3>
          <div className="space-y-2">
            {filteredSupplements.map((supp) => (
              <button
                key={supp.name}
                onClick={() => setSelectedItem(supp)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedItem?.name === supp.name
                    ? "bg-green-500/30 border border-green-500/50"
                    : "bg-black/20 border border-transparent hover:bg-black/40"
                }`}
              >
                <p className="text-white font-medium">{supp.name}</p>
                <p className="text-gray-400 text-sm">{supp.category}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedItem ? (
            <SupplementDetail supplement={selectedItem as SupplementEntry} />
          ) : (
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-12 text-center">
              <FiSun className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Supplement</h3>
              <p className="text-gray-400">Choose from the list to see detailed information</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SupplementDetail({ supplement }: { supplement: SupplementEntry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{supplement.name}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
            {supplement.category}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-green-400 font-semibold mb-3">Benefits</h3>
          <ul className="space-y-2">
            {supplement.benefits.map((benefit, idx) => (
              <li key={idx} className="text-gray-300 flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-400" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-blue-400 font-semibold mb-3">Recommended Dosage</h3>
          <p className="text-gray-300">{supplement.dosage}</p>
          
          <h3 className="text-orange-400 font-semibold mb-3 mt-4">Warnings</h3>
          <ul className="space-y-2">
            {supplement.warnings.map((warning, idx) => (
              <li key={idx} className="text-gray-300 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 text-orange-400" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// CONDITIONS BROWSER
// =============================================================================
function ConditionsBrowser({
  searchQuery,
  setSearchQuery,
  selectedLetter,
  setSelectedLetter,
  selectedItem,
  setSelectedItem,
  alphabet,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLetter: string | null;
  setSelectedLetter: (l: string | null) => void;
  selectedItem: ConditionEntry | null;
  setSelectedItem: (item: MedicationEntry | SupplementEntry | ConditionEntry | null) => void;
  alphabet: string[];
}) {
  const filteredConditions = useMemo(() => {
    let conditions = CONDITIONS_DATABASE;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      conditions = conditions.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.symptoms.some(s => s.toLowerCase().includes(q))
      );
    } else if (selectedLetter) {
      conditions = conditions.filter(c => c.letter === selectedLetter);
    }
    return conditions;
  }, [searchQuery, selectedLetter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedLetter(null);
          }}
          placeholder="Search health conditions and topics..."
          className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg"
        />
      </div>

      {/* A-Z Navigation */}
      <div className="flex flex-wrap gap-1 justify-center">
        <button
          onClick={() => {
            setSelectedLetter(null);
            setSearchQuery("");
          }}
          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
            !selectedLetter && !searchQuery
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          All
        </button>
        {alphabet.map((letter) => {
          const hasConditions = CONDITIONS_DATABASE.some(c => c.letter === letter);
          return (
            <button
              key={letter}
              onClick={() => {
                setSelectedLetter(letter);
                setSearchQuery("");
              }}
              disabled={!hasConditions}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                selectedLetter === letter
                  ? "bg-blue-500 text-white"
                  : hasConditions
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-gray-900 text-gray-700 cursor-not-allowed"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-900/30 border border-gray-700/50 rounded-2xl p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-white font-semibold mb-4">Health Topics</h3>
          <div className="space-y-2">
            {filteredConditions.map((condition) => (
              <button
                key={condition.name}
                onClick={() => setSelectedItem(condition)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedItem?.name === condition.name
                    ? "bg-blue-500/30 border border-blue-500/50"
                    : "bg-black/20 border border-transparent hover:bg-black/40"
                }`}
              >
                <p className="text-white font-medium">{condition.name}</p>
                <p className="text-gray-400 text-sm">{condition.category}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedItem ? (
            <ConditionDetail condition={selectedItem as ConditionEntry} />
          ) : (
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-12 text-center">
              <FiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Health Topic</h3>
              <p className="text-gray-400">Choose from the list to learn more</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ConditionDetail({ condition }: { condition: ConditionEntry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{condition.name}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
            {condition.category}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-blue-400 font-semibold mb-3">Common Symptoms</h3>
          <ul className="space-y-2">
            {condition.symptoms.map((symptom, idx) => (
              <li key={idx} className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-purple-400 font-semibold mb-3">Common Medications</h3>
          <div className="flex flex-wrap gap-2">
            {condition.commonMedications.map((med, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm"
              >
                {med}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <p className="text-blue-200 text-sm">
          <FiInfo className="inline-block mr-2" />
          This is general information. Treatment plans vary by individual. 
          Consult your healthcare provider for personalized advice.
        </p>
      </div>
    </motion.div>
  );
}
