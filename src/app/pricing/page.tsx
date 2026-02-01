export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-8">
        <h1 className="text-5xl font-bold mb-8">Pricing</h1>
        <p className="text-xl text-white/80 mb-12">
          Simple, transparent pricing for complete healthcare management.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal">/month</span></div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Basic document storage
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Family health overview
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Limited AI insights
              </li>
            </ul>
            <a
              href="/signup"
              className="block bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition"
            >
              Get Started
            </a>
          </div>

          <div className="bg-gradient-to-b from-pink-600 to-purple-600 rounded-lg p-8 border-2 border-pink-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-4">Premium</h3>
            <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal">/month</span></div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Unlimited document storage
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Advanced AI health insights
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Family health tree analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Priority support
              </li>
            </ul>
            <a
              href="/signup"
              className="block bg-white text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Start Free Trial
            </a>
          </div>

          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Everything in Premium
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Custom integrations
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Dedicated account manager
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                HIPAA compliance support
              </li>
            </ul>
            <a
              href="/contact"
              className="block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition"
            >
              Contact Sales
            </a>
          </div>
        </div>

        <p className="text-white/60">
          All plans include our core features: Sacred Vault, Your Blueprint, and Family Health Tree.
        </p>
      </div>
    </div>
  );
}