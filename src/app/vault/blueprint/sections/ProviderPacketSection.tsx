"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

// Types for the enhanced provider packet
type PacketTemplate = 'comprehensive' | 'focused' | 'followup' | 'urgent' | 'preventive';

type PacketStatus = 'draft' | 'ready' | 'shared' | 'archived';

type ComplianceLevel = 'hipaa' | 'standard' | 'minimal';

interface ProviderPacket {
  id: string;
  template: PacketTemplate;
  status: PacketStatus;
  complianceLevel: ComplianceLevel;
  createdAt: Date;
  updatedAt: Date;
  sharedWith: string[];
  sections: PacketSection[];
  metadata: {
    visitType: string;
    urgency: 'routine' | 'urgent' | 'asap';
    estimatedDuration: number;
    preparationTime: number;
  };
}

interface PacketSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'form' | 'upload' | 'checklist';
  required: boolean;
  completed: boolean;
  data: any;
  aiSuggestions?: string[];
}

// Template configurations
const PACKET_TEMPLATES = {
  comprehensive: {
    name: 'Comprehensive Visit',
    description: 'Full health assessment with detailed preparation',
    sections: [
      'Chief Concern',
      'Medical History',
      'Current Medications',
      'Recent Labs/Vitals',
      'Lifestyle Factors',
      'Goals & Expectations',
      'Preparation Checklist'
    ],
    estimatedTime: 45
  },
  focused: {
    name: 'Focused Consultation',
    description: 'Targeted visit for specific concern',
    sections: [
      'Chief Concern',
      'Relevant History',
      'Current Status',
      'Questions for Provider',
      'Preparation Checklist'
    ],
    estimatedTime: 25
  },
  followup: {
    name: 'Follow-up Visit',
    description: 'Post-treatment or routine follow-up',
    sections: [
      'Progress Update',
      'Current Symptoms',
      'Medication Changes',
      'Questions/Concerns',
      'Preparation Checklist'
    ],
    estimatedTime: 20
  },
  urgent: {
    name: 'Urgent Care',
    description: 'Immediate attention needed',
    sections: [
      'Urgent Concern',
      'Current Symptoms',
      'Immediate Needs',
      'Emergency Contacts',
      'Preparation Checklist'
    ],
    estimatedTime: 15
  },
  preventive: {
    name: 'Preventive Care',
    description: 'Routine screening and prevention',
    sections: [
      'Screening History',
      'Risk Factors',
      'Preventive Goals',
      'Questions',
      'Preparation Checklist'
    ],
    estimatedTime: 30
  }
};

