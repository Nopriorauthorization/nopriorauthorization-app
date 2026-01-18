"use client";

import Image from "next/image";

interface BeauToxProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showName?: boolean;
}

const sizes = {
  sm: { width: 40, height: 40 },
  md: { width: 60, height: 60 },
  lg: { width: 100, height: 100 },
  xl: { width: 150, height: 150 },
};

export default function BeauTox({
  size = "md",
  className = "",
  showName = false,
}: BeauToxProps) {
  const { width, height } = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Placeholder - replace with actual mascot image */}
      <div
        className="relative rounded-full bg-gradient-to-br from-hot-pink to-hot-pink-dark flex items-center justify-center text-white font-bold overflow-hidden"
        style={{ width, height }}
      >
        {/* Check if mascot image exists, otherwise show placeholder */}
        <Image
          src="/mascot/beau-tox.png"
          alt="Beau-Tox™ Mascot"
          width={width}
          height={height}
          className="object-cover"
          onError={(e) => {
            // Hide broken image and show fallback
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Fallback text shown if image fails */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: width * 0.3 }}
        >
          BT
        </span>
      </div>
      {showName && (
        <span className="mt-2 font-semibold text-gray-900">Beau-Tox™</span>
      )}
    </div>
  );
}

// Chat avatar variant
export function BeauToxAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-hot-pink to-hot-pink-dark flex items-center justify-center ${className}`}>
      <Image
        src="/mascot/beau-tox.png"
        alt="Beau-Tox"
        width={32}
        height={32}
        className="object-cover"
      />
    </div>
  );
}
