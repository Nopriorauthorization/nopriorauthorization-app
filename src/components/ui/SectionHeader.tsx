import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
        {title}
      </h2>
      {subtitle && <p className="text-pink-300">{subtitle}</p>}
    </div>
  );
}