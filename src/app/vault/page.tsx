"use client";

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Sacred Vault</h1>
      <p className="text-gray-300 mb-8">Welcome to your healthcare vault</p>

      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Features</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
            <div>
              <h3 className="text-lg font-medium">Family Tree</h3>
              <p className="text-gray-300">Interactive family health mapping</p>
            </div>
            <span className="text-green-400">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
            <div>
              <h3 className="text-lg font-medium">Sacred Vault Dashboard</h3>
              <p className="text-gray-300">Complete health intelligence platform</p>
            </div>
            <span className="text-green-400">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
            <div>
              <h3 className="text-lg font-medium">Blueprint</h3>
              <p className="text-gray-300">Your health record builder</p>
            </div>
            <span className="text-green-400">Active</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-400 mb-4">Your healthcare platform is ready!</p>
        <p className="text-sm text-gray-500">Contact support if you need help accessing specific features.</p>
      </div>
    </div>
  );
}
