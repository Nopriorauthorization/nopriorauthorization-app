import { NextRequest, NextResponse } from "next/server";

/**
 * NPA Phase 6: Governance Policies API
 * 
 * Public endpoint returning NPA's governance policies,
 * ethical boundaries, and explicit "Do Not Build" list.
 * 
 * This must be documented and agreed to.
 */

// GET - Return all governance policies
export async function GET(request: NextRequest) {
  return NextResponse.json({
    version: "1.0",
    lastUpdated: "2026-02-01",

    // ========================================
    // CORE PRINCIPLES (NON-NEGOTIABLE)
    // ========================================
    corePrinciples: [
      {
        id: "patient-authority",
        title: "Patient Remains Root Authority",
        description:
          "The patient is the ultimate owner and controller of their health data. No entity can override patient decisions about their own data.",
        enforced: true,
      },
      {
        id: "no-silent-access",
        title: "No Silent Access, Ever",
        description:
          "Every access to patient data must be logged, auditable, and visible to the patient. There are no hidden backdoors.",
        enforced: true,
      },
      {
        id: "no-phi-monetization",
        title: "No PHI Monetization",
        description:
          "Personal health information is never sold, rented, or monetized. Patient trust is not for sale.",
        enforced: true,
      },
      {
        id: "no-diagnostic-authority",
        title: "No Diagnostic Authority",
        description:
          "NPA does not diagnose, recommend treatments, or replace clinical judgment. We organize information, not interpret it medically.",
        enforced: true,
      },
      {
        id: "no-vendor-lock-in",
        title: "No Vendor Lock-In",
        description:
          "Patients can export all their data at any time with one click. If users can't leave, they won't trust us.",
        enforced: true,
      },
      {
        id: "no-data-hoarding",
        title: "No Data Hoarding",
        description:
          "We collect only what's necessary for the service. Patient data belongs to patients, not to NPA's analytics.",
        enforced: true,
      },
    ],

    // ========================================
    // EXPLICIT "DO NOT BUILD" LIST
    // ========================================
    doNotBuildList: {
      statement:
        "The following features will NEVER be built, regardless of technical feasibility, business pressure, or external requests. This list protects the company and the mission.",
      items: [
        {
          feature: "Automatic Provider Access",
          reason:
            "All provider access must be explicitly authorized by the patient. No automatic sharing.",
          category: "access-control",
        },
        {
          feature: "Silent Data Sharing",
          reason:
            "No data leaves the patient's control without explicit, logged consent.",
          category: "privacy",
        },
        {
          feature: "AI Diagnosis or Treatment Advice",
          reason:
            "NPA is not a medical provider. We organize information, not practice medicine.",
          category: "medical-safety",
        },
        {
          feature: "Risk Scoring Without Clinician",
          reason:
            "Health risk assessments require clinical oversight. NPA does not assess risk.",
          category: "medical-safety",
        },
        {
          feature: "Data Resale or Ad Targeting",
          reason:
            "PHI is never monetized. Patient trust is not a revenue stream.",
          category: "privacy",
        },
        {
          feature: "Insurance Decision Engines",
          reason:
            "NPA does not make or influence coverage decisions. We serve patients, not payers.",
          category: "ethics",
        },
        {
          feature: "Mandatory Usage Enforcement",
          reason:
            "Patients can leave anytime. We don't trap users or penalize departure.",
          category: "ethics",
        },
        {
          feature: "Social Features on Health Data",
          reason:
            "Health information is private. No public profiles, sharing feeds, or social mechanics.",
          category: "privacy",
        },
        {
          feature: "Behavioral Manipulation",
          reason:
            "No dark patterns, addiction mechanics, or manipulative UX in health contexts.",
          category: "ethics",
        },
        {
          feature: "Third-Party Data Sales",
          reason:
            "Patient data is never shared with third parties for their commercial benefit.",
          category: "privacy",
        },
      ],
    },

    // ========================================
    // SECURITY POLICIES
    // ========================================
    securityPolicies: {
      dataRetention: {
        title: "Data Retention Policy",
        description:
          "Patient data is retained only as long as the patient maintains an active account. Upon deletion request, all data is permanently removed within 30 days.",
        retentionPeriods: {
          activeAccount: "Indefinite (patient-controlled)",
          deletedAccount: "30 days maximum",
          auditLogs: "7 years (legal requirement)",
          anonymizedAnalytics: "Indefinite",
        },
      },
      breachResponse: {
        title: "Breach Response Plan",
        description:
          "In the event of a data breach, NPA commits to immediate action and transparency.",
        steps: [
          "Immediate containment and assessment",
          "Notification to affected patients within 72 hours",
          "Notification to regulators as required by law",
          "Public disclosure of breach scope and remediation",
          "Free identity protection for affected patients",
          "Post-incident review and security hardening",
        ],
      },
      incidentLogging: {
        title: "Incident Logging",
        description:
          "All security incidents, attempted breaches, and anomalous access patterns are logged and reviewed.",
        logged: [
          "Failed authentication attempts",
          "Unusual access patterns",
          "Rate limit violations",
          "API abuse attempts",
          "Emergency access usage",
        ],
      },
      keyRotation: {
        title: "Key Rotation Policy",
        description:
          "Encryption keys and secrets are rotated regularly to limit exposure.",
        schedule: {
          encryptionKeys: "Annually",
          apiSecrets: "Quarterly",
          sessionSecrets: "Monthly",
          emergencyKeys: "After any emergency access event",
        },
      },
    },

    // ========================================
    // REQUIRED LEGAL LANGUAGE
    // ========================================
    legalLanguage: {
      missionStatement: {
        text: "No Prior Authorization exists to restore continuity and patient control in healthcare. It does not replace clinicians, does not diagnose, and does not monetize personal health data.",
        mustAppearIn: [
          "Governance page",
          "Privacy policy",
          "App store notes",
          "Investor materials",
        ],
      },
      medicalDisclaimer: {
        text: "No Prior Authorization is not a medical provider and does not provide medical advice. This service organizes health information but does not interpret, diagnose, or recommend treatment. Always consult qualified healthcare providers for medical decisions.",
        mustAppearIn: [
          "Signup flow",
          "Document intelligence features",
          "Share link pages",
          "Emergency access pages",
        ],
      },
      emergencyAccessDisclaimer: {
        text: "Emergency access allows temporary, read-only access to critical health information when you cannot consent. This access is audited, time-limited, and can be revoked at any time. By enabling emergency access, you acknowledge the risks and benefits of this feature.",
        mustAppearIn: ["Emergency access settings", "Emergency access pages"],
      },
      sharingDisclaimer: {
        text: "Access is granted by the patient and may be revoked at any time. Shared information reflects records as provided and does not constitute medical advice.",
        mustAppearIn: ["Share creation", "Provider view pages"],
      },
    },

    // ========================================
    // INSTITUTIONAL READINESS (WITHOUT INSTITUTIONAL CONTROL)
    // ========================================
    institutionalReadiness: {
      description:
        "NPA is prepared for future institutional partnerships without compromising patient ownership.",
      principles: [
        "API-first architecture for interoperability",
        "Read-only institutional access (patient-granted only)",
        "Patient-revocable scopes for all institutional access",
        "No bulk data access under any circumstances",
        "No background syncing or automatic data collection",
        "All institutional access logged and visible to patients",
      ],
      futureCapabilities: [
        "Research participation (opt-in only)",
        "Hospital pilot programs (patient-controlled)",
        "Government data portability compliance",
        "FHIR/CCDA import (patient-initiated only)",
      ],
      neverAllowed: [
        "Institutional override of patient decisions",
        "Bulk patient data exports to institutions",
        "Automatic institutional enrollment",
        "Hidden institutional data sharing",
      ],
    },

    // ========================================
    // COMPLIANCE STATEMENT
    // ========================================
    complianceStatement:
      "NPA is designed to comply with HIPAA, state privacy laws, and emerging healthcare data regulations. Patient rights always take precedence over operational convenience.",

    // ========================================
    // FOUNDER SIGN-OFF
    // ========================================
    founderSignOff: {
      required: true,
      statement:
        "I confirm that these governance policies represent the ethical foundation of No Prior Authorization. Any deviation requires explicit founder approval and documented justification.",
    },
  });
}
