"use client"

import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pause, Play, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AudioPlayer() {
  const { audioState, language, pauseAudio, resumeAudio, stopAudio } = useApp()

  if (!audioState.currentText) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-lg border-primary/20 shadow-xl">
          <div className="flex items-center gap-4 p-4">
            <Button
              size="icon"
              variant={audioState.isPlaying ? "default" : "outline"}
              onClick={audioState.isPlaying ? pauseAudio : resumeAudio}
              className="flex-shrink-0"
            >
              {audioState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{audioState.currentTitle}</p>
              <p className="text-xs text-muted-foreground">
                {audioState.isPlaying
                  ? language === "english"
                    ? "Playing..."
                    : "बजिरहेको छ..."
                  : language === "english"
                    ? "Paused"
                    : "रोकिएको"}
              </p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={stopAudio}
              className="flex-shrink-0"
              title={language === "english" ? "Close" : "बन्द गर्नुहोस्"}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {audioState.isPlaying && (
            <div className="h-1 bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
