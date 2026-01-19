"use client";

import React from 'react';

// Health journey node types
type JourneyNode = {
  id: string;
  type: 'condition' | 'treatment' | 'outcome' | 'decision' | 'provider';
  title: string;
  description: string;
  status: 'active' | 'completed' | 'planned' | 'on-hold';
  date: string;
  connections: string[];
  position: { x: number; y: number };
  details?: {
    provider?: string;
    duration?: string;
    effectiveness?: 'high' | 'medium' | 'low';
    sideEffects?: string[];
    notes?: string;
  };
};

// Health journey connections
type Connection = {
  from: string;
  to: string;
  type: 'leads-to' | 'influences' | 'requires' | 'alternative';
  strength: 'strong' | 'medium' | 'weak';
};

// Sample health journey data
const journeyNodes: JourneyNode[] = [
  {
    id: 'initial-symptoms',
    type: 'condition',
    title: 'Initial Symptoms',
    description: 'Fatigue, weight gain, irregular periods',
    status: 'completed',
    date: '2024-01-15',
    connections: ['first-consult'],
    position: { x: 100, y: 200 },
    details: {
      notes: 'Symptoms persisted for 3+ months before seeking care'
    }
  },
  {
    id: 'first-consult',
    type: 'provider',
    title: 'Primary Care Visit',
    description: 'Initial evaluation with Dr. Chen',
    status: 'completed',
    date: '2024-02-01',
    connections: ['lab-workup', 'lifestyle-changes'],
    position: { x: 300, y: 200 },
    details: {
      provider: 'Dr. Sarah Chen, MD',
      duration: '45 minutes'
    }
  },
  {
    id: 'lab-workup',
    type: 'treatment',
    title: 'Comprehensive Labs',
    description: 'HbA1c, thyroid panel, hormone levels',
    status: 'completed',
    date: '2024-02-05',
    connections: ['diabetes-diagnosis', 'hormone-issues'],
    position: { x: 500, y: 150 },
    details: {
      effectiveness: 'high',
      notes: 'Revealed multiple metabolic issues'
    }
  },
  {
    id: 'lifestyle-changes',
    type: 'treatment',
    title: 'Lifestyle Modifications',
    description: 'Diet changes, exercise plan, stress management',
    status: 'active',
    date: '2024-02-08',
    connections: ['weight-loss', 'energy-improvement'],
    position: { x: 300, y: 350 },
    details: {
      effectiveness: 'medium',
      duration: 'Ongoing',
      notes: 'Gradual implementation with mixed success'
    }
  },
  {
    id: 'diabetes-diagnosis',
    type: 'condition',
    title: 'Pre-diabetes Diagnosis',
    description: 'HbA1c 6.1% - borderline diabetic',
    status: 'active',
    date: '2024-02-10',
    connections: ['metformin-start', 'endocrinologist'],
    position: { x: 700, y: 100 },
    details: {
      notes: 'Early intervention opportunity'
    }
  },
  {
    id: 'hormone-issues',
    type: 'condition',
    title: 'Hormonal Imbalance',
    description: 'Low testosterone, irregular estrogen',
    status: 'active',
    date: '2024-02-10',
    connections: ['hormone-therapy', 'nutrition-counseling'],
    position: { x: 700, y: 250 },
    details: {
      notes: 'Contributing to fatigue and weight gain'
    }
  },
  {
    id: 'metformin-start',
    type: 'treatment',
    title: 'Metformin 500mg',
    description: 'Started diabetes management',
    status: 'active',
    date: '2024-05-25',
    connections: ['blood-sugar-control'],
    position: { x: 900, y: 100 },
    details: {
      provider: 'Dr. Sarah Chen, MD',
      effectiveness: 'high',
      duration: '3+ months',
      sideEffects: ['Mild GI upset initially']
    }
  },
  {
    id: 'endocrinologist',
    type: 'provider',
    title: 'Endocrine Specialist',
    description: 'Referral to Dr. Torres for diabetes management',
    status: 'active',
    date: '2024-06-08',
    connections: ['advanced-monitoring'],
    position: { x: 900, y: 200 },
    details: {
      provider: 'Dr. Michael Torres, Endocrinologist',
      notes: 'Ongoing quarterly follow-ups'
    }
  },
  {
    id: 'weight-loss',
    type: 'outcome',
    title: 'Weight Loss Success',
    description: '8 lbs lost, reached target weight',
    status: 'completed',
    date: '2024-06-15',
    connections: ['improved-confidence'],
    position: { x: 500, y: 400 },
    details: {
      effectiveness: 'high',
      notes: 'Sustainable lifestyle changes working'
    }
  },
  {
    id: 'blood-sugar-control',
    type: 'outcome',
    title: 'Improved Glucose Control',
    description: 'HbA1c dropped to 5.8%',
    status: 'completed',
    date: '2024-06-10',
    connections: ['reduced-diabetes-risk'],
    position: { x: 1100, y: 150 },
    details: {
      effectiveness: 'high',
      notes: 'Excellent response to treatment'
    }
  }
];

