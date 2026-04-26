import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, name: true },
  });

  if (user?.onboardingCompleted) redirect("/");

  return <OnboardingWizard userName={user?.name ?? ""} />;
}
