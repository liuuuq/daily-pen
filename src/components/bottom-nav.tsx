"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, BookOpen, User, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "今日", icon: Home },
  { href: "/history", label: "历史", icon: Clock },
  { href: "/analysis", label: "拆解", icon: BookOpen },
  { href: "/profile", label: "我的", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/90 backdrop-blur-lg supports-[backdrop-filter]:bg-card/70 md:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {tabs.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-1 text-xs transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                    isActive && "bg-primary/10 scale-110"
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px]", isActive && "stroke-[2.5px]")} />
                </div>
                <span className={cn("font-medium", isActive && "font-semibold")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: floating left sidebar */}
      <nav className="hidden md:fixed md:left-6 md:top-1/2 md:z-50 md:flex md:-translate-y-1/2 md:flex-col md:items-center md:gap-1 md:rounded-2xl md:border md:border-border/50 md:bg-card/90 md:px-2 md:py-4 md:shadow-lg md:shadow-black/5 md:backdrop-blur-lg md:supports-[backdrop-filter]:bg-card/70">
        {/* Logo */}
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500">
          <PenLine className="h-5 w-5 text-white" />
        </div>

        <div className="mb-2 h-px w-6 bg-border/50" />

        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-foreground/90 px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {label}
              </span>
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -left-2 h-5 w-1 rounded-r-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
