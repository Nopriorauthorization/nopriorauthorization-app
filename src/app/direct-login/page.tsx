"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DirectLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'danielleglazier@yahoo.com',
          password: 'admin123'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Login successful! But session not set. Redirecting to admin page anyway...');
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Direct Admin Login</h1>
        
        <div className="mb-6 space-y-2 text-sm text-gray-400">
          <p>Email: danielleglazier@yahoo.com</p>
          <p>Password: admin123</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-hot-pink hover:bg-hot-pink-dark text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>

        <p className="mt-6 text-xs text-gray-500">
          This bypasses NextAuth to test if credentials work
        </p>
      </div>
    </div>
  );
}
