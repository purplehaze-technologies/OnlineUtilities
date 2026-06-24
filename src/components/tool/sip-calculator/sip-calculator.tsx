"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolStats } from "@/components/tool/tool-stats";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { calcSip, calcSipYearwise } from "@/lib/utils/finance";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function SipCalculator() {
  const [monthly, setMonthly] = React.useState(5000);
  const [rate, setRate] = React.useState(12);
  const [years, setYears] = React.useState(10);

  const result = React.useMemo(
    () => calcSip(monthly, rate, years),
    [monthly, rate, years]
  );

  const yearwise = React.useMemo(
    () => calcSipYearwise(monthly, rate, years),
    [monthly, rate, years]
  );

  const investedPct = (result.totalInvested / result.finalValue) * 100;

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="sidebar"
        controls={
          <ToolPanel title="Investment Settings">
            <ToolField
              label="Monthly investment (₹)"
              htmlFor="sip-monthly"
              labelAddon={formatInr(monthly)}
            >
              <Slider
                id="sip-monthly"
                min={500}
                max={100000}
                step={500}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
              />
              <Input
                type="number"
                min={500}
                max={100000}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="mt-2"
              />
            </ToolField>

            <ToolField
              label="Expected annual return (%)"
              htmlFor="sip-rate"
              labelAddon={`${rate}%`}
            >
              <Slider
                id="sip-rate"
                min={1}
                max={30}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </ToolField>

            <ToolField
              label="Investment duration (years)"
              htmlFor="sip-years"
              labelAddon={`${years} yr`}
            >
              <Slider
                id="sip-years"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </ToolField>
          </ToolPanel>
        }
        output={
          <div className="space-y-4">
            <ToolPanel title="Result">
              <ToolStats
                stats={[
                  {
                    label: "Total invested",
                    value: formatInr(result.totalInvested),
                  },
                  { label: "Est. returns", value: formatInr(result.returns) },
                ]}
                columns={2}
              />
              <div className="bg-primary/5 border-primary/20 rounded-xl border p-4 text-center">
                <p className="text-muted-foreground text-xs">
                  Estimated corpus after {years} yr
                </p>
                <p className="text-primary mt-1 text-3xl font-bold tabular-nums">
                  {formatInr(result.finalValue)}
                </p>
              </div>
              {/* Progress bar: invested vs returns */}
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Invested</span>
                  <span className="text-muted-foreground">Returns</span>
                </div>
                <div className="bg-muted flex h-3 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${investedPct}%` }}
                    title={`Invested: ${investedPct.toFixed(0)}%`}
                  />
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${100 - investedPct}%` }}
                    title={`Returns: ${(100 - investedPct).toFixed(0)}%`}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-primary">
                    {investedPct.toFixed(0)}%
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {(100 - investedPct).toFixed(0)}%
                  </span>
                </div>
              </div>
            </ToolPanel>

            {/* Year-wise table */}
            <ToolPanel title="Year-wise Growth">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-muted-foreground py-2 text-left font-medium">
                        Year
                      </th>
                      <th className="text-muted-foreground py-2 text-right font-medium">
                        Invested
                      </th>
                      <th className="text-muted-foreground py-2 text-right font-medium">
                        Returns
                      </th>
                      <th className="text-muted-foreground py-2 text-right font-medium">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearwise.map((row) => (
                      <tr key={row.year} className="border-b last:border-0">
                        <td className="py-1.5">{row.year}</td>
                        <td className="py-1.5 text-right tabular-nums">
                          {formatInr(row.invested)}
                        </td>
                        <td className="py-1.5 text-right text-emerald-600 tabular-nums dark:text-emerald-400">
                          {formatInr(row.returns)}
                        </td>
                        <td className="py-1.5 text-right font-medium tabular-nums">
                          {formatInr(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ToolPanel>
          </div>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
