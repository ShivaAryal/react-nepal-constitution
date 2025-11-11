"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function SplashScreen() {
  const { isInitialized, language } = useApp()
  const router = useRouter()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => {
        if (language) {
          router.push("/parts")
        } else {
          router.push("/language-selection")
        }
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [isInitialized, language, router])

  if (!show) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
            />
            <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-foreground">Nepal Constitution</h1>
          <p className="text-muted-foreground text-lg">नेपालको संविधान</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
