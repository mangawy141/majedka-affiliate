import { prisma } from "@/lib/db";

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteContentMap = {
  "nav.middleLabel": string;
  "nav.middleUrl": string;
  "nav.ctaLabel": string;
  "hero.title": string;
  "hero.subtitle": string;
  "hero.badge": string;
  "hero.primaryCtaLabel": string;
  "hero.secondaryCtaLabel": string;
  "affiliate.explanation": string;
  "benefits.title": string;
  "benefits.description": string;
  "rewards.title": string;
  "rewards.description": string;
  "faq.title": string;
  "faq.description": string;
  "faq.items": FaqItem[];
  "footer.tagline": string;
};

export const DEFAULT_SITE_CONTENT: SiteContentMap = {
  "nav.middleLabel": "المتجر الرسمي",
  "nav.middleUrl": "https://www.majedka.com",
  "nav.ctaLabel": "قدّم الآن",
  "hero.title": "حوّل متابعينك إلى دخل ثابت 💸",
  "hero.subtitle":
    "انضم لبرنامج أفلييت Majedka واكسب عمولة من كل عملية شراء قام بها متابعوك",
  "hero.badge": "برنامج الأفلييت الأفضل في الشرق الأوسط",
  "hero.primaryCtaLabel": "قدّم الآن مجاناً",
  "hero.secondaryCtaLabel": "اعرف كيف يعمل",
  "affiliate.explanation":
    "برنامج أفلييت محترف يساعدك على تحويل متابعينك إلى دخل ثابت",
  "benefits.title": "لماذا تختار Majedka؟",
  "benefits.description":
    "برنامج أفلييت محترف يساعدك على تحويل متابعينك إلى دخل ثابت",
  "rewards.title": "برامج الحوافز",
  "rewards.description": "كلما زادت مبيعاتك، كلما زادت مكافآتك وأرباحك",
  "faq.title": "الأسئلة الشائعة",
  "faq.description": "كل ما تحتاج معرفته عن برنامج الشركاء",
  "faq.items": [
    {
      question: "كيف تحتسب العمولة؟",
      answer:
        "العمولة هي 10% من قيمة العملية. مثالاً: إذا كانت قيمة الشراء 100 دولار، فستحصل على 10 دولارات.",
    },
    {
      question: "كيف يعمل الكود الخاص بي؟",
      answer:
        "بعد قبول طلبك، ستحصل على كود فريد. كل عملية شراء بالكود تُحتسب تلقائياً في أرباحك.",
    },
  ],
  "footer.tagline": "أكبر مكتبة ألعاب عربية بأسعار لا تقبل المنافسة",
};

const CMS_KEYS = Object.keys(DEFAULT_SITE_CONTENT) as Array<keyof SiteContentMap>;

export async function getSiteContent(): Promise<SiteContentMap> {
  // Prisma client must be generated after adding SiteContent.
  // In case the app is running before migration/generate completes,
  // fall back to defaults instead of crashing the whole site.
  const client = prisma as unknown as {
    siteContent?: {
      findMany: (args: unknown) => Promise<Array<{ key: string; value: unknown }>>;
    };
  };

  if (!client.siteContent) {
    return { ...DEFAULT_SITE_CONTENT };
  }

  let rows: Array<{ key: string; value: unknown }> = [];
  try {
    rows = await client.siteContent.findMany({
      where: { key: { in: CMS_KEYS as unknown as string[] } },
    });
  } catch (e: unknown) {
    // If the DB hasn't been migrated yet, the table may not exist.
    // Prisma typically throws P2021 in that case.
    const code =
      typeof e === "object" && e !== null && "code" in e
        ? String((e as { code?: unknown }).code)
        : null;
    if (code === "P2021") {
      return { ...DEFAULT_SITE_CONTENT };
    }
    throw e;
  }

  const mapped = { ...DEFAULT_SITE_CONTENT };
  for (const row of rows) {
    const key = row.key as keyof SiteContentMap;
    if (key in mapped) {
      (mapped as Record<string, unknown>)[key] = row.value;
    }
  }
  return mapped;
}

export function getAllowedCmsKeys() {
  return CMS_KEYS;
}

export async function updateSiteContent(
  updates: Partial<SiteContentMap>,
): Promise<SiteContentMap> {
  const entries = Object.entries(updates) as Array<
    [keyof SiteContentMap, SiteContentMap[keyof SiteContentMap]]
  >;

  const allowed = new Set(CMS_KEYS);
  const client = prisma as unknown as {
    siteContent?: {
      upsert: (args: unknown) => Promise<unknown>;
    };
    $transaction: (args: Promise<unknown>[]) => Promise<unknown>;
  };

  if (!client.siteContent) {
    return { ...DEFAULT_SITE_CONTENT, ...(updates as Partial<SiteContentMap>) } as SiteContentMap;
  }

  try {
    await client.$transaction(
      entries
        .filter(([key]) => allowed.has(key))
        .map(([key, value]) =>
          client.siteContent!.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          }),
        ),
    );
  } catch (e: unknown) {
    const code =
      typeof e === "object" && e !== null && "code" in e
        ? String((e as { code?: unknown }).code)
        : null;
    if (code === "P2021") {
      return { ...DEFAULT_SITE_CONTENT, ...(updates as Partial<SiteContentMap>) } as SiteContentMap;
    }
    throw e;
  }

  return getSiteContent();
}
