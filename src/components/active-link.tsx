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
      { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
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

import { Lock } from "lucide-react";
import { Plan } from "@prisma/client";
import { hasFeatureAccess, Feature } from "@/lib/plans";
import { UpgradeModal } from "@/components/upgrade-modal";
import { useState } from "react";

export function SidebarNav({ plan = Plan.FREE }: { plan?: Plan }) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  return (
    <nav className="px-3 space-y-0.5">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "pt-2" : ""}>
          {group.labelKey && (
            <div className="text-[10px] font-semibold text-muted-foreground/40 tracking-widest uppercase px-3 pt-3 pb-1.5">
              {t(group.labelKey as any)}
            </div>
          )}
          {group.items.map(({ key, href, icon: Icon }) => {
            const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
            const featureKey = key as Feature;
            const isLocked = ["tax", "analytics", "reports"].includes(featureKey) && !hasFeatureAccess(plan, featureKey);
            
            const content = (
              <>
                {isActive && (
                  <span className="absolute left-0 inset-y-2.5 w-0.5 rounded-full bg-primary" />
                )}
                <Icon className={cn("h-[18px] w-[18px] shrink-0", isLocked && "text-muted-foreground/40")} />
                <span className={cn("flex-1", isLocked && "text-muted-foreground/40")}>
                  {t(key as any)}
                </span>
                {isLocked && <Lock className="h-3 w-3 text-muted-foreground/40" />}
              </>
            );

            if (isLocked) {
              return (
                <button
                  key={key}
                  onClick={() => setUpgradeModalOpen(true)}
                  className={cn(
                    "w-full relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    "text-muted-foreground/50 hover:bg-sidebar-accent hover:text-foreground cursor-pointer"
                  )}
                >
                  {content}
                </button>
              );
            }

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
                {content}
              </Link>
            );
          })}
        </div>
      ))}
      <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </nav>
  );
}

