'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const slides = [
  {
    title: "Your health. Your family.",
    subtitle: "Finally in one place."
  },
  {
    title: "Sacred Vault",
    subtitle: "All your records. Secure. Connected."
  },
  {
    title: "Your Blueprint",
    subtitle: "Know what matters next."
  },
  {
    title: "Family Health Tree",
    subtitle: "See patterns before they become problems."
  }
];

export default function HeroSplitSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= slides.length - 1) return;
    const timer = setTimeout(() => setIndex(index + 1), 2000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="w-full min-h-screen bg-black flex items-center justify-center px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT IMAGE */}
        <motion.img
          src="/nopriornew.png"
          alt="No Prior Authorization System Overview"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full rounded-xl shadow-2xl"
        />

        {/* RIGHT TEXT */}
        <div className="relative h-[320px]">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {slides[index].title}
            </h1>
            <p className="text-xl text-pink-400">
              {slides[index].subtitle}
            </p>
          </motion.div>

          {index === slides.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-40 flex gap-4"
            >
              <a
                href="/vault"
                className="px-6 py-3 rounded-full bg-pink-600 text-white font-semibold"
              >
                Enter the Sacred Vault
              </a>
              <a
                href="/blueprint"
                className="px-6 py-3 rounded-full border border-pink-500 text-pink-400"
              >
                Build Your Blueprint
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}