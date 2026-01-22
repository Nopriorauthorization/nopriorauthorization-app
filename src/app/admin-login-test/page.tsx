"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import Button from "@/components/ui/button";

export default function AdminLoginTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
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
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Login Test</h1>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-400 mb-4">
            This page tests the login credentials directly without NextAuth
          </p>
          <p className="mb-2">Email: danielleglazier@yahoo.com</p>
          <p className="mb-4">Password: admin123</p>
          
          <Button 
            onClick={testLogin} 
            isLoading={loading}
            variant="primary"
          >
            Test Login
          </Button>
        </div>

        {result && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
