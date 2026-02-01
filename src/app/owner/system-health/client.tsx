'use client';
import { useState, useEffect } from 'react';

interface SystemHealthData {
  services: {
    api: ServiceStatus;
    auth: ServiceStatus;
    vault: ServiceStatus;
    blueprint: ServiceStatus;
    labDecoder: ServiceStatus;
    stripe: ServiceStatus;
  };
  featureFlags: {
    mascotControls: FeatureFlag;
    audioModes: FeatureFlag;
    exports: FeatureFlag;
    signups: FeatureFlag;
    readOnly: FeatureFlag;
  };
  mascotControls: {
    individualMascots: MascotControl[];
    singleSpeakerEnforcement: boolean;
    lastReset: string | null;
  };
  auditLogs: AuditLogEntry[];
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  message: string;
  latency?: number;
  lastChecked: string;
}

interface FeatureFlag {
  enabled: boolean;
  name: string;
  description: string;
  lastChanged?: string;
  changedBy?: string;
}

interface MascotControl {
  id: string;
  name: string;
  enabled: boolean;
  lastChanged?: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

function SystemHealthClient({ admin }: { admin: AdminUser }) {
  const [data, setData] = useState<SystemHealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/owner/system-health', {
        headers: {
          'x-admin-user': admin.id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch system health data");
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (flagKey: string, reason: string = 'Emergency toggle') => {
    try {
      const response = await fetch('/api/owner/system-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': admin.id,
        },
        body: JSON.stringify({
          action: 'toggle-feature',
          target: flagKey,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle feature');
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Toggle error:', err);
      alert('Failed to toggle feature');
    }
  };

  const handleMascotToggle = async (mascotId: string, reason: string = 'Mascot control toggle') => {
    try {
      const response = await fetch('/api/owner/system-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': admin.id,
        },
        body: JSON.stringify({
          action: 'toggle-mascot',
          target: mascotId,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle mascot');
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Mascot toggle error:', err);
      alert('Failed to toggle mascot');
    }
  };

  const handleResetMascots = async (reason: string = 'Emergency mascot reset') => {
    if (!confirm('Are you sure you want to reset all mascots to enabled state? This action will be logged.')) {
      return;
    }

    try {
      const response = await fetch('/api/owner/system-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': admin.id,
        },
        body: JSON.stringify({
          action: 'reset-mascots',
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset mascots');
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Reset error:', err);
      alert('Failed to reset mascots');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading system health data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <div className="text-2xl mb-4">⚠️</div>
          <div className="text-lg font-semibold">System Health Check Failed</div>
          <div className="text-sm text-gray-400 mt-2">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">System Health Control</h1>
          <p className="mt-2 text-gray-400">Monitor system status and manage emergency controls</p>
        </div>

        <div className="space-y-8">
          {/* System Health Status */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">System Health Status</h2>
            {data?.services ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data.services).map(([service, status]) => (
                  <ServiceStatusCard key={service} service={service} status={status} />
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Loading system status...</div>
            )}
          </div>

          {/* Emergency Feature Toggles */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Emergency Feature Toggles</h2>
            {data?.featureFlags ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data.featureFlags).map(([key, flag]) => (
                  <FeatureToggleCard key={key} flagKey={key} flag={flag} onToggle={handleToggle} />
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Loading feature flags...</div>
            )}
          </div>

          {/* Mascot Safety Controls */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Mascot Safety Controls</h2>
            {data?.mascotControls ? (
              <div className="space-y-6">
                {/* Single Speaker Enforcement */}
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">Single Speaker Enforcement</h3>
                    <p className="text-sm text-gray-400">Only one mascot can speak at a time</p>
                  </div>
                  <ToggleSwitch
                    enabled={data.mascotControls.singleSpeakerEnforcement}
                    onChange={() => handleToggle('single-speaker-enforcement')}
                  />
                </div>

                {/* Individual Mascot Controls */}
                <div>
                  <h3 className="font-medium text-white mb-4">Individual Mascot Controls</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.mascotControls.individualMascots.map((mascot) => (
                      <MascotControlCard key={mascot.id} mascot={mascot} onToggle={handleMascotToggle} />
                    ))}
                  </div>
                </div>

                {/* Reset All Mascots */}
                <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-400">Emergency Mascot Reset</h3>
                    <p className="text-sm text-gray-400">
                      Reset all mascots to default state. Last reset: {data.mascotControls.lastReset || 'Never'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleResetMascots()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Loading mascot controls...</div>
            )}
          </div>

          {/* Audit Log */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Audit Log</h2>
            {data?.auditLogs && data.auditLogs.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.auditLogs.map((log) => (
                  <AuditLogEntry key={log.id} entry={log} />
                ))}
              </div>
            ) : (
              <div className="text-gray-400">No recent audit entries</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceStatusCard({ service, status }: { service: string; status: ServiceStatus }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'degraded': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'unhealthy': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'unhealthy': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor(status.status)}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white capitalize">{service.replace('-', ' ')}</h3>
        <span className="text-lg">{getStatusIcon(status.status)}</span>
      </div>
      <p className="text-sm text-gray-300 mb-2">{status.message}</p>
      {status.latency && (
        <p className="text-xs text-gray-400">{status.latency}ms latency</p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Last checked: {new Date(status.lastChecked).toLocaleString()}
      </p>
    </div>
  );
}

function FeatureToggleCard({ flagKey, flag, onToggle }: { flagKey: string; flag: FeatureFlag; onToggle: (key: string) => void }) {
  return (
    <div className="p-4 bg-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white">{flag.name}</h3>
        <ToggleSwitch
          enabled={flag.enabled}
          onChange={() => onToggle(flagKey)}
        />
      </div>
      <p className="text-sm text-gray-400 mb-2">{flag.description}</p>
      {flag.lastChanged && (
        <p className="text-xs text-gray-500">
          Last changed: {new Date(flag.lastChanged).toLocaleString()}
          {flag.changedBy && ` by ${flag.changedBy}`}
        </p>
      )}
    </div>
  );
}

function MascotControlCard({ mascot, onToggle }: { mascot: MascotControl; onToggle: (id: string) => void }) {
  return (
    <div className="p-4 bg-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white">{mascot.name}</h3>
        <ToggleSwitch
          enabled={mascot.enabled}
          onChange={() => onToggle(mascot.id)}
        />
      </div>
      {mascot.lastChanged && (
        <p className="text-xs text-gray-500">
          Last changed: {new Date(mascot.lastChanged).toLocaleString()}
        </p>
      )}
    </div>
  );
}

function AuditLogEntry({ entry }: { entry: AuditLogEntry }) {
  return (
    <div className="p-3 bg-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-white">{entry.action}</span>
        <span className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</span>
      </div>
      <p className="text-sm text-gray-300">{entry.details}</p>
      <p className="text-xs text-gray-500">by {entry.actor}</p>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-green-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default SystemHealthClient;