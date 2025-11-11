"use client"

import { use, useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { getConstitutionData } from "@/lib/constitution-data"
import { Copy, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PartDetailPage({ params }) {
  const unwrappedParams = use(params)
  const { language, fontSize, playAudio } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [part, setPart] = useState(null)

  useEffect(() => {
    if (!language) {
      router.push("/language-selection")
      return
    }

    const data = getConstitutionData(language)
    const foundPart = data.parts.find((p) => p.partNumber === Number.parseInt(unwrappedParams.partNumber))
    setPart(foundPart)
  }, [language, unwrappedParams.partNumber, router])

  const copyPartText = () => {
    if (!part) return
    const text = `${part.title}\n\n${part.articles.map((a) => `${a.title}\n${a.text}`).join("\n\n")}`
    navigator.clipboard.writeText(text)
    toast({
      title: language === "english" ? "Copied!" : "प्रतिलिपि गरियो!",
      description:
        language === "english" ? "Part content copied to clipboard" : "भागको सामग्री क्लिपबोर्डमा प्रतिलिपि गरियो",
    })
  }

  const speakPartText = () => {
    if (!part) return
    const text = `${part.title}. ${part.articles.map((a) => `${a.title}. ${a.text}`).join(". ")}`
    playAudio(text, part.title)
    toast({
      title: language === "english" ? "Playing Audio" : "अडियो बजाउँदै",
      description: language === "english" ? "Reading part content aloud" : "भागको सामग्री पढ्दै",
    })
  }

  if (!language || !part) return null

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/parts")} className="mb-2 -ml-3">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {language === "english" ? "Back to Parts" : "भागहरूमा फर्कनुहोस्"}
              </Button>

              <h1
                className={`font-bold text-foreground ${fontSize === "small" ? "text-2xl" : fontSize === "large" ? "text-4xl" : fontSize === "xlarge" ? "text-5xl" : "text-3xl"}`}
              >
                {part.title}
              </h1>
              <p className="text-muted-foreground">
                {part.articles.length} {language === "english" ? "Articles" : "धाराहरू"}
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={copyPartText}
                title={language === "english" ? "Copy all articles" : "सबै धाराहरू प्रतिलिपि गर्नुहोस्"}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={speakPartText}
                title={language === "english" ? "Listen to all articles" : "सबै धाराहरू सुन्नुहोस्"}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {part.articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300 group"
                  onClick={() => router.push(`/parts/${part.partNumber}/articles/${index}`)}
                >
                  <div className="space-y-3">
                    <h3
                      className={`font-semibold text-foreground group-hover:text-primary transition-colors ${fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : fontSize === "xlarge" ? "text-2xl" : "text-lg"}`}
                    >
                      {article.title}
                    </h3>
                    <p
                      className={`text-muted-foreground line-clamp-2 ${fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-base" : fontSize === "xlarge" ? "text-lg" : "text-sm"}`}
                    >
                      {article.text}
                    </p>
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
