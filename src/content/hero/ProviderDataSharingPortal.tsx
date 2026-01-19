"use client";

import React, { useState } from 'react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

// Provider sharing data types
type SharePermission = {
  id: string;
  category: 'documents' | 'timeline' | 'vitals' | 'medications' | 'appointments';
  label: string;
  description: string;
  enabled: boolean;
  subcategories?: {
    id: string;
    label: string;
    enabled: boolean;
  }[];
};

type ShareLink = {
  id: string;
  providerName: string;
  providerEmail: string;
  specialty: string;
  permissions: string[];
  dateRange: {
    start: string;
    end: string;
  };
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
  shareUrl: string;
};

// Sample data
const defaultPermissions: SharePermission[] = [
  {
    id: 'documents',
    category: 'documents',
    label: 'Medical Documents',
    description: 'Lab results, imaging, visit notes, and discharge summaries',
    enabled: true,
    subcategories: [
      { id: 'lab-results', label: 'Lab Results', enabled: true },
      { id: 'imaging', label: 'Imaging Studies', enabled: true },
      { id: 'visit-notes', label: 'Visit Notes', enabled: true },
      { id: 'discharge', label: 'Discharge Summaries', enabled: false }
    ]
  },
  {
    id: 'timeline',
    category: 'timeline',
    label: 'Health Timeline',
    description: 'Chronological view of health events and milestones',
    enabled: true
  },
  {
    id: 'vitals',
    category: 'vitals',
    label: 'Vital Signs',
    description: 'Blood pressure, weight, heart rate trends',
    enabled: true
  },
  {
    id: 'medications',
    category: 'medications',
    label: 'Medications',
    description: 'Current and past medications with adherence data',
    enabled: false
  },
  {
    id: 'appointments',
    category: 'appointments',
    label: 'Appointment History',
    description: 'Past and upcoming appointments with other providers',
    enabled: false
  }
];

const existingShares: ShareLink[] = [
  {
    id: 'share-1',
    providerName: 'Dr. Michael Torres',
    providerEmail: 'torres@endocrinology.health',
    specialty: 'Endocrinology',
    permissions: ['documents', 'vitals', 'timeline'],
    dateRange: { start: '2024-01-01', end: '2024-12-31' },
    expiresAt: '2024-07-18',
    status: 'active',
    createdAt: '2024-06-18',
    lastAccessed: '2024-06-15',
    accessCount: 12,
    shareUrl: 'https://vault.nopa.health/share/abc123'
  },
  {
    id: 'share-2',
    providerName: 'Regional Imaging Center',
    providerEmail: 'records@regionalimaging.com',
    specialty: 'Radiology',
    permissions: ['documents'],
    dateRange: { start: '2024-06-01', end: '2024-06-30' },
    expiresAt: '2024-06-25',
    status: 'expired',
    createdAt: '2024-06-01',
    lastAccessed: '2024-06-22',
    accessCount: 3,
    shareUrl: 'https://vault.nopa.health/share/def456'
  }
];

