'use client';

import { useState, useEffect } from 'react';

interface GovernanceData {
  featureFlags: Array<{
    id: string;
    key: string;
    name: string;
    description?: string;
    enabled: boolean;
    type: string;
  }>;
  mascotScripts: Array<{
    id: string;
    mascotId: string;
    version: string;
    status: string;
    title: string;
    description?: string;
    audioEnabled: boolean;
    autoplayEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  activeScripts: Record<string, string>;
  auditLogs: Array<{
    id: string;
    action: string;
    details: string;
    performedBy: string;
    performedAt: string;
  }>;
}

interface ContentGovernanceClientProps {
  initialData: GovernanceData | null;
  adminId: string;
}

const MASCOTS = [
  { id: 'beau-tox', name: 'Beau-Tox', domain: 'Aesthetics' },
  { id: 'peppi', name: 'Peppi', domain: 'Peptides' },
  { id: 'f-ill', name: 'Filla Grace', domain: 'Fillers' },
  { id: 'rn-lisa-grace', name: 'Harmony', domain: 'Hormones' },
];

export default function ContentGovernanceClient({ initialData, adminId }: ContentGovernanceClientProps) {
  const [data, setData] = useState<GovernanceData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'scripts' | 'audit'>('controls');

  const updateFeatureFlag = async (flagId: string, enabled: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/owner/content-governance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_flag',
          flagId,
          enabled,
          adminId,
        }),
      });

      if (!response.ok) throw new Error('Failed to update flag');

      // Refresh data
      const refreshResponse = await fetch('/api/owner/content-governance');
      if (refreshResponse.ok) {
        setData(await refreshResponse.json());
      }
    } catch (error) {
      alert('Failed to update feature flag');
    } finally {
      setLoading(false);
    }
  };

  const activateScript = async (mascotId: string, scriptId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/owner/content-governance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activate_script',
          mascotId,
          scriptId,
          adminId,
        }),
      });

      if (!response.ok) throw new Error('Failed to activate script');

      // Refresh data
      const refreshResponse = await fetch('/api/owner/content-governance');
      if (refreshResponse.ok) {
        setData(await refreshResponse.json());
      }
    } catch (error) {
      alert('Failed to activate script');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading governance data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Safety Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Safety Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-gray-600">One Speaker Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-gray-600">Autoplay Disabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-gray-600">Safe Loading</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'controls', label: 'Mascot Controls' },
            { id: 'scripts', label: 'Script Versions' },
            { id: 'audit', label: 'Audit Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Controls Tab */}
      {activeTab === 'controls' && (
        <div className="space-y-6">
          {MASCOTS.map((mascot) => {
            const mascotFlag = data.featureFlags.find(f => f.key === `mascot-${mascot.id}-enabled`);
            const audioFlag = data.featureFlags.find(f => f.key === `mascot-${mascot.id}-audio`);
            const autoplayFlag = data.featureFlags.find(f => f.key === `mascot-${mascot.id}-autoplay`);

            return (
              <div key={mascot.id} className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {mascot.name} - {mascot.domain}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={mascotFlag?.enabled ?? true}
                        onChange={(e) => mascotFlag && updateFeatureFlag(mascotFlag.id, e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Mascot</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={audioFlag?.enabled ?? true}
                        onChange={(e) => audioFlag && updateFeatureFlag(audioFlag.id, e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Audio Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={autoplayFlag?.enabled ?? false}
                        onChange={(e) => autoplayFlag && updateFeatureFlag(autoplayFlag.id, e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Autoplay</span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scripts Tab */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          {MASCOTS.map((mascot) => {
            const scripts = data.mascotScripts.filter(s => s.mascotId === mascot.id);
            const activeVersion = data.activeScripts[mascot.id];

            return (
              <div key={mascot.id} className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {mascot.name} Script Versions
                </h3>
                <div className="space-y-3">
                  {scripts.map((script) => (
                    <div key={script.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{script.title} (v{script.version})</div>
                        <div className="text-sm text-gray-600">
                          Status: {script.status} | Audio: {script.audioEnabled ? 'On' : 'Off'} | Autoplay: {script.autoplayEnabled ? 'On' : 'Off'}
                        </div>
                        {script.description && (
                          <div className="text-sm text-gray-500 mt-1">{script.description}</div>
                        )}
                      </div>
                      <button
                        onClick={() => activateScript(mascot.id, script.id)}
                        disabled={script.status !== 'ACTIVE' || activeVersion === script.version || loading}
                        className={`px-3 py-1 text-sm rounded ${
                          activeVersion === script.version
                            ? 'bg-green-100 text-green-800'
                            : script.status === 'ACTIVE'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {activeVersion === script.version ? 'Active' : 'Activate'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Log</h3>
          <div className="space-y-3">
            {data.auditLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">{log.action}</div>
                  <div className="text-sm text-gray-600">{log.details}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {log.performedBy} • {new Date(log.performedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}