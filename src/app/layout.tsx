import type { Metadata } from "next";
import "@/styles/globals.css";
import SessionWrapper from "@/components/shared/SessionWrapper";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "PitchID — AI Video Profile Platform",
  description: "Replace traditional resumes with AI-powered video introductions. Record, share, and get hired faster.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <SessionWrapper>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
