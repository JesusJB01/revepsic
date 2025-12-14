import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'REVEPSIC - Red Venezolana Para el Avance de la Psicología Científica',
  description: 'Explora la ciencia detrás de la mente en nuestro blog de divulgación psicológica. Descubre investigaciones, tendencias y enfoques innovadores de expertos en psicología.',
  keywords: ['psicología', 'psicología científica', 'Venezuela', 'investigación', 'evidencia'],
  authors: [{ name: 'REVEPSIC' }],
  openGraph: {
    title: 'REVEPSIC - Red Venezolana Para el Avance de la Psicología Científica',
    description: 'Líderes en la difusión y divulgación de la psicología basada en evidencia en Venezuela.',
    url: 'https://www.revepsic.com',
    siteName: 'REVEPSIC',
    locale: 'es_VE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REVEPSIC',
    description: 'Red Venezolana Para el Avance de la Psicología Científica',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}




