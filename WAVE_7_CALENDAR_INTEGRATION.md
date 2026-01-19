# Wave 7: Visit Prep Intelligence + Calendar Integration

## 🎯 Objective
Help users feel prepared and confident for healthcare visits without overwhelming them.

## ✅ Completed Features

### 1. Visit Prep Intelligence API
**File:** `src/app/api/vault/visit-prep/route.ts`

**Data Synthesis (6+ sources):**
- Upcoming appointments (next 30 days)
- Active priorities (questions, bring-items, follow-ups)
- Care team context (top 3 members)
- Active care plans (goals + questions)
- Recent documents (last 30 days)
- Recent changes (new docs/appointments within 7 days)

**Returns:**
```typescript
{
  upcomingAppointments: Array,
  questionsToAsk: Array,
  thingsToBring: Array,
  pendingFollowUps: Array,
  recentChanges: Array,
  discussionItems: Array,
  careTeamContext: Array,
  isEmpty: boolean,
  generatedAt: string
}
```

### 2. Visit Prep Intelligence Page
**File:** `src/app/(dashboard)/appointment-prep/page.tsx`

**UI Sections (10+):**
- 🧘 Calm Intelligence Banner (educational framing)
- 📅 Upcoming Appointments (green gradient cards)
- 📅 Calendar Events (from Google Calendar, optional)
- ❓ Questions to Ask (numbered list with sources)
- 🎒 Things to Bring (grid with category icons)
- 💬 Discussion Items (care plan goals)
- 📝 Recent Changes (docs + appointments)
- 📞 Pending Follow-ups
- 👥 Care Team Context (top 3 members)
- Quick Actions Grid
- Refresh Button

**Design Philosophy:**
- Calm gradient background (slate → purple)
- Soft colors, rounded corners, breathing space
- Smart assistant feel, NOT clinical advisor
- Educational messaging prominent
- User-pulled (not pushed notifications)

### 3. Google Calendar Integration (Read-Only)

#### OAuth Setup
**Files:**
- `src/app/api/vault/calendar/route.ts` - OAuth initiation + connection status
- `src/app/api/vault/calendar/callback/route.ts` - OAuth callback handler
- `src/app/api/vault/calendar/sync/route.ts` - Calendar event sync

**Features:**
- Read-only access (`calendar.readonly` scope)
- OAuth2 flow with Google
- Stores tokens in UserMemory.preferences JSON field
- Smart filtering (health-related keywords only)
- Shows next 90 days of events
- Auto-refreshes tokens

**Health Keyword Filtering:**
```javascript
["doctor", "dr.", "appointment", "clinic", "hospital", "medical", 
 "dentist", "therapy", "checkup", "consultation", "exam", "screening", 
 "vaccination", "vaccine", "physical", "lab", "test", "imaging", 
 "mri", "ct scan", "x-ray", "ultrasound"]
```

#### Calendar Settings Page
**File:** `src/app/vault/settings/page.tsx`

**Features:**
- Connect/Disconnect Google Calendar
- Connection status display
- Last sync timestamp
- OAuth callback handling
- Privacy notice
- "How It Works" explanation

**User Flow:**
1. User clicks "Connect Google Calendar"
2. Redirects to Google OAuth consent screen
3. User grants read-only calendar access
4. Callback stores tokens in user preferences
5. Calendar events appear in Visit Prep page

### 4. Calendar Display Integration

**Visit Prep Page Updates:**
- Fetches calendar events on load
- Displays calendar events in separate section
- Labels events "From Google Calendar"
- Shows connection banner if not connected
- Link to settings for management

## 📋 Environment Setup

### Required Environment Variables
Add to `.env.local`:

```bash
# Google Calendar Integration (Read-Only)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Google Cloud Console Setup

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Create new project (or use existing)
   - Enable "Google Calendar API"

2. **Configure OAuth Consent Screen:**
   - OAuth consent screen → External
   - App name: "Sacred Vault"
   - User support email: your email
   - Developer contact: your email
   - Scopes: Add `https://www.googleapis.com/auth/calendar.readonly`
   - Test users: Add your email for testing

3. **Create OAuth Credentials:**
   - Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Name: "Sacred Vault Calendar Integration"
   - Authorized redirect URIs:
     - http://localhost:3000/api/vault/calendar/callback (development)
     - https://your-production-domain.com/api/vault/calendar/callback (production)
   - Copy Client ID and Client Secret to `.env.local`

### Dependencies
```bash
npm install googleapis
```

## 🔒 Security & Privacy

### Read-Only Access
- Only requests `calendar.readonly` scope
- Cannot create, modify, or delete calendar events
- Cannot access other Google services

