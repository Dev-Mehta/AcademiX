"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.querySelector(".radix-themes");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      root?.classList.add("dark");
      setTheme("dark");
    } else {
      root?.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const toggleMode = () => {
    const root = document.querySelector(".radix-themes");

    if (theme === "dark") {
      root?.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      root?.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleMode}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
