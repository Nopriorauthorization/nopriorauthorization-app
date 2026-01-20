"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Family Tree Types
type FamilyMember = {
  id: string;
  name: string;
  relationship: 'self' | 'parent' | 'child' | 'sibling' | 'grandparent' | 'grandchild' | 'aunt' | 'uncle' | 'cousin' | 'spouse' | 'other';
  birthYear?: number;
  healthNotes?: string;
  photo?: string;
  icon?: string;
  position: { x: number; y: number };
  generation: number;
  isExpanded: boolean;
  children: string[];
  parents: string[];
  spouse?: string;
  healthInsights?: {
    geneticRisks: string[];
    preventiveCare: string[];
    familyPatterns: string[];
  };
};

type TreeNode = {
  member: FamilyMember;
  children: TreeNode[];
  spouse?: TreeNode;
};

type AddMemberFlow = {
  step: 'relationship' | 'details' | 'confirm';
  relationship?: FamilyMember['relationship'];
  tempMember?: Partial<FamilyMember>;
};

// Mock family data with health insights
const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'self',
    name: 'You',
    relationship: 'self',
    birthYear: 1990,
    position: { x: 400, y: 300 },
    generation: 0,
    isExpanded: true,
    children: [],
    parents: ['father', 'mother'],
    healthNotes: 'Focus on preventive care and regular check-ups',
    healthInsights: {
      geneticRisks: ['Family history of heart disease', 'Increased risk for certain cancers'],
      preventiveCare: ['Annual cardiovascular screening', 'Regular cancer screenings', 'Genetic counseling'],
      familyPatterns: ['Longevity in maternal line', 'Autoimmune conditions in paternal line']
    }
  },
  {
    id: 'father',
    name: 'Dad',
    relationship: 'parent',
    birthYear: 1960,
    position: { x: 300, y: 150 },
    generation: -1,
    isExpanded: false,
    children: ['self', 'sibling1'],
    parents: ['grandfather-pat', 'grandmother-pat'],
    healthNotes: 'Heart disease at age 55, manages with medication',
    healthInsights: {
      geneticRisks: ['Cardiovascular disease', 'Type 2 diabetes'],
      preventiveCare: ['Regular cardiology visits', 'Blood pressure monitoring', 'Cholesterol management'],
      familyPatterns: ['Early onset heart disease', 'Diabetes in multiple generations']
    }
  },
  {
    id: 'mother',
    name: 'Mom',
    relationship: 'parent',
    birthYear: 1965,
    position: { x: 500, y: 150 },
    generation: -1,
    isExpanded: false,
    children: ['self', 'sibling1'],
    parents: ['grandfather-mat', 'grandmother-mat'],
    healthNotes: 'Breast cancer survivor, excellent health overall',
    healthInsights: {
      geneticRisks: ['Breast cancer', 'Osteoporosis'],
      preventiveCare: ['Annual mammograms', 'Bone density scans', 'Regular wellness visits'],
      familyPatterns: ['Strong maternal health', 'Longevity patterns']
    }
  },
  {
    id: 'sibling1',
    name: 'Sister',
    relationship: 'sibling',
    birthYear: 1992,
    position: { x: 600, y: 300 },
    generation: 0,
    isExpanded: false,
    children: ['niece1'],
    parents: ['father', 'mother'],
    healthNotes: 'Healthy lifestyle, focuses on fitness',
    healthInsights: {
      geneticRisks: ['Lower risk profile', 'Family cancer history'],
      preventiveCare: ['Regular health screenings', 'Fitness tracking'],
      familyPatterns: ['Healthy lifestyle choices', 'Preventive care focus']
    }
  },
  {
    id: 'grandfather-pat',
    name: 'Grandpa (Pat)',
    relationship: 'grandparent',
    birthYear: 1935,
    position: { x: 200, y: 50 },
    generation: -2,
    isExpanded: false,
    children: ['father', 'uncle1'],
    parents: [],
    healthNotes: 'Lived to 85, heart disease in later years',
    healthInsights: {
      geneticRisks: ['Cardiovascular disease', 'Longevity factors'],
      preventiveCare: ['Heart health monitoring', 'Regular check-ups'],
      familyPatterns: ['Long paternal lifespan', 'Heart disease patterns']
    }
  },
  {
    id: 'grandmother-pat',
    name: 'Grandma (Pat)',
    relationship: 'grandparent',
    birthYear: 1940,
    position: { x: 400, y: 50 },
    generation: -2,
    isExpanded: false,
    children: ['father', 'uncle1'],
    parents: [],
    healthNotes: 'Excellent health until age 80, natural causes',
    healthInsights: {
      geneticRisks: ['Age-related conditions', 'Longevity genes'],
      preventiveCare: ['Regular health maintenance', 'Preventive screenings'],
      familyPatterns: ['Maternal longevity', 'Healthy aging']
    }
  }
];

