"use client";

import React, { useState } from "react";
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
  FiInfo,
  FiShield,
  FiHeart,
  FiX,
  FiMessageCircle,
  FiBookOpen,
  FiActivity,
} from "react-icons/fi";

// =============================================================================
// MEDICATION DECODER™
// Educational medication information - NOT medical advice
// =============================================================================

// Sample medication database (would connect to FDA/NIH APIs in production)
const MEDICATION_DATABASE: Record<string, MedicationInfo> = {
  "metformin": {
    genericName: "Metformin",
    brandNames: ["Glucophage", "Fortamet", "Glumetza", "Riomet"],
    drugClass: "Biguanide",
    commonlyPrescribedFor: ["Type 2 Diabetes", "Prediabetes", "Polycystic Ovary Syndrome (PCOS)"],
    howItWorks: "Metformin helps control blood sugar levels by reducing the amount of glucose your liver produces and helping your body respond better to insulin.",
    sideEffects: {
      common: ["Nausea", "Diarrhea", "Stomach upset", "Loss of appetite", "Metallic taste"],
      lessCommon: ["Headache", "Muscle pain", "Weakness", "Flushing"],
      serious: ["Lactic acidosis (rare but serious)", "Vitamin B12 deficiency (long-term use)"],
    },
    interactions: [
      { drug: "Contrast dye", severity: "high", note: "May need to stop before procedures with contrast dye" },
      { drug: "Alcohol", severity: "medium", note: "Excessive alcohol may increase lactic acidosis risk" },
      { drug: "Certain diuretics", severity: "low", note: "May affect blood sugar control" },
    ],
    allergyWarnings: ["Sulfa drugs (rare cross-reaction)"],
    questionsToAsk: [
      "Should I take this with food?",
      "How will I know if it's working?",
      "What blood sugar levels should I watch for?",
      "How often do I need lab work while on this?",
    ],
  },
  "lisinopril": {
    genericName: "Lisinopril",
    brandNames: ["Prinivil", "Zestril", "Qbrelis"],
    drugClass: "ACE Inhibitor",
    commonlyPrescribedFor: ["High Blood Pressure", "Heart Failure", "Post-Heart Attack Care", "Diabetic Kidney Protection"],
    howItWorks: "Lisinopril relaxes blood vessels by blocking an enzyme that causes them to narrow, making it easier for your heart to pump blood.",
    sideEffects: {
      common: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
      lessCommon: ["Elevated potassium levels", "Rash", "Changes in taste"],
      serious: ["Angioedema (swelling of face/throat)", "Severe allergic reaction", "Kidney problems"],
    },
    interactions: [
      { drug: "NSAIDs (ibuprofen, naproxen)", severity: "medium", note: "May reduce effectiveness and affect kidneys" },
      { drug: "Potassium supplements", severity: "high", note: "May cause dangerously high potassium" },
      { drug: "Lithium", severity: "high", note: "May increase lithium levels in blood" },
    ],
    allergyWarnings: ["ACE inhibitors", "History of angioedema"],
    questionsToAsk: [
      "What should my blood pressure goal be?",
      "Should I avoid potassium-rich foods?",
      "What should I do if I develop a cough?",
      "How often should I check my blood pressure?",
    ],
  },
  "atorvastatin": {
    genericName: "Atorvastatin",
    brandNames: ["Lipitor"],
    drugClass: "Statin (HMG-CoA Reductase Inhibitor)",
    commonlyPrescribedFor: ["High Cholesterol", "Heart Disease Prevention", "Stroke Prevention"],
    howItWorks: "Atorvastatin lowers cholesterol by blocking an enzyme in your liver that makes cholesterol, and helps your body remove existing cholesterol from your blood.",
    sideEffects: {
      common: ["Muscle aches", "Joint pain", "Diarrhea", "Nausea"],
      lessCommon: ["Memory issues", "Confusion", "Elevated blood sugar"],
      serious: ["Rhabdomyolysis (severe muscle breakdown)", "Liver problems"],
    },
    interactions: [
      { drug: "Grapefruit juice", severity: "medium", note: "May increase statin levels in blood" },
      { drug: "Certain antibiotics", severity: "high", note: "Clarithromycin, erythromycin may increase statin levels" },
      { drug: "Fibrates", severity: "high", note: "Increased risk of muscle problems" },
    ],
    allergyWarnings: ["Other statins"],
    questionsToAsk: [
      "When is the best time to take this?",
      "What muscle symptoms should concern me?",
      "How often do I need cholesterol checks?",
      "Should I avoid grapefruit?",
    ],
  },
  "levothyroxine": {
    genericName: "Levothyroxine",
    brandNames: ["Synthroid", "Levoxyl", "Tirosint", "Unithroid"],
    drugClass: "Thyroid Hormone",
    commonlyPrescribedFor: ["Hypothyroidism", "Thyroid Cancer (post-surgery)", "Goiter"],
    howItWorks: "Levothyroxine replaces the thyroid hormone your body isn't making enough of, helping regulate your metabolism, energy levels, and body temperature.",
    sideEffects: {
      common: ["Hair loss (temporary)", "Weight changes", "Appetite changes", "Sensitivity to heat"],
      lessCommon: ["Headache", "Nervousness", "Irritability", "Sleep problems"],
      serious: ["Chest pain", "Rapid heartbeat", "Bone loss (long-term overtreatment)"],
    },
    interactions: [
      { drug: "Calcium supplements", severity: "medium", note: "Take 4 hours apart - calcium reduces absorption" },
      { drug: "Iron supplements", severity: "medium", note: "Take 4 hours apart - iron reduces absorption" },
      { drug: "Antacids", severity: "medium", note: "May reduce absorption" },
    ],
    allergyWarnings: ["Thyroid hormones (rare)"],
    questionsToAsk: [
      "Should I take this on an empty stomach?",
      "How long until I feel the effects?",
      "How often do I need thyroid levels checked?",
      "What symptoms mean my dose needs adjusting?",
    ],
  },
  "omeprazole": {
    genericName: "Omeprazole",
    brandNames: ["Prilosec", "Zegerid"],
    drugClass: "Proton Pump Inhibitor (PPI)",
    commonlyPrescribedFor: ["GERD (Acid Reflux)", "Stomach Ulcers", "H. pylori Infection (with antibiotics)", "Erosive Esophagitis"],
    howItWorks: "Omeprazole reduces the amount of acid your stomach produces by blocking the pumps in your stomach lining that create acid.",
    sideEffects: {
      common: ["Headache", "Nausea", "Diarrhea", "Stomach pain", "Gas"],
      lessCommon: ["Dizziness", "Rash", "Constipation"],
      serious: ["Bone fractures (long-term use)", "Kidney problems", "Low magnesium", "C. diff infection"],
    },
    interactions: [
      { drug: "Clopidogrel (Plavix)", severity: "high", note: "May reduce effectiveness of clopidogrel" },
      { drug: "Methotrexate", severity: "medium", note: "May increase methotrexate levels" },
      { drug: "Certain HIV medications", severity: "high", note: "May reduce absorption of some HIV drugs" },
    ],
    allergyWarnings: ["Other PPIs (esomeprazole, pantoprazole)"],
    questionsToAsk: [
      "How long should I take this?",
      "Can I take this long-term?",
      "Should I take it before meals?",
      "What if my symptoms don't improve?",
    ],
  },
};

