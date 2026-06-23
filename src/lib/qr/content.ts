import type { QrContent } from "@/lib/schemas/qr-code-generator";

/**
 * Turn validated, typed QR content into the raw string that gets encoded.
 * QR-specific by nature (mailto/tel/SMSTO/WIFI payload formats), so it lives in
 * the QR feature folder rather than the shared layer.
 */
export function buildQrPayload(content: QrContent): string {
  switch (content.type) {
    case "url":
      return ensureProtocol(content.url.trim());
    case "text":
      return content.text;
    case "phone":
      return `tel:${content.phone.trim()}`;
    case "sms":
      return content.message
        ? `SMSTO:${content.phone.trim()}:${content.message}`
        : `SMSTO:${content.phone.trim()}`;
    case "email":
      return buildMailto(content.to.trim(), content.subject, content.body);
    case "wifi":
      return buildWifi(content);
  }
}

/** Prepend https:// when the user omitted a scheme. */
function ensureProtocol(url: string): string {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
}

function buildMailto(to: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return query ? `mailto:${to}?${query}` : `mailto:${to}`;
}

/** Escape the reserved characters in the WIFI: payload grammar. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function buildWifi(content: Extract<QrContent, { type: "wifi" }>): string {
  const { ssid, password, encryption, hidden } = content;
  const parts = [`T:${encryption}`, `S:${escapeWifi(ssid)}`];
  if (encryption !== "nopass" && password) {
    parts.push(`P:${escapeWifi(password)}`);
  }
  if (hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}
