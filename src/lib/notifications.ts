type NotifyInput = {
  toEmail: string;
  toPhone?: string | null;
  name: string;
  code: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
};

function buildReferralLink(code: string) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.APP_BASE_URL ||
    "http://localhost:3000";
  return `${base}/?ref=${encodeURIComponent(code)}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

async function sendEmail(input: NotifyInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("test_")) {
    console.info("[notify] RESEND_API_KEY missing/test, skip email");
    return;
  }

  const referralLink = buildReferralLink(input.code);
  const subject =
    input.status === "REJECTED"
      ? "تحديث طلب برنامج الأفلييت"
      : "رمز الأفلييت الخاص بك";
  const statusText =
    input.status === "PENDING"
      ? "تم استلام طلبك وهو الآن قيد المراجعة."
      : input.status === "APPROVED"
        ? "تمت الموافقة على طلبك."
        : `تم رفض الطلب. ${input.rejectionReason ?? ""}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "Affiliate <noreply@majedka.com>",
      to: input.toEmail,
      subject,
      html: `
        <h2>مرحباً ${input.name}</h2>
        <p>${statusText}</p>
        <p><strong>الكود:</strong> ${input.code}</p>
        <p><strong>الرابط:</strong> <a href="${referralLink}">${referralLink}</a></p>
      `,
    }),
  });
}

async function sendWhatsApp(input: NotifyInput) {
  if (!input.toPhone) return;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886
  if (!sid || !token || !from) {
    console.info("[notify] Twilio WhatsApp env missing, skip whatsapp");
    return;
  }

  const toDigits = normalizePhone(input.toPhone);
  if (!toDigits) return;
  const to = `whatsapp:+${toDigits}`;
  const referralLink = buildReferralLink(input.code);
  const statusText =
    input.status === "PENDING"
      ? "طلبك قيد المراجعة."
      : input.status === "APPROVED"
        ? "تمت الموافقة على طلبك."
        : `تم رفض الطلب. ${input.rejectionReason ?? ""}`;
  const body = `مرحباً ${input.name}\n${statusText}\nالكود: ${input.code}\nالرابط: ${referralLink}`;

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const form = new URLSearchParams({
    To: to,
    From: from,
    Body: body,
  });

  await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
}

export async function notifyApplicant(input: NotifyInput) {
  await Promise.allSettled([sendEmail(input), sendWhatsApp(input)]);
}

export function getAdminContactLinks(phone?: string | null, email?: string | null) {
  const phoneDigits = phone ? normalizePhone(phone) : "";
  return {
    whatsappUrl: phoneDigits ? `https://wa.me/${phoneDigits}` : null,
    emailUrl: email ? `mailto:${email}` : null,
  };
}

