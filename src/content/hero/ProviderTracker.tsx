"use client";

import React, { useState, useEffect, useMemo } from 'react';

// Provider Tracker Types
type HealthcareProvider = {
  id: string;
  name: string;
  specialty: string;
  facility: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  npi?: string;
  insuranceAccepted: string[];
  rating: number;
  reviewCount: number;
  lastVisited: string;
  nextAppointment?: string;
  notes: string;
  status: 'active' | 'inactive' | 'preferred' | 'emergency';
  avatar?: string;
  coordinates?: { lat: number; lng: number };
};

type Appointment = {
  id: string;
  providerId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency' | 'telehealth';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  followUpNeeded: boolean;
  reminders: boolean;
};

type CareTeam = {
  id: string;
  name: string;
  role: 'primary-care' | 'specialist' | 'therapist' | 'pharmacist' | 'emergency';
  providers: string[]; // provider IDs
  description: string;
};

// Mock data for demonstration
const mockProviders: HealthcareProvider[] = [
  {
    id: 'prov-1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Primary Care',
    facility: 'Wellness Medical Center',
    address: '123 Health St, Medical City, MC 12345',
    phone: '(555) 123-4567',
    email: 's.johnson@wellnessmc.com',
    website: 'https://wellnessmc.com',
    npi: '1234567890',
    insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'United Healthcare'],
    rating: 4.8,
    reviewCount: 127,
    lastVisited: '2026-01-15T10:00:00Z',
    nextAppointment: '2026-02-15T10:00:00Z',
    notes: 'Excellent bedside manner, very thorough. Always takes time to answer questions.',
    status: 'preferred',
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 'prov-2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    facility: 'Heart & Vascular Institute',
    address: '456 Cardiac Ave, Medical City, MC 12345',
    phone: '(555) 234-5678',
    email: 'm.chen@heartvascular.com',
    npi: '0987654321',
    insuranceAccepted: ['Blue Cross Blue Shield', 'Cigna', 'Humana'],
    rating: 4.9,
    reviewCount: 89,
    lastVisited: '2026-01-10T14:30:00Z',
    nextAppointment: '2026-03-10T14:30:00Z',
    notes: 'Specializes in hypertension management. Very knowledgeable about latest treatments.',
    status: 'active',
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 'prov-3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Endocrinology',
    facility: 'Metabolic Health Center',
    address: '789 Diabetes Dr, Medical City, MC 12345',
    phone: '(555) 345-6789',
    email: 'e.rodriguez@metabolichealth.com',
    insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Medicare'],
    rating: 4.7,
    reviewCount: 156,
    lastVisited: '2025-12-20T09:15:00Z',
    notes: 'Helped manage diabetes effectively. Good at explaining complex medical concepts.',
    status: 'active',
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 'prov-4',
    name: 'Dr. James Wilson',
    specialty: 'Emergency Medicine',
    facility: 'City General Hospital ER',
    address: '321 Emergency Blvd, Medical City, MC 12345',
    phone: '(555) 456-7890',
    email: 'j.wilson@citygeneral.com',
    insuranceAccepted: ['All major insurance accepted'],
    rating: 4.5,
    reviewCount: 203,
    lastVisited: '2025-11-15T22:45:00Z',
    notes: 'Efficient and calm under pressure. Good at explaining what\'s happening during emergencies.',
    status: 'emergency',
    avatar: '/api/placeholder/100/100'
  },
  {
    id: 'prov-5',
    name: 'Lisa Thompson, PharmD',
    specialty: 'Pharmacy',
    facility: 'Wellness Pharmacy',
    address: '555 Medicine Ln, Medical City, MC 12345',
    phone: '(555) 567-8901',
    email: 'l.thompson@wellnesspharmacy.com',
    insuranceAccepted: ['Most insurance accepted'],
    rating: 4.6,
    reviewCount: 78,
    lastVisited: '2026-01-18T11:30:00Z',
    notes: 'Very knowledgeable about medication interactions. Always double-checks prescriptions.',
    status: 'active',
    avatar: '/api/placeholder/100/100'
  }
];

const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    providerId: 'prov-1',
    date: '2026-02-15',
    time: '10:00',
    type: 'follow-up',
    status: 'scheduled',
    notes: 'Routine check-up and blood pressure monitoring',
    followUpNeeded: false,
    reminders: true
  },
  {
    id: 'appt-2',
    providerId: 'prov-2',
    date: '2026-03-10',
    time: '14:30',
    type: 'consultation',
    status: 'scheduled',
    notes: 'Cardiac stress test results review',
    followUpNeeded: false,
    reminders: true
  },
  {
    id: 'appt-3',
    providerId: 'prov-3',
    date: '2026-01-25',
    time: '09:15',
    type: 'follow-up',
    status: 'scheduled',
    notes: 'Diabetes management review',
    followUpNeeded: false,
    reminders: true
  }
];

