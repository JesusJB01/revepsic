import './globals.css'
import { Providers } from "./providers";
import NavMenu from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Revepsic',
  description: 'Explora la ciencia detrás de la mente en nuestro blog de divulgación psicológica. Descubre investigaciones, tendencias y enfoques innovadores de expertos en psicología. Sumérgete en el fascinante mundo de la mente y la conducta.',
 
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-slate-800">
      <Providers>
      <header >
            <NavMenu />
          </header>
        <main className="min-h-screen ">
          {children}
        </main>
        <Footer/>
        </Providers>
      </body>
    </html>
  )
}