const relationshipColors = {
  self: 'from-purple-500 to-purple-600',
  parent: 'from-blue-500 to-blue-600',
  child: 'from-green-500 to-green-600',
  sibling: 'from-orange-500 to-orange-600',
  grandparent: 'from-indigo-500 to-indigo-600',
  grandchild: 'from-pink-500 to-pink-600',
  spouse: 'from-red-500 to-red-600',
  other: 'from-gray-500 to-gray-600'
};

const relationshipIcons = {
  self: '👤',
  parent: '👨‍👩‍👧‍👦',
  child: '👶',
  sibling: '👫',
  grandparent: '👴',
  grandchild: '🧒',
  spouse: '💕',
  other: '👥'
};

export default function FamilyTree() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberFlow, setAddMemberFlow] = useState<AddMemberFlow>({ step: 'relationship' });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMemberClick = useCallback((member: FamilyMember) => {
    setSelectedMember(member);
  }, []);

  const handleExpandCollapse = useCallback((memberId: string) => {
    setFamilyMembers(prev => prev.map(member =>
      member.id === memberId
        ? { ...member, isExpanded: !member.isExpanded }
        : member
    ));
  }, []);

  const handleAddMember = useCallback(() => {
    setIsAddingMember(true);
    setAddMemberFlow({ step: 'relationship' });
  }, []);

  const handleRelationshipSelect = useCallback((relationship: FamilyMember['relationship']) => {
    setAddMemberFlow({
      step: 'details',
      relationship,
      tempMember: {
        id: `temp-${Date.now()}`,
        name: '',
        relationship,
        position: { x: 400, y: 300 },
        generation: 0,
        isExpanded: false,
        children: [],
        parents: []
      }
    });
  }, []);

  const handleMemberSubmit = useCallback(() => {
    if (addMemberFlow.tempMember) {
      const newMember: FamilyMember = {
        ...addMemberFlow.tempMember,
        id: `member-${Date.now()}`,
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 + 150
        }
      } as FamilyMember;

      setFamilyMembers(prev => [...prev, newMember]);
      setIsAddingMember(false);
      setAddMemberFlow({ step: 'relationship' });
    }
  }, [addMemberFlow]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewBox.x, y: e.clientY - viewBox.y });
    }
  }, [viewBox]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setViewBox(prev => ({ ...prev, x: newX, y: newY }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    familyMembers.forEach(member => {
      // Parent-child connections
      member.children.forEach(childId => {
        const child = familyMembers.find(m => m.id === childId);
        if (child) {
          connections.push(
            <line
              key={`${member.id}-${child.id}`}
              x1={member.position.x}
              y1={member.position.y + 30}
              x2={child.position.x}
              y2={child.position.y - 30}
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="transition-all duration-300"
            />
          );
        }
      });

      // Spouse connections
      if (member.spouse) {
        const spouse = familyMembers.find(m => m.id === member.spouse);
        if (spouse) {
          connections.push(
            <line
              key={`${member.id}-spouse-${spouse.id}`}
              x1={member.position.x + 30}
              y1={member.position.y}
              x2={spouse.position.x - 30}
              y2={spouse.position.y}
              stroke="#ec4899"
              strokeWidth="3"
              className="transition-all duration-300"
            />
          );
        }
      }
    });

    return connections;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Family Tree
              </h1>
              <p className="text-gray-600 mt-1">The heart of your health story</p>
            </div>
            <button
              onClick={handleAddMember}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              + Add Family Member
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tree Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Family Connections</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleZoom(-0.1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      🔍-
                    </button>
                    <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={() => handleZoom(0.1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      🔍+
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative h-96 overflow-hidden">
                <svg
                  ref={svgRef}
                  viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                  className="w-full h-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                >
                  {/* Background pattern */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Connections */}
                  {renderConnections()}

                  {/* Family Members */}
                  {familyMembers.map((member) => (
                    <g key={member.id} className="cursor-pointer">
                      {/* Member Node */}
                      <circle
                        cx={member.position.x}
                        cy={member.position.y}
                        r="35"
                        className={`fill-current transition-all duration-300 hover:scale-110 ${
                          selectedMember?.id === member.id ? 'drop-shadow-lg' : ''
                        }`}
                        style={{
                          fill: `url(#gradient-${member.relationship})`,
                          filter: selectedMember?.id === member.id ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
                        }}
                        onClick={() => handleMemberClick(member)}
                      />

                      {/* Gradient definitions */}
                      <defs>
                        <radialGradient id={`gradient-${member.relationship}`} cx="50%" cy="30%">
                          <stop offset="0%" stopColor={relationshipColors[member.relationship].split(' ')[0].replace('from-', '')} stopOpacity="1" />
                          <stop offset="100%" stopColor={relationshipColors[member.relationship].split(' ')[1].replace('to-', '')} stopOpacity="0.8" />
                        </radialGradient>
                      </defs>

                      {/* Member Icon */}
                      <text
                        x={member.position.x}
                        y={member.position.y + 5}
                        textAnchor="middle"
                        className="text-2xl pointer-events-none select-none"
                        onClick={() => handleMemberClick(member)}
                      >
                        {relationshipIcons[member.relationship]}
                      </text>

                      {/* Member Name */}
                      <text
                        x={member.position.x}
                        y={member.position.y + 55}
                        textAnchor="middle"
                        className="text-sm font-medium fill-gray-700 pointer-events-none select-none"
                      >
                        {member.name}
                      </text>

                      {/* Expand/Collapse Button */}
                      {(member.children.length > 0 || member.parents.length > 0) && (
                        <circle
                          cx={member.position.x + 25}
                          cy={member.position.y - 25}
                          r="12"
                          fill="white"
                          stroke="#6366f1"
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-blue-50 transition-colors"
                          onClick={() => handleExpandCollapse(member.id)}
                        />
                      )}

                      {(member.children.length > 0 || member.parents.length > 0) && (
                        <text
                          x={member.position.x + 25}
                          y={member.position.y - 20}
                          textAnchor="middle"
                          className="text-xs font-bold fill-blue-600 pointer-events-none select-none cursor-pointer"
                          onClick={() => handleExpandCollapse(member.id)}
                        >
                          {member.isExpanded ? '−' : '+'}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Member Details Panel */}
          <div className="lg:col-span-1">
            {selectedMember ? (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${relationshipColors[selectedMember.relationship]} flex items-center justify-center text-3xl mb-3`}>
                    {relationshipIcons[selectedMember.relationship]}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedMember.name}</h3>
                  <p className="text-gray-600 capitalize">{selectedMember.relationship}</p>
                  {selectedMember.birthYear && (
                    <p className="text-sm text-gray-500">Born {selectedMember.birthYear}</p>
                  )}
                </div>

                {selectedMember.healthInsights && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">🧬 Genetic Insights</h4>
                      <div className="space-y-1">
                        {selectedMember.healthInsights.geneticRisks.map((risk, idx) => (
                          <div key={idx} className="text-sm text-gray-600 bg-purple-50 rounded-lg p-2">
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">🛡️ Preventive Care</h4>
                      <div className="space-y-1">
                        {selectedMember.healthInsights.preventiveCare.map((care, idx) => (
                          <div key={idx} className="text-sm text-gray-600 bg-blue-50 rounded-lg p-2">
                            {care}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">📈 Family Patterns</h4>
                      <div className="space-y-1">
                        {selectedMember.healthInsights.familyPatterns.map((pattern, idx) => (
                          <div key={idx} className="text-sm text-gray-600 bg-green-50 rounded-lg p-2">
                            {pattern}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                  Edit Details
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                <div className="text-6xl mb-4">👆</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Family Member</h3>
                <p className="text-gray-600 text-sm">
                  Click on anyone in your family tree to see their health insights and story.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add Family Member</h2>
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {addMemberFlow.step === 'relationship' && (
                <div>
                  <p className="text-gray-600 mb-6">
                    Who would you like to add to your family tree? You can always come back later to add more details.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(relationshipIcons).map(([relationship, icon]) => (
                      <button
                        key={relationship}
                        onClick={() => handleRelationshipSelect(relationship as FamilyMember['relationship'])}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                      >
                        <div className="text-2xl mb-2">{icon}</div>
                        <div className="text-sm font-medium capitalize">{relationship}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {addMemberFlow.step === 'details' && addMemberFlow.tempMember && (
                <div>
                  <p className="text-gray-600 mb-6">
                    Tell us a bit about them. Even partial information helps build your health story.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Their Name
                      </label>
                      <input
                        type="text"
                        placeholder="First name or nickname"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        value={addMemberFlow.tempMember.name || ''}
                        onChange={(e) => setAddMemberFlow(prev => ({
                          ...prev,
                          tempMember: { ...prev.tempMember!, name: e.target.value }
                        }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birth Year (optional)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 1985"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        value={addMemberFlow.tempMember.birthYear || ''}
                        onChange={(e) => setAddMemberFlow(prev => ({
                          ...prev,
                          tempMember: { ...prev.tempMember!, birthYear: parseInt(e.target.value) || undefined }
                        }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Any health notes? (optional)
                      </label>
                      <textarea
                        placeholder="Share what you know about their health journey..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                        rows={3}
                        value={addMemberFlow.tempMember.healthNotes || ''}
                        onChange={(e) => setAddMemberFlow(prev => ({
                          ...prev,
                          tempMember: { ...prev.tempMember!, healthNotes: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setAddMemberFlow({ step: 'relationship' })}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleMemberSubmit}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    >
                      Add to Tree
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}