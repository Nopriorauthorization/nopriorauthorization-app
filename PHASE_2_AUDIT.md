# Phase 2: Interactivity & Personalization Audit

**Goal:** Convert static/template pages → fully user-scoped, interactive, data-driven pages  
**Scope:** Wiring, state, data, navigation — **NO visual redesign**  
**Date:** January 19, 2026

---

## ✅ Already Dynamic (Production-Ready)

These pages are **already wired** and pulling user-specific data:

### 1. **Treatment Decoder** (`/vault/decoder`)
- **Status:** ✅ Fully Dynamic
- **Data Source:** Prisma (Document, DocumentDecode models)
- **Auth:** `resolveDocumentIdentity()` - user/anonId scoped
- **Features:**
  - Upload documents (PDF/images)
  - AI decode with OCR fallback
  - Save to Blueprint (UserMemory)
  - Add to Provider Packet
  - Rate limiting (10/hour per user)
  - Recent documents list (user-scoped)
- **Notes:** This is the gold standard - everything else should match this level

### 2. **Timeline** (`/vault/timeline`)
- **Status:** ✅ Partially Dynamic
- **Data Source:** `/api/vault/timeline` → fetches user's documents + chat sessions
- **Auth:** User-scoped via API
- **Features:**
  - Filters (all/documents/chats/milestones)
  - Click handlers for documents/chats
  - Empty states need improvement
- **Gaps:**
  - Missing milestones integration
  - Need better empty state messaging
  - No "add first item" CTAs

### 3. **Providers/Appointments** (`/vault/providers`)
- **Status:** ✅ Partially Dynamic
- **Data Source:** `/api/vault/appointments` → user's appointments
- **Auth:** User-scoped via API
- **Features:**
  - Fetches real appointments
  - Groups by upcoming/past
  - Add appointment form (needs testing)
- **Gaps:**
  - Still declares empty `providers` state (line 90: `const [providers] = useState<Provider[]>([])`)
  - This suggests providers list isn't populated yet
  - Need to wire provider CRUD

### 4. **Documents** (`/vault/documents`)
- **Status:** ✅ Assumed Dynamic (based on decoder using same DB)
- **Model:** Document (userId/anonId scoped)
- **Notes:** Need to verify this page exists and is wired

---

## 🔴 Static/Template Pages (Need Conversion)

These pages are **NOT pulling user data** and need full wiring:

### 5. **Main Vault Landing** (`/vault/page.tsx`)
- **Status:** 🔴 Static Navigation Hub
- **Current State:** 507 lines - likely hardcoded section cards
- **What It Should Do:**
  - Show user-specific quick stats
  - Recent activity feed
  - Personalized shortcuts
  - Empty states if new user
- **Action Needed:**
  - Audit line-by-line for hardcoded cards
  - Replace with dynamic data queries
  - Add "Getting Started" flow for new users

### 6. **Dashboard** (`/vault/dashboard`)
- **Status:** 🔴 Template Component Import
- **Current Code:**
  ```tsx
  import SacredVaultDashboard from '@/content/hero/SacredVaultDashboard';
  export default function DashboardPage() {
    return <SacredVaultDashboard />;
  }
  ```
- **Problem:** Importing from `/content/hero` = demo/marketing component
- **Action Needed:**
  - Create real dashboard with user data
  - Stats: total documents, recent chats, upcoming appointments
  - Should match `/vault` landing or replace it

### 7. **Snapshot** (`/vault/snapshot`)
- **Status:** 🔴 Unknown (201 lines - needs inspection)
- **Data Source:** `/api/vault/snapshot` exists
- **Action Needed:**
  - Verify API is user-scoped
  - Check if UI is fetching or static
  - Add interactivity if missing

### 8. **All Other Vault Pages** (Need Individual Audits)