export default function InteractiveProviderPacket() {
  const [currentPacket, setCurrentPacket] = useState<ProviderPacket | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PacketTemplate | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  // Initialize packet from template
  const createPacketFromTemplate = useCallback((template: PacketTemplate): ProviderPacket => {
    const templateConfig = PACKET_TEMPLATES[template];
    const sections: PacketSection[] = templateConfig.sections.map(sectionName => ({
      id: crypto.randomUUID(),
      title: sectionName,
      type: getSectionType(sectionName),
      required: isSectionRequired(sectionName),
      completed: false,
      data: getInitialSectionData(sectionName),
      aiSuggestions: getAISuggestions(sectionName)
    }));

    return {
      id: crypto.randomUUID(),
      template,
      status: 'draft',
      complianceLevel: 'hipaa',
      createdAt: new Date(),
      updatedAt: new Date(),
      sharedWith: [],
      sections,
      metadata: {
        visitType: templateConfig.name,
        urgency: template === 'urgent' ? 'urgent' : 'routine',
        estimatedDuration: templateConfig.estimatedTime,
        preparationTime: 0
      }
    };
  }, []);

  // Helper functions
  const getSectionType = (sectionName: string): PacketSection['type'] => {
    const typeMap: Record<string, PacketSection['type']> = {
      'Chief Concern': 'text',
      'Medical History': 'list',
      'Current Medications': 'list',
      'Recent Labs/Vitals': 'upload',
      'Lifestyle Factors': 'form',
      'Goals & Expectations': 'text',
      'Preparation Checklist': 'checklist',
      'Relevant History': 'list',
      'Current Status': 'form',
      'Questions for Provider': 'list',
      'Progress Update': 'text',
      'Current Symptoms': 'list',
      'Medication Changes': 'list',
      'Questions/Concerns': 'list',
      'Urgent Concern': 'text',
      'Immediate Needs': 'list',
      'Emergency Contacts': 'form',
      'Screening History': 'list',
      'Risk Factors': 'list',
      'Preventive Goals': 'text'
    };
    return typeMap[sectionName] || 'text';
  };

  const isSectionRequired = (sectionName: string): boolean => {
    const requiredSections = [
      'Chief Concern', 'Urgent Concern', 'Current Symptoms',
      'Preparation Checklist', 'Emergency Contacts'
    ];
    return requiredSections.includes(sectionName);
  };

  const getInitialSectionData = (sectionName: string): any => {
    // Initialize with blueprint data where available
    return {};
  };

  const getAISuggestions = (sectionName: string): string[] => {
    const suggestions: Record<string, string[]> = {
      'Chief Concern': [
        'Be specific about when symptoms started',
        'Include severity and frequency',
        'Mention any triggers or patterns'
      ],
      'Preparation Checklist': [
        'Bring insurance card and ID',
        'List of current medications',
        'Recent lab results or test results',
        'Questions you want to ask'
      ]
    };
    return suggestions[sectionName] || [];
  };

  // Handle template selection
  const handleTemplateSelect = (template: PacketTemplate) => {
    const packet = createPacketFromTemplate(template);
    setCurrentPacket(packet);
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  // Update section data
  const updateSection = (sectionId: string, data: any) => {
    if (!currentPacket) return;

    const updatedSections = currentPacket.sections.map(section =>
      section.id === sectionId
        ? { ...section, data, completed: isSectionComplete(section.title, data) }
        : section
    );

    setCurrentPacket({
      ...currentPacket,
      sections: updatedSections,
      updatedAt: new Date()
    });
  };

  // Check if section is complete
  const isSectionComplete = (sectionName: string, data: any): boolean => {
    if (!data) return false;

    switch (sectionName) {
      case 'Preparation Checklist':
        return Array.isArray(data) && data.length > 0;
      case 'Chief Concern':
      case 'Urgent Concern':
        return typeof data === 'string' && data.trim().length > 10;
      default:
        return Object.keys(data).length > 0;
    }
  };

  // Save packet
  const savePacket = async () => {
    if (!currentPacket) return;

    setSaving(true);
    try {
      const response = await fetch('/api/provider-packet-interactive/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPacket)
      });

      if (!response.ok) {
        throw new Error('Failed to save packet');
      }

      const result = await response.json();
      setCurrentPacket(result.packet);
    } catch (error) {
      console.error('Failed to save packet:', error);
    } finally {
      setSaving(false);
    }
  };

  // Download packet as PDF
  const downloadPacket = async () => {
    if (!currentPacket) return;

    setDownloading(true);
    try {
      // First save the packet
      await savePacket();

      // Then trigger download
      const response = await fetch(`/api/provider-packet-interactive/download/${currentPacket.id}`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // In a real implementation, this would trigger a file download
      console.log('PDF download initiated');
    } catch (error) {
      console.error('Failed to download packet:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Share packet
  const sharePacket = async (providerEmail: string) => {
    if (!currentPacket) return;

    try {
      const response = await fetch('/api/provider-packet-interactive/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packetId: currentPacket.id,
          providerEmail,
          providerName: 'Healthcare Provider',
          message: 'Please review this patient preparation packet before our visit.'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to share packet');
      }

      const result = await response.json();
      console.log('Packet shared successfully:', result);
    } catch (error) {
      console.error('Failed to share packet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HIPAA Compliance Banner */}
      <div className="bg-red-900 border-l-4 border-red-500 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-200">
              HIPAA Compliance Required
            </h3>
            <div className="mt-2 text-sm text-red-300">
              <p>This provider packet contains sensitive health information. By proceeding, you acknowledge that:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>All information is encrypted and stored securely</li>
                <li>Data sharing requires explicit consent</li>
                <li>You can revoke access at any time</li>
                <li>Information is retained for 7 years per HIPAA requirements</li>
              </ul>
            </div>
            <div className="mt-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={complianceAccepted}
                  onChange={(e) => setComplianceAccepted(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-red-200">
                  I understand and accept these HIPAA compliance terms
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-400 mb-2">
            Interactive Provider Packet
          </h1>
          <p className="text-gray-400">
            Comprehensive preparation tool for your healthcare visits
          </p>
        </div>

        {/* Template Selector */}
        {showTemplateSelector && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">
              Choose Your Visit Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(PACKET_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => handleTemplateSelect(key as PacketTemplate)}
                  disabled={!complianceAccepted}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    complianceAccepted
                      ? 'border-gray-700 hover:border-pink-500 bg-gray-900 hover:bg-gray-800'
                      : 'border-gray-800 bg-gray-900 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.sections.length} sections</span>
                    <span>{template.estimatedTime} min prep</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Packet Content */}
        {currentPacket && (
          <div className="space-y-6">
            {/* Packet Header */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-pink-400">
                    {PACKET_TEMPLATES[currentPacket.template].name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Created {format(currentPacket.createdAt, 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    currentPacket.status === 'ready' ? 'bg-green-900 text-green-300' :
                    currentPacket.status === 'draft' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-blue-900 text-blue-300'
                  }`}>
                    {currentPacket.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Completion Progress</span>
                  <span>
                    {currentPacket.sections.filter(s => s.completed).length} / {currentPacket.sections.length}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(currentPacket.sections.filter(s => s.completed).length / currentPacket.sections.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={savePacket}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {saving ? 'Saving...' : '💾 Save Draft'}
                </button>
                <button
                  onClick={downloadPacket}
                  disabled={downloading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {downloading ? 'Downloading...' : '📄 Download PDF'}
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  📤 Share with Provider
                </button>
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  🔄 Change Template
                </button>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {currentPacket.sections.map((section) => (
                <PacketSectionComponent
                  key={section.id}
                  section={section}
                  onUpdate={(data) => updateSection(section.id, data)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-pink-400">
                Share Provider Packet
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Share this preparation packet securely with your healthcare provider.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Provider Email
                  </label>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="provider@clinic.com"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (shareEmail) {
                        sharePacket(shareEmail);
                        setShowShareModal(false);
                        setShareEmail('');
                      }
                    }}
                    disabled={!shareEmail}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Send Secure Link
                  </button>
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setShareEmail('');
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Section Component
function PacketSectionComponent({
  section,
  onUpdate
}: {
  section: PacketSection;
  onUpdate: (data: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(section.required);

  return (
    <div className={`bg-gray-900 rounded-xl border-2 transition-colors ${
      section.completed ? 'border-green-500' : section.required ? 'border-red-500' : 'border-gray-700'
    }`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800 rounded-t-xl"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            section.completed ? 'bg-green-500' :
            section.required ? 'bg-red-500' : 'bg-gray-500'
          }`} />
          <h3 className="font-semibold">{section.title}</h3>
          {section.required && (
            <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">Required</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-700">
          {/* AI Suggestions */}
          {section.aiSuggestions && section.aiSuggestions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-400 mb-2">💡 AI Suggestions</h4>
              <ul className="text-sm text-blue-300 space-y-1">
                {section.aiSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section Content Based on Type */}
          <SectionContent section={section} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

// Section Content Component
function SectionContent({
  section,
  onUpdate
}: {
  section: PacketSection;
  onUpdate: (data: any) => void;
}) {
  switch (section.type) {
    case 'text':
      return (
        <textarea
          value={section.data || ''}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder={`Enter details for ${section.title.toLowerCase()}...`}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
          rows={4}
        />
      );

    case 'list':
      return (
        <div className="space-y-2">
          {(section.data || []).map((item: string, idx: number) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newData = [...(section.data || [])];
                  newData[idx] = e.target.value;
                  onUpdate(newData);
                }}
                className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                placeholder="Enter item..."
              />
              <button
                onClick={() => {
                  const newData = (section.data || []).filter((_: any, i: number) => i !== idx);
                  onUpdate(newData);
                }}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate([...(section.data || []), ''])}
            className="text-pink-400 hover:text-pink-300 text-sm"
          >
            + Add Item
          </button>
        </div>
      );

    case 'checklist':
      const checklistItems = [
        'Bring insurance card and ID',
        'List of current medications with dosages',
        'Recent lab results or test results',
        'List of questions for your provider',
        'Medical history summary',
        'Allergy information',
        'Previous treatment records'
      ];

      return (
        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <label key={idx} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={(section.data || []).includes(item)}
                onChange={(e) => {
                  const currentData = section.data || [];
                  if (e.target.checked) {
                    onUpdate([...currentData, item]);
                  } else {
                    onUpdate(currentData.filter((i: string) => i !== item));
                  }
                }}
                className="rounded border-gray-600 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      );

    case 'form':
      return (
        <div className="space-y-4">
          {/* Dynamic form based on section - simplified for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Field 1"
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Field 2"
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
            />
          </div>
        </div>
      );

    case 'upload':
      return (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-pink-400">
                  Upload files
                </span>
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG, PNG up to 10MB each
            </p>
          </div>
        </div>
      );

    default:
      return <div>Unsupported section type</div>;
  }
}