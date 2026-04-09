import Link from "next/link"
import { Sparkles } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import UserMenu from "./_components/header/UserMenu"

import { Sidebar } from "@/app/(main)/_components/sidebar"
import { Header } from "@/app/(main)/_components/header"

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // ถ้าไม่ได้ Login → Redirect ไปหน้า Login
    if (!session) {
        redirect("/auth/signin")
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

// Nav Link Component
function NavLink({
    href,
    icon,
    children,
}: {
    href: string
    icon: string
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition"
        >
            <span className="text-base">{icon}</span>
            <span className="hidden sm:inline">{children}</span>
        </Link>
    )
}