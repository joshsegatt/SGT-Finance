"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
        <Monitor className="w-4 h-4" />
      </Button>
    );
  }

  function cycle() {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="rounded-full w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
      title={`Theme: ${theme}`}
    >
      {theme === "dark" && <Moon className="w-4 h-4" />}
      {theme === "light" && <Sun className="w-4 h-4" />}
      {theme === "system" && <Monitor className="w-4 h-4" />}
    </Button>
  );
}
