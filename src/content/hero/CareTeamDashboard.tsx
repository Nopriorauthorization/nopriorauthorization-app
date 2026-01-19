"use client";

import React, { useState } from 'react';
import { format, addDays, isBefore, isAfter } from 'date-fns';

// Care team data types
type Provider = {
  id: string;
  name: string;
  specialty: string;
  role: 'primary' | 'specialist' | 'consultant' | 'coordinator';
  email: string;
  phone: string;
  practice: string;
  location: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  relationship: {
    startDate: string;
    lastContact: string;
    nextAppointment?: string;
    totalAppointments: number;
    totalMessages: number;
    sharedDataAccess: boolean;
  };
  specializations: string[];
  notes?: string;
  communicationPreference: 'email' | 'phone' | 'portal' | 'fax';
  urgencyLevel: 'routine' | 'important' | 'urgent';
};

type CommunicationThread = {
  id: string;
  providerId: string;
  subject: string;
  lastMessage: string;
  lastActivity: string;
  status: 'read' | 'unread' | 'pending-response';
  priority: 'low' | 'medium' | 'high';
  messageCount: number;
};

type CareCoordination = {
  id: string;
  title: string;
  type: 'referral' | 'consultation' | 'follow-up' | 'test-order' | 'care-plan';
  fromProviderId: string;
  toProviderId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
};

// Sample data
const careTeam: Provider[] = [
  {
    id: 'provider-1',
    name: 'Dr. Sarah Chen',
    specialty: 'Internal Medicine',
    role: 'primary',
    email: 'schen@primarycare.health',
    phone: '(555) 123-4567',
    practice: 'Metro Primary Care',
    location: 'Downtown Medical Center',
    status: 'active',
    relationship: {
      startDate: '2023-03-15',
      lastContact: '2024-06-15',
      nextAppointment: '2024-08-20',
      totalAppointments: 8,
      totalMessages: 15,
      sharedDataAccess: true
    },
    specializations: ['Preventive Care', 'Chronic Disease Management', 'Diabetes'],
    notes: 'Excellent communication, very thorough with follow-ups',
    communicationPreference: 'portal',
    urgencyLevel: 'routine'
  },
  {
    id: 'provider-2',
    name: 'Dr. Michael Torres',
    specialty: 'Endocrinology',
    role: 'specialist',
    email: 'torres@endocrinology.health',
    phone: '(555) 234-5678',
    practice: 'Diabetes & Hormone Center',
    location: 'Medical Plaza East',
    status: 'active',
    relationship: {
      startDate: '2024-05-10',
      lastContact: '2024-06-08',
      nextAppointment: '2024-09-08',
      totalAppointments: 2,
      totalMessages: 8,
      sharedDataAccess: true
    },
    specializations: ['Type 2 Diabetes', 'Insulin Management', 'Metabolic Disorders'],
    notes: 'Referred by Dr. Chen for diabetes management. Very knowledgeable.',
    communicationPreference: 'email',
    urgencyLevel: 'important'
  },
  {
    id: 'provider-3',
    name: 'Regional Imaging Center',
    specialty: 'Radiology',
    role: 'consultant',
    email: 'scheduling@regionalimaging.com',
    phone: '(555) 345-6789',
    practice: 'Regional Imaging Center',
    location: 'Northside Medical Complex',
    status: 'active',
    relationship: {
      startDate: '2024-05-25',
      lastContact: '2024-06-01',
      totalAppointments: 1,
      totalMessages: 3,
      sharedDataAccess: false
    },
    specializations: ['MRI', 'CT Scans', 'Ultrasound'],
    communicationPreference: 'phone',
    urgencyLevel: 'routine'
  },
  {
    id: 'provider-4',
    name: 'Dr. Lisa Rodriguez',
    specialty: 'Cardiology',
    role: 'consultant',
    email: 'rodriguez@hearthealth.med',
    phone: '(555) 456-7890',
    practice: 'Heart Health Associates',
    location: 'Cardiac Care Center',
    status: 'pending',
    relationship: {
      startDate: '2024-06-20',
      lastContact: '2024-06-20',
      nextAppointment: '2024-07-25',
      totalAppointments: 0,
      totalMessages: 1,
      sharedDataAccess: false
    },
    specializations: ['Preventive Cardiology', 'Hypertension', 'Heart Disease'],
    notes: 'New referral for blood pressure management',
    communicationPreference: 'portal',
    urgencyLevel: 'important'
  },
  {
    id: 'provider-5',
    name: 'Care Coordinator Emma',
    specialty: 'Care Coordination',
    role: 'coordinator',
    email: 'emma@carecoord.health',
    phone: '(555) 567-8901',
    practice: 'Integrated Care Solutions',
    location: 'Virtual',
    status: 'active',
    relationship: {
      startDate: '2024-01-10',
      lastContact: '2024-06-12',
      totalAppointments: 4,
      totalMessages: 22,
      sharedDataAccess: true
    },
    specializations: ['Care Navigation', 'Insurance Authorization', 'Appointment Coordination'],
    notes: 'Helps coordinate between all providers and manage appointments',
    communicationPreference: 'email',
    urgencyLevel: 'routine'
  }
];

