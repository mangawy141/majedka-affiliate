import { z } from "zod";

// Apply form validation
export const affiliateApplySchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(100),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().optional(),
  country: z.string().min(2).optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  contentType: z.enum(["videos", "streaming", "mixed"]).optional(),
  experience: z.enum(["beginner", "intermediate", "experienced"]).optional(),
  motivation: z.string().min(10, "اشرح كيف ستروج للكود").max(1000).optional(),
});

export type AffiliateApplyInput = z.infer<typeof affiliateApplySchema>;

// Approve/Reject validation
export const affiliateApproveSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  customCode: z.string().min(3).max(20).optional(),
  rejectionReason: z.string().optional(),
});

export type AffiliateApproveInput = z.infer<typeof affiliateApproveSchema>;

// Track click validation
export const trackClickSchema = z.object({
  code: z.string(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

export type TrackClickInput = z.infer<typeof trackClickSchema>;

// Track sale validation
export const trackSaleSchema = z.object({
  code: z.string(),
  orderId: z.string(),
  amount: z.number().min(0),
});

export type TrackSaleInput = z.infer<typeof trackSaleSchema>;

const emptyToUndefined = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

// Admin affiliate codes (DB `code` is slug; `name` is human-readable label)
export const affiliateCodeCreateSchema = z.object({
  code: z.preprocess(emptyToUndefined, z.string().max(80).optional()),
  name: z.string().min(1, "الاسم مطلوب").max(200),
  owner: z.string().min(1, "المالك مطلوب").max(200),
});

export type AffiliateCodeCreateInput = z.infer<typeof affiliateCodeCreateSchema>;

export const affiliateCodeUpdateSchema = z
  .object({
    code: z.string().min(3).max(80).optional(),
    name: z.string().min(1).max(200).optional(),
    owner: z.string().min(1).max(200).optional(),
    clicks: z.number().int().min(0).optional(),
  })
  .strict();

export type AffiliateCodeUpdateInput = z.infer<typeof affiliateCodeUpdateSchema>;

const faqItemSchema = z.object({
  question: z.string().min(3).max(300),
  answer: z.string().min(3).max(2000),
});

export const siteContentUpdateSchema = z
  .object({
    "nav.middleLabel": z.string().min(1).max(100).optional(),
    "nav.middleUrl": z.string().url().max(500).optional(),
    "nav.ctaLabel": z.string().min(1).max(100).optional(),
    "hero.title": z.string().min(1).max(300).optional(),
    "hero.subtitle": z.string().min(1).max(800).optional(),
    "hero.badge": z.string().min(1).max(200).optional(),
    "hero.primaryCtaLabel": z.string().min(1).max(120).optional(),
    "hero.secondaryCtaLabel": z.string().min(1).max(120).optional(),
    "affiliate.explanation": z.string().min(1).max(1000).optional(),
    "benefits.title": z.string().min(1).max(250).optional(),
    "benefits.description": z.string().min(1).max(800).optional(),
    "rewards.title": z.string().min(1).max(250).optional(),
    "rewards.description": z.string().min(1).max(800).optional(),
    "faq.title": z.string().min(1).max(250).optional(),
    "faq.description": z.string().min(1).max(800).optional(),
    "faq.items": z.array(faqItemSchema).max(20).optional(),
    "footer.tagline": z.string().min(1).max(500).optional(),
  })
  .strict();

export type SiteContentUpdateInput = z.infer<typeof siteContentUpdateSchema>;

export const affiliateApplicationCreateSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(120),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(7).max(30).optional(),
  country: z.string().max(120).optional(),
  platform: z.string().max(120).optional(),
  followers: z.string().max(120).optional(),
  contentType: z.string().max(120).optional(),
  motivation: z.string().max(1500).optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
});

export type AffiliateApplicationCreateInput = z.infer<
  typeof affiliateApplicationCreateSchema
>;

export const adminApplicationUpdateSchema = z
  .object({
    action: z.enum(["approve", "reject"]),
    rejectionReason: z.string().max(1000).optional(),
  })
  .strict();

export type AdminApplicationUpdateInput = z.infer<
  typeof adminApplicationUpdateSchema
>;
