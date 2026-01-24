"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiUser,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiTarget,
  FiX,
  FiCheck,
  FiInfo,
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';

export interface FamilyMember {
  id: string;
  relationship: 'user' | 'parent' | 'grandparent' | 'sibling' | 'child';
  sex: 'male' | 'female' | 'unknown';
  age?: number;
  ageAtDeath?: number;
  conditions: string[];
  notes?: string;
  createdAt: Date;
}

export interface FamilyInsight {
  id: string;
  type: 'pattern' | 'risk' | 'observation';
  title: string;
  description: string;
  relatedMembers: string[];
  vaultActions?: string[];
  blueprintActions?: string[];
}

const CONDITION_OPTIONS = [
  'Cardiovascular',
  'Metabolic / Diabetes',
  'Thyroid',
  'Cancer',
  'Autoimmune',
  'Neurological',
  'Mental Health',
  'Hormonal / Endocrine'
];

const RELATIONSHIP_LABELS = {
  user: 'You',
  parent: 'Parent',
  grandparent: 'Grandparent',
  sibling: 'Sibling',
  child: 'Child'
};

const SEX_LABELS = {
  male: 'Male',
  female: 'Female',
  unknown: 'Unknown'
};

export default function FamilyHealthTree() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [insights, setInsights] = useState<FamilyInsight[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Load family data on mount
  useEffect(() => {
    loadFamilyData();
  }, []);

  // Generate insights when family data changes
  useEffect(() => {
    if (familyMembers.length > 0) {
      generateInsights();
    }
  }, [familyMembers]);

  const loadFamilyData = async () => {
    try {
      const response = await fetch('/api/family-members');
      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data.members || []);
      }
    } catch (error) {
      console.error('Failed to load family data:', error);
    }
  };

  const generateInsights = () => {
    const newInsights: FamilyInsight[] = [];

    // Count conditions by type
    const conditionCounts: Record<string, number> = {};
    const membersByCondition: Record<string, string[]> = {};

    familyMembers.forEach(member => {
      member.conditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        if (!membersByCondition[condition]) {
          membersByCondition[condition] = [];
        }
        membersByCondition[condition].push(member.id);
      });
    });

    // Generate pattern insights
    Object.entries(conditionCounts).forEach(([condition, count]) => {
      if (count >= 2) {
        const members = membersByCondition[condition];
        const relationships = members.map(id =>
          familyMembers.find(m => m.id === id)?.relationship
        ).filter(Boolean);

        if (relationships.length >= 2) {
          newInsights.push({
            id: `pattern-${condition.toLowerCase().replace(/\s+\/\s+/g, '-').replace(/\s+/g, '-')}`,
            type: 'pattern',
            title: `Multiple family members with ${condition.toLowerCase()}`,
            description: `${count} ${relationships.join(' and ').toLowerCase()} reported ${condition.toLowerCase()}. This pattern may be relevant for your health monitoring.`,
            relatedMembers: members,
            vaultActions: [
              `Upload ${condition.toLowerCase()}-related medical records`,
              `Track ${condition.toLowerCase()} in your health timeline`
            ],
            blueprintActions: [
              `Consider earlier monitoring for ${condition.toLowerCase()}`,
              `Discuss family history with healthcare providers`
            ]
          });
        }
      }
    });

    // Check for multi-generational patterns
    const conditionsByGeneration: Record<string, Set<string>> = {
      parent: new Set(),
      grandparent: new Set(),
      sibling: new Set(),
      child: new Set()
    };

    familyMembers.forEach(member => {
      member.conditions.forEach(condition => {
        if (member.relationship !== 'user') {
          conditionsByGeneration[member.relationship].add(condition);
        }
      });
    });

    // Multi-generational patterns
    Object.entries(conditionsByGeneration).forEach(([gen, conditions]) => {
      conditions.forEach(condition => {
        const hasInOtherGens = Object.entries(conditionsByGeneration)
          .some(([otherGen, otherConditions]) =>
            otherGen !== gen && otherConditions.has(condition)
          );

        if (hasInOtherGens) {
          newInsights.push({
            id: `multigen-${condition.toLowerCase().replace(/\s+\/\s+/g, '-').replace(/\s+/g, '-')}`,
            type: 'observation',
            title: `${condition} appears across generations`,
            description: `${condition} has been reported in multiple generations of your family. This may indicate hereditary patterns worth discussing with your healthcare provider.`,
            relatedMembers: familyMembers
              .filter(m => m.conditions.includes(condition))
              .map(m => m.id),
            vaultActions: [
              `Document family history of ${condition.toLowerCase()}`,
              `Share this pattern with your care team`
            ],
            blueprintActions: [
              `Earlier screening for ${condition.toLowerCase()} may be appropriate`,
              `Genetic counseling could provide valuable insights`
            ]
          });
        }
      });
    });

    setInsights(newInsights);
  };

  const addFamilyMember = async (memberData: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/family-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });

      if (response.ok) {
        await loadFamilyData();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add family member:', error);
    }
  };

  const getMemberPosition = (relationship: string, index: number) => {
    const positions = {
      user: { x: 0, y: 0 },
      parent: [
        { x: -120, y: -100 },
        { x: 120, y: -100 }
      ],
      grandparent: [
        { x: -200, y: -200 },
        { x: -40, y: -200 },
        { x: 40, y: -200 },
        { x: 200, y: -200 }
      ],
      sibling: [
        { x: -80, y: 0 },
        { x: 80, y: 0 }
      ],
      child: [
        { x: -60, y: 100 },
        { x: 60, y: 100 }
      ]
    };

    const pos = positions[relationship as keyof typeof positions];
    if (Array.isArray(pos)) {
      return pos[index] || pos[0];
    }
    return pos;
  };

  const getMembersByRelationship = (relationship: string) =>
    familyMembers.filter(m => m.relationship === relationship);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                🌳 Family Health Tree
              </h1>
              <p className="text-gray-400">
                Understand inherited health patterns to act sooner and smarter
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:shadow-lg transition-all"
            >
              <FiPlus className="w-5 h-5" />
              Add Family Member
            </button>
          </div>
        </div>

        {/* Family Tree Visualization */}
        <div className="relative mb-8">
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl h-96">
              {/* User (Center) */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <FamilyMemberNode
                  member={familyMembers.find(m => m.relationship === 'user') || {
                    id: 'user',
                    relationship: 'user',
                    sex: 'unknown',
                    conditions: [],
                    createdAt: new Date()
                  }}
                  onClick={() => setSelectedMember(familyMembers.find(m => m.relationship === 'user') || null)}
                  isUser={true}
                />
              </motion.div>

              {/* Parents */}
              {getMembersByRelationship('parent').map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${getMemberPosition('parent', index).x}px)`,
                    top: `calc(50% + ${getMemberPosition('parent', index).y}px)`
                  }}
                >
                  <FamilyMemberNode
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                </motion.div>
              ))}

              {/* Grandparents */}
              {getMembersByRelationship('grandparent').map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${getMemberPosition('grandparent', index).x}px)`,
                    top: `calc(50% + ${getMemberPosition('grandparent', index).y}px)`
                  }}
                >
                  <FamilyMemberNode
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                </motion.div>
              ))}

              {/* Siblings */}
              {getMembersByRelationship('sibling').map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${getMemberPosition('sibling', index).x}px)`,
                    top: `calc(50% + ${getMemberPosition('sibling', index).y}px)`
                  }}
                >
                  <FamilyMemberNode
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                </motion.div>
              ))}

              {/* Children */}
              {getMembersByRelationship('child').map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${getMemberPosition('child', index).x}px)`,
                    top: `calc(50% + ${getMemberPosition('child', index).y}px)`
                  }}
                >
                  <FamilyMemberNode
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-6 h-6 text-blue-400" />
              Health Insights
            </h2>
            <div className="grid gap-4">
              {insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">
                        {insight.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {insight.description}
                      </p>

                      {insight.vaultActions && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-green-400 mb-2">💼 Sacred Vault Actions:</h4>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {insight.vaultActions.map((action, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <FiCheck className="w-4 h-4 text-green-400" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {insight.blueprintActions && (
                        <div>
                          <h4 className="text-sm font-medium text-purple-400 mb-2">🎯 Blueprint Actions:</h4>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {insight.blueprintActions.map((action, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <FiTarget className="w-4 h-4 text-purple-400" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add Member Modal */}
        <AnimatePresence>
          {showAddModal && (
            <AddMemberModal
              onClose={() => setShowAddModal(false)}
              onAdd={addFamilyMember}
            />
          )}
        </AnimatePresence>

        {/* Member Details Modal */}
        <AnimatePresence>
          {selectedMember && (
            <MemberDetailsModal
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Family Member Node Component
function FamilyMemberNode({
  member,
  onClick,
  isUser = false
}: {
  member: FamilyMember;
  onClick: () => void;
  isUser?: boolean;
}) {
  const hasConditions = member.conditions.length > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
        isUser
          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-300'
          : hasConditions
            ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-400'
            : 'bg-gray-700 border-gray-600'
      }`}
    >
      <FiUser className={`w-6 h-6 ${isUser ? 'text-black' : 'text-white'}`} />
      {hasConditions && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">{member.conditions.length}</span>
        </div>
      )}
    </motion.div>
  );
}

// Add Member Modal Component
function AddMemberModal({
  onClose,
  onAdd
}: {
  onClose: () => void;
  onAdd: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => void;
}) {
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('parent');
  const [sex, setSex] = useState<FamilyMember['sex']>('unknown');
  const [age, setAge] = useState<string>('');
  const [ageAtDeath, setAgeAtDeath] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const memberData: Omit<FamilyMember, 'id' | 'createdAt'> = {
      relationship,
      sex,
      conditions: selectedConditions,
      notes: notes.trim() || undefined
    };

    if (age) {
      memberData.age = parseInt(age);
    }

    if (ageAtDeath) {
      memberData.ageAtDeath = parseInt(ageAtDeath);
    }

    onAdd(memberData);
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-lg max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Add Family Member</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as FamilyMember['relationship'])}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="parent">Parent</option>
              <option value="grandparent">Grandparent</option>
              <option value="sibling">Sibling</option>
              <option value="child">Child</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sex</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as FamilyMember['sex'])}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="unknown">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age at Death</label>
              <input
                type="number"
                value={ageAtDeath}
                onChange={(e) => setAgeAtDeath(e.target.value)}
                placeholder="if applicable"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Known Conditions</label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITION_OPTIONS.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                    selectedConditions.includes(condition)
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:shadow-lg transition-all"
            >
              Add Member
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Member Details Modal Component
function MemberDetailsModal({
  member,
  onClose
}: {
  member: FamilyMember;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-lg max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {RELATIONSHIP_LABELS[member.relationship]}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Relationship</p>
              <p className="font-medium">{RELATIONSHIP_LABELS[member.relationship]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Sex</p>
              <p className="font-medium">{SEX_LABELS[member.sex]}</p>
            </div>
          </div>

          {(member.age || member.ageAtDeath) && (
            <div className="grid grid-cols-2 gap-4">
              {member.age && (
                <div>
                  <p className="text-sm text-gray-400">Current Age</p>
                  <p className="font-medium">{member.age} years old</p>
                </div>
              )}
              {member.ageAtDeath && (
                <div>
                  <p className="text-sm text-gray-400">Age at Death</p>
                  <p className="font-medium">{member.ageAtDeath} years old</p>
                </div>
              )}
            </div>
          )}

          {member.conditions.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Known Conditions</p>
              <div className="flex flex-wrap gap-2">
                {member.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-sm text-red-400"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {member.notes && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Notes</p>
              <p className="text-gray-300">{member.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}