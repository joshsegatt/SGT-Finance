import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/components/active-link";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UpgradeButton } from "@/components/upgrade-button";
import { NotificationPanel } from "@/components/notification-panel";
import { Breadcrumb, TopbarSearch } from "@/components/topbar";
import { CommandPalette } from "@/components/command-palette";
import { OnboardingTrigger } from "@/components/onboarding/onboarding-trigger";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlerts } from "@/lib/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [t, tNav, locale, alerts, branding, userProfile] = await Promise.all([
    getTranslations("Common"),
    getTranslations("Navigation"),
    getLocale(),
    getAlerts(userId),
    import("@/lib/db").then(({ db }) => db.taxProfile.findFirst({
      where: { entity: { userId } },
      select: { customLogoUrl: true }
    })),
    import("@/lib/db").then(({ db }) => db.user.findUnique({
      where: { id: userId },
      select: { onboardingCompleted: true, name: true }
    })),
  ]);

  const user = session?.user?.id 
    ? await db.user.findUnique({ where: { id: session.user.id } }) 
    : null;
  const currentPlan = user?.plan ?? "FREE";

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-sidebar border-r border-sidebar-border flex flex-col z-20 shadow-2xl shadow-black/40">
        <div className="h-16 flex items-center px-5 border-b border-sidebar-border gap-3">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            {branding?.customLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.customLogoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="32" height="32" rx="8" fill="#2563EB"/>
                <rect x="6" y="18" width="4" height="8" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="12" y="13" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.75"/>
                <rect x="18" y="8" width="4" height="18" rx="1.5" fill="white"/>
                <path d="M7 14 L13 10 L19 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9"/>
                <circle cx="19" cy="6" r="1.5" fill="white"/>
              </svg>
            )}
          </div>
          <div>
            <span className="font-semibold tracking-tight text-foreground text-sm">SGT Finance</span>
            <div className="text-[10px] text-muted-foreground/60 tracking-wider uppercase">{tNav("commandCenter")}</div>
          </div>
        </div>
        <ScrollArea className="flex-1 py-4">
          <SidebarNav plan={currentPlan} />
        </ScrollArea>
        <div className="p-4 border-t border-sidebar-border">
          <UpgradeButton plan={currentPlan} />
        </div>
      </aside>


      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-background/95 backdrop-blur-sm border-b border-border/40 flex items-center justify-between px-6 z-10">
          <Breadcrumb />
          
            <div className="flex items-center gap-2">
              <TopbarSearch placeholder={t("search")} />
              
              <div className="mr-1">
                <UpgradeButton plan={currentPlan} />
              </div>

              <NotificationPanel alerts={alerts} />

            <ThemeToggle />
            
            <div className="h-5 w-px bg-border/60 mx-1" />

            <LanguageSwitcher currentLocale={locale} />

            <div className="h-5 w-px bg-border/60 mx-1" />

            <UserMenu
              name={session?.user?.name ?? null}
              email={session?.user?.email ?? null}
              role={session?.user?.role ?? "VIEWER"}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
             {children}
          </div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
      <OnboardingTrigger 
        userName={userProfile?.name ?? ""} 
        onboardingCompleted={userProfile?.onboardingCompleted ?? false} 
      />
    </div>
  );
}
