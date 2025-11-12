"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { getConstitutionData } from "@/lib/constitution-data";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useApp();
  const allConstitutionData = getConstitutionData(language);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Hide chatbot on language selection page
  if (pathname === "/language-selection") {
    return null;
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
          language: language || "English",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Expecting data to be an array of results
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: data.results || [],
          originalQuestion: userMessage,
        },
      ]);
    } catch (error) {
      console.error("[v0] Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: [],
          error: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result) => {
    const partFound = allConstitutionData.parts.find(
      (x) => x.partNumber === result.partNumber
    );
    if (!partFound) return;
    const articleIndex = partFound.articles.findIndex(
      (article) => article.title === result.articleTitle
    );
    if (articleIndex === -1) return;
    router.push(`/parts/${result.partNumber}/articles/${articleIndex}`);
    setIsOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-white"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-background border-2 border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
            <h3 className="font-bold text-lg">Constitution Assistant</h3>
            <p className="text-xs opacity-90">
              Ask questions about the constitution
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ask me anything about the Nepal Constitution!</p>
                <p className="text-xs mt-2">
                  Try: "What are the fundamental rights?" or "What are the laws
                  of equality of religious beliefs?"
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "user" ? (
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                    {message.content}
                  </div>
                ) : (
                  <div className="space-y-2 max-w-[90%]">
                    {message.error ? (
                      <div className="bg-destructive/10 text-destructive rounded-2xl rounded-tl-sm px-4 py-2">
                        {message.error}
                      </div>
                    ) : message.content.length > 0 ? (
                      <>
                        <div className="text-sm text-muted-foreground px-2">
                          Found {message.content.length} results:
                        </div>
                        {message.content.map((result, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleResultClick(result)}
                            className="w-full bg-card hover:bg-accent/10 border border-border rounded-xl p-3 text-left transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="font-semibold text-sm text-foreground mb-1">
                              {result.articleTitle}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {result.partTitle}
                            </div>
                            <div className="text-xs text-primary mt-1">
                              Click to view →
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2">
                        No results found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl px-4 py-2 transition-colors duration-200"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
