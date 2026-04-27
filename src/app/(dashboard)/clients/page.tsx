import { getClients } from "@/lib/data";
import { ClientsView } from "@/components/clients/clients-view";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Clients",
  description: "Manage client profiles, entities and billing relationships.",
};

interface PageProps {
  searchParams: Promise<{ search?: string; clientId?: string }>;
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ClientsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const params = await searchParams;
  const [clients, t] = await Promise.all([
    getClients(userId, params.search),
    getTranslations("Clients"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1.5">
          {clients.length} {clients.length !== 1 ? t("subtitlePlural") : t("subtitle")}
        </p>
      </div>
      <ClientsView clients={clients} selectedClientId={params.clientId} />
    </div>
  );
}
