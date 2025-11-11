"use client";

import { use, useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { getConstitutionData } from "@/lib/constitution-data";
import { Copy, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ArticlePage({ params }) {
  const unwrappedParams = use(params);
  const { language, fontSize, playAudio } = useApp();
  const router = useRouter();
  const { toast } = useToast();
  const [article, setArticle] = useState(null);
  const [part, setPart] = useState(null);
  const [articleIndex, setArticleIndex] = useState(0);

  useEffect(() => {
    if (!language) {
      router.push("/language-selection");
      return;
    }

    const data = getConstitutionData(language);
    const foundPart = data.parts.find(
      (p) => p.partNumber === Number.parseInt(unwrappedParams.partNumber)
    );
    const index = Number.parseInt(unwrappedParams.articleIndex);

    if (foundPart && foundPart.articles[index]) {
      setPart(foundPart);
      setArticle(foundPart.articles[index]);
      setArticleIndex(index);
    }
  }, [
    language,
    unwrappedParams.partNumber,
    unwrappedParams.articleIndex,
    router,
  ]);

  const copyArticleText = () => {
    if (!article) return;
    const text = `${article.title}\n\n${article.text}`;
    navigator.clipboard.writeText(text);
    toast({
      title: language === "english" ? "Copied!" : "प्रतिलिपि गरियो!",
      description:
        language === "english"
          ? "Article copied to clipboard"
          : "धारा क्लिपबोर्डमा प्रतिलिपि गरियो",
    });
  };

  const speakArticleText = () => {
    if (!article) return;
    const text = `${article.title}. ${article.text}`;
    playAudio(text, article.title);
    toast({
      title: language === "english" ? "Playing Audio" : "अडियो बजाउँदै",
      description:
        language === "english" ? "Reading article aloud" : "धारा पढ्दै",
    });
  };

  const goToPrevious = () => {
    if (articleIndex > 0) {
      router.push(
        `/parts/${unwrappedParams.partNumber}/articles/${articleIndex - 1}`
      );
    }
  };

  const goToNext = () => {
    if (part && articleIndex < part.articles.length - 1) {
      router.push(
        `/parts/${unwrappedParams.partNumber}/articles/${articleIndex + 1}`
      );
    }
  };

  if (!language || !article || !part) return null;

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/parts/${unwrappedParams.partNumber}`)}
            className="mb-2 -ml-3"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {language === "english" ? "Back to Part" : "भागमा फर्कनुहोस्"}
          </Button>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{part.title}</p>
                  <h1
                    className={`font-bold text-foreground ${
                      fontSize === "small"
                        ? "text-xl"
                        : fontSize === "large"
                        ? "text-3xl"
                        : fontSize === "xlarge"
                        ? "text-4xl"
                        : "text-2xl"
                    }`}
                  >
                    {article.title}
                  </h1>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyArticleText}
                    title={
                      language === "english"
                        ? "Copy article"
                        : "धारा प्रतिलिपि गर्नुहोस्"
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={speakArticleText}
                    title={
                      language === "english"
                        ? "Listen to article"
                        : "धारा सुन्नुहोस्"
                    }
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div
                className={`text-foreground leading-relaxed whitespace-pre-wrap ${
                  fontSize === "small"
                    ? "text-sm"
                    : fontSize === "large"
                    ? "text-lg"
                    : fontSize === "xlarge"
                    ? "text-xl"
                    : "text-base"
                }`}
              >
                {article.text.replace(
                  / \(([a-zA-Z0-9\u0900-\u097F])\)/g,
                  "\n($1)"
                )}
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={articleIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === "english" ? "Previous Article" : "अघिल्लो धारा"}
            </Button>

            <span className="text-sm text-muted-foreground">
              {articleIndex + 1} / {part.articles.length}
            </span>

            <Button
              variant="outline"
              onClick={goToNext}
              disabled={articleIndex === part.articles.length - 1}
            >
              {language === "english" ? "Next Article" : "अर्को धारा"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
