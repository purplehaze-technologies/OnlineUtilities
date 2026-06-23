"use client";

import { Smartphone } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToolField } from "@/components/tool/tool-field";

function AndroidNote() {
  return (
    <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
      <Smartphone className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      Android&apos;s native camera may open Chrome instead of the expected app.
      Use a dedicated QR scanner app for reliable results.
    </p>
  );
}
import {
  WIFI_ENCRYPTIONS,
  type QrContentType,
  type WifiEncryption,
} from "@/lib/schemas/qr-code-generator";

/** All editable fields across every content type, held flat in one object. */
export interface QrFields {
  url: string;
  text: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  smsPhone: string;
  smsMessage: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: WifiEncryption;
  wifiHidden: boolean;
}

export const INITIAL_QR_FIELDS: QrFields = {
  url: "",
  text: "",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  smsPhone: "",
  smsMessage: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
};

export function QrContentForm({
  type,
  fields,
  onChange,
  errors,
}: {
  type: QrContentType;
  fields: QrFields;
  onChange: <K extends keyof QrFields>(key: K, value: QrFields[K]) => void;
  errors: Partial<Record<string, string>>;
}) {
  switch (type) {
    case "url":
      return (
        <ToolField label="Website URL" htmlFor="qr-url" error={errors.url}>
          <Input
            id="qr-url"
            type="url"
            inputMode="url"
            placeholder="example.com"
            value={fields.url}
            onChange={(e) => onChange("url", e.target.value)}
          />
        </ToolField>
      );

    case "text":
      return (
        <ToolField label="Text" htmlFor="qr-text" error={errors.text}>
          <Textarea
            id="qr-text"
            placeholder="Any text you want to encode…"
            value={fields.text}
            onChange={(e) => onChange("text", e.target.value)}
          />
        </ToolField>
      );

    case "email":
      return (
        <div className="space-y-4">
          <ToolField
            label="Recipient email"
            htmlFor="qr-email-to"
            error={errors.to}
          >
            <Input
              id="qr-email-to"
              type="email"
              inputMode="email"
              placeholder="name@example.com"
              value={fields.emailTo}
              onChange={(e) => onChange("emailTo", e.target.value)}
            />
          </ToolField>
          <ToolField label="Subject" htmlFor="qr-email-subject">
            <Input
              id="qr-email-subject"
              placeholder="Optional subject"
              value={fields.emailSubject}
              onChange={(e) => onChange("emailSubject", e.target.value)}
            />
          </ToolField>
          <ToolField label="Message" htmlFor="qr-email-body">
            <Textarea
              id="qr-email-body"
              placeholder="Optional message body"
              value={fields.emailBody}
              onChange={(e) => onChange("emailBody", e.target.value)}
            />
          </ToolField>
          <AndroidNote />
        </div>
      );

    case "phone":
      return (
        <div className="space-y-4">
          <ToolField
            label="Phone number"
            htmlFor="qr-phone"
            error={errors.phone}
            hint="Include the country code for best results, e.g. +1 555 0100."
          >
            <Input
              id="qr-phone"
              type="tel"
              inputMode="tel"
              placeholder="+1 555 0100"
              value={fields.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </ToolField>
          <AndroidNote />
        </div>
      );

    case "sms":
      return (
        <div className="space-y-4">
          <ToolField
            label="Phone number"
            htmlFor="qr-sms-phone"
            error={errors.phone}
          >
            <Input
              id="qr-sms-phone"
              type="tel"
              inputMode="tel"
              placeholder="+1 555 0100"
              value={fields.smsPhone}
              onChange={(e) => onChange("smsPhone", e.target.value)}
            />
          </ToolField>
          <ToolField label="Message" htmlFor="qr-sms-message">
            <Textarea
              id="qr-sms-message"
              placeholder="Optional pre-filled message"
              value={fields.smsMessage}
              onChange={(e) => onChange("smsMessage", e.target.value)}
            />
          </ToolField>
          <AndroidNote />
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-4">
          <ToolField
            label="Network name (SSID)"
            htmlFor="qr-wifi-ssid"
            error={errors.ssid}
          >
            <Input
              id="qr-wifi-ssid"
              placeholder="My Wi-Fi network"
              value={fields.wifiSsid}
              onChange={(e) => onChange("wifiSsid", e.target.value)}
            />
          </ToolField>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolField label="Encryption" htmlFor="qr-wifi-enc">
              <Select
                id="qr-wifi-enc"
                value={fields.wifiEncryption}
                onChange={(e) =>
                  onChange("wifiEncryption", e.target.value as WifiEncryption)
                }
              >
                {WIFI_ENCRYPTIONS.map((enc) => (
                  <option key={enc} value={enc}>
                    {enc === "nopass" ? "None" : enc}
                  </option>
                ))}
              </Select>
            </ToolField>
            {fields.wifiEncryption !== "nopass" ? (
              <ToolField label="Password" htmlFor="qr-wifi-pass">
                <Input
                  id="qr-wifi-pass"
                  type="text"
                  autoComplete="off"
                  placeholder="Network password"
                  value={fields.wifiPassword}
                  onChange={(e) => onChange("wifiPassword", e.target.value)}
                />
              </ToolField>
            ) : null}
          </div>
          <ToolField
            label="Hidden network"
            htmlFor="qr-wifi-hidden"
            description="Enable if the network does not broadcast its SSID."
            orientation="horizontal"
          >
            <Switch
              id="qr-wifi-hidden"
              checked={fields.wifiHidden}
              onCheckedChange={(v) => onChange("wifiHidden", v)}
            />
          </ToolField>
        </div>
      );
  }
}
