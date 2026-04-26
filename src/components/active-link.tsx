"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, PieChart, RefreshCcw, Receipt, Repeat,
  FileText, Users, Landmark, BarChart3, Settings,
} from "lucide-react";

type NavItem = { key: string; href: string; icon: React.ElementType };
type NavGroup = { labelKey?: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { key: "dashboard", href: "/", icon: LayoutDashboard },
      { key: "analytics", href: "/analytics", icon: PieChart },
    ],
  },
  {
    labelKey: "groups.operations",
    items: [
      { key: "transactions", href: "/transactions", icon: RefreshCcw },
      { key: "invoices", href: "/invoices", icon: Receipt },
      { key: "recurring", href: "/recurring", icon: Repeat },
    ],
  },
  {
    labelKey: "groups.management",
    items: [
      { key: "tax", href: "/tax", icon: FileText },
      { key: "clients", href: "/clients", icon: Users },
      { key: "accounts", href: "/accounts", icon: Landmark },
    ],
  },
  {
    labelKey: "groups.tools",
    items: [
      { key: "reports", href: "/reports", icon: BarChart3 },
      { key: "settings", href: "/settings", icon: Settings },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <nav className="px-3 space-y-0.5">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "pt-2" : ""}>
          {group.labelKey && (
            <div className="text-[10px] font-semibold text-muted-foreground/40 tracking-widest uppercase px-3 pt-3 pb-1.5">
              {t(group.labelKey as Parameters<typeof t>[0])}
            </div>
          )}
          {group.items.map(({ key, href, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 inset-y-2.5 w-0.5 rounded-full bg-primary" />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {t(key as Parameters<typeof t>[0])}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
