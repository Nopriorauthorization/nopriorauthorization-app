"use client";

import React, { useState } from 'react';
import { format, parseISO, addDays, startOfWeek, endOfWeek, isToday, isSameDay, addWeeks, subWeeks, isAfter, isBefore } from 'date-fns';

// Types
type Provider = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  color: string;
  avatar?: string;
  availability: {
    [key: string]: { // day of week (0-6)
      slots: TimeSlot[];
    };
  };
};

type TimeSlot = {
  start: string; // HH:mm format
  end: string;
  available: boolean;
  appointmentId?: string;
};

type Appointment = {
  id: string;
  title: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'routine' | 'follow-up' | 'urgent' | 'consultation' | 'lab' | 'imaging';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  location: 'in-person' | 'telehealth' | 'phone';
  notes?: string;
  requiresPrep?: string[];
  relatedGoalIds?: string[];
  reminderSent?: boolean;
  duration: number; // in minutes
};

type AppointmentRequest = {
  id: string;
  providerId: string;
  requestedDates: string[];
  requestedTimes: string[];
  appointmentType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  status: 'pending' | 'approved' | 'declined' | 'counter-offer';
  submittedAt: string;
  responseNeeded?: boolean;
  autoBooking?: boolean;
};

type ConflictResolution = {
  id: string;
  conflictType: 'scheduling' | 'preparation' | 'coordination';
  appointments: string[];
  suggestions: {
    type: 'reschedule' | 'combine' | 'sequence';
    description: string;
    impact: string;
  }[];
  resolved: boolean;
};

// Sample data
const providers: Provider[] = [
  {
    id: 'provider-1',
    name: 'Dr. Sarah Chen',
    specialty: 'Internal Medicine',
    location: 'Main Clinic',
    color: '#ec4899',
    availability: {
      '1': { slots: [{ start: '09:00', end: '12:00', available: true }, { start: '13:00', end: '17:00', available: true }] },
      '2': { slots: [{ start: '09:00', end: '12:00', available: true }, { start: '13:00', end: '17:00', available: true }] },
      '3': { slots: [{ start: '09:00', end: '12:00', available: true }, { start: '13:00', end: '17:00', available: true }] },
      '4': { slots: [{ start: '09:00', end: '12:00', available: true }, { start: '13:00', end: '17:00', available: true }] },
      '5': { slots: [{ start: '09:00', end: '12:00', available: true }] }
    }
  },
  {
    id: 'provider-2',
    name: 'Dr. Michael Torres',
    specialty: 'Endocrinology',
    location: 'Specialty Center',
    color: '#8b5cf6',
    availability: {
      '1': { slots: [{ start: '10:00', end: '12:00', available: true }, { start: '14:00', end: '16:00', available: true }] },
      '2': { slots: [{ start: '10:00', end: '12:00', available: true }, { start: '14:00', end: '16:00', available: true }] },
      '4': { slots: [{ start: '10:00', end: '12:00', available: true }, { start: '14:00', end: '16:00', available: true }] },
      '5': { slots: [{ start: '08:00', end: '11:00', available: true }] }
    }
  },
  {
    id: 'provider-4',
    name: 'Dr. Lisa Rodriguez',
    specialty: 'Cardiology',
    location: 'Heart Center',
    color: '#f59e0b',
    availability: {
      '1': { slots: [{ start: '08:00', end: '12:00', available: true }, { start: '13:00', end: '15:00', available: true }] },
      '3': { slots: [{ start: '08:00', end: '12:00', available: true }, { start: '13:00', end: '15:00', available: true }] },
      '5': { slots: [{ start: '08:00', end: '12:00', available: true }] }
    }
  }
];

const appointments: Appointment[] = [
  {
    id: 'appt-1',
    title: 'Quarterly Check-up',
    providerId: 'provider-1',
    date: '2024-06-25',
    startTime: '09:00',
    endTime: '09:30',
    type: 'routine',
    status: 'scheduled',
    location: 'in-person',
    duration: 30,
    requiresPrep: ['Fasting blood work', 'Bring medication list'],
    relatedGoalIds: ['goal-1', 'goal-2']
  },
  {
    id: 'appt-2',
    title: 'Diabetes Follow-up',
    providerId: 'provider-2',
    date: '2024-06-26',
    startTime: '10:30',
    endTime: '11:00',
    type: 'follow-up',
    status: 'confirmed',
    location: 'telehealth',
    duration: 30,
    notes: 'Review latest HbA1c results',
    relatedGoalIds: ['goal-1']
  },
  {
    id: 'appt-3',
    title: 'Cardiology Consultation',
    providerId: 'provider-4',
    date: '2024-06-28',
    startTime: '08:30',
    endTime: '09:30',
    type: 'consultation',
    status: 'scheduled',
    location: 'in-person',
    duration: 60,
    requiresPrep: ['Recent EKG', 'Blood pressure log'],
    relatedGoalIds: ['goal-2']
  }
];

