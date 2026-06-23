import { createElement } from "react";

import { getIcon } from "@/lib/data/icons";

/**
 * Renders a Lucide icon resolved from the icon registry by string key.
 * Centralizing the dynamic lookup here keeps data files serializable and keeps
 * the component reference resolution out of consumers' render bodies.
 */
export function Icon({
  name,
  className,
  "aria-hidden": ariaHidden = true,
}: {
  name: string;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return createElement(getIcon(name), { className, "aria-hidden": ariaHidden });
}
