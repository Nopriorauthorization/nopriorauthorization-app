import ChatInterface from "@/components/chat/chat-interface";
import WidgetTracker from "@/components/provider/widget-tracker";

export default function WidgetPage() {
  return (
    <main className="min-h-screen bg-white">
      <WidgetTracker />
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-800">
          Verified by No Prior Authorization
        </span>
        <span className="text-gray-500">Educational only</span>
      </div>
      <div className="h-[calc(100vh-52px)]">
        <ChatInterface />
      </div>
    </main>
  );
}
