/**
 * SVG → PNG conversion helper shared by the Barcode Generator and any future
 * tool that renders an SVG and needs to export a rasterised copy (QR code with
 * logo overlay, chart exports, etc.).
 */

/**
 * Convert an SVG DOM element to a PNG data URL at `scale`× resolution.
 * Resolves to the data URL string, or rejects on canvas/image error.
 */
export function svgElementToPngDataUrl(
  svgEl: SVGSVGElement,
  scale = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const serialized = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([serialized], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || svgEl.width.baseVal.value || 300;
      const h = img.naturalHeight || svgEl.height.baseVal.value || 150;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to render SVG as image"));
    };
    img.src = url;
  });
}
