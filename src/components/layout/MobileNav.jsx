"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, CloseIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { headerCta, mainNav } from "@/data/navigation";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

/**
 * Full-screen menu for < lg, styled to match the desktop panel: one accordion
 * per section, painted from semantic tokens so it follows the theme. It
 * renders the same `mainNav` the desktop header does, so the two can never
 * drift apart.
 */
export function MobileNav({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal={open}
      aria-label="Main menu"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-60 flex flex-col bg-page transition-all duration-400 lg:hidden",
        open
          ? "visible opacity-100"
          : "pointer-events-none invisible -translate-y-4 opacity-0",
      )}
    >
      <header className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-5 sm:px-6">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="text-content transition-colors hover:text-headline"
        >
          <CloseIcon className="size-6" />
        </button>
      </header>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8 sm:px-6">
        <ul className="divide-y divide-line border-y border-line">
          {mainNav.map((item) => {
            const isOpen = expanded === item.label;

            if (!item.panel) {
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    tabIndex={open ? undefined : -1}
                    className="block py-5 font-heading text-lg font-semibold text-headline transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  tabIndex={open ? undefined : -1}
                  className="flex w-full items-center justify-between py-5 font-heading text-lg font-semibold text-headline"
                >
                  {item.label}
                  <ChevronDownIcon
                    className={cn(
                      "size-4 text-muted transition-transform duration-300",
                      isOpen && "-rotate-180",
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-400 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-6 pb-6">
                      {item.panel.map((entry) => (
                        <li key={entry.href}>
                          <Link
                            href={entry.href}
                            onClick={onClose}
                            tabIndex={isOpen && open ? undefined : -1}
                            className="group block"
                          >
                            <span className="flex items-center gap-2 font-heading text-[15px] font-semibold text-headline transition-colors group-hover:text-brand">
                              {entry.label}
                              <ChevronRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                            <span className="mt-2 block text-sm leading-relaxed text-muted">
                              {entry.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Button
          href={headerCta.href}
          onClick={onClose}
          tabIndex={open ? undefined : -1}
          block
          className="mt-8"
        >
          {headerCta.label}
        </Button>

        <div className="mt-8 space-y-3 text-sm">
          <a
            href={siteConfig.contact.phoneHref}
            className="flex items-center gap-3 text-muted transition-colors hover:text-brand"
          >
            <PhoneIcon className="size-4" />
            {siteConfig.contact.phone}
          </a>
          <a
            href={siteConfig.contact.emailHref}
            className="flex items-center gap-3 text-muted transition-colors hover:text-brand"
          >
            <MailIcon className="size-4" />
            {siteConfig.contact.email}
          </a>
        </div>
      </nav>
    </div>
  );
}