const communications: CommunicationThread[] = [
  {
    id: 'comm-1',
    providerId: 'provider-2',
    subject: 'Lab Results Follow-up',
    lastMessage: 'HbA1c results look great! Continue current medication.',
    lastActivity: '2024-06-15',
    status: 'read',
    priority: 'medium',
    messageCount: 3
  },
  {
    id: 'comm-2',
    providerId: 'provider-1',
    subject: 'Annual Physical Scheduling',
    lastMessage: 'Available dates for your annual exam in August...',
    lastActivity: '2024-06-14',
    status: 'pending-response',
    priority: 'low',
    messageCount: 2
  },
  {
    id: 'comm-3',
    providerId: 'provider-4',
    subject: 'Cardiology Consultation Prep',
    lastMessage: 'Please bring recent blood pressure logs to appointment',
    lastActivity: '2024-06-13',
    status: 'unread',
    priority: 'high',
    messageCount: 1
  }
];

const coordinations: CareCoordination[] = [
  {
    id: 'coord-1',
    title: 'Cardiology Referral',
    type: 'referral',
    fromProviderId: 'provider-1',
    toProviderId: 'provider-4',
    status: 'in-progress',
    dueDate: '2024-07-25',
    description: 'Evaluate elevated blood pressure and cardiovascular risk',
    priority: 'high'
  },
  {
    id: 'coord-2',
    title: 'Quarterly Lab Work',
    type: 'test-order',
    fromProviderId: 'provider-2',
    toProviderId: 'provider-1',
    status: 'pending',
    dueDate: '2024-09-01',
    description: 'HbA1c, lipid panel, comprehensive metabolic panel',
    priority: 'medium'
  },
  {
    id: 'coord-3',
    title: 'Diabetes Management Review',
    type: 'follow-up',
    fromProviderId: 'provider-2',
    toProviderId: 'provider-1',
    status: 'completed',
    dueDate: '2024-06-08',
    description: 'Share diabetes management updates and medication changes',
    priority: 'medium'
  }
];

