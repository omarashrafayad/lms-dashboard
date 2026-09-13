"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogIn,
  Search,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import { Input } from "../ui/input";
import { useCart } from "@/features/main/cart/hooks/useCart";

export default function Navbar() {
  const { data: cartData } = useCart();
  const cartCount = cartData?.numOfCartItems || 0;
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    ...(user?.role === "admin" ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <span className="font-bold text-xl hidden sm:block tracking-tight">Commerce</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${isActive
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary"
                    : "text-muted-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4">

            {/* Search - Desktop only */}
            <div className="hidden lg:flex items-center relative w-64 mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full h-9 rounded-full border border-input bg-muted/50 pl-10 pr-4 text-xs focus:bg-background transition-all focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <Link href="/wishlist">
              <button className="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-accent transition-colors">
                <Heart className="size-5" />
              </button>
            </Link>

            <Link href="/cart">
              <button className="relative inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-accent transition-colors">
                <ShoppingCart className="size-5" />

                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {token ? (
              <Link href="/profile">
                <button className="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-accent transition-colors">
                  <User className="size-5" />
                </button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <button className="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-primary/90 cursor-pointer transition-colors lg:bg-primary lg:text-primary-foreground lg:w-auto lg:px-5 lg:h-9 lg:text-xs lg:font-semibold">
                  <LogIn className="size-5 lg:hidden" />
                  <span className="hidden lg:block">Sign In</span>
                </button>
              </Link>
            )}

            {/* Menu Toggle */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-accent transition-colors ml-1"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        token={token}
        navLinks={navLinks}
      />
    </>
  );
}

