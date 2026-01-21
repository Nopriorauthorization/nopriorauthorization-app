import { NextRequest, NextResponse } from 'next/server';

// GET /api/provider-packet-interactive/templates
// Get available provider packet templates
export async function GET() {
  try {
    const templates = {
      comprehensive: {
        id: 'comprehensive',
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
        estimatedTime: 45,
        complianceLevel: 'hipaa',
        features: ['AI Suggestions', 'Progress Tracking', 'File Uploads']
      },
      focused: {
        id: 'focused',
        name: 'Focused Consultation',
        description: 'Targeted visit for specific concern',
        sections: [
          'Chief Concern',
          'Relevant History',
          'Current Status',
          'Questions for Provider',
          'Preparation Checklist'
        ],
        estimatedTime: 25,
        complianceLevel: 'hipaa',
        features: ['Quick Setup', 'Essential Info Only']
      },
      followup: {
        id: 'followup',
        name: 'Follow-up Visit',
        description: 'Post-treatment or routine follow-up',
        sections: [
          'Progress Update',
          'Current Symptoms',
          'Medication Changes',
          'Questions/Concerns',
          'Preparation Checklist'
        ],
        estimatedTime: 20,
        complianceLevel: 'standard',
        features: ['Progress Tracking', 'Symptom Logging']
      },
      urgent: {
        id: 'urgent',
        name: 'Urgent Care',
        description: 'Immediate attention needed',
        sections: [
          'Urgent Concern',
          'Current Symptoms',
          'Immediate Needs',
          'Emergency Contacts',
          'Preparation Checklist'
        ],
        estimatedTime: 15,
        complianceLevel: 'hipaa',
        features: ['Priority Flagging', 'Emergency Contacts']
      },
      preventive: {
        id: 'preventive',
        name: 'Preventive Care',
        description: 'Routine screening and prevention',
        sections: [
          'Screening History',
          'Risk Factors',
          'Preventive Goals',
          'Questions',
          'Preparation Checklist'
        ],
        estimatedTime: 30,
        complianceLevel: 'standard',
        features: ['Risk Assessment', 'Preventive Planning']
      }
    };

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}