| Page | Status | Priority | Notes |
|------|--------|----------|-------|
| `/vault/ai-insights` | 🔴 Unknown | Medium | AI features - check if using UserMemory |
| `/vault/alerts` | 🔴 Unknown | High | Should show user notifications |
| `/vault/analytics` | 🔴 Unknown | Medium | Document analytics |
| `/vault/appointments` | ✅ Dynamic | Low | Already wired (same as providers) |
| `/vault/care-plans` | 🔴 Unknown | Medium | Needs DB model check |
| `/vault/care-team` | 🔴 Unknown | Medium | Providers + appointments combo? |
| `/vault/communication` | 🔴 Unknown | Low | Chat redirects? |
| `/vault/document-analytics` | 🔴 Unknown | Medium | Duplicate of analytics? |
| `/vault/insights` | 🔴 Unknown | Medium | Duplicate of ai-insights? |
| `/vault/journey` | 🔴 Unknown | Low | Timeline variant? |
| `/vault/metrics` | 🔴 Unknown | Low | Health metrics tracking |
| `/vault/patterns` | 🔴 Unknown | Low | AI pattern detection |
| `/vault/personalization` | 🔴 Unknown | Low | Settings variant? |
| `/vault/photos` | 🔴 Static | Low | `useState<Photo[]>([])` = empty array |
| `/vault/priority` | 🔴 Unknown | Medium | Priority actions/tasks? |
| `/vault/provider-portal` | 🔴 Unknown | High | For providers to access user data? |
| `/vault/recommendations` | 🔴 Unknown | Medium | AI recommendations |
| `/vault/rewards` | 🔴 Unknown | Low | Gamification |
| `/vault/timeline-enhanced` | 🔴 Unknown | Low | Timeline variant |
| `/vault/wellness-coach` | 🔴 Unknown | Medium | AI coaching feature |

---

## 🗄️ Database Models Available

From `prisma/schema.prisma`:

### User-Scoped Models (Ready to Use)
- ✅ **User** - Base user record
- ✅ **UserMemory** - Blueprint/goals/insights (used by decoder)
- ✅ **Document** - Files uploaded by user (userId/anonId)
- ✅ **DocumentDecode** - AI decode results
- ✅ **ChatSession** - Chat conversations
- ✅ **Appointment** - Healthcare appointments
- ✅ **ProviderPacket** - Exported provider packets
- ✅ **Analytics** - User activity tracking
- ✅ **Subscription** - Billing/tier data

### Missing Models (Need Creation)
- ❌ **Provider** - Healthcare providers (name, specialty, contact)
- ❌ **CarePlan** - Treatment plans
- ❌ **Medication** - Prescriptions/meds
- ❌ **HealthMetric** - Vitals, lab results
- ❌ **Task/Reminder** - Action items
- ❌ **Note** - User notes/journal

---

## 🔧 API Routes Audit

### Existing User-Scoped APIs
- ✅ `/api/vault/timeline` - Timeline events
- ✅ `/api/vault/appointments` - Appointments
- ✅ `/api/vault/snapshot` - Snapshot generation
- ✅ `/api/decoder/*` - Document decode + integrations
- ✅ `/api/documents` - Document CRUD
- ✅ `/api/chat` - Chat sessions
- ✅ `/api/memory` - UserMemory access
- ✅ `/api/provider-packet` - Provider packet generation

### Missing APIs (Need Creation)
- ❌ `/api/vault/providers` - Provider CRUD
- ❌ `/api/vault/care-plans` - Care plan management
- ❌ `/api/vault/metrics` - Health metrics
- ❌ `/api/vault/insights` - AI insights aggregation
- ❌ `/api/vault/dashboard` - Dashboard stats
- ❌ `/api/vault/alerts` - User notifications

---

## 🎯 Phase 2 Implementation Plan

### **Wave 1: Foundation (Week 1)**
**Goal:** Get core pages pulling real user data

#### 1.1 Audit & Document Current State
- [ ] Read all 28 vault pages (10 min each = ~5 hours)
- [ ] Document which are static vs dynamic
- [ ] Identify duplicate functionality
- [ ] Create consolidated page map

#### 1.2 Fix Main Vault Landing (`/vault/page.tsx`)
- [ ] Replace hardcoded cards with user data
- [ ] Add quick stats (document count, recent activity)
- [ ] Empty state for new users ("Get started by...")
- [ ] Real navigation (not just visual cards)

#### 1.3 Replace Dashboard Template
- [ ] Remove `SacredVaultDashboard` import
- [ ] Build real dashboard with:
  - User stats (documents, chats, appointments)
  - Recent activity feed
  - Quick actions
  - Upcoming appointments
- [ ] Create `/api/vault/dashboard` endpoint

### **Wave 2: Core Features (Week 2)**
**Goal:** Wire up high-value features

#### 2.1 Providers Management
- [ ] Create Provider model in Prisma
- [ ] Build `/api/vault/providers` CRUD
- [ ] Wire providers list in `/vault/providers`
- [ ] Add provider creation flow
- [ ] Link providers to appointments

