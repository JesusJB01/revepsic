"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { useState } from "react";
import SwitchDarkMode from "./SwitchDarkMode";
import { usePathname } from "next/navigation";

export default function NavMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Nosotros", path: "/nosotros" },
    { text: "Contacto", path: "/contacto" },
    { text: "Team", path: "/equipo" },
    { text: "Blog", path: "/blog" },
  ];
  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="shadow-xl dark:bg-slate-800 "
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />

        <NavbarBrand>
          <p className="font-bold text-inherit">REVEPSIC</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((menuItem) => (
          <NavbarItem key={menuItem.text} isActive={pathname === menuItem.path}>
            <Link
              color="foreground"
              href={menuItem.path}
              aria-current={pathname === menuItem.path ? "page" : undefined} // Agrega aria-current si el elemento está activo
              className={pathname === menuItem.path ? "text-yellow-500" : ""}
            >
              {menuItem.text}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <SwitchDarkMode />
      </NavbarContent>

      {/* menu responsive */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              /* color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              } */
              className="w-full"
              href={item.path}
              size="lg"
            >
              {item.text}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
