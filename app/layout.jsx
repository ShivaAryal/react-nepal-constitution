import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "@/contexts/AppContext";
import { AudioPlayer } from "@/components/AudioPlayer";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Nepal Constitution",
  description: "Constitution of Nepal - Read, Listen, and Understand",
  icons: {
    icon: "/web-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppProvider>
          {children}
          <AudioPlayer />
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
