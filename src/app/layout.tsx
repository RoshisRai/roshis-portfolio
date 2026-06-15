import type { Metadata } from "next"
import Script from "next/script"

import { fontSans, fontDisplay, fontMono } from "@/lib/fonts"
import "./globals.css"
import { Providers } from "@/providers/providers"
import { LayoutShell } from "@/components/layout/layout-shell"

import { siteConfig } from "@/seo/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import {
    getWebsiteJsonLd,
    getPersonJsonLd
 } from "@/seo/jsonld"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  applicationName: `${siteConfig.name} Portfolio`,

  keywords: [
    `${siteConfig.name}`,
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

  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Portfolio`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
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

        <JsonLd data={getWebsiteJsonLd()} />
        <JsonLd data={getPersonJsonLd()} />

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}

                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  )
}