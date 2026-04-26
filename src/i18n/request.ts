import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const SUPPORTED_LOCALES = ["en", "pt", "fr"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupported(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/** Detect locale from Accept-Language header (best-effort) */
function detectFromAcceptLanguage(acceptLang: string | null): Locale {
  if (!acceptLang) return "en";
  // e.g. "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
  const tags = acceptLang.split(",").map((s) => s.split(";")[0].trim().toLowerCase());
  for (const tag of tags) {
    if (tag.startsWith("pt")) return "pt";
    if (tag.startsWith("fr")) return "fr";
    if (tag.startsWith("en")) return "en";
  }
  return "en";
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get("NEXT_LOCALE")?.value;

  let locale: Locale;
  if (cookieVal && isSupported(cookieVal)) {
    locale = cookieVal;
  } else {
    // No cookie yet — auto-detect from browser Accept-Language
    const headersList = await headers();
    locale = detectFromAcceptLanguage(headersList.get("accept-language"));
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