export default function ProviderDataSharingPortal() {
  const [permissions, setPermissions] = useState<SharePermission[]>(defaultPermissions);
  const [shares, setShares] = useState<ShareLink[]>(existingShares);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedShare, setSelectedShare] = useState<ShareLink | null>(null);

  // New share form state
  const [newShare, setNewShare] = useState({
    providerName: '',
    providerEmail: '',
    specialty: '',
    expiryDuration: '1month',
    dateRangeStart: format(addMonths(new Date(), -6), 'yyyy-MM-dd'),
    dateRangeEnd: format(new Date(), 'yyyy-MM-dd'),
    customMessage: ''
  });

  const togglePermission = (permissionId: string, subcategoryId?: string) => {
    setPermissions(prev => prev.map(perm => {
      if (perm.id === permissionId) {
        if (subcategoryId && perm.subcategories) {
          return {
            ...perm,
            subcategories: perm.subcategories.map(sub => 
              sub.id === subcategoryId ? { ...sub, enabled: !sub.enabled } : sub
            )
          };
        } else {
          return { ...perm, enabled: !perm.enabled };
        }
      }
      return perm;
    }));
  };

  const getExpiryDate = (duration: string) => {
    const now = new Date();
    switch (duration) {
      case '1day': return addDays(now, 1);
      case '1week': return addWeeks(now, 1);
      case '1month': return addMonths(now, 1);
      case '3months': return addMonths(now, 3);
      case '6months': return addMonths(now, 6);
      case '1year': return addMonths(now, 12);
      default: return addMonths(now, 1);
    }
  };

  const createShareLink = () => {
    const enabledPermissions = permissions.filter(p => p.enabled).map(p => p.id);
    
    if (enabledPermissions.length === 0) {
      alert('Please select at least one permission to share.');
      return;
    }

    const newShareLink: ShareLink = {
      id: `share-${Date.now()}`,
      providerName: newShare.providerName,
      providerEmail: newShare.providerEmail,
      specialty: newShare.specialty,
      permissions: enabledPermissions,
      dateRange: {
        start: newShare.dateRangeStart,
        end: newShare.dateRangeEnd
      },
      expiresAt: format(getExpiryDate(newShare.expiryDuration), 'yyyy-MM-dd'),
      status: 'active',
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      accessCount: 0,
      shareUrl: `https://vault.nopa.health/share/${Math.random().toString(36).substring(7)}`
    };

    setShares(prev => [newShareLink, ...prev]);
    setShowCreateForm(false);
    
    // Reset form
    setNewShare({
      providerName: '',
      providerEmail: '',
      specialty: '',
      expiryDuration: '1month',
      dateRangeStart: format(addMonths(new Date(), -6), 'yyyy-MM-dd'),
      dateRangeEnd: format(new Date(), 'yyyy-MM-dd'),
      customMessage: ''
    });
  };

  const revokeShareLink = (shareId: string) => {
    setShares(prev => prev.map(share => 
      share.id === shareId ? { ...share, status: 'revoked' } : share
    ));
  };

  const getStatusColor = (status: ShareLink['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'expired': return 'text-yellow-400 bg-yellow-500/20';
      case 'revoked': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPermissionIcon = (category: SharePermission['category']) => {
    const icons = {
      documents: '📋',
      timeline: '📅',
      vitals: '💓',
      medications: '💊',
      appointments: '🏥'
    };
    return icons[category];
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Provider Data Sharing Portal
          </h1>
          <p className="text-gray-400 mb-6">
            Securely share your health data with healthcare providers with granular control and time limits
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-500/20">
              <div className="text-2xl font-bold text-pink-400">{shares.filter(s => s.status === 'active').length}</div>
              <p className="text-sm text-gray-400">Active Shares</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {shares.reduce((sum, share) => sum + share.accessCount, 0)}
              </div>
              <p className="text-sm text-gray-400">Total Access Count</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">
                {new Set(shares.map(s => s.specialty)).size}
              </div>
              <p className="text-sm text-gray-400">Specialties</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">
                {shares.filter(s => s.status === 'expired').length}
              </div>
              <p className="text-sm text-gray-400">Expired Links</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
          >
            + Create New Share Link
          </button>
        </div>

        {/* Create Share Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Provider Share Link</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Provider Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Provider Name *</label>
                    <input
                      type="text"
                      value={newShare.providerName}
                      onChange={(e) => setNewShare(prev => ({ ...prev, providerName: e.target.value }))}
                      className="w-full bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Specialty</label>
                    <input
                      type="text"
                      value={newShare.specialty}
                      onChange={(e) => setNewShare(prev => ({ ...prev, specialty: e.target.value }))}
                      className="w-full bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                      placeholder="Cardiology, Endocrinology, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Provider Email *</label>
                  <input
                    type="email"
                    value={newShare.providerEmail}
                    onChange={(e) => setNewShare(prev => ({ ...prev, providerEmail: e.target.value }))}
                    className="w-full bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                    placeholder="provider@healthcare.com"
                  />
                </div>

                {/* Access Permissions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Data Access Permissions</h3>
                  <div className="space-y-4">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="bg-black/20 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getPermissionIcon(permission.category)}</span>
                            <div>
                              <h4 className="font-medium text-white">{permission.label}</h4>
                              <p className="text-sm text-gray-400">{permission.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={permission.enabled}
                              onChange={() => togglePermission(permission.id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                          </label>
                        </div>

                        {/* Subcategories */}
                        {permission.enabled && permission.subcategories && (
                          <div className="ml-8 mt-3 space-y-2">
                            {permission.subcategories.map((sub) => (
                              <div key={sub.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">{sub.label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={sub.enabled}
                                    onChange={() => togglePermission(permission.id, sub.id)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Data Date Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newShare.dateRangeStart}
                        onChange={(e) => setNewShare(prev => ({ ...prev, dateRangeStart: e.target.value }))}
                        className="w-full bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">End Date</label>
                      <input
                        type="date"
                        value={newShare.dateRangeEnd}
                        onChange={(e) => setNewShare(prev => ({ ...prev, dateRangeEnd: e.target.value }))}
                        className="w-full bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Link Expiry */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Link Expires In</label>
                  <select
                    value={newShare.expiryDuration}
                    onChange={(e) => setNewShare(prev => ({ ...prev, expiryDuration: e.target.value }))}
                    className="w-full bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                  >
                    <option value="1day">1 Day</option>
                    <option value="1week">1 Week</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Custom Message (Optional)</label>
                  <textarea
                    value={newShare.customMessage}
                    onChange={(e) => setNewShare(prev => ({ ...prev, customMessage: e.target.value }))}
                    rows={3}
                    className="w-full bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                    placeholder="Add a personal message for the provider..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-400 rounded-lg hover:border-gray-500 hover:text-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createShareLink}
                    disabled={!newShare.providerName || !newShare.providerEmail}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Share Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Shares List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Shared Access Links</h2>
          
          {shares.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Share Links Created</h3>
              <p className="text-gray-400 mb-6">Start collaborating with your healthcare providers by creating secure share links.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                Create Your First Share Link
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {shares.map((share) => (
                <div key={share.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{share.providerName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(share.status)}`}>
                          {share.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-1">{share.specialty}</p>
                      <p className="text-gray-400 text-sm">{share.providerEmail}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedShare(selectedShare?.id === share.id ? null : share)}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition"
                      >
                        {selectedShare?.id === share.id ? 'Hide' : 'Details'}
                      </button>
                      {share.status === 'active' && (
                        <button
                          onClick={() => revokeShareLink(share.id)}
                          className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-sm hover:bg-red-500/30 transition"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-sm text-gray-400 mb-1">Access Count</div>
                      <div className="text-lg font-semibold text-white">{share.accessCount}</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-sm text-gray-400 mb-1">Last Accessed</div>
                      <div className="text-lg font-semibold text-white">
                        {share.lastAccessed ? format(new Date(share.lastAccessed), 'MMM dd') : 'Never'}
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-sm text-gray-400 mb-1">Expires</div>
                      <div className="text-lg font-semibold text-white">{format(new Date(share.expiresAt), 'MMM dd, yyyy')}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {share.permissions.map((perm) => {
                      const permData = permissions.find(p => p.id === perm);
                      return permData ? (
                        <span key={perm} className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full text-sm">
                          {getPermissionIcon(permData.category)} {permData.label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  {selectedShare?.id === share.id && (
                    <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-700">
                      <h4 className="font-semibold text-white mb-3">Share Link Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Data Range:</span>
                          <p className="text-white">{format(new Date(share.dateRange.start), 'MMM dd, yyyy')} - {format(new Date(share.dateRange.end), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Created:</span>
                          <p className="text-white">{format(new Date(share.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-400">Share URL:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-black/50 text-green-400 px-3 py-2 rounded text-sm">{share.shareUrl}</code>
                          <button className="px-3 py-2 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded text-sm hover:bg-pink-500/30 transition">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}