### Data Storage
- Tokens stored in `UserMemory.preferences` (JSON field)
- No calendar data cached permanently
- Events fetched on-demand
- User can disconnect at any time

### Token Management
- Access tokens auto-refresh via refresh token
- Expired tokens trigger reconnection flow
- Disconnect clears all tokens immediately

### Smart Filtering
- Only shows health-related appointments
- Filters by keyword matching in title/description
- Prevents data leakage of personal events

## 🎨 Design Principles

### Calm Intelligence
- No urgency indicators
- No alerts or notifications
- Educational framing ("not a clinical advisor")
- Smart assistant metaphor
- User-pulled (not pushed)

### Invisible & Optional
- Calendar integration is opt-in
- Works perfectly without calendar
- No pressure to connect
- Easy disconnect

### Educational Only
- NO clinical recommendations
- NO diagnoses
- NO treatment suggestions
- NO urgency scoring

## 📊 User Flows

### First Visit (No Calendar)
1. User opens Visit Prep page
2. Sees upcoming appointments from manual entries
3. Sees banner: "Optional: Connect Your Calendar"
4. Can use all features without connecting

### Connecting Calendar
1. Click "Connect Calendar" in Visit Prep or Settings
2. Redirects to Google OAuth
3. Grant read-only calendar access
4. Returns to settings with success message
5. Calendar events appear in Visit Prep

### Using Visit Prep
1. Open Visit Prep before appointment
2. Review synthesized information:
   - Upcoming appointments (manual + calendar)
   - Questions to ask (from priorities + care plans)
   - Things to bring (from priorities + vault documents)
   - Discussion items (care plan goals)
   - Recent changes (new docs, new appointments)
   - Care team context
3. Feel prepared and confident

### Disconnecting Calendar
1. Go to Settings → Calendar
2. Click "Disconnect"
3. Confirm action
4. Tokens cleared immediately
5. Calendar events no longer appear

## 🧪 Testing Checklist

### Manual Testing
- [ ] OAuth flow completes successfully
- [ ] Tokens stored in database
- [ ] Calendar events fetch and display
- [ ] Health keyword filtering works
- [ ] "From Google Calendar" label shows
- [ ] Disconnect clears tokens
- [ ] Visit Prep works without calendar
- [ ] Error handling for expired tokens
- [ ] Privacy notice displays correctly

### Edge Cases
- [ ] No upcoming appointments
- [ ] No calendar events match health keywords
- [ ] Token expiration during sync
- [ ] User denies OAuth permission
- [ ] Calendar not connected
- [ ] Multiple calendar events same day
- [ ] All-day events display correctly

## 📈 Success Metrics (User-Defined)

- ✅ Users can open app before appointment and feel less anxious
- ✅ Visit Prep feels personalized, calm, and useful
- ✅ Calendar integration feels invisible and optional
- ✅ No new liability vectors introduced
- ✅ No demo data exists anywhere

## 🚀 Deployment Notes

### Before Production
1. Update Google OAuth redirect URIs with production domain
2. Move Google Cloud project to production mode
3. Test OAuth flow on production URL
4. Verify environment variables set on hosting platform

### Monitoring
- Watch for OAuth failures
- Monitor calendar sync errors
- Track token expiration/refresh rates
- Check health keyword filter effectiveness

## 🔮 Future Enhancements (NOT in Wave 7)

- Two-way sync (write to calendar) - requires user approval
- Calendar event categorization
- Appointment preparation checklists
- Pre-visit reminders (opt-in)
- Multi-calendar support
- Outlook/Apple Calendar integration

## 📝 Technical Notes

### Database Schema
No migrations needed - uses existing `UserMemory.preferences` JSON field:

```typescript
preferences: {
  calendarIntegration: {
    enabled: boolean,
    connected: boolean,
    lastSync: string | null,
    email: string | null,
    accessToken: string,
    refreshToken: string,
    expiryDate: number
  }
}
```

### API Routes
- `GET /api/vault/calendar` - Connection status
- `POST /api/vault/calendar` - Connect/disconnect
- `GET /api/vault/calendar/callback` - OAuth callback
- `GET /api/vault/calendar/sync` - Fetch calendar events

### Error Handling
- Token expiration → Clear settings, prompt reconnect
- OAuth denial → Show user-friendly message
- Sync failure → Degrade gracefully, show cached data
- No calendar access → Hide calendar section

## ✅ Wave 7 Complete

**Build Status:** ✅ Passing  
**Pages Converted:** 17/28 (61%)  
**Waves Completed:** 7/7  

**Next Steps:** Checkpoint before visualization layers (Journey, Metrics, Alerts, Communication, Wellness Coach, Recommendations, Patterns, Provider Portal, Photos, Rewards)
