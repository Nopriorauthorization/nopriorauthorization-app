"use client";

import { useState } from "react";

export function ShopCategoryFilter({
  categories,
}: {
  categories: string[];
}) {
  const [active, setActive] = useState("All");

  const handleFilter = (cat: string) => {
    setActive(cat);
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLElement>("[data-category]");
    cards.forEach((card) => {
      if (cat === "All" || card.dataset.category === cat) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => handleFilter(cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            active === cat
              ? "bg-[#D4537E] text-white"
              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
