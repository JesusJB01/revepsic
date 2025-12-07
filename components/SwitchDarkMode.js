"use client";

import React from "react";
import { useTheme } from "next-themes";
// TODO: Replace with shadcn/ui button/dropdown later
import { Moon, Sun } from "lucide-react";

export default function SwitchDarkMode() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
         <Sun className="h-5 w-5" />
      ) : (
         <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
