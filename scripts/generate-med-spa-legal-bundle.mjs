/**
 * Generates HTML templates for med-spa-legal-startup-bundle (34 documents).
 * Run: node scripts/generate-med-spa-legal-bundle.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "forms");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(docTitle, formTitle, subtitle, inner) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(docTitle)}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/forms/msl-legal-bundle.css">
</head>
<body>
<div class="page">
<div class="header">
<div>
<div class="clinic-name">Hello <span>Gorgeous</span></div>
<div class="clinic-tagline">Med Spa · Oswego, Illinois</div>
</div>
<div>
<div class="form-title">${formTitle}</div>
<div class="form-subtitle">${subtitle}</div>
</div>
</div>
<div class="legal-banner">
<strong>Important — template, not legal advice</strong>
This is a generic editable template. Your jurisdiction may impose additional or different requirements (including corporate practice of medicine, scope of practice, and med spa rules). Have a licensed attorney in your state review and customize before use. No attorney–client relationship is created by this document.
</div>
${inner}
<div class="footer-note">Editable template for your practice. Replace all bracketed placeholders. Not a substitute for legal counsel.</div>
</div>
</body>
</html>`;
}

function parties() {
  return `<div class="section"><div class="sh pink">Parties</div>
<div class="field-row"><label>Practice legal name</label><span class="line"></span></div>
<div class="field-row"><label>Practice address</label><span class="line"></span></div>
<div class="field-row"><label>Individual name</label><span class="line"></span></div>
<div class="field-row"><label>Individual address</label><span class="line"></span></div>
<div class="field-row"><label>Effective date</label><span class="line"></span></div>
</div>`;
}

function sig() {
  return `<div class="sig-grid">
<div class="sig-block"><label>Practice authorized signature</label><div class="sig-line"></div><div class="sig-hint">Name &amp; title · Date</div></div>
<div class="sig-block"><label>Individual signature</label><div class="sig-line"></div><div class="sig-hint">Printed name · Date</div></div>
</div>`;
}

function employmentCore(roleLabel) {
  return `${parties()}
<div class="section"><div class="sh">1. Position &amp; duties</div>
<p class="p">The Employee is engaged as <b>${esc(roleLabel)}</b>. Duties include clinical oversight, chart review, policy compliance, and other responsibilities assigned in writing by the Practice that are consistent with the Employee’s license and applicable law.</p>
</div>
<div class="section"><div class="sh">2. Compensation</div>
<p class="p">Base compensation: <span class="blank"></span> per <span class="blank"></span>. Bonuses and production-based amounts (if any): <span class="blank"></span>. Pay dates: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">3. Schedule &amp; location</div>
<p class="p">Primary work location: <span class="blank"></span>. Expected schedule: <span class="blank"></span>. Remote work (if allowed): <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">4. Term &amp; termination</div>
<p class="p">At-will employment unless otherwise required by contract addendum. Either party may terminate with written notice as follows: <span class="blank"></span>. Grounds for immediate termination include license loss, material breach, or conduct jeopardizing patient safety or the Practice.</p>
</div>
<div class="section"><div class="sh">5. Compliance &amp; credentials</div>
<p class="p">Employee maintains active licensure, DEA (if applicable), malpractice insurance as required, and completes HIPAA, OSHA, and facility training. Employee must notify the Practice within five (5) days of any investigation, restriction, or complaint affecting credentials.</p>
</div>
<div class="section"><div class="sh">6. Confidentiality &amp; non-disclosure</div>
<p class="p">Employee will protect PHI, trade secrets, pricing, client lists, and business methods. Obligations survive termination.</p>
</div>
<div class="section"><div class="sh">7. Non-solicitation (optional — edit per state law)</div>
<p class="p">For <span class="blank"></span> months after separation, Employee will not solicit Practice clients or employees, except as limited by state law.</p>
</div>
<div class="section"><div class="sh">8. Miscellaneous</div>
<p class="p">Governing law: State of <span class="blank"></span>. Entire agreement; amendments in writing. Dispute resolution: <span class="blank"></span>.</p>
</div>
${sig()}`;
}

function icCore(roleLabel) {
  return `${parties()}
<div class="section"><div class="sh">1. Independent contractor status</div>
<p class="p">Contractor is an independent contractor, not an employee. Contractor is responsible for taxes, benefits, and insurance unless otherwise required by law.</p>
</div>
<div class="section"><div class="sh">2. Services</div>
<p class="p">Contractor provides services as <b>${esc(roleLabel)}</b> in accordance with their license and the Practice’s policies. Scope: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">3. Compensation</div>
<p class="p">Fee structure: <span class="blank"></span>. Invoicing/payment terms: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">4. Term &amp; termination</div>
<p class="p">Term: <span class="blank"></span>. Termination: <span class="blank"></span> days’ notice, or immediately for breach or safety concerns.</p>
</div>
<div class="section"><div class="sh">5. Insurance &amp; indemnity</div>
<p class="p">Contractor maintains professional liability limits of not less than $<span class="blank"></span> per occurrence. Contractor indemnifies the Practice for claims arising from Contractor’s acts or omissions within scope, except to the extent caused by the Practice’s gross negligence.</p>
</div>
<div class="section"><div class="sh">6. Confidentiality</div>
<p class="p">Contractor protects PHI and confidential business information per HIPAA and Practice policies.</p>
</div>
<div class="section"><div class="sh">7. Miscellaneous</div>
<p class="p">Governing law: State of <span class="blank"></span>. Entire agreement; amendments in writing.</p>
</div>
${sig()}`;
}

function roomRentalCore() {
  return `${parties()}
<div class="section"><div class="sh">1. Premises</div>
<p class="p">Landlord grants Licensee use of treatment room(s) described as: <span class="blank"></span>, during hours: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">2. Rent &amp; fees</div>
<p class="p">Monthly rent or per diem: <span class="blank"></span>. Due date: <span class="blank"></span>. Late fee (if any): <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">3. Compliance</div>
<p class="p">Licensee maintains own malpractice insurance, follows facility policies, and uses space only for lawful scope of practice. Licensee indemnifies Landlord for claims arising from Licensee’s services except Landlord’s gross negligence.</p>
</div>
<div class="section"><div class="sh">4. Term &amp; termination</div>
<p class="p">Term: <span class="blank"></span>. Either party may terminate on <span class="blank"></span> days’ written notice.</p>
</div>
${sig()}`;
}

const DOCS = [
  {
    file: "MSL-01-Medical-Director-Employment.html",
    id: "msl-md-employment",
    name: "Medical Director — Employment Agreement",
    title: "Medical Director<br>Employment Agreement",
    sub: "Employment · at-will / customize per state",
    body: () => employmentCore("Medical Director"),
  },
  {
    file: "MSL-02-Medical-Director-Independent-Contractor.html",
    id: "msl-md-ic",
    name: "Medical Director — Independent Contractor Agreement",
    title: "Medical Director<br>Independent Contractor Agreement",
    sub: "Contractor relationship · tax &amp; insurance",
    body: () => icCore("Medical Director"),
  },
  {
    file: "MSL-03-Cosmetic-Injector-Employment.html",
    id: "msl-ci-employment",
    name: "Cosmetic Injector — Employment Agreement",
    title: "Cosmetic Injector<br>Employment Agreement",
    sub: "NP / RN injectable provider",
    body: () => employmentCore("Cosmetic Injector (NP/RN)"),
  },
  {
    file: "MSL-04-Cosmetic-Injector-Independent-Contractor.html",
    id: "msl-ci-ic",
    name: "Cosmetic Injector — Independent Contractor Agreement",
    title: "Cosmetic Injector<br>Independent Contractor Agreement",
    sub: "NP / RN · contractor",
    body: () => icCore("Cosmetic Injector (NP/RN)"),
  },
  {
    file: "MSL-05-Cosmetic-Injector-Room-Rental.html",
    id: "msl-ci-room",
    name: "Cosmetic Injector — Room Rental Agreement",
    title: "Room Rental Agreement<br>Cosmetic Injector",
    sub: "Licensee use of treatment space",
    body: roomRentalCore,
  },
  {
    file: "MSL-06-Laser-Tech-Employment.html",
    id: "msl-lt-employment",
    name: "Laser Technician — Employment Agreement",
    title: "Cosmetic Laser Technician<br>Employment Agreement",
    sub: "Employment",
    body: () => employmentCore("Cosmetic Laser Technician"),
  },
  {
    file: "MSL-07-Laser-Tech-Independent-Contractor.html",
    id: "msl-lt-ic",
    name: "Laser Technician — Independent Contractor Agreement",
    title: "Cosmetic Laser Technician<br>Independent Contractor Agreement",
    sub: "Contractor",
    body: () => icCore("Cosmetic Laser Technician"),
  },
  {
    file: "MSL-08-Laser-Tech-Room-Rental.html",
    id: "msl-lt-room",
    name: "Laser Technician — Room Rental Agreement",
    title: "Room Rental Agreement<br>Laser Technician",
    sub: "Treatment space",
    body: roomRentalCore,
  },
  {
    file: "MSL-09-Medical-Aesthetician-Employment.html",
    id: "msl-maes-employment",
    name: "Medical Aesthetician — Employment Agreement",
    title: "Medical Aesthetician<br>Employment Agreement",
    sub: "Employment",
    body: () => employmentCore("Medical Aesthetician"),
  },
  {
    file: "MSL-10-Medical-Aesthetician-Independent-Contractor.html",
    id: "msl-maes-ic",
    name: "Medical Aesthetician — Independent Contractor Agreement",
    title: "Medical Aesthetician<br>Independent Contractor Agreement",
    sub: "Contractor",
    body: () => icCore("Medical Aesthetician"),
  },
  {
    file: "MSL-11-Medical-Assistant-Employment.html",
    id: "msl-ma-employment",
    name: "Medical Assistant — Employment Agreement",
    title: "Medical Assistant<br>Employment Agreement",
    sub: "Employment only",
    body: () => employmentCore("Medical Assistant"),
  },
  {
    file: "MSL-12-Front-Desk-Employment.html",
    id: "msl-fd-employment",
    name: "Front Desk Associate — Employment Agreement",
    title: "Front Desk Associate<br>Employment Agreement",
    sub: "Employment only",
    body: () => employmentCore("Front Desk Associate"),
  },
  {
    file: "MSL-13-Office-Manager-Employment.html",
    id: "msl-om-employment",
    name: "Office Manager — Employment Agreement",
    title: "Office Manager<br>Employment Agreement",
    sub: "Employment only",
    body: () => employmentCore("Office Manager"),
  },
  {
    file: "MSL-14-Collaborative-Practice-Agreement.html",
    id: "msl-cpa",
    name: "Med Spa Collaborative Practice Agreement (NP & Physician)",
    title: "Collaborative Practice Agreement",
    sub: "Nurse practitioner &amp; supervising physician",
    body: () =>
      `${parties()}
<div class="section"><div class="sh">1. Purpose</div>
<p class="p">This agreement defines the collaborative relationship required between Physician and Advanced Practice Provider (APP) under the laws of State of <span class="blank"></span> for med spa / aesthetic services.</p>
</div>
<div class="section"><div class="sh">2. Supervision model</div>
<p class="p">Method of collaboration (e.g., chart review frequency, availability, protocols): <span class="blank"></span>. Prescriptive authority (if applicable): <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">3. Quality assurance</div>
<p class="p">Peer review, adverse event reporting, and protocol updates: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">4. Term &amp; termination</div>
<p class="p">Term: <span class="blank"></span>. Either party may terminate with <span class="blank"></span> days’ notice or immediately for cause.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-15-Training-Repayment-Agreement.html",
    id: "msl-training-repay",
    name: "Medical Spa Training Repayment Agreement",
    title: "Training Repayment Agreement",
    sub: "Education costs &amp; retention",
    body: () =>
      `${parties()}
<div class="section"><div class="sh">1. Training investment</div>
<p class="p">The Practice will pay or reimburse training costs of $<span class="blank"></span> for: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">2. Service commitment</div>
<p class="p">Employee agrees to remain employed for <span class="blank"></span> months from completion. If Employee resigns or is terminated for cause before then, Employee repays a prorated amount per the schedule: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">3. Payroll deduction</div>
<p class="p">Repayment may be deducted from final wages where permitted by law: <span class="blank"></span>.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-16-Medical-Practice-Confidentiality.html",
    id: "msl-confidentiality",
    name: "Medical Practice Confidentiality Agreement",
    title: "Confidentiality &amp; Non-Disclosure Agreement",
    sub: "PHI, trade secrets, business information",
    body: () =>
      `${parties()}
<div class="section"><div class="sh">1. Confidential information</div>
<p class="p">Includes PHI, patient lists, financials, marketing plans, vendor terms, protocols, and software credentials.</p>
</div>
<div class="section"><div class="sh">2. Use &amp; non-disclosure</div>
<p class="p">Recipient uses information only for authorized business purposes and does not disclose except as required by law or with Practice written approval.</p>
</div>
<div class="section"><div class="sh">3. HIPAA</div>
<p class="p">Recipient complies with HIPAA, BAA (if applicable), and Practice policies.</p>
</div>
<div class="section"><div class="sh">4. Duration</div>
<p class="p">Obligations survive termination for as long as information remains confidential or per PHI rules.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-17-Med-Spa-Employee-Handbook.html",
    id: "msl-employee-handbook",
    name: "Med Spa Employee Handbook",
    title: "Employee Handbook",
    sub: "Policies &amp; expectations — customize fully",
    body: () =>
      `<div class="section"><div class="sh">Welcome &amp; mission</div>
<p class="p">Our mission: <span class="blank"></span>. This handbook summarizes workplace policies and is not a contract of employment.</p>
</div>
<div class="section"><div class="sh">Key policies (outline)</div>
<ol class="ol">
<li>Equal employment &amp; anti-harassment</li>
<li>Attendance, punctuality, dress code</li>
<li>HIPAA, privacy, social media, and photography</li>
<li>Drug-free workplace &amp; safety</li>
<li>Disciplinary process &amp; open-door reporting</li>
<li>PTO / benefits (if offered) — describe: <span class="blank"></span></li>
</ol>
</div>
<div class="section"><div class="sh">Acknowledgment</div>
<p class="p">I acknowledge receipt of the handbook and that policies may change with notice.</p>
${sig()}`,
  },
  {
    file: "MSL-18-Med-Spa-IC-Handbook.html",
    id: "msl-ic-handbook",
    name: "Med Spa Independent Contractor Handbook",
    title: "Independent Contractor Handbook",
    sub: "Facility rules for IC providers",
    body: () =>
      `<div class="section"><div class="sh">Facility standards</div>
<p class="p">Contractors must follow infection control, scheduling, charting in <span class="blank"></span>, emergency protocols, and brand standards.</p>
</div>
<div class="section"><div class="sh">Branding &amp; marketing</div>
<p class="p">Use of logo and patient testimonials: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Acknowledgment</div>
${sig()}`,
  },
  {
    file: "MSL-19-Med-Spa-Good-Faith-Exam.html",
    id: "msl-gfe",
    name: "Med Spa Good Faith Exam Documentation",
    title: "Good Faith Exam (GFE) Record",
    sub: "Physician / APP encounter documentation",
    body: () =>
      `<div class="section"><div class="sh pink">Patient &amp; visit</div>
<div class="field-row"><label>Patient name</label><span class="line"></span></div>
<div class="field-row"><label>DOB</label><span class="line"></span></div>
<div class="field-row"><label>Date of exam</label><span class="line"></span></div>
<div class="field-row"><label>Licensed examiner</label><span class="line"></span></div>
</div>
<div class="section"><div class="sh">Assessment</div>
<p class="p">History pertinent to planned treatment(s): <span class="blank"></span>. Physical / aesthetic assessment: <span class="blank"></span>. Contraindications ruled out: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Plan</div>
<p class="p">Treatment plan approved: <span class="blank"></span>. Orders / delegation to qualified staff (if applicable): <span class="blank"></span>.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-20-Injectable-Treatment-Record.html",
    id: "msl-injectable-record",
    name: "Injectable Treatment Record Form",
    title: "Injectable Treatment Record",
    sub: "Neuromodulator &amp; filler documentation",
    body: () =>
      `<div class="section"><div class="sh pink">Patient</div>
<div class="field-row"><label>Name</label><span class="line"></span></div>
<div class="field-row"><label>DOB · MRN</label><span class="line"></span></div>
</div>
<div class="section"><div class="sh">Treatment</div>
<p class="p">Product(s): <span class="blank"></span>. Lot #s: <span class="blank"></span>. Areas / units or mL: <span class="blank"></span>. Technique notes: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Adverse events</div>
<p class="p">None / describe: <span class="blank"></span>. Follow-up: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Provider</div>
<div class="field-row"><label>Name · credentials</label><span class="line"></span></div>
<div class="field-row"><label>Signature · date/time</label><span class="line"></span></div>
</div>`,
  },
  {
    file: "MSL-21-Dermal-Filler-Informed-Consent.html",
    id: "msl-filler-consent",
    name: "Dermal Filler Informed Consent",
    title: "Informed Consent — Dermal Filler",
    sub: "Risks, alternatives, acknowledgment",
    body: () =>
      `<div class="section"><div class="sh">Procedure</div>
<p class="p">Hyaluronic acid or other filler injection(s) to: <span class="blank"></span>. Benefits discussed: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Risks (non-exhaustive)</div>
<p class="p">Bruising, swelling, asymmetry, infection, vascular occlusion, tissue necrosis, blindness (rare), nodules, delayed inflammatory reaction, dissatisfaction with aesthetic outcome.</p>
</div>
<div class="section"><div class="sh">Alternatives</div>
<p class="p">No treatment, alternative products or volumes, surgical options as applicable.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-22-Neurotoxin-Informed-Consent.html",
    id: "msl-neuro-consent",
    name: "Neurotoxin Informed Consent",
    title: "Informed Consent — Neuromodulator",
    sub: "Botox / Dysport / Xeomin / Jeuveau",
    body: () =>
      `<div class="section"><div class="sh">Procedure</div>
<p class="p">Neuromodulator injection to: <span class="blank"></span>. Expected effect and duration discussed.</p>
</div>
<div class="section"><div class="sh">Risks</div>
<p class="p">Bruising, headache, ptosis, asymmetry, flu-like symptoms, spread to adjacent muscles (rare), unsatisfactory cosmetic result.</p>
</div>
<div class="section"><div class="sh">Pregnancy / breastfeeding</div>
<p class="p">Patient confirms understanding of manufacturer contraindications: <span class="blank"></span>.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-23-Laser-Resurfacing-Informed-Consent.html",
    id: "msl-laser-consent",
    name: "Cosmetic Laser Resurfacing Informed Consent",
    title: "Informed Consent — Laser Resurfacing",
    sub: "Ablative / fractional — edit for device",
    body: () =>
      `<div class="section"><div class="sh">Procedure</div>
<p class="p">Device / settings: <span class="blank"></span>. Area: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Risks</div>
<p class="p">Erythema, edema, pain, pigment changes, infection, scarring, prolonged healing, herpes simplex reactivation, eye injury (periorbital).</p>
</div>
<div class="section"><div class="sh">Pre &amp; post</div>
<p class="p">Patient agrees to pre-treatment prep and sun avoidance as instructed.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-24-Esthetician-Informed-Consent.html",
    id: "msl-esthetician-consent",
    name: "Esthetician Service Informed Consent",
    title: "Informed Consent — Esthetic Services",
    sub: "Facials, peels (esthetician scope), etc.",
    body: () =>
      `<div class="section"><div class="sh">Services</div>
<p class="p">Service(s): <span class="blank"></span>. Skin concerns: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Risks</div>
<p class="p">Irritation, redness, allergic reaction, photosensitivity, unsatisfactory outcome.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-25-Photo-Video-Release.html",
    id: "msl-photo-video-release",
    name: "Med Spa Photo &amp; Video Release",
    title: "Photo &amp; Video Release",
    sub: "Marketing &amp; educational use",
    body: () =>
      `<div class="section"><div class="sh">Grant</div>
<p class="p">I authorize <span class="blank"></span> to photograph / record my image and voice for: ☐ website ☐ social media ☐ internal training ☐ other: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">No PHI</div>
<p class="p">I understand marketing materials will not include my full name or other PHI without separate written consent.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-26-Waiver-Release-Liability.html",
    id: "msl-waiver-liability",
    name: "Med Spa Waiver &amp; Release of Liability",
    title: "Waiver &amp; General Release",
    sub: "Aesthetic services — enforceability varies by state",
    body: () =>
      `<div class="section"><div class="sh">Assumption of risk</div>
<p class="p">Patient acknowledges elective nature of services and assumes risks explained in informed consent(s) except gross negligence or willful misconduct to the extent not waivable under state law.</p>
</div>
<div class="section"><div class="sh">Release</div>
<p class="p">Patient releases the Practice and providers from claims arising from disclosed risks, to fullest extent permitted by law in <span class="blank"></span>.</p>
</div>
<p class="p"><b>Note:</b> Have counsel review enforceability; some jurisdictions limit releases for healthcare.</p>
${sig()}`,
  },
  {
    file: "MSL-27-HIPAA-Patient-Acknowledgment-Authorization.html",
    id: "msl-hipaa-ack-auth",
    name: "HIPAA Patient Acknowledgment &amp; Authorization",
    title: "Patient Acknowledgment &amp; Authorization",
    sub: "NPP receipt &amp; specific authorizations",
    body: () =>
      `<div class="section"><div class="sh">Notice of Privacy Practices</div>
<p class="p">I acknowledge receipt of the Notice of Privacy Practices dated <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Authorization (optional)</div>
<p class="p">I authorize disclosure of PHI to: <span class="blank"></span> for purpose: <span class="blank"></span>. Expires: <span class="blank"></span>.</p>
</div>
${sig()}`,
  },
  {
    file: "MSL-28-Appointments-Cancellation-Policy.html",
    id: "msl-cancellation-policy",
    name: "Med Spa Appointments &amp; Cancellation Policy",
    title: "Appointments &amp; Cancellation Policy",
    sub: "Patient-facing",
    body: () =>
      `<div class="section"><div class="sh">Scheduling</div>
<p class="p">Appointments are held with card on file / deposit: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Cancellation &amp; no-show</div>
<p class="p">Cancellations within <span class="blank"></span> hours may incur fee of <span class="blank"></span>. No-shows: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Late arrival</div>
<p class="p">Patients more than <span class="blank"></span> minutes late may be rescheduled.</p>
</div>`,
  },
  {
    file: "MSL-29-Return-Policy.html",
    id: "msl-return-policy",
    name: "Med Spa Return Policy",
    title: "Return &amp; Refund Policy",
    sub: "Retail / packages — customize",
    body: () =>
      `<div class="section"><div class="sh">Retail</div>
<p class="p">Unopened retail may be returned within <span class="blank"></span> days: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Services &amp; packages</div>
<p class="p">Services rendered are non-refundable. Unused package balance: <span class="blank"></span>.</p>
</div>`,
  },
  {
    file: "MSL-30-Financial-Payment-Policy.html",
    id: "msl-financial-policy",
    name: "Med Spa Financial &amp; Payment Policy",
    title: "Financial &amp; Payment Policy",
    sub: "Patient-facing",
    body: () =>
      `<div class="section"><div class="sh">Payment</div>
<p class="p">Payment due at time of service unless arranged in writing. Accepted methods: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Cards &amp; holds</div>
<p class="p">Card authorization / membership billing: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Collections</div>
<p class="p">Past-due accounts: <span class="blank"></span>.</p>
</div>`,
  },
  {
    file: "MSL-31-Website-Privacy-Policy.html",
    id: "msl-privacy-policy-web",
    name: "Website Privacy Policy",
    title: "Website Privacy Policy",
    sub: "Online collection — supplement HIPAA NPP",
    body: () =>
      `<div class="section"><div class="sh">Information we collect</div>
<p class="p">Website usage, cookies, contact forms, scheduling widgets, analytics: <span class="blank"></span>.</p>
</div>
<div class="section"><div class="sh">Use</div>
<p class="p">To respond to inquiries, improve services, and marketing (with consent where required).</p>
</div>
<div class="section"><div class="sh">Rights</div>
<p class="p">State privacy rights (e.g., CA, CO, VA) — add jurisdiction-specific sections with counsel.</p>
</div>`,
  },
  {
    file: "MSL-32-Terms-of-Use.html",
    id: "msl-terms-of-use",
    name: "Website Terms of Use",
    title: "Terms of Use",
    sub: "Site access &amp; limitations",
    body: () =>
      `<div class="section"><div class="sh">Use of site</div>
<p class="p">Informational only; not medical advice. No doctor–patient relationship from site use alone.</p>
</div>
<div class="section"><div class="sh">Intellectual property</div>
<p class="p">Content owned by Practice; limited license to browse.</p>
</div>
<div class="section"><div class="sh">Limitation of liability</div>
<p class="p">To maximum extent permitted by law: <span class="blank"></span>.</p>
</div>`,
  },
  {
    file: "MSL-33-Website-Disclaimers.html",
    id: "msl-disclaimers",
    name: "Website Disclaimers",
    title: "Medical &amp; General Disclaimers",
    sub: "Footer / educational content",
    body: () =>
      `<div class="section"><div class="sh">Medical disclaimer</div>
<p class="p">Content is educational and not a substitute for professional medical advice. Seek a qualified provider for personal recommendations.</p>
</div>
<div class="section"><div class="sh">Results</div>
<p class="p">Individual results vary. Photos may be illustrative.</p>
</div>
<div class="section"><div class="sh">Testimonials</div>
<p class="p">Testimonials reflect individual experience; not guaranteed outcomes.</p>
</div>`,
  },
  {
    file: "MSL-34-HIPAA-Notice-of-Privacy-Practices.html",
    id: "msl-hipaa-npp",
    name: "HIPAA Notice of Privacy Practices",
    title: "Notice of Privacy Practices",
    sub: "HIPAA · clinic NPP",
    body: () =>
      `<div class="section"><div class="sh">Required notice</div>
<p class="p">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS. PLEASE REVIEW CAREFULLY.</p>
</div>
<div class="section"><div class="sh">Summary outline</div>
<ol class="ol">
<li>Uses/disclosures for treatment, payment, healthcare operations</li>
<li>Patient rights (access, amendment, accounting, restrictions, complaint)</li>
<li>Our duties and contact information for Privacy Officer</li>
<li>Effective date and changes to notice</li>
</ol>
<p class="p"><b>Note:</b> Expand with full regulatory text or align with your comprehensive HIPAA-01 practice NPP. This is a short-form shell for the bundle.</p>
</div>`,
  },
];

function main() {
  if (DOCS.length !== 34) {
    throw new Error(`Expected 34 documents, got ${DOCS.length}`);
  }
  const manifestTemplates = [];
  for (const d of DOCS) {
    const html = shell(
      `${d.name.replace(/<[^>]+>/g, "")} — Hello Gorgeous`,
      d.title,
      d.sub,
      d.body()
    );
    fs.writeFileSync(path.join(OUT, d.file), html, "utf8");
    manifestTemplates.push({
      id: d.id,
      name: d.name.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      description: d.sub.replace(/&amp;/g, "&"),
      canvaTemplateUrl: `/forms/${d.file}`,
      _deliveryType: "html",
      format: "8.5x11",
      pages: d.file.includes("Handbook") || d.file.includes("NPP") ? 4 : 2,
      category: "legal",
    });
  }
  console.log(`Wrote ${DOCS.length} HTML files to ${OUT}`);

  const manifest = {
    productId: "med-spa-legal-startup-bundle",
    displayName: "Medical Spa Legal Startup Bundle",
    description:
      "34 editable med spa legal templates: hiring contracts (medical director, injector, laser tech, aesthetician, MA, front desk, office manager), collaborative practice agreement, training repayment, confidentiality, handbooks, good faith exam, treatment record, consents, releases, HIPAA and website policies. Attorney review required before use.",
    version: "1.0.0",
    priceUSD: 197,
    etsySku: "NPA-MSL-001",
    category: "legal",
    targetBuyer:
      "Med spa owners, practice managers, and attorneys assisting with aesthetic practice startup",
    templates: manifestTemplates,
    deliveryNote:
      "Templates are for customization by a licensed attorney in your jurisdiction. Not legal advice.",
    expirationDays: 365,
    importedAt: new Date().toISOString(),
  };

  const manifestPath = path.join(
    ROOT,
    "imports",
    "npa-manifests-and-spec",
    "med-spa-legal-startup-bundle.json"
  );
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Wrote ${manifestPath}`);

  const strictDir = path.join(
    ROOT,
    "imports",
    "npa-manifests-and-spec-prefilled-strict"
  );
  if (fs.existsSync(strictDir)) {
    fs.writeFileSync(
      path.join(strictDir, "med-spa-legal-startup-bundle.json"),
      JSON.stringify(manifest, null, 2) + "\n",
      "utf8"
    );
    console.log("Updated prefilled-strict copy");
  }
}

main();
