"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolStats } from "@/components/tool/tool-stats";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { calcGstExclusive, calcGstInclusive } from "@/lib/utils/finance";

const PRESET_RATES = [3, 5, 12, 18, 28] as const;

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function GstCalculator() {
  const [amount, setAmount] = React.useState("");
  const [rateStr, setRateStr] = React.useState("18");
  const [customRate, setCustomRate] = React.useState("");
  const [inclusive, setInclusive] = React.useState(false);

  const isCustom = rateStr === "custom";
  const rate = isCustom ? parseFloat(customRate) : parseFloat(rateStr);

  const result = React.useMemo(() => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) return null;
    if (isNaN(rate) || rate < 0 || rate > 100) return null;
    return inclusive
      ? calcGstInclusive(amt, rate)
      : calcGstExclusive(amt, rate);
  }, [amount, rate, inclusive]);

  const hasError =
    amount !== "" &&
    (isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0 ||
      (isCustom && (isNaN(rate) || rate < 0 || rate > 100)));

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        controls={
          <ToolPanel title="Settings">
            <ToolField
              label="Amount (₹)"
              htmlFor="gst-amount"
              error={hasError ? "Enter a valid positive amount." : undefined}
            >
              <Input
                id="gst-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </ToolField>

            <ToolField label="GST rate" htmlFor="gst-rate">
              <Select
                id="gst-rate"
                value={rateStr}
                onChange={(e) => setRateStr(e.target.value)}
              >
                {PRESET_RATES.map((r) => (
                  <option key={r} value={String(r)}>
                    {r}%
                  </option>
                ))}
                <option value="custom">Custom</option>
              </Select>
            </ToolField>

            {isCustom && (
              <ToolField label="Custom rate (%)" htmlFor="gst-custom">
                <Input
                  id="gst-custom"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="15"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                />
              </ToolField>
            )}

            <ToolField
              label="GST inclusive"
              htmlFor="gst-inclusive"
              description={
                inclusive
                  ? "The amount already includes GST — back-calculate the base."
                  : "The amount is before GST — add GST on top."
              }
              orientation="horizontal"
            >
              <Switch
                id="gst-inclusive"
                checked={inclusive}
                onCheckedChange={setInclusive}
              />
            </ToolField>
          </ToolPanel>
        }
        output={
          <ToolPanel title="Result">
            {result ? (
              <>
                <ToolStats
                  stats={[
                    { label: "Base amount", value: formatInr(result.base) },
                    { label: "GST amount", value: formatInr(result.gst) },
                    { label: "Total", value: formatInr(result.total) },
                    { label: "Rate", value: `${rate}%` },
                  ]}
                  columns={2}
                />
                <div className="bg-primary/5 border-primary/20 rounded-xl border p-4 text-center">
                  <p className="text-muted-foreground text-xs">
                    {inclusive
                      ? "Total (GST inclusive)"
                      : "Total (GST exclusive)"}
                  </p>
                  <p className="text-primary mt-1 text-3xl font-bold tabular-nums">
                    {formatInr(result.total)}
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-muted/20 flex min-h-48 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Enter an amount to calculate GST
                </p>
              </div>
            )}
          </ToolPanel>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
