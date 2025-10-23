import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TestiFlow - Collect Testimonials Effortlessly",
  description: "Create beautiful testimonial collection spaces, embed them anywhere, and showcase authentic customer feedback to build trust and grow your business.",
  keywords: ["testimonials", "reviews", "feedback", "customer reviews", "social proof"],
  authors: [{ name: "TestiFlow Team" }],
  openGraph: {
    title: "TestiFlow - Collect Testimonials Effortlessly",
    description: "Create beautiful testimonial collection spaces, embed them anywhere, and showcase authentic customer feedback to build trust and grow your business.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}