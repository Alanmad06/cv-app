"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ToggleButton({
  iconFirst,
  iconLast,
}: {
  iconFirst: React.ReactNode;
  iconLast: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors duration-300 ease-in-out dark:bg-gray-700"
      >
        <span className="sr-only">Toggle theme</span>
        <div
          className={`${
            theme === "dark"
              ? "translate-x-6 bg-white text-black"
              : "translate-x-1 bg-gray-700 text-white"
          } inline-flex h-4 w-4 transform items-center justify-center rounded-full transition-transform duration-300 ease-in-out`}
        >
          {theme === "dark" ? iconFirst : iconLast}
        </div>
      </button>
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={handleToggle}
        className="hidden"
      />
    </div>
  );
}
