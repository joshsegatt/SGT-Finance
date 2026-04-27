import { auth } from "@/lib/auth";
import { getUserById, getAccounts } from "@/lib/data";
import { ProfileForm } from "@/components/settings/profile-form";
import { ProfileAvatar } from "@/components/settings/profile-avatar";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { NotificationPreferences } from "@/components/settings/notification-preferences";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ShieldCheck, CreditCard, Bell, User, KeyRound, AlertTriangle, Zap } from "lucide-react";
import Link from "next/link";
import { DeleteAccountButton } from "@/components/settings/delete-account-button";
import { ApiAccess } from "@/components/settings/api-access";
import { WhiteLabel } from "@/components/settings/white-label";
import { MfaSetup } from "@/components/settings/mfa-setup";
import { hasFeatureAccess } from "@/lib/plans";
import { Plan } from "@prisma/client";

export const metadata = {
  title: "Settings",
  description: "Account preferences, profile, security and notification settings.",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  ADVISOR: "Advisor",
  FINANCE_MANAGER: "Finance Manager",
  VIEWER: "Viewer",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, accounts, t, dbUser, branding] = await Promise.all([
    getUserById(session.user.id),
    getAccounts(session.user.id),
    getTranslations("Settings"),
    import("@/lib/db").then(({ db }) => db.user.findUnique({
      where: { id: session.user.id } as any,
      select: { plan: true, apiKey: true, stripeCurrentPeriodEnd: true, twoFactorEnabled: true } as any
    })),
    import("@/lib/db").then(({ db }) => db.taxProfile.findFirst({
      where: { entity: { userId: session.user.id } } as any,
      select: { customLogoUrl: true } as any
    })),
  ]) as [any, any, any, any, any];
  if (!user) redirect("/login");

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1.5">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── LEFT COLUMN ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile */}
          <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border/40">
              <User className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">{t("profileSection")}</h2>
            </div>
            <div className="p-6 space-y-6">
              <ProfileAvatar currentImage={user.image ?? null} name={user.name ?? ""} />
              <div className="border-t border-border/30 pt-5">
                <ProfileForm user={{ id: user.id, name: user.name ?? "", email: user.email ?? "", role: user.role }} />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border/40">
              <KeyRound className="w-4 h-4 text-muted-foreground" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">{t("changePasswordSection")}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-muted-foreground mb-5">{t("changePasswordDesc")}</p>
              <ChangePasswordForm />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border/40">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
            </div>
            <div className="p-6">
              <NotificationPreferences />
            </div>
          </div>

          {/* MFA Setup */}
          <MfaSetup isEnabled={(dbUser as any)?.twoFactorEnabled ?? false} />

          {/* Connected Bank Accounts */}
          <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Connected Accounts</h2>
              </div>
              <a href="/accounts" className="text-xs text-primary hover:underline">Manage →</a>
            </div>
            <div className="divide-y divide-border/30">
              {accounts.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <CreditCard className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No connected accounts</p>
                  <a href="/accounts" className="text-xs text-primary hover:underline mt-1 inline-block">Connect a bank account →</a>
                </div>
              ) : (
                accounts.slice(0, 6).map((account: any) => (
                  <div key={account.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {(account as any).entity?.name ?? "—"} · {account.accountType}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">
                        {new Intl.NumberFormat("en-GB", { style: "currency", currency: account.currency }).format(account.balance)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{account.currency}</p>
                    </div>
                  </div>
                ))
              )}
              {accounts.length > 6 && (
                <div className="px-6 py-3 text-center">
                  <a href="/accounts" className="text-xs text-muted-foreground hover:text-foreground">
                    +{accounts.length - 6} more accounts
                  </a>
                </div>
              )}
            </div>
          </div>
          {/* API Access (PRO/BUSINESS) */}
          {hasFeatureAccess(dbUser?.plan ?? Plan.FREE, "apiAccess") && (
            <ApiAccess apiKey={(dbUser as any)?.apiKey ?? null} />
          )}

          {/* White-label (BUSINESS) */}
          {hasFeatureAccess(dbUser?.plan ?? Plan.FREE, "whiteLabel") && (
            <WhiteLabel currentLogoUrl={(branding as any)?.customLogoUrl ?? null} />
          )}
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="space-y-6">

          {/* Account info card */}
          <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">{t("accountInfoSection")}</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Avatar mini */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-border">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-primary">
                      {(user.name ?? "U").split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join("")}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-border/30 pt-2.5">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="text-xs font-medium text-foreground">{memberSince}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-border/30 pt-2.5">
                  <span className="text-muted-foreground">Accounts</span>
                  <span className="text-xs font-medium text-foreground">{accounts.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="bg-card rounded-xl border border-border panel-shadow overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Plano & Billing</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Plano atual</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {(dbUser as any)?.plan ?? "FREE"}
                </span>
              </div>
              {dbUser?.stripeCurrentPeriodEnd && (
                <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                  <span className="text-xs text-muted-foreground">Próxima renovação</span>
                  <span className="text-xs font-medium text-foreground">
                    {new Date((dbUser as any).stripeCurrentPeriodEnd).toLocaleDateString("pt-PT")}
                  </span>
                </div>
              )}
              <Link
                href="/settings/billing"
                className="mt-1 w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                {(dbUser as any)?.plan === "FREE" ? "Fazer upgrade" : "Gerir subscrição"}
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-xl border border-destructive/30 panel-shadow overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-destructive/20">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h2 className="text-sm font-semibold text-destructive">{t("dangerZone")}</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <p className="text-xs text-muted-foreground">{t("dangerDesc")}</p>
              <DeleteAccountButton />
              <div className="border-t border-border/30 pt-3 flex gap-3">
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Termos de Serviço</Link>
                <span className="text-muted-foreground/30">·</span>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
