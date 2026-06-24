"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolStats } from "@/components/tool/tool-stats";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { calcEmi, calcEmiYearwise } from "@/lib/utils/finance";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function EmiCalculator() {
  const [principal, setPrincipal] = React.useState(500000);
  const [rate, setRate] = React.useState(8.5);
  const [tenure, setTenure] = React.useState(5);
  const [unit, setUnit] = React.useState<"years" | "months">("years");

  const months = unit === "years" ? tenure * 12 : tenure;

  const result = React.useMemo(
    () => (months > 0 ? calcEmi(principal, rate, months) : null),
    [principal, rate, months]
  );

  const yearwise = React.useMemo(
    () => (months > 0 ? calcEmiYearwise(principal, rate, months) : []),
    [principal, rate, months]
  );

  const principalPct = result
    ? (result.principal / result.totalPayment) * 100
    : 0;

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="sidebar"
        controls={
          <ToolPanel title="Loan Settings">
            <ToolField
              label="Loan amount (₹)"
              htmlFor="emi-principal"
              labelAddon={formatInr(principal)}
            >
              <Slider
                id="emi-principal"
                min={50000}
                max={10000000}
                step={50000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
              <Input
                type="number"
                min={50000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="mt-2"
              />
            </ToolField>

            <ToolField
              label="Annual interest rate (%)"
              htmlFor="emi-rate"
              labelAddon={`${rate}%`}
            >
              <Slider
                id="emi-rate"
                min={1}
                max={30}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </ToolField>

            <ToolField label="Loan tenure" htmlFor="emi-tenure">
              <div className="flex gap-2">
                <Input
                  id="emi-tenure"
                  type="number"
                  min={1}
                  max={unit === "years" ? 30 : 360}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                />
                <Select
                  value={unit}
                  onChange={(e) =>
                    setUnit(e.target.value as "years" | "months")
                  }
                  className="w-32"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </Select>
              </div>
            </ToolField>
          </ToolPanel>
        }
        output={
          <div className="space-y-4">
            {result ? (
              <>
                <ToolPanel title="Result">
                  <div className="bg-primary/5 border-primary/20 rounded-xl border p-4 text-center">
                    <p className="text-muted-foreground text-xs">Monthly EMI</p>
                    <p className="text-primary mt-1 text-3xl font-bold tabular-nums">
                      {formatInr(result.emi)}
                    </p>
                  </div>
                  <ToolStats
                    stats={[
                      {
                        label: "Principal",
                        value: formatInr(result.principal),
                      },
                      {
                        label: "Total interest",
                        value: formatInr(result.totalInterest),
                      },
                      {
                        label: "Total payment",
                        value: formatInr(result.totalPayment),
                      },
                      { label: "Tenure", value: `${months} months` },
                    ]}
                    columns={2}
                  />
                  {/* Principal vs interest bar */}
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Principal</span>
                      <span className="text-muted-foreground">Interest</span>
                    </div>
                    <div className="bg-muted flex h-3 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${principalPct}%` }}
                      />
                      <div className="h-full flex-1 bg-orange-400 dark:bg-orange-500" />
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-primary">
                        {principalPct.toFixed(0)}%
                      </span>
                      <span className="text-orange-600 dark:text-orange-400">
                        {(100 - principalPct).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </ToolPanel>

                <ToolPanel title="Year-wise Amortization">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-muted-foreground py-2 text-left font-medium">
                            Year
                          </th>
                          <th className="text-muted-foreground py-2 text-right font-medium">
                            Principal
                          </th>
                          <th className="text-muted-foreground py-2 text-right font-medium">
                            Interest
                          </th>
                          <th className="text-muted-foreground py-2 text-right font-medium">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearwise.map((row) => (
                          <tr key={row.year} className="border-b last:border-0">
                            <td className="py-1.5">{row.year}</td>
                            <td className="text-primary py-1.5 text-right tabular-nums">
                              {formatInr(row.principalPaid)}
                            </td>
                            <td className="py-1.5 text-right text-orange-600 tabular-nums dark:text-orange-400">
                              {formatInr(row.interestPaid)}
                            </td>
                            <td className="py-1.5 text-right tabular-nums">
                              {formatInr(row.endBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ToolPanel>
              </>
            ) : (
              <div className="bg-muted/20 flex min-h-48 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Enter loan details to calculate EMI
                </p>
              </div>
            )}
          </div>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
