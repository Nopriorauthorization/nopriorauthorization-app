"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import ExportModal from "@/components/export/ExportModal";
import { StoryboardSnapshot, TreatmentItem } from "@/types/storyboard";
import { motion } from "framer-motion";
import { FiTrendingUp, FiHeart, FiActivity, FiUsers, FiTarget } from "react-icons/fi";

interface FamilyInsight {
  type: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

const INITIAL_SNAPSHOT: StoryboardSnapshot = {
  ageRange: "",
  goals: "",
  allergies: "",
  meds: "",
  conditions: "",
  preferences: "",
};

export default function BlueprintPage() {
  const { data: session } = useSession();
  const [snapshot, setSnapshot] = useState<StoryboardSnapshot>(INITIAL_SNAPSHOT);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [userData, setUserData] = useState({
    hasDocuments: false,
    hasTimelineEntries: false,
    hasFamilyData: false,
    hasSharedWithProviders: false,
    hasAIInsights: false,
  });
  const [familyInsights, setFamilyInsights] = useState<FamilyInsight[]>([]);

  useEffect(() => {
    if (session?.user) {
      loadUserData();
      loadFamilyInsights();
    }
  }, [session]);

  const loadUserData = async () => {
    try {
      const documentsResponse = await fetch('/api/documents?limit=1');
      const documentsData = await documentsResponse.json();
      const hasDocuments = documentsData.documents && documentsData.documents.length > 0;

      const timelineResponse = await fetch('/api/vault/timeline?limit=1');
      const timelineData = await timelineResponse.json();
      const hasTimelineEntries = timelineData.entries && timelineData.entries.length > 0;

      const familyResponse = await fetch('/api/family-members');
      const familyData = await familyResponse.json();
      const hasFamilyData = familyData.members && familyData.members.length > 0;

      setUserData({
        hasDocuments,
        hasTimelineEntries,
        hasFamilyData,
        hasSharedWithProviders: false,
        hasAIInsights: false,
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadFamilyInsights = async () => {
    try {
      const response = await fetch('/api/family-members');
      const data = await response.json();
      if (data.members && data.members.length > 0) {
        const insights = generateFamilyInsights(data.members);
        setFamilyInsights(insights);
      }
    } catch (error) {
      console.error('Failed to load family insights:', error);
    }
  };

  const generateFamilyInsights = (members: any[]): FamilyInsight[] => {
    const insights: FamilyInsight[] = [];
    const conditionCounts: Record<string, number> = {};

    members.forEach(member => {
      member.conditions.forEach((condition: string) => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
    });

    Object.entries(conditionCounts).forEach(([condition, count]) => {
      if (count >= 2) {
        insights.push({
          type: 'pattern',
          title: `Family Pattern: ${condition}`,
          description: `${count} family members reported ${condition.toLowerCase()}. Consider earlier monitoring.`,
          icon: FiTrendingUp,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
        });
      }
    });

    return insights;
  };

  const getCompletionPercentage = () => {
    const items = [
      userData.hasDocuments,
      userData.hasTimelineEntries,
      userData.hasFamilyData,
      userData.hasSharedWithProviders,
      userData.hasAIInsights,
    ];
    return Math.round((items.filter(Boolean).length / items.length) * 100);
  };

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                My Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Blueprint</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Your personalized health intelligence dashboard. See how your data connects to create actionable insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Blueprint Progress</h2>
                <div className="text-2xl font-bold text-pink-400">{getCompletionPercentage()}%</div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`flex items-center gap-2 ${userData.hasDocuments ? 'text-green-400' : 'text-white/50'}`}>
                  <FiHeart className="w-4 h-4" />
                  <span className="text-sm">Documents</span>
                </div>
                <div className={`flex items-center gap-2 ${userData.hasTimelineEntries ? 'text-green-400' : 'text-white/50'}`}>
                  <FiActivity className="w-4 h-4" />
                  <span className="text-sm">Timeline</span>
                </div>
                <div className={`flex items-center gap-2 ${userData.hasFamilyData ? 'text-green-400' : 'text-white/50'}`}>
                  <FiUsers className="w-4 h-4" />
                  <span className="text-sm">Family Tree</span>
                </div>
                <div className={`flex items-center gap-2 ${userData.hasSharedWithProviders ? 'text-green-400' : 'text-white/50'}`}>
                  <FiTarget className="w-4 h-4" />
                  <span className="text-sm">Provider Share</span>
                </div>
                <div className={`flex items-center gap-2 ${userData.hasAIInsights ? 'text-green-400' : 'text-white/50'}`}>
                  <FiTrendingUp className="w-4 h-4" />
                  <span className="text-sm">AI Insights</span>
                </div>
              </div>
            </motion.div>

            {familyInsights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FiTrendingUp className="w-6 h-6 text-blue-400" />
                  Family Health Insights
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {familyInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`${insight.bgColor} border border-white/10 rounded-lg p-6`}
                    >
                      <div className="flex items-start gap-3">
                        <insight.icon className={`w-6 h-6 ${insight.color} mt-1`} />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                          <p className="text-white/80 text-sm">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid gap-4 md:grid-cols-3 mb-8"
            >
              <button
                onClick={() => window.location.href = '/vault/family-tree'}
                className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-6 hover:bg-green-500/30 transition-all text-left"
              >
                <FiUsers className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Family Health Tree</h3>
                <p className="text-white/80 text-sm">Add family health history and see patterns</p>
              </button>

              <button
                onClick={() => window.location.href = '/vault/timeline'}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 hover:bg-purple-500/30 transition-all text-left"
              >
                <FiActivity className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Health Timeline</h3>
                <p className="text-white/80 text-sm">Track your health journey over time</p>
              </button>

              <button
                onClick={() => window.location.href = '/vault/personal-documents'}
                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-6 hover:bg-orange-500/30 transition-all text-left"
              >
                <FiHeart className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Document Vault</h3>
                <p className="text-white/80 text-sm">Securely store and organize health records</p>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Export My Blueprint
              </button>
              <p className="text-white/60 text-sm mt-3">
                Generate a comprehensive health summary for providers
              </p>
            </motion.div>
          </div>
        </main>
        <ExportModal
          open={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          snapshot={snapshot}
          treatments={treatments}
        />
      </div>
    </Providers>
  );
}