"use client"

import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export default function LanguageSelection() {
  const { changeLanguage } = useApp()
  const router = useRouter()

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang)
    router.push("/parts")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold text-foreground">Select Language</h1>
          <p className="text-muted-foreground">भाषा छान्नुहोस्</p>
        </div>

        <div className="grid gap-4">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card
              className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300 group"
              onClick={() => handleLanguageSelect("english")}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">English</h3>
                  <p className="text-sm text-muted-foreground">Read in English</p>
                </div>
                <svg
                  className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card
              className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300 group"
              onClick={() => handleLanguageSelect("nepali")}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">नेपाली</h3>
                  <p className="text-sm text-muted-foreground">नेपालीमा पढ्नुहोस्</p>
                </div>
                <svg
                  className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground"
        >
          You can change language anytime from settings
        </motion.p>
      </motion.div>
    </div>
  )
}