interface MedicationInfo {
  genericName: string;
  brandNames: string[];
  drugClass: string;
  commonlyPrescribedFor: string[];
  howItWorks: string;
  sideEffects: {
    common: string[];
    lessCommon: string[];
    serious: string[];
  };
  interactions: {
    drug: string;
    severity: "low" | "medium" | "high";
    note: string;
  }[];
  allergyWarnings: string[];
  questionsToAsk: string[];
}

interface UserMedication {
  id: string;
  name: string;
  addedAt: Date;
  reason?: string;
}

interface UserAllergy {
  id: string;
  name: string;
  type: "medication" | "food" | "other";
}

export default function MedicationDecoderPage() {
  const [userMedications, setUserMedications] = useState<UserMedication[]>([]);
  const [userAllergies, setUserAllergies] = useState<UserAllergy[]>([
    { id: "1", name: "Penicillin", type: "medication" },
  ]);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  const searchResults = searchQuery.length > 2
    ? Object.keys(MEDICATION_DATABASE).filter(med =>
        med.toLowerCase().includes(searchQuery.toLowerCase()) ||
        MEDICATION_DATABASE[med].brandNames.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const addMedication = (medName: string, reason?: string) => {
    const newMed: UserMedication = {
      id: Date.now().toString(),
      name: medName,
      addedAt: new Date(),
      reason,
    };
    setUserMedications([...userMedications, newMed]);
    setSelectedMedication(medName);
    setShowAddModal(false);
    setSearchQuery("");
  };

  const removeMedication = (id: string) => {
    setUserMedications(userMedications.filter(m => m.id !== id));
    setSelectedMedication(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Disclaimer Banner */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-sm text-purple-200">
            <FiInfo className="inline-block mr-2" />
            <strong>Educational information only.</strong> This is not medical advice. Always consult your provider or pharmacist before making medication decisions.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-black" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                <FiShield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Medication Decoder™
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Understand your medications clearly. Learn about side effects, interactions, and what questions to ask —{" "}
              <span className="text-purple-300">without the confusion.</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Medications & Allergies */}
          <div className="lg:col-span-1 space-y-6">
            {/* My Medications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiActivity className="text-purple-400" />
                  My Medications
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>

              {userMedications.length === 0 ? (
                <div className="text-center py-8">
                  <FiBookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No medications added yet</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-purple-400 text-sm font-medium hover:text-purple-300"
                  >
                    + Add your first medication
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {userMedications.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => setSelectedMedication(med.name)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                        selectedMedication === med.name
                          ? "bg-purple-500/30 border border-purple-500/50"
                          : "bg-black/20 border border-transparent hover:bg-black/30"
                      }`}
                    >
                      <div>
                        <p className="text-white font-medium capitalize">{med.name}</p>
                        {med.reason && <p className="text-gray-400 text-xs">{med.reason}</p>}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMedication(med.id);
                        }}
                        className="p-1 text-gray-500 hover:text-red-400 transition"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Allergy Safety Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiAlertTriangle className="text-red-400" />
                  My Allergies
                </h2>
                <button
                  onClick={() => setShowAllergyModal(true)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>

              {userAllergies.length === 0 ? (
                <p className="text-gray-400 text-sm">No allergies recorded</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userAllergies.map((allergy) => (
                    <span
                      key={allergy.id}
                      className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center gap-2"
                    >
                      {allergy.name}
                      <button
                        onClick={() => setUserAllergies(userAllergies.filter(a => a.id !== allergy.id))}
                        className="hover:text-white transition"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4">
                We check your medications against your allergies for safety awareness.
              </p>
            </motion.div>

            {/* Harmony Mascot */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/characters/harmony.png"
                  alt="Harmony"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-white font-semibold">Harmony</h3>
                  <p className="text-purple-300 text-sm">Your Medication Guide</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                I'm here to help you understand your medications clearly. Select a medication to get started, or add a new one to decode.
              </p>
              <Link
                href="https://app.nopriorauthorization.com/chat?mascot=harmony&source=medications"
                className="mt-4 inline-flex items-center gap-2 text-purple-400 text-sm font-medium hover:text-purple-300"
              >
                <FiMessageCircle className="w-4 h-4" />
                Ask Harmony a question
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Medication Decoder */}
          <div className="lg:col-span-2">
            {selectedMedication && MEDICATION_DATABASE[selectedMedication] ? (
              <MedicationDecoder
                medication={MEDICATION_DATABASE[selectedMedication]}
                userMedications={userMedications}
                userAllergies={userAllergies}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-12 text-center"
              >
                <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Medication to Decode</h3>
                <p className="text-gray-400 mb-6">
                  Add a medication from your list or search for one to see detailed information.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                >
                  <FiPlus className="w-5 h-5" />
                  Add Medication
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Interaction Checker Section */}
        {userMedications.length >= 2 && (
          <InteractionChecker
            medications={userMedications}
            database={MEDICATION_DATABASE}
          />
        )}

        {/* Bottom Disclaimer */}
        <div className="mt-12 bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <FiShield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Important Safety Information</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Medication Decoder™ provides educational information from publicly available sources including FDA drug labels, NIH, and MedlinePlus. 
                This information is not a substitute for professional medical advice, diagnosis, or treatment. 
                <strong className="text-gray-300"> Always consult your healthcare provider or pharmacist</strong> before starting, stopping, or changing any medication.
                If you experience any concerning symptoms, contact your healthcare provider immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddMedicationModal
            onClose={() => {
              setShowAddModal(false);
              setSearchQuery("");
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onAdd={addMedication}
            database={MEDICATION_DATABASE}
          />
        )}
      </AnimatePresence>

      {/* Add Allergy Modal */}
      <AnimatePresence>
        {showAllergyModal && (
          <AddAllergyModal
            onClose={() => setShowAllergyModal(false)}
            onAdd={(name, type) => {
              setUserAllergies([...userAllergies, { id: Date.now().toString(), name, type }]);
              setShowAllergyModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// MEDICATION DECODER COMPONENT
// =============================================================================

function MedicationDecoder({
  medication,
  userMedications,
  userAllergies,
}: {
  medication: MedicationInfo;
  userMedications: UserMedication[];
  userAllergies: UserAllergy[];
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  // Check for allergy warnings
  const allergyWarnings = userAllergies.filter(allergy =>
    medication.allergyWarnings.some(warning =>
      warning.toLowerCase().includes(allergy.name.toLowerCase())
    )
  );

  const sections = [
    { id: "overview", title: "Medication Overview", icon: FiBookOpen },
    { id: "sideEffects", title: "Side Effects Explorer", icon: FiAlertCircle },
    { id: "interactions", title: "Known Interactions", icon: FiActivity },
    { id: "questions", title: "Before You Pick Up", icon: FiMessageCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Allergy Warning */}
      {allergyWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-300 font-semibold">Allergy Alert</h3>
              <p className="text-red-200 text-sm mt-1">
                Based on your recorded allergies ({allergyWarnings.map(a => a.name).join(", ")}), 
                there may be a potential concern with this medication. 
                <strong> Please discuss this with your provider or pharmacist.</strong>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">{medication.genericName}</h2>
            <p className="text-purple-300 mt-1">
              {medication.brandNames.join(" • ")}
            </p>
            <span className="inline-block mt-3 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              {medication.drugClass}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <FiShield className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      {sections.map((section) => (
        <div
          key={section.id}
          className="bg-black/30 border border-gray-700/50 rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <section.icon className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">{section.title}</span>
            </div>
            {expandedSection === section.id ? (
              <FiChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 border-t border-gray-700/50">
                  {section.id === "overview" && (
                    <OverviewSection medication={medication} />
                  )}
                  {section.id === "sideEffects" && (
                    <SideEffectsSection medication={medication} />
                  )}
                  {section.id === "interactions" && (
                    <InteractionsSection medication={medication} userMedications={userMedications} />
                  )}
                  {section.id === "questions" && (
                    <QuestionsSection medication={medication} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
}

// =============================================================================
// SECTION COMPONENTS
// =============================================================================

function OverviewSection({ medication }: { medication: MedicationInfo }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-purple-300 text-sm font-medium mb-2">Commonly Prescribed For</h4>
        <div className="flex flex-wrap gap-2">
          {medication.commonlyPrescribedFor.map((condition, idx) => (
            <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              {condition}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-purple-300 text-sm font-medium mb-2">How It Works</h4>
        <p className="text-gray-300 leading-relaxed">{medication.howItWorks}</p>
      </div>

      <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
        <p className="text-purple-200 text-sm">
          <FiInfo className="inline-block mr-2" />
          This is general information about what {medication.genericName} is commonly used for. 
          Your specific prescription may be for a different purpose as determined by your provider.
        </p>
      </div>
    </div>
  );
}

function SideEffectsSection({ medication }: { medication: MedicationInfo }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm mb-4">
        What to be aware of — not what to fear. Most people don't experience all of these.
      </p>

      {/* Common */}
      <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <h4 className="text-green-300 font-medium">Common (may occur)</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {medication.sideEffects.common.map((effect, idx) => (
            <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">
              {effect}
            </span>
          ))}
        </div>
      </div>

      {/* Less Common */}
      <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <h4 className="text-yellow-300 font-medium">Less Common</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {medication.sideEffects.lessCommon.map((effect, idx) => (
            <span key={idx} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm">
              {effect}
            </span>
          ))}
        </div>
      </div>

      {/* Serious */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <h4 className="text-red-300 font-medium">Serious (rare, but discuss with provider if experienced)</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {medication.sideEffects.serious.map((effect, idx) => (
            <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">
              {effect}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function InteractionsSection({ medication, userMedications }: { medication: MedicationInfo; userMedications: UserMedication[] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/20 border-red-500/30 text-red-300";
      case "medium": return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
      default: return "bg-green-500/20 border-green-500/30 text-green-300";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <FiAlertTriangle className="w-5 h-5 text-red-400" />;
      case "medium": return <FiAlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <FiInfo className="w-5 h-5 text-green-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm mb-4">
        Known interactions to discuss with your provider or pharmacist.
      </p>

      {medication.interactions.map((interaction, idx) => (
        <div
          key={idx}
          className={`rounded-xl p-4 border ${getSeverityColor(interaction.severity)}`}
        >
          <div className="flex items-start gap-3">
            {getSeverityIcon(interaction.severity)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{interaction.drug}</h4>
                <span className={`px-2 py-0.5 rounded text-xs uppercase ${
                  interaction.severity === "high" ? "bg-red-500/30" :
                  interaction.severity === "medium" ? "bg-yellow-500/30" : "bg-green-500/30"
                }`}>
                  {interaction.severity === "high" ? "Discuss with provider" :
                   interaction.severity === "medium" ? "Caution" : "Informational"}
                </span>
              </div>
              <p className="text-sm mt-1 opacity-80">{interaction.note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionsSection({ medication }: { medication: MedicationInfo }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm mb-4">
        Questions to ask your provider or pharmacist before you pick up this medication.
      </p>

      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
        <h4 className="text-purple-300 font-medium mb-4 flex items-center gap-2">
          <FiMessageCircle className="w-5 h-5" />
          Suggested Questions
        </h4>
        <ul className="space-y-3">
          {medication.questionsToAsk.map((question, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">{question}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <p className="text-blue-200 text-sm">
          <FiInfo className="inline-block mr-2" />
          Pro tip: Write these questions down or save them to your Blueprint before your pharmacy visit.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// INTERACTION CHECKER
// =============================================================================

function InteractionChecker({
  medications,
  database,
}: {
  medications: UserMedication[];
  database: Record<string, MedicationInfo>;
}) {
  const foundInteractions: Array<{
    med1: string;
    med2: string;
    severity: string;
    note: string;
  }> = [];

  // Check each medication pair
  medications.forEach((med1, i) => {
    medications.forEach((med2, j) => {
      if (i >= j) return;
      
      const med1Info = database[med1.name];
      const med2Info = database[med2.name];
      
      if (med1Info && med2Info) {
        // Check if med1 interacts with med2
        med1Info.interactions.forEach(interaction => {
          if (interaction.drug.toLowerCase().includes(med2Info.drugClass.toLowerCase())) {
            foundInteractions.push({
              med1: med1.name,
              med2: med2.name,
              severity: interaction.severity,
              note: interaction.note,
            });
          }
        });
      }
    });
  });

  if (foundInteractions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <FiAlertTriangle className="w-6 h-6 text-orange-400" />
        <h2 className="text-xl font-semibold text-white">Potential Interactions Detected</h2>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Based on your medication list, we found potential interactions to discuss with your provider.
      </p>
      
      <div className="space-y-3">
        {foundInteractions.map((interaction, idx) => (
          <div key={idx} className="bg-black/30 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 text-orange-300 font-medium mb-2">
              <span className="capitalize">{interaction.med1}</span>
              <span className="text-gray-500">+</span>
              <span className="capitalize">{interaction.med2}</span>
            </div>
            <p className="text-gray-400 text-sm">{interaction.note}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        This is not a complete interaction check. Always verify with your pharmacist.
      </p>
    </motion.div>
  );
}

// =============================================================================
// MODALS
// =============================================================================

function AddMedicationModal({
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  onAdd,
  database,
}: {
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: string[];
  onAdd: (name: string, reason?: string) => void;
  database: Record<string, MedicationInfo>;
}) {
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-purple-500/30 rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Medication</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medication name..."
            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            autoFocus
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4 space-y-2">
            {searchResults.map((med) => (
              <button
                key={med}
                onClick={() => setSelectedMed(med)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedMed === med
                    ? "bg-purple-500/20 border-purple-500/50"
                    : "bg-black/30 border-gray-700/50 hover:border-purple-500/30"
                }`}
              >
                <p className="text-white font-medium capitalize">{med}</p>
                <p className="text-gray-400 text-sm">{database[med]?.brandNames.join(", ")}</p>
              </button>
            ))}
          </div>
        )}

        {searchQuery.length > 0 && searchQuery.length <= 2 && (
          <p className="text-gray-500 text-sm mb-4">Type at least 3 characters to search</p>
        )}

        {searchQuery.length > 2 && searchResults.length === 0 && (
          <p className="text-gray-500 text-sm mb-4">No medications found. Try a different name.</p>
        )}

        {/* Reason (optional) */}
        {selectedMed && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Why are you taking this? (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., High blood pressure"
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedMed && onAdd(selectedMed, reason || undefined)}
            disabled={!selectedMed}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
          >
            Add Medication
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddAllergyModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string, type: "medication" | "food" | "other") => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"medication" | "food" | "other">("medication");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Allergy</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Allergy Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Penicillin"
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <div className="flex gap-2">
              {(["medication", "food", "other"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition ${
                    type === t
                      ? "bg-red-500/20 border-red-500/50 text-red-300"
                      : "bg-black/30 border-gray-700/50 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => name && onAdd(name, type)}
            disabled={!name}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition disabled:opacity-50"
          >
            Add Allergy
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
