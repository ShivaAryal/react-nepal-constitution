"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { getConstitutionData } from "@/lib/constitution-data"

export default function PartsListPage() {
  const { language, fontSize } = useApp()
  const router = useRouter()
  const [parts, setParts] = useState([])

  useEffect(() => {
    if (!language) {
      router.push("/language-selection")
      return
    }

    const data = getConstitutionData(language)
    setParts(data.parts)
  }, [language, router])

  if (!language) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {language === "english" ? "Parts of Constitution" : "संविधानका भागहरू"}
            </h1>
            <p className="text-muted-foreground">
              {language === "english"
                ? `Browse through all ${parts.length} parts of the Nepal Constitution`
                : `नेपालको संविधानका ${parts.length} भागहरू हेर्नुहोस्`}
            </p>
          </div>

          <div className="grid gap-4">
            {parts.map((part, index) => (
              <motion.div
                key={part.partNumber}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300 group"
                  onClick={() => router.push(`/parts/${part.partNumber}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">{part.partNumber}</span>
                        </div>
                        <h3
                          className={`font-semibold text-foreground group-hover:text-primary transition-colors ${fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : fontSize === "xlarge" ? "text-2xl" : "text-lg"}`}
                        >
                          {part.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-13">
                        {part.articles.length} {language === "english" ? "Articles" : "धाराहरू"}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
