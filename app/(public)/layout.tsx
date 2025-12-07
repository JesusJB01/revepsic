import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BackToTop from "@/components/BackToTop"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <BackToTop />
        </div>
    )
}