const mockCareTeams: CareTeam[] = [
  {
    id: 'team-1',
    name: 'Primary Care Team',
    role: 'primary-care',
    providers: ['prov-1', 'prov-5'],
    description: 'Core healthcare providers for routine care and medication management'
  },
  {
    id: 'team-2',
    name: 'Cardiovascular Care',
    role: 'specialist',
    providers: ['prov-2'],
    description: 'Specialized care for heart health and cardiovascular conditions'
  },
  {
    id: 'team-3',
    name: 'Metabolic Health',
    role: 'specialist',
    providers: ['prov-3'],
    description: 'Diabetes and endocrine system management'
  }
];

export default function ProviderTracker() {
  const [activeTab, setActiveTab] = useState<'providers' | 'appointments' | 'teams' | 'analytics'>('providers');
  const [selectedProvider, setSelectedProvider] = useState<HealthcareProvider | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Providers', icon: '👥' },
    { id: 'primary-care', name: 'Primary Care', icon: '🏥' },
    { id: 'specialist', name: 'Specialists', icon: '🩺' },
    { id: 'emergency', name: 'Emergency', icon: '🚑' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
    { id: 'therapy', name: 'Therapy', icon: '🧠' }
  ];

  const getStatusColor = (status: HealthcareProvider['status']) => {
    const colors = {
      preferred: 'text-yellow-400 bg-yellow-500/20',
      active: 'text-green-400 bg-green-500/20',
      inactive: 'text-gray-400 bg-gray-500/20',
      emergency: 'text-red-400 bg-red-500/20'
    };
    return colors[status];
  };

  const getAppointmentStatusColor = (status: Appointment['status']) => {
    const colors = {
      scheduled: 'text-blue-400 bg-blue-500/20',
      completed: 'text-green-400 bg-green-500/20',
      cancelled: 'text-red-400 bg-red-500/20',
      'no-show': 'text-orange-400 bg-orange-500/20'
    };
    return colors[status];
  };

  const filteredProviders = useMemo(() => {
    let filtered = mockProviders;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(provider => {
        if (selectedCategory === 'primary-care') return provider.specialty === 'Primary Care';
        if (selectedCategory === 'specialist') return ['Cardiology', 'Endocrinology'].includes(provider.specialty);
        if (selectedCategory === 'emergency') return provider.specialty === 'Emergency Medicine';
        if (selectedCategory === 'pharmacy') return provider.specialty === 'Pharmacy';
        return true;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.facility.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const upcomingAppointments = useMemo(() => {
    return mockAppointments
      .filter(appt => appt.status === 'scheduled')
      .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
  }, []);

  const getProviderById = (id: string) => mockProviders.find(p => p.id === id);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Provider Tracker
          </h1>
          <p className="text-gray-400">
            Comprehensive healthcare provider management and appointment coordination
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'providers', label: 'Providers', icon: '👨‍⚕️' },
            { id: 'appointments', label: 'Appointments', icon: '📅' },
            { id: 'teams', label: 'Care Teams', icon: '👥' },
            { id: 'analytics', label: 'Analytics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition"
              >
                + Add Provider
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-gray-900 rounded-xl p-6 cursor-pointer hover:bg-gray-800 transition"
                  onClick={() => setSelectedProvider(provider)}
                >
                  {/* Provider Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {provider.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{provider.name}</h3>
                      <p className="text-purple-400 text-sm mb-2">{provider.specialty}</p>
                      <p className="text-gray-400 text-sm">{provider.facility}</p>
                    </div>
                  </div>

                  {/* Status and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white text-sm">{provider.rating}</span>
                      <span className="text-gray-400 text-xs">({provider.reviewCount})</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">📞</span>
                      <span className="text-gray-300">{provider.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">📧</span>
                      <span className="text-gray-300">{provider.email}</span>
                    </div>
                  </div>

                  {/* Last Visit & Next Appointment */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last Visit:</span>
                      <span className="text-white">{new Date(provider.lastVisited).toLocaleDateString()}</span>
                    </div>
                    {provider.nextAppointment && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Next Appt:</span>
                        <span className="text-blue-400">{new Date(provider.nextAppointment).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes Preview */}
                  {provider.notes && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-300 text-sm line-clamp-2">{provider.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-blue-400">📅 Appointments</h2>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition">
                + Schedule Appointment
              </button>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => {
                  const provider = getProviderById(appointment.providerId);
                  return (
                    <div key={appointment.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">
                            {provider?.name}
                          </h4>
                          <p className="text-gray-400 text-sm">{provider?.specialty} • {provider?.facility}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-gray-400 text-sm">Date</span>
                          <div className="text-white font-medium">{new Date(appointment.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Time</span>
                          <div className="text-white font-medium">{appointment.time}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Type</span>
                          <div className="text-white font-medium capitalize">{appointment.type}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Reminders</span>
                          <div className="text-white font-medium">{appointment.reminders ? 'On' : 'Off'}</div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="bg-gray-700 rounded-lg p-3">
                          <p className="text-gray-300 text-sm">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Appointment Calendar */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Calendar View</h3>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-gray-400">Interactive calendar view would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">Monthly calendar with appointment scheduling and reminders</p>
              </div>
            </div>
          </div>
        )}

        {/* Care Teams Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-green-400">👥 Care Teams</h2>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition">
                + Create Team
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCareTeams.map((team) => (
                <div key={team.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{team.name}</h3>
                      <p className="text-gray-400 text-sm capitalize">{team.role.replace('-', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{team.providers.length}</div>
                      <div className="text-sm text-gray-400">Providers</div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{team.description}</p>

                  <div className="space-y-3">
                    {team.providers.map((providerId) => {
                      const provider = getProviderById(providerId);
                      return provider ? (
                        <div key={providerId} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {provider.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{provider.name}</h4>
                            <p className="text-gray-400 text-xs">{provider.specialty}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(provider.status)}`}>
                            {provider.status}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-orange-400">📊 Provider Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provider Statistics */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Provider Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Total Providers</span>
                    <span className="text-white font-bold">{mockProviders.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Active Providers</span>
                    <span className="text-green-400 font-bold">
                      {mockProviders.filter(p => p.status === 'active' || p.status === 'preferred').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Preferred Provider</span>
                    <span className="text-yellow-400 font-bold">
                      {mockProviders.filter(p => p.status === 'preferred').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Average Rating</span>
                    <span className="text-white font-bold">
                      {(mockProviders.reduce((acc, p) => acc + p.rating, 0) / mockProviders.length).toFixed(1)} ⭐
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment Statistics */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Appointment Tracking</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Upcoming Appointments</span>
                    <span className="text-blue-400 font-bold">{upcomingAppointments.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">This Month</span>
                    <span className="text-white font-bold">
                      {mockAppointments.filter(a =>
                        new Date(a.date).getMonth() === new Date().getMonth()
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-green-400 font-bold">94%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Average Wait Time</span>
                    <span className="text-white font-bold">12 min</span>
                  </div>
                </div>
              </div>

              {/* Specialty Distribution */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Specialty Distribution</h3>
                <div className="space-y-3">
                  {[
                    { specialty: 'Primary Care', count: 1, color: 'from-blue-500 to-blue-600' },
                    { specialty: 'Cardiology', count: 1, color: 'from-red-500 to-red-600' },
                    { specialty: 'Endocrinology', count: 1, color: 'from-green-500 to-green-600' },
                    { specialty: 'Emergency Medicine', count: 1, color: 'from-orange-500 to-orange-600' },
                    { specialty: 'Pharmacy', count: 1, color: 'from-purple-500 to-purple-600' }
                  ].map((spec) => (
                    <div key={spec.specialty} className="flex items-center justify-between">
                      <span className="text-white text-sm">{spec.specialty}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${spec.color} h-2 rounded-full`}
                            style={{ width: `${(spec.count / mockProviders.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-400 text-sm w-6">{spec.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Coordination */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Care Coordination</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Team Communication</h4>
                    <p className="text-sm text-gray-300">
                      89% of providers have shared notes and updates in the last 30 days.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Appointment Coordination</h4>
                    <p className="text-sm text-gray-300">
                      Average 2.3 appointments scheduled per provider per month.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Follow-up Compliance</h4>
                    <p className="text-sm text-gray-300">
                      91% of recommended follow-ups completed within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Provider Detail Modal */}
        {selectedProvider && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedProvider.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{selectedProvider.name}</h2>
                      <p className="text-purple-400">{selectedProvider.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedProvider.status)}`}>
                      {selectedProvider.status}
                    </span>
                    <button
                      onClick={() => setSelectedProvider(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Provider Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 w-6">🏥</span>
                          <div>
                            <div className="text-white font-medium">{selectedProvider.facility}</div>
                            <div className="text-gray-400 text-sm">{selectedProvider.address}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 w-6">📞</span>
                          <span className="text-white">{selectedProvider.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 w-6">📧</span>
                          <span className="text-white">{selectedProvider.email}</span>
                        </div>
                        {selectedProvider.website && (
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-400 w-6">🌐</span>
                            <a href={selectedProvider.website} className="text-blue-400 hover:text-blue-300">
                              {selectedProvider.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Insurance Accepted</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.insuranceAccepted.map((insurance, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm">
                            {insurance}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Visit History</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <span className="text-gray-300">Last Visit</span>
                          <span className="text-white">{new Date(selectedProvider.lastVisited).toLocaleDateString()}</span>
                        </div>
                        {selectedProvider.nextAppointment && (
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span className="text-gray-300">Next Appointment</span>
                            <span className="text-blue-400">{new Date(selectedProvider.nextAppointment).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ratings and Notes */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Ratings & Reviews</h3>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400 text-xl">⭐</span>
                          <span className="text-white text-xl font-bold">{selectedProvider.rating}</span>
                        </div>
                        <span className="text-gray-400">({selectedProvider.reviewCount} reviews)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                          style={{ width: `${(selectedProvider.rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Personal Notes</h3>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-300">{selectedProvider.notes}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition">
                          📅 Schedule
                        </button>
                        <button className="p-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition">
                          📞 Call
                        </button>
                        <button className="p-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition">
                          ✏️ Edit Notes
                        </button>
                        <button className="p-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition">
                          📧 Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Provider Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Add New Provider</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-400">Provider addition form would be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">Including contact info, specialty, insurance, and notes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}