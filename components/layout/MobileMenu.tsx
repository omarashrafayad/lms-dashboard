"use client";

import Link from "next/link";
import { X, Search, Heart, User, LogIn, ShoppingCart, Home, ShoppingBag, Info, PhoneCall, Facebook, Twitter, Instagram, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  navLinks: { href: string; label: string }[];
}

export default function MobileMenu({ isOpen, onClose, token, navLinks }: MobileMenuProps) {
  const pathname = usePathname();

  // Map icons to labels for a better look
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home": return <Home className="size-5" />;
      case "shop": return <ShoppingBag className="size-5" />;
      case "about": return <Info className="size-5" />;
      case "contact": return <PhoneCall className="size-5" />;
      case "dashboard": return <ShieldCheck className="size-5" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-[85%] max-w-[320px] bg-background shadow-2xl md:hidden flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">E</span>
                </div>
                <span className="font-bold text-lg tracking-tight">Commerce</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-full transition-colors active:scale-90"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">

              <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 font-outfit">Main Menu</p>
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-semibold transition-all duration-300 ${isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-foreground hover:bg-accent hover:translate-x-1"
                          }`}
                      >
                        {getIcon(link.label)}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Secondary Actions */}
              <div className="space-y-1 pb-4">
                <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Quick Links</p>
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-semibold hover:bg-accent hover:translate-x-1 transition-all"
                >
                  <Heart className="size-5" />
                  Wishlist
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-semibold hover:bg-accent hover:translate-x-1 transition-all"
                >
                  <ShoppingCart className="size-5" />
                  Shopping Cart
                </Link>
                <Link
                  href={token ? "/profile" : "/auth/login"}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-semibold hover:bg-accent hover:translate-x-1 transition-all"
                >
                  {token ? <User className="size-5" /> : <LogIn className="size-5" />}
                  {token ? "My Account" : "Sign In"}
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
