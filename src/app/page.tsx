export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Ask Beau-Tox</h1>
      <p className="text-gray-300 mb-8">Welcome to your healthcare platform</p>
      <div className="space-y-4">
        <a href="/sacred-vault" className="block bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          Sacred Vault
        </a>
        <a href="/vault/family-tree" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Family Tree
        </a>
        <a href="/chat" className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Chat
        </a>
      </div>
    </div>
  );
}