const connections: Connection[] = [
  { from: 'initial-symptoms', to: 'first-consult', type: 'leads-to', strength: 'strong' },
  { from: 'first-consult', to: 'lab-workup', type: 'requires', strength: 'strong' },
  { from: 'first-consult', to: 'lifestyle-changes', type: 'leads-to', strength: 'medium' },
  { from: 'lab-workup', to: 'diabetes-diagnosis', type: 'leads-to', strength: 'strong' },
  { from: 'lab-workup', to: 'hormone-issues', type: 'leads-to', strength: 'strong' },
  { from: 'diabetes-diagnosis', to: 'metformin-start', type: 'leads-to', strength: 'strong' },
  { from: 'diabetes-diagnosis', to: 'endocrinologist', type: 'requires', strength: 'medium' },
  { from: 'lifestyle-changes', to: 'weight-loss', type: 'influences', strength: 'strong' },
  { from: 'metformin-start', to: 'blood-sugar-control', type: 'leads-to', strength: 'strong' },
];

const getNodeColor = (type: JourneyNode['type'], status: JourneyNode['status']) => {
  const baseColors = {
    condition: 'from-red-500/20 to-orange-500/20 border-red-500/50',
    treatment: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
    outcome: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
    decision: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
    provider: 'from-purple-500/20 to-pink-500/20 border-purple-500/50'
  };

  if (status === 'completed') {
    return baseColors[type] + ' opacity-80';
  }
  if (status === 'planned') {
    return baseColors[type] + ' opacity-60 border-dashed';
  }
  return baseColors[type];
};

const getNodeIcon = (type: JourneyNode['type']) => {
  const icons = {
    condition: '🔍',
    treatment: '💊',
    outcome: '✨',
    decision: '🤔',
    provider: '👩‍⚕️'
  };
  return icons[type];
};

const getConnectionStyle = (connection: Connection) => {
  const styles = {
    'leads-to': { color: '#ec4899', dashArray: 'none' },
    'influences': { color: '#8b5cf6', dashArray: '5,5' },
    'requires': { color: '#10b981', dashArray: 'none' },
    'alternative': { color: '#f59e0b', dashArray: '10,5' }
  };
  return styles[connection.type];
};

