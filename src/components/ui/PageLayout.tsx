import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-pink-400">
      <div className="max-w-4xl mx-auto p-6">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {title}
              </h1>
            )}
            {subtitle && <p className="text-pink-300 text-lg">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}