export default function CareTeamDashboard() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'communications' | 'coordination' | 'calendar'>('overview');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProviders = careTeam.filter(provider => {
    if (filterRole !== 'all' && provider.role !== filterRole) return false;
    if (filterStatus !== 'all' && provider.status !== filterStatus) return false;
    return true;
  });

  const getRoleIcon = (role: Provider['role']) => {
    const icons = {
      primary: '👨‍⚕️',
      specialist: '🩺',
      consultant: '📋',
      coordinator: '📞'
    };
    return icons[role];
  };

  const getStatusColor = (status: Provider['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'inactive': return 'text-gray-400 bg-gray-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getUrgencyColor = (urgency: Provider['urgencyLevel']) => {
    switch (urgency) {
      case 'urgent': return 'border-red-500/50 bg-red-500/10';
      case 'important': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getCommunicationStatusColor = (status: CommunicationThread['status']) => {
    switch (status) {
      case 'unread': return 'text-red-400 bg-red-500/20';
      case 'pending-response': return 'text-yellow-400 bg-yellow-500/20';
      case 'read': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCoordinationStatusColor = (status: CareCoordination['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'in-progress': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const upcomingAppointments = careTeam
    .filter(p => p.relationship.nextAppointment)
    .map(p => ({
      provider: p,
      date: p.relationship.nextAppointment!
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentCommunications = communications
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 5);

  const pendingCoordinations = coordinations
    .filter(c => c.status === 'pending' || c.status === 'in-progress')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Care Team Dashboard
          </h1>
          <p className="text-gray-400 mb-6">
            Coordinate with your healthcare providers and manage all care team communications
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-500/20">
              <div className="text-2xl font-bold text-pink-400">{careTeam.filter(p => p.status === 'active').length}</div>
              <p className="text-sm text-gray-400">Active Providers</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">{upcomingAppointments.length}</div>
              <p className="text-sm text-gray-400">Upcoming Appointments</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{communications.filter(c => c.status === 'unread').length}</div>
              <p className="text-sm text-gray-400">Unread Messages</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{pendingCoordinations.length}</div>
              <p className="text-sm text-gray-400">Pending Coordinations</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'communications', label: 'Communications', icon: '💬' },
              { id: 'coordination', label: 'Care Coordination', icon: '🤝' },
              { id: 'calendar', label: 'Calendar', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="primary">Primary Care</option>
              <option value="specialist">Specialists</option>
              <option value="consultant">Consultants</option>
              <option value="coordinator">Coordinators</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Care Team List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4">Your Care Team</h2>
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    selectedProvider?.id === provider.id ? 'border-pink-500/50 bg-pink-500/5' : getUrgencyColor(provider.urgencyLevel)
                  }`}
                  onClick={() => setSelectedProvider(selectedProvider?.id === provider.id ? null : provider)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-2xl border border-pink-500/30">
                        {getRoleIcon(provider.role)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold text-white">{provider.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                            {provider.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-1">{provider.specialty}</p>
                        <p className="text-gray-400 text-sm">{provider.practice}</p>
                        <p className="text-gray-500 text-xs">{provider.location}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Last Contact</div>
                      <div className="text-white font-medium">
                        {format(new Date(provider.relationship.lastContact), 'MMM dd')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-pink-400">{provider.relationship.totalAppointments}</div>
                      <p className="text-xs text-gray-400">Appointments</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-blue-400">{provider.relationship.totalMessages}</div>
                      <p className="text-xs text-gray-400">Messages</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className={`text-lg font-semibold ${provider.relationship.sharedDataAccess ? 'text-green-400' : 'text-gray-400'}`}>
                        {provider.relationship.sharedDataAccess ? '✓' : '✗'}
                      </div>
                      <p className="text-xs text-gray-400">Data Access</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.specializations.slice(0, 3).map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs">
                        {spec}
                      </span>
                    ))}
                    {provider.specializations.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-full text-xs">
                        +{provider.specializations.length - 3} more
                      </span>
                    )}
                  </div>

                  {provider.relationship.nextAppointment && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Next Appointment:</span>
                      <span className="text-green-400 font-medium">
                        {format(new Date(provider.relationship.nextAppointment), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}

                  {selectedProvider?.id === provider.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Email:</span>
                              <span className="text-white">{provider.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Phone:</span>
                              <span className="text-white">{provider.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Preferred Contact:</span>
                              <span className="text-white capitalize">{provider.communicationPreference}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white mb-2">Relationship</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Since:</span>
                              <span className="text-white">{format(new Date(provider.relationship.startDate), 'MMM yyyy')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Role:</span>
                              <span className="text-white capitalize">{provider.role}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Priority Level:</span>
                              <span className={`capitalize ${
                                provider.urgencyLevel === 'urgent' ? 'text-red-400' :
                                provider.urgencyLevel === 'important' ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {provider.urgencyLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {provider.notes && (
                        <div className="mb-4">
                          <h4 className="font-medium text-white mb-2">Notes</h4>
                          <p className="text-gray-300 text-sm">{provider.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition">
                          Send Message
                        </button>
                        <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition">
                          Schedule Appointment
                        </button>
                        <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition">
                          Share Data
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar - Recent Activity */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Appointments</h3>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-gray-400 text-sm">No upcoming appointments</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map((apt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium text-sm">{apt.provider.name}</h4>
                          <p className="text-gray-400 text-xs">{apt.provider.specialty}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-pink-400 font-medium text-sm">
                            {format(new Date(apt.date), 'MMM dd')}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {format(new Date(apt.date), 'yyyy')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Communications */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
                <div className="space-y-3">
                  {recentCommunications.map((comm) => {
                    const provider = careTeam.find(p => p.id === comm.providerId);
                    return (
                      <div key={comm.id} className="p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium text-sm">{provider?.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCommunicationStatusColor(comm.status)}`}>
                            {comm.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-xs mb-2">{comm.subject}</p>
                        <p className="text-gray-500 text-xs">{format(new Date(comm.lastActivity), 'MMM dd')}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pending Coordinations */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Care Coordination</h3>
                <div className="space-y-3">
                  {pendingCoordinations.slice(0, 3).map((coord) => {
                    const fromProvider = careTeam.find(p => p.id === coord.fromProviderId);
                    const toProvider = careTeam.find(p => p.id === coord.toProviderId);
                    return (
                      <div key={coord.id} className="p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium text-xs">{coord.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCoordinationStatusColor(coord.status)}`}>
                            {coord.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">
                          {fromProvider?.name} → {toProvider?.name}
                        </p>
                        <p className="text-gray-500 text-xs">Due: {format(new Date(coord.dueDate), 'MMM dd')}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tab content would go here */}
        {activeTab === 'communications' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Communications Hub</h3>
            <p className="text-gray-400 mb-6">Secure messaging with all your healthcare providers coming soon!</p>
          </div>
        )}

        {activeTab === 'coordination' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Care Coordination</h3>
            <p className="text-gray-400 mb-6">Advanced care coordination features coming soon!</p>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Integrated Calendar</h3>
            <p className="text-gray-400 mb-6">Unified appointment calendar across all providers coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}