export default function InteractiveHealthJourneyMap() {
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [viewBox, setViewBox] = React.useState({ x: 0, y: 0, width: 1400, height: 600 });

  const selectedNodeData = selectedNode ? journeyNodes.find(n => n.id === selectedNode) : null;

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>();
    connections.forEach(conn => {
      if (conn.from === nodeId) connected.add(conn.to);
      if (conn.to === nodeId) connected.add(conn.from);
    });
    return connected;
  };

  const connectedNodes = selectedNode ? getConnectedNodes(selectedNode) : new Set();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Interactive Health Journey Map
          </h1>
          <p className="text-gray-400 mb-4">
            Explore the connections between your health conditions, treatments, and outcomes
          </p>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50"></div>
              <span>Conditions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500/50"></div>
              <span>Treatments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50"></div>
              <span>Outcomes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500/50"></div>
              <span>Providers</span>
            </div>
          </div>
        </div>

        {/* Main Journey Map */}
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-white/10 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Journey Flow Diagram</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
                className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded text-sm hover:bg-pink-500/30 transition"
              >
                Zoom In
              </button>
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
                className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded text-sm hover:bg-pink-500/30 transition"
              >
                Zoom Out
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-black/30 rounded-xl min-h-[600px]">
            <svg
              width="100%"
              height="600"
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoomLevel} ${viewBox.height / zoomLevel}`}
              className="absolute inset-0"
            >
              {/* Connection Lines */}
              {connections.map((connection, index) => {
                const fromNode = journeyNodes.find(n => n.id === connection.from);
                const toNode = journeyNodes.find(n => n.id === connection.to);
                if (!fromNode || !toNode) return null;

                const style = getConnectionStyle(connection);
                const isHighlighted = selectedNode && (connection.from === selectedNode || connection.to === selectedNode);

                return (
                  <line
                    key={index}
                    x1={fromNode.position.x + 50}
                    y1={fromNode.position.y + 40}
                    x2={toNode.position.x + 50}
                    y2={toNode.position.y + 40}
                    stroke={style.color}
                    strokeWidth={isHighlighted ? "3" : "2"}
                    strokeDasharray={style.dashArray}
                    opacity={selectedNode ? (isHighlighted ? 1 : 0.3) : 0.7}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* Journey Nodes */}
            {journeyNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isConnected = connectedNodes.has(node.id);
              const isHovered = hoveredNode === node.id;
              const shouldHighlight = !selectedNode || isSelected || isConnected;

              return (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    shouldHighlight ? 'opacity-100' : 'opacity-30'
                  } ${isSelected || isHovered ? 'scale-110 z-20' : 'z-10'}`}
                  style={{
                    left: node.position.x * zoomLevel,
                    top: node.position.y * zoomLevel,
                    transform: `translate(${viewBox.x}px, ${viewBox.y}px)`
                  }}
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className={`w-32 h-20 bg-gradient-to-br ${getNodeColor(node.type, node.status)} rounded-lg border-2 p-3 ${isSelected ? 'ring-2 ring-pink-500' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{getNodeIcon(node.type)}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        node.status === 'completed' ? 'bg-green-400' :
                        node.status === 'active' ? 'bg-yellow-400' :
                        node.status === 'planned' ? 'bg-blue-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <h4 className="font-medium text-xs leading-tight text-white">
                      {node.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Details Panel */}
        {selectedNodeData && (
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-500/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getNodeIcon(selectedNodeData.type)}</span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedNodeData.title}</h3>
                  <p className="text-gray-300 text-sm">{selectedNodeData.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`capitalize ${
                      selectedNodeData.status === 'completed' ? 'text-green-400' :
                      selectedNodeData.status === 'active' ? 'text-yellow-400' :
                      selectedNodeData.status === 'planned' ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {selectedNodeData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{new Date(selectedNodeData.date).toLocaleDateString()}</span>
                  </div>
                  {selectedNodeData.details?.provider && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Provider:</span>
                      <span className="text-white">{selectedNodeData.details.provider}</span>
                    </div>
                  )}
                  {selectedNodeData.details?.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{selectedNodeData.details.duration}</span>
                    </div>
                  )}
                  {selectedNodeData.details?.effectiveness && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Effectiveness:</span>
                      <span className={`capitalize ${
                        selectedNodeData.details.effectiveness === 'high' ? 'text-green-400' :
                        selectedNodeData.details.effectiveness === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {selectedNodeData.details.effectiveness}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Additional Information</h4>
                {selectedNodeData.details?.notes && (
                  <p className="text-sm text-gray-300 mb-3">{selectedNodeData.details.notes}</p>
                )}
                {selectedNodeData.details?.sideEffects && selectedNodeData.details.sideEffects.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-400">Side Effects:</span>
                    <ul className="text-sm text-gray-300 mt-1">
                      {selectedNodeData.details.sideEffects.map((effect, index) => (
                        <li key={index} className="ml-2">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Journey Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
            <h4 className="font-medium text-white mb-1">Completed</h4>
            <div className="text-2xl font-bold text-green-400">
              {journeyNodes.filter(n => n.status === 'completed').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <h4 className="font-medium text-white mb-1">Active</h4>
            <div className="text-2xl font-bold text-yellow-400">
              {journeyNodes.filter(n => n.status === 'active').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
            <h4 className="font-medium text-white mb-1">Planned</h4>
            <div className="text-2xl font-bold text-blue-400">
              {journeyNodes.filter(n => n.status === 'planned').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
            <h4 className="font-medium text-white mb-1">Connections</h4>
            <div className="text-2xl font-bold text-purple-400">
              {connections.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}