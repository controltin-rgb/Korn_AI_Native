import type { Metadata } from "next"
import { Inter, Sarabun } from "next/font/google"
import "./globals.css"

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
})

const sarabun = Sarabun({
    variable: "--font-sarabun",
    subsets: ["thai", "latin"],
    weight: ["100", "200", "300", "400"],
})

export const metadata: Metadata = {
    title: {
        default: "AI Native App",
        template: "%s | AI Native App",
    },
    description: "AI-Native Application with Next.js 16 & Better Auth",
    keywords: ["Next.js", "AI", "Authentication", "Better Auth", "RAG"],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        // <html lang="th" suppressHydrationWarning>
        <html lang="th" data-scroll-behavior="smooth">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var t = localStorage.getItem('theme');
                                    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                        document.documentElement.classList.add('dark');
                                    }
                                } catch(e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body className={`${inter.variable} ${sarabun.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    )
}