"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/teams", label: "Teams" },
    { href: "/countries", label: "Countries" },
    { href: "/seasons", label: "Seasons" },
    { href: "/players/search", label: "Player Search" },
  ];

  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        {/* Top bar with menu button for mobile */}
        <div className="flex items-center justify-between py-4 md:hidden">
          <h1 className="text-xl font-bold">NBA Zone</h1>
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <NavigationMenu className="hidden md:flex py-4">
          <NavigationMenuList className="gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref legacyBehavior>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    "text-lg font-semibold"
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Nav (toggle visible on click) */}
        {isOpen && (
          <div className="flex flex-col space-y-2 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref legacyBehavior>
                <a
                  className="block px-4 py-2 rounded-md text-lg font-medium text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
