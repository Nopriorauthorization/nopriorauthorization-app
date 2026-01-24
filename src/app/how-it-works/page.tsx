export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-8">
        <h1 className="text-5xl font-bold mb-8">How It Works</h1>
        <p className="text-xl text-white/80 mb-8">
          No Prior Authorization is your complete healthcare management platform.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 rounded-lg p-6">
            <div className="text-4xl mb-4">🏰</div>
            <h3 className="text-xl font-semibold mb-2">Sacred Vault</h3>
            <p className="text-white/70">Securely store all your medical records in one place.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Your Blueprint</h3>
            <p className="text-white/70">Get personalized health insights and recommendations.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <div className="text-4xl mb-4">🌳</div>
            <h3 className="text-xl font-semibold mb-2">Family Health Tree</h3>
            <p className="text-white/70">See patterns across generations before they become problems.</p>
          </div>
        </div>
        <a
          href="/vault"
          className="inline-block bg-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-pink-700 transition"
        >
          Enter the Sacred Vault
        </a>
      </div>
    </div>
  );
}