#### 2.2 Snapshot Enhancement
- [ ] Verify `/api/vault/snapshot` is user-scoped
- [ ] Wire UI to fetch real data
- [ ] Add download/share functionality
- [ ] Empty state if no data

#### 2.3 AI Insights Consolidation
- [ ] Audit `/vault/ai-insights` vs `/vault/insights`
- [ ] Choose one as canonical
- [ ] Wire to UserMemory.goals/insights
- [ ] Aggregate data from decoder + chat
- [ ] Show personalized recommendations

### **Wave 3: Polish & Interactivity (Week 3)**
**Goal:** Make every click do something meaningful

#### 3.1 Navigation & Routing
- [ ] Audit all tab components
- [ ] Ensure tabs update state or navigate
- [ ] Add URL params for shareable state
- [ ] Breadcrumbs for deep navigation

#### 3.2 Cards & Detail Views
- [ ] Every card should:
  - Open detail modal OR
  - Navigate to detail page OR
  - Expand inline
- [ ] No dead/static cards allowed

#### 3.3 Empty States Everywhere
- [ ] Template: "No {thing} yet. [Action Button]"
- [ ] Examples:
  - "No providers yet. Add your first provider →"
  - "No documents yet. Upload your first file →"
  - "No insights yet. Chat with Beau-Tox to get started →"

### **Wave 4: Advanced Features (Week 4)**
**Goal:** Complete the ecosystem

#### 4.1 Care Plans
- [ ] Create CarePlan model
- [ ] Build care plan builder UI
- [ ] Link to providers + appointments
- [ ] Timeline integration

#### 4.2 Health Metrics
- [ ] Create HealthMetric model
- [ ] Metrics tracker UI
- [ ] Charts/graphs
- [ ] Export to provider packet

#### 4.3 Notifications/Alerts
- [ ] Wire `/vault/alerts` to real data
- [ ] Create Alert model or use existing
- [ ] Notification system
- [ ] Email/SMS integration (future)

---

## 🚨 Critical Rules

### Data Scoping
- ✅ **ALWAYS** filter by `userId` OR `anonId`
- ✅ **NEVER** show shared/global data
- ✅ **EVERY** query must include user scope
- ✅ **TEST** auth boundaries (can user A see user B's data?)

### Empty States
- ✅ **NO** example/sample data in production
- ✅ **SHOW** helpful empty states
- ✅ **INCLUDE** clear CTAs
- ✅ **GUIDE** users to create content

### Navigation
- ✅ **NO** dead buttons/tabs/cards
- ✅ **EVERY** click does something
- ✅ **USE** modals, routes, or state changes
- ✅ **PROVIDE** feedback on actions

### Testing
- ✅ **TEST** with fresh user account
- ✅ **VERIFY** no data bleeds between users
- ✅ **CHECK** empty states render correctly
- ✅ **ENSURE** all features work for anon users too

---

## 📋 Next Immediate Actions

### Before Writing Code:
1. **Review this audit** - confirm scope & priorities
2. **Pick Wave 1 or start with specific page**
3. **Get confirmation** on which pages to prioritize
4. **Clarify** any duplicate features (insights vs ai-insights, etc.)

### When Ready to Code:
1. Start with `/vault/page.tsx` (main landing)
2. Then `/vault/dashboard` (replace template)
3. Then `/vault/providers` (finish wiring)
4. Continue systematically through priority list

---

## 🎯 Success Criteria

**Phase 2 is complete when:**
- ✅ Every page shows only user-specific data
- ✅ Every button/tab/card does something
- ✅ New users see helpful empty states
- ✅ No example/sample data in production
- ✅ All critical features are interactive
- ✅ App feels private and personalized

**Timeline:** 3-4 weeks (1 wave per week)

---

## Questions for You

1. **Priority order:** Do you want to start with Wave 1 (foundation), or a specific high-value feature?
2. **Duplicate pages:** Should we consolidate insights/ai-insights, timeline/timeline-enhanced, etc.?
3. **Provider Portal:** Is `/vault/provider-portal` for providers to VIEW patient data, or is it for patients to manage provider access?
4. **Rewards/Gamification:** Keep this or deprioritize?
5. **New user flow:** Should we build an onboarding wizard?

---

**Ready to proceed?** Let me know which wave or page to start with! 🚀
