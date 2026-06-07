"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CloudLogo } from "@/components/layout/cloud-logo";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/lib/board-context";

const NAV_LINKS = [
  { href: "/", label: "Shop" },
  { href: "/finds", label: "Finds" },
  { href: "/category/trending", label: "Trending" },
  { href: "/category/fashion", label: "Fashion" },
  { href: "/category/beauty", label: "Beauty" },
  { href: "/category/home", label: "Home" },
  { href: "/blog", label: "Blog" },
];

const MOBILE_NAV_LINKS = NAV_LINKS;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { count } = useBoard();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <CloudLogo />
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                CLOUTR
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(pathname, link.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/finds" className="hidden md:inline-flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-primary/10 hover:text-primary"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/board">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Bookmark className="h-5 w-5" />
                <AnimatePresence>
                  {count > 0 ? (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                    >
                      {count}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sticky top-16 z-40 overflow-hidden border-b border-border bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {MOBILE_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/board"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
              >
                <Bookmark className="h-4 w-4" />
                My Board
                {count > 0 ? (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                    {count}
                  </span>
                ) : null}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
