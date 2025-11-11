"use client";

import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Type, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Header() {
  const { theme, toggleTheme, fontSize, changeFontSize, language } = useApp();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push("/parts")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          style={{ cursor: "pointer" }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="font-semibold text-foreground hidden sm:block">
            Nepal Constitution
          </span>
        </button>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Font Size"
                style={{ cursor: "pointer" }}
              >
                <Type className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeFontSize("small")}>
                <span className={fontSize === "small" ? "font-bold" : ""}>
                  {language === "english" ? "Small" : "सानो"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeFontSize("medium")}>
                <span className={fontSize === "medium" ? "font-bold" : ""}>
                  {language === "english" ? "Medium" : "मध्यम"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeFontSize("large")}>
                <span className={fontSize === "large" ? "font-bold" : ""}>
                  {language === "english" ? "Large" : "ठूलो"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeFontSize("xlarge")}>
                <span className={fontSize === "xlarge" ? "font-bold" : ""}>
                  {language === "english" ? "Extra Large" : "धेरै ठूलो"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/language-selection")}
            title="Change Language"
            style={{ cursor: "pointer" }}
          >
            <Globe className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
            style={{ cursor: "pointer" }}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
