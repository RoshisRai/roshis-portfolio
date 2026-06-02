import type { Metadata } from "next"
import Script from "next/script"
import { fontSans, fontDisplay, fontMono } from "@/lib/fonts"
import { Providers } from "@/providers/providers"
import "./globals.css"
import { LayoutShell } from "@/components/layout/layout-shell"

const SITE_URL = "https://roshis.dev"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Roshis Rai — Full-Stack Software Engineer",
    template: "%s | Roshis Rai",
  },

  description:
    "Full-Stack Software Engineer specializing in scalable web applications, system design, APIs, and AI-powered systems.",

  applicationName: "Roshis Rai Portfolio",

  keywords: [
    "Roshis Rai",
    "Roshis Rai Portfolio",
    "Full Stack Engineer",
    "Software Developer Portfolio",
    "Next.js Developer",
    "React Node.js Developer",
    "TypeScript Engineer",
    "Django Full Stack Developer",
    "AI Engineer Portfolio",
    "RAG Systems Developer",
    "LLM Integration Engineer",
    "Remote Software Engineer"
  ],

  authors: [{ name: "Roshis Rai" }],
  creator: "Roshis Rai",
  publisher: "Roshis Rai",

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: "Roshis Rai — Full-Stack Software Engineer",
    description:
      "Portfolio showcasing full-stack engineering projects, scalable systems, and AI-powered applications.",
    url: SITE_URL,
    siteName: "Roshis Rai Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Roshis Rai Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Roshis Rai — Full-Stack Software Engineer",
    description:
      "Full-stack engineer building scalable systems and AI-powered applications.",
    images: [`/images/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

const themeScript = `
  (function () {
    try {
      var theme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");

      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {}
  })();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />

        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  )
}