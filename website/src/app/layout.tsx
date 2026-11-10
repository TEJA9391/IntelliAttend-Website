import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = "https://www.intelliattend.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "IntelliAttend | Intelligent Attendance. Smart Campus.",
    template: "%s | IntelliAttend",
  },
  description:
    "From 1-tap attendance and timetable scheduling to fee payments and SmartBoard displays—run your entire campus from one unified platform at your fingertips.",
  keywords: [
    "attendance management",
    "campus management",
    "smart board",
    "faculty portal",
    "student portal",
    "AI attendance",
    "campus analytics",
    "educational technology",
    "university management",
    "school management",
    "attendance software",
    "campus automation",
  ],
  authors: [{ name: "IntelliAttend" }],
  creator: "IntelliAttend",
  publisher: "IntelliAttend",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "IntelliAttend",
    title: "IntelliAttend | Intelligent Attendance. Smart Campus.",
    description:
      "From 1-tap attendance and timetable scheduling to fee payments and SmartBoard displays—run your entire campus from one unified platform at your fingertips.",
    images: [
      {
        url: `${baseUrl}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: "IntelliAttend - Intelligent Campus Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliAttend | Intelligent Attendance. Smart Campus.",
    description:
      "From 1-tap attendance and timetable scheduling to fee payments and SmartBoard displays—run your entire campus from one unified platform at your fingertips.",
    images: [`${baseUrl}/images/og-default.png`],
    creator: "@intelliattend",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: "your-google-search-console-verification-code",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex flex-col font-sans">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1 relative overflow-x-hidden">{children}</main>
          <ChatWidget />
          <FeedbackWidget />
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
