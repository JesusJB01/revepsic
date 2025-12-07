"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SwitchDarkMode from "./SwitchDarkMode";
import { Menu } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

    const menuItems = [
        { text: "Home", path: "/" },
        { text: "Nosotros", path: "/nosotros" },
        { text: "Contacto", path: "/contacto" },
        { text: "Team", path: "/equipo" },
        { text: "Blog", path: "/blog" },
        { text: "Jornada", path: "/postulacion" },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold">REVEPSIC</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex gap-6">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        pathname === item.path ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <SwitchDarkMode />

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col gap-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md hover:bg-accent",
                                        pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
