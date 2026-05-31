import Link from "next/link";

import { CloudLogo } from "@/components/layout/cloud-logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <CloudLogo />
              <span className="font-serif text-xl font-bold tracking-tight text-primary">
                CLOUTR
              </span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              Curated lifestyle discovery for the modern woman. Find your next favorite thing.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-serif font-semibold text-foreground">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/fashion"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/category/beauty"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Beauty
                </Link>
              </li>
              <li>
                <Link
                  href="/category/home"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Home Decor
                </Link>
              </li>
              <li>
                <Link
                  href="/category/accessories"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-serif font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-serif font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CLOUTR. All rights reserved.
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-muted-foreground">
            CLOUTR is a participant in the Amazon Services LLC Associates Program and other
            affiliate advertising programs designed to provide a means for sites to earn
            advertising fees by advertising and linking to affiliated sites.
          </p>
        </div>
      </div>
    </footer>
  );
}
