import type { Metadata } from "next"
import { fontSans, fontDisplay, fontMono } from "@/lib/fonts"
import { Providers } from "@/providers/providers"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: 'Roshis Rai — Full-Stack Software Engineer',
    template: '%s | Roshis Rai',
  },
  description:
    'Full-Stack Software Engineer building scalable web apps, APIs & intelligent systems.',
  metadataBase: new URL('https://roshisrai.com'),
  openGraph: {
    title: 'Roshis Rai — Full-Stack Software Engineer',
    description:
      'I design and build end-to-end applications, from frontend UX to backend architecture.',
    url: 'https://roshisrai.com',
    siteName: 'Roshis Rai',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Inline script to prevent theme flash (Runs before React hydration)
const themeScript = `
  (function(){
    try {
      if (typeof window === 'undefined') return;
      var theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {}
  })();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
