import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/constants/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social card generated at the edge for every route that inherits it. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 40, opacity: 0.9 }}>{siteConfig.name}</div>
      <div
        style={{
          marginTop: 24,
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: 900,
        }}
      >
        Free online tools for everything you do
      </div>
      <div style={{ marginTop: 28, fontSize: 32, opacity: 0.85 }}>
        {siteConfig.tagline}
      </div>
    </div>,
    { ...size }
  );
}
