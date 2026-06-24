"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolStats } from "@/components/tool/tool-stats";
import { ValidationMessage } from "@/components/shared/validation-message";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { formatNumber } from "@/lib/utils";
import {
  parseLocalDate,
  calcAge,
  getZodiacSign,
  getDayName,
  daysUntilNextBirthday,
} from "@/lib/utils/date";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function AgeCalculator() {
  const [dob, setDob] = React.useState("");
  const [targetDate, setTargetDate] = React.useState(todayStr());

  const result = React.useMemo(() => {
    if (!dob) return null;
    try {
      const dobDate = parseLocalDate(dob);
      const targetD = parseLocalDate(targetDate || todayStr());
      if (dobDate > targetD)
        return { error: "Date of birth must be before the target date." };
      const age = calcAge(dobDate, targetD);
      const zodiac = getZodiacSign(dobDate);
      const dayName = getDayName(dobDate);
      const nextBday = daysUntilNextBirthday(dobDate, targetD);
      return { age, zodiac, dayName, nextBday };
    } catch {
      return { error: "Invalid date — please check your input." };
    }
  }, [dob, targetDate]);

  const hasResult = result && !("error" in result);

  const mainStats = hasResult
    ? [
        { label: "Years", value: result.age.years },
        { label: "Months", value: result.age.months },
        { label: "Days", value: result.age.days },
        { label: "Zodiac", value: result.zodiac },
      ]
    : [];

  const totalStats = hasResult
    ? [
        {
          label: "Total days",
          value: formatNumber(result.age.totalDays),
        },
        {
          label: "Total weeks",
          value: formatNumber(result.age.totalWeeks),
        },
        {
          label: "Total hours",
          value: formatNumber(result.age.totalHours),
        },
        {
          label: "Total minutes",
          value: formatNumber(result.age.totalMinutes),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        controls={
          <ToolPanel title="Dates">
            <ToolField label="Date of birth" htmlFor="age-dob">
              <Input
                id="age-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={todayStr()}
              />
            </ToolField>
            <ToolField
              label="Target date"
              htmlFor="age-target"
              hint="Defaults to today."
            >
              <Input
                id="age-target"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </ToolField>
            {result && "error" in result ? (
              <ValidationMessage status="error">
                {result.error}
              </ValidationMessage>
            ) : null}
          </ToolPanel>
        }
        output={
          <div className="space-y-4">
            {hasResult ? (
              <>
                <ToolPanel title="Age">
                  <ToolStats stats={mainStats} columns={2} />
                  <div className="divide-border divide-y rounded-lg border text-sm">
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-muted-foreground">Born on</span>
                      <span className="font-medium">{result.dayName}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-muted-foreground">
                        Next birthday in
                      </span>
                      <span className="font-medium">
                        {result.nextBday === 0
                          ? "🎂 Today!"
                          : `${result.nextBday} days`}
                      </span>
                    </div>
                  </div>
                </ToolPanel>

                <ToolPanel title="Totals">
                  <ToolStats stats={totalStats} columns={2} />
                </ToolPanel>
              </>
            ) : (
              <div className="bg-muted/20 flex min-h-56 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Enter a date of birth to calculate age
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