const appointmentRequests: AppointmentRequest[] = [
  {
    id: 'req-1',
    providerId: 'provider-2',
    requestedDates: ['2024-07-15', '2024-07-16', '2024-07-17'],
    requestedTimes: ['10:00', '11:00', '14:00'],
    appointmentType: '3-month diabetes check',
    priority: 'medium',
    notes: 'Follow-up for HbA1c monitoring',
    status: 'pending',
    submittedAt: '2024-06-20',
    responseNeeded: true,
    autoBooking: true
  }
];

const conflicts: ConflictResolution[] = [
  {
    id: 'conflict-1',
    conflictType: 'preparation',
    appointments: ['appt-1', 'appt-2'],
    suggestions: [
      {
        type: 'sequence',
        description: 'Schedule blood work 3 days before endocrinology appointment',
        impact: 'Ensures fresh lab results for diabetes consultation'
      }
    ],
    resolved: false
  }
];

export default function AppointmentCoordinationSystem() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'requests' | 'conflicts' | 'coordination'>('calendar');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{date: string, time: string} | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  const getProviderById = (id: string) => {
    return providers.find(p => p.id === id);
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'routine': return '🩺';
      case 'follow-up': return '🔄';
      case 'urgent': return '🚨';
      case 'consultation': return '💬';
      case 'lab': return '🧪';
      case 'imaging': return '📱';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'confirmed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'completed': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'in-person': return '🏥';
      case 'telehealth': return '💻';
      case 'phone': return '📞';
      default: return '📍';
    }
  };

  const isTimeSlotAvailable = (providerId: string, date: string, time: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return false;
    
    const dayOfWeek = new Date(date).getDay();
    const dayAvailability = provider.availability[dayOfWeek.toString()];
    
    if (!dayAvailability) return false;
    
    // Check if time falls within any available slot
    return dayAvailability.slots.some(slot => {
      const slotStart = slot.start;
      const slotEnd = slot.end;
      return time >= slotStart && time < slotEnd && slot.available;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Appointment Coordination
              </h1>
              <p className="text-gray-400">
                Unified scheduling across all your healthcare providers with smart coordination
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowNewRequest(true)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                + Request Appointment
              </button>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                Sync Calendar
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-white">{appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}</p>
                </div>
                <div className="text-2xl">📅</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Pending Requests</p>
                  <p className="text-2xl font-bold text-white">{appointmentRequests.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="text-2xl">⏳</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-sm font-medium">Conflicts</p>
                  <p className="text-2xl font-bold text-white">{conflicts.filter(c => !c.resolved).length}</p>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Providers</p>
                  <p className="text-2xl font-bold text-white">{providers.length}</p>
                </div>
                <div className="text-2xl">👥</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'calendar', label: 'Calendar View', icon: '📅' },
              { id: 'requests', label: 'Requests', icon: '📝' },
              { id: 'conflicts', label: 'Conflicts', icon: '⚠️' },
              { id: 'coordination', label: 'Care Coordination', icon: '🔄' }
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
        </div>

        {/* Tab Content */}
        {activeTab === 'calendar' && (
          <div>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Week of {format(weekStart, 'MMM dd, yyyy')}
                </h2>
                <p className="text-gray-400">
                  {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                >
                  ← Previous
                </button>
                
                <button
                  onClick={() => setCurrentWeek(new Date())}
                  className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                >
                  Today
                </button>
                
                <button
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Provider Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    selectedProvider === null
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  All Providers
                </button>
                
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition border ${
                      selectedProvider === provider.id
                        ? `text-white border-white`
                        : `text-gray-300 border-gray-600 hover:border-gray-500`
                    }`}
                    style={{
                      backgroundColor: selectedProvider === provider.id ? provider.color : undefined,
                      borderColor: selectedProvider === provider.id ? provider.color : undefined
                    }}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-white/10">
                {weekDays.map((day, index) => (
                  <div key={index} className="p-4 border-r border-white/10 last:border-r-0">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">
                        {format(day, 'EEE')}
                      </div>
                      <div className={`text-lg font-semibold ${
                        isToday(day) ? 'text-pink-400' : 'text-white'
                      }`}>
                        {format(day, 'dd')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calendar Body */}
              <div className="grid grid-cols-7 min-h-[500px]">
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForDate(format(day, 'yyyy-MM-dd'))
                    .filter(apt => !selectedProvider || apt.providerId === selectedProvider);
                  
                  return (
                    <div key={dayIndex} className="p-2 border-r border-white/10 last:border-r-0 min-h-[500px]">
                      <div className="space-y-2">
                        {dayAppointments.map((appointment) => {
                          const provider = getProviderById(appointment.providerId);
                          return (
                            <div
                              key={appointment.id}
                              className="p-3 rounded-lg border cursor-pointer hover:opacity-90 transition"
                              style={{
                                backgroundColor: `${provider?.color}20`,
                                borderColor: `${provider?.color}40`
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {getAppointmentTypeIcon(appointment.type)}
                                  </span>
                                  <span className="text-xs text-gray-300">
                                    {appointment.startTime} - {appointment.endTime}
                                  </span>
                                </div>
                                <span className="text-xs">
                                  {getLocationIcon(appointment.location)}
                                </span>
                              </div>
                              
                              <h4 className="text-sm font-medium text-white mb-1">
                                {appointment.title}
                              </h4>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {provider?.name}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                                  {appointment.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Add available time slots if no appointments */}
                        {dayAppointments.length === 0 && (
                          <div className="p-3 border border-dashed border-gray-600 rounded-lg">
                            <p className="text-xs text-gray-400 text-center">
                              Available slots
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">Appointment Requests</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                  Auto-Book Available
                </button>
                <button 
                  onClick={() => setShowNewRequest(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
                >
                  + New Request
                </button>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="space-y-4">
              {appointmentRequests.map((request) => {
                const provider = getProviderById(request.providerId);
                return (
                  <div key={request.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{request.appointmentType}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.priority === 'urgent' ? 'text-red-400 bg-red-500/20' :
                            request.priority === 'high' ? 'text-orange-400 bg-orange-500/20' :
                            request.priority === 'medium' ? 'text-yellow-400 bg-yellow-500/20' :
                            'text-green-400 bg-green-500/20'
                          }`}>
                            {request.priority.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-500/20">
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-2">with {provider?.name} - {provider?.specialty}</p>
                        <p className="text-sm text-gray-400">{request.notes}</p>
                      </div>
                      
                      <div className="text-right text-sm text-gray-400">
                        <p>Submitted: {format(parseISO(request.submittedAt), 'MMM dd, yyyy')}</p>
                        {request.responseNeeded && (
                          <span className="inline-block mt-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                            Response Needed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Requested Times */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-white mb-2">Preferred Options:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {request.requestedDates.map((date, index) => (
                          <div key={index} className="p-3 bg-black/20 rounded-lg">
                            <div className="text-white font-medium">
                              {format(parseISO(date), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-sm text-gray-400">
                              {request.requestedTimes[index] || 'Any time'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                        Approve & Book
                      </button>
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                        Suggest Alternative
                      </button>
                      <button className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition">
                        View Provider Calendar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'conflicts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">Scheduling Conflicts</h3>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                Auto-Resolve Conflicts
              </button>
            </div>

            {conflicts.filter(c => !c.resolved).length === 0 ? (
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-green-500/20 p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h4 className="text-2xl font-semibold text-white mb-2">No Conflicts</h4>
                <p className="text-gray-400">All your appointments are perfectly coordinated!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conflicts.filter(c => !c.resolved).map((conflict) => (
                  <div key={conflict.id} className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {conflict.conflictType === 'scheduling' && '📅 Scheduling Conflict'}
                          {conflict.conflictType === 'preparation' && '🧪 Preparation Conflict'}
                          {conflict.conflictType === 'coordination' && '🔄 Coordination Issue'}
                        </h4>
                        <p className="text-gray-300">
                          Affects {conflict.appointments.length} appointments
                        </p>
                      </div>
                      
                      <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-sm font-medium">
                        UNRESOLVED
                      </span>
                    </div>

                    {/* Affected Appointments */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-white mb-2">Affected Appointments:</h5>
                      <div className="space-y-2">
                        {conflict.appointments.map((aptId) => {
                          const appointment = appointments.find(a => a.id === aptId);
                          const provider = appointment ? getProviderById(appointment.providerId) : null;
                          return appointment ? (
                            <div key={aptId} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                              <span style={{color: provider?.color}}>●</span>
                              <div>
                                <div className="text-white font-medium">{appointment.title}</div>
                                <div className="text-sm text-gray-400">
                                  {format(parseISO(appointment.date), 'MMM dd')} at {appointment.startTime} with {provider?.name}
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-white mb-2">Suggested Solutions:</h5>
                      <div className="space-y-2">
                        {conflict.suggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 bg-black/20 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-400">
                                  {suggestion.type === 'reschedule' && '📅'}
                                  {suggestion.type === 'combine' && '🔄'}
                                  {suggestion.type === 'sequence' && '⏭️'}
                                </span>
                                <span className="text-white font-medium capitalize">
                                  {suggestion.type.replace('-', ' ')}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-1">{suggestion.description}</p>
                            <p className="text-gray-400 text-xs">{suggestion.impact}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                        Apply Suggestion
                      </button>
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                        Manual Resolution
                      </button>
                      <button className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition">
                        Ignore Conflict
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'coordination' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Care Coordination Timeline */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Care Coordination Timeline</h3>
              
              <div className="space-y-4">
                {/* Coordinated appointment sequences */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    🩺 Diabetes Management Sequence
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <div className="text-white font-medium">Lab Work (Fasting)</div>
                        <div className="text-sm text-gray-400">June 22 • Complete by 8:00 AM</div>
                      </div>
                      <span className="ml-auto text-green-400">✓</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <div className="text-white font-medium">Primary Care Check-up</div>
                        <div className="text-sm text-gray-400">June 25 at 9:00 AM • Dr. Sarah Chen</div>
                      </div>
                      <span className="ml-auto text-blue-400">📅</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <div className="text-white font-medium">Endocrinology Follow-up</div>
                        <div className="text-sm text-gray-400">June 26 at 10:30 AM • Dr. Michael Torres</div>
                      </div>
                      <span className="ml-auto text-blue-400">📅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    ❤️ Cardiovascular Assessment
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <div className="text-white font-medium">EKG & Blood Pressure Log</div>
                        <div className="text-sm text-gray-400">June 27 • Prep for consultation</div>
                      </div>
                      <span className="ml-auto text-yellow-400">⏳</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <div className="text-white font-medium">Cardiology Consultation</div>
                        <div className="text-sm text-gray-400">June 28 at 8:30 AM • Dr. Lisa Rodriguez</div>
                      </div>
                      <span className="ml-auto text-blue-400">📅</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Scheduling Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Smart Features</h3>
              
              {/* Auto-coordination settings */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Auto-Coordination Settings</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Auto-book available slots</div>
                      <div className="text-sm text-gray-400">Automatically confirm appointments when provider approves</div>
                    </div>
                    <button className="w-12 h-6 bg-green-500 rounded-full p-1 transition">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Smart conflict resolution</div>
                      <div className="text-sm text-gray-400">Automatically resolve scheduling conflicts when possible</div>
                    </div>
                    <button className="w-12 h-6 bg-green-500 rounded-full p-1 transition">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Preparation reminders</div>
                      <div className="text-sm text-gray-400">Send reminders for fasting, medications, etc.</div>
                    </div>
                    <button className="w-12 h-6 bg-green-500 rounded-full p-1 transition">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Coordination insights */}
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">📊 Coordination Insights</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Average time between related appointments:</span>
                    <span className="text-white font-semibold">2.3 days</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Coordination efficiency score:</span>
                    <span className="text-green-400 font-semibold">94%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Auto-resolved conflicts:</span>
                    <span className="text-blue-400 font-semibold">7 this month</span>
                  </div>
                </div>
              </div>

              {/* Provider coordination status */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Provider Coordination</h4>
                
                <div className="space-y-3">
                  {providers.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: provider.color }}
                        ></div>
                        <div>
                          <div className="text-white font-medium">{provider.name}</div>
                          <div className="text-sm text-gray-400">{provider.specialty}</div>
                        </div>
                      </div>
                      <span className="text-green-400 text-sm">✓ Connected</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}