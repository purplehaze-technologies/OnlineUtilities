"use client";

import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolStats } from "@/components/tool/tool-stats";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { useDebounce } from "@/hooks/use-debounce";
import { analyzeText, topKeywords, formatReadingTime } from "@/lib/utils/text";

export function WordCounter() {
  const [text, setText] = React.useState("");
  const debounced = useDebounce(text, 150);

  const stats = React.useMemo(() => analyzeText(debounced), [debounced]);
  const keywords = React.useMemo(() => topKeywords(debounced), [debounced]);

  const hasContent = debounced.trim().length > 0;

  const mainStats = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "No spaces", value: stats.charsNoSpace },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Avg word len", value: stats.avgWordLength },
  ];

  const timeStats = [
    {
      label: "Reading time",
      value: formatReadingTime(stats.readingMinutes),
    },
    {
      label: "Speaking time",
      value: formatReadingTime(stats.speakingMinutes),
    },
    { label: "Longest word", value: stats.longestWord || "—" },
  ];

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        stickyOutput={false}
        controls={
          <ToolPanel title="Text input">
            <Textarea
              id="wc-input"
              placeholder="Start typing or paste your text here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-80 text-sm"
              aria-label="Text to analyse"
            />
          </ToolPanel>
        }
        output={
          <div className="space-y-4">
            <ToolPanel title="Statistics">
              <ToolStats stats={mainStats} columns={3} />
            </ToolPanel>

            <ToolPanel title="Reading & Speaking">
              <ToolStats stats={timeStats} columns={3} />
            </ToolPanel>

            {hasContent && keywords.length > 0 && (
              <ToolPanel title="Top Keywords">
                <div className="space-y-2">
                  {keywords.map(({ word, count, density }) => (
                    <div key={word} className="flex items-center gap-3 text-sm">
                      <span className="w-28 font-mono font-medium">{word}</span>
                      <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(density * 5, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground w-20 text-right tabular-nums">
                        {count}× · {density.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </ToolPanel>
            )}
          </div>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
