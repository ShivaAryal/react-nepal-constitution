"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState(null);
  const [fontSize, setFontSize] = useState("medium");
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentText: null,
    currentTitle: null,
  });
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLanguage = localStorage.getItem("language");
    const savedFontSize = localStorage.getItem("fontSize") || "medium";

    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setFontSize(savedFontSize);

    // Apply theme
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

    setIsInitialized(true);

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log(
        "[v0] Available voices:",
        voices.map((v) => `${v.name} (${v.lang})`)
      );
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
  };

  const playAudio = (text, title) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    let selectedVoice = null;

    if (language === "nepali") {
      selectedVoice = availableVoices.find(
        (voice) => voice.lang.includes("ne") || voice.lang.includes("NE")
      );
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(
          (voice) => voice.lang.includes("hi") || voice.lang.includes("HI")
        );
      }
      utterance.lang = "ne-NP";
    } else {
      selectedVoice = availableVoices.find(
        (voice) => voice.lang.includes("en-US") || voice.lang.includes("en-GB")
      );
      utterance.lang = "en-US";
      console.log(
        "[v0] Selected voice for English:",
        selectedVoice?.name || "default"
      );
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setAudioState({
        isPlaying: false,
        currentText: null,
        currentTitle: null,
      });
    };

    utterance.onerror = (event) => {
      console.error("[v0] Audio error:", event);
      setAudioState({
        isPlaying: false,
        currentText: null,
        currentTitle: null,
      });
    };

    speechSynthesis.speak(utterance);
    setAudioState({ isPlaying: true, currentText: text, currentTitle: title });
  };

  const pauseAudio = () => {
    speechSynthesis.pause();
    setAudioState((prev) => ({ ...prev, isPlaying: false }));
  };

  const resumeAudio = () => {
    speechSynthesis.resume();
    setAudioState((prev) => ({ ...prev, isPlaying: true }));
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setAudioState({ isPlaying: false, currentText: null, currentTitle: null });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        language,
        fontSize,
        isInitialized,
        audioState,
        availableVoices,
        toggleTheme,
        changeLanguage,
        changeFontSize,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
