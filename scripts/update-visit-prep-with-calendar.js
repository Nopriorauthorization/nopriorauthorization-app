const fs = require('fs');
const path = require('path');

// Read the current file
const currentFile = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'appointment-prep', 'page.tsx'),
  'utf8'
);

// Add calendar events state and fetch logic after existing state
const updatedFile = currentFile
  // Add calendar events state after existing states
  .replace(
    'const [loading, setLoading] = useState(true);',
    `const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [calendarConnected, setCalendarConnected] = useState(false);`
  )
  // Add calendar fetch in the effect
  .replace(
    `useEffect(() => {
    if (status === "authenticated") {
      fetchVisitPrep();
    }
  }, [status]);`,
    `useEffect(() => {
    if (status === "authenticated") {
      fetchVisitPrep();
      fetchCalendarEvents();
    }
  }, [status]);`
  )
  // Add calendar fetch function after fetchVisitPrep
  .replace(
    `const fetchVisitPrep = async () => {
    try {
      const res = await fetch("/api/vault/visit-prep");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch visit prep:", error);
    } finally {
      setLoading(false);
    }
  };`,
    `const fetchVisitPrep = async () => {
    try {
      const res = await fetch("/api/vault/visit-prep");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch visit prep:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const res = await fetch("/api/vault/calendar/sync");
      if (res.ok) {
        const json = await res.json();
        setCalendarEvents(json.events || []);
        setCalendarConnected(json.connected || false);
      }
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
    }
  };`
  )
  // Add calendar events section after upcoming appointments section
  .replace(
    /{\/\* Upcoming Appointments \*\/}[\s\S]*?<\/div>\s*<\/div>\s*\)\s*\)}/m,
    function(match) {
      return match + `\n\n        {/* Calendar Events (From Google Calendar) */}
        {calendarConnected && calendarEvents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                📅 Calendar Events
              </h2>
              <Link
                href="/vault/settings"
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Manage →
              </Link>
            </div>
            <div className="space-y-3">
              {calendarEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-blue-400/10 to-blue-400/5 border border-blue-400/30 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{event.summary}</h3>
                      <p className="text-sm text-blue-300 mt-1">
                        {new Date(event.startTime).toLocaleDateString()} at{" "}
                        {new Date(event.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-400/20 text-blue-300 rounded text-xs font-medium">
                      From Google Calendar
                    </span>
                  </div>
                  {event.location && (
                    <p className="text-sm text-white/60 mt-2">
                      📍 {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-white/60 mt-2">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 text-center">
              Calendar events are read-only and filtered for health-related appointments
            </p>
          </div>
        )}

        {/* Calendar Not Connected Banner */}
        {!calendarConnected && (
          <div className="bg-gradient-to-r from-purple-400/10 to-blue-400/10 border border-purple-400/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📅</span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Optional: Connect Your Calendar
                  </h3>
                  <p className="text-white/70 text-sm mb-3">
                    See your Google Calendar appointments here alongside your manual entries. Read-only access—we never modify your calendar.
                  </p>
                  <Link
                    href="/vault/settings"
                    className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition text-sm"
                  >
                    Connect Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}`;
    }
  );

const outputPath = path.join(
  __dirname,
  '..',
  'src',
  'app',
  '(dashboard)',
  'appointment-prep',
  'page.tsx'
);

fs.writeFileSync(outputPath, updatedFile, 'utf8');

console.log('✅ Visit Prep page updated with calendar events integration');
