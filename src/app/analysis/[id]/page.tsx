"use client";

import { useParams, useRouter } from "next/navigation";
import { getAnalysisById, markAnalysisDone } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Quote, Lightbulb, BookOpen, PenLine, Sparkles } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "next/link";
import React, { useMemo, useState, useCallback } from "react";
import type { SpeechTechnique } from "@/lib/types";

const STRUCTURE_COLORS: Record<string, string> = {
  opening: "bg-blue-400",
  body: "bg-emerald-400",
  closing: "bg-orange-400",
};

const STRUCTURE_LABELS: Record<string, string> = {
  opening: "开场",
  body: "主体",
  closing: "收束",
};

function HighlightedText({
  text,
  techniques,
}: {
  text: string;
  techniques: SpeechTechnique[];
}) {
  const [active, setActive] = useState<SpeechTechnique | null>(null);

  const segments = useMemo(() => {
    type Segment = { text: string; technique?: SpeechTechnique };
    const markers: { start: number; end: number; technique: SpeechTechnique }[] = [];

    for (const t of techniques) {
      const idx = text.indexOf(t.text);
      if (idx !== -1) {
        markers.push({ start: idx, end: idx + t.text.length, technique: t });
      }
    }

    markers.sort((a, b) => a.start - b.start);

    const result: Segment[] = [];
    let cursor = 0;
    for (const m of markers) {
      if (m.start < cursor) continue;
      if (m.start > cursor) {
        result.push({ text: text.slice(cursor, m.start) });
      }
      result.push({ text: text.slice(m.start, m.end), technique: m.technique });
      cursor = m.end;
    }
    if (cursor < text.length) {
      result.push({ text: text.slice(cursor) });
    }
    return result;
  }, [text, techniques]);

  return (
    <div className="relative">
      <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
        {segments.map((seg, i) =>
          seg.technique ? (
            <span
              key={i}
              className="cursor-pointer rounded-sm bg-amber-100/80 px-0.5 underline decoration-amber-400 decoration-2 underline-offset-2 transition-colors hover:bg-amber-200/80 dark:bg-amber-900/40 dark:hover:bg-amber-900/60"
              onClick={() =>
                setActive(active?.text === seg.technique!.text ? null : seg.technique!)
              }
            >
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>

      {active && (
        <Card className="mt-3 border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-3 dark:border-amber-800/40 dark:from-amber-950/40 dark:to-orange-950/30">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                {active.technique}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {active.explanation}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActive(null)}
            className="mt-2 text-xs text-amber-600 hover:underline dark:text-amber-400"
          >
            关闭
          </button>
        </Card>
      )}
    </div>
  );
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const analysis = getAnalysisById(params.id as string);
  const [submitted, setSubmitted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "在此写下你的练习内容…" }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[160px] px-3 py-2 focus:outline-none",
      },
    },
  });

  const handleSubmit = useCallback(() => {
    if (!editor || !analysis) return;
    const html = editor.getHTML();
    const text = editor.getText();
    if (!text.trim()) return;

    localStorage.setItem(
      `dailypen_analysis_exercise_${analysis.id}`,
      JSON.stringify({ html, text, submittedAt: new Date().toISOString() }),
    );
    markAnalysisDone();
    setSubmitted(true);
  }, [editor, analysis]);

  if (!analysis) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">未找到该演讲拆解内容</p>
        <Button variant="outline" className="mt-4 rounded-xl" asChild>
          <Link href="/analysis">返回列表</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-bold">演讲拆解</h1>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-rose-100 text-xl font-bold text-violet-600 dark:from-violet-950/50 dark:to-rose-950/50 dark:text-violet-400">
            {analysis.speaker[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold">{analysis.speaker}</h2>
            <p className="text-sm text-muted-foreground">{analysis.occasion}</p>
          </div>
        </div>
        <h3 className="mt-3 text-base font-semibold">{analysis.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {analysis.background}
        </p>
      </div>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
          <BookOpen className="size-4 text-primary" />
          结构拆解
        </h3>
        <div className="space-y-3">
          {analysis.structure_breakdown.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`h-full w-1 rounded-full ${STRUCTURE_COLORS[item.type]}`}
                />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full text-xs">
                    {STRUCTURE_LABELS[item.type]}
                  </Badge>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
          <BookOpen className="size-4 text-primary" />
          演讲精华
        </h3>
        <Card className="p-4 border-border/50">
          <HighlightedText
            text={analysis.full_text}
            techniques={analysis.techniques}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            点击高亮文字查看修辞技巧解析
          </p>
        </Card>
      </section>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
          <Lightbulb className="size-4 text-amber-500" />
          修辞技巧
        </h3>
        <div className="space-y-3">
          {analysis.techniques.map((t, i) => (
            <Card key={i} className="p-4 border-border/50">
              <p className="text-sm font-semibold">{t.technique}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t.explanation}
              </p>
              <blockquote className="mt-2 border-l-2 border-primary/30 pl-3 text-xs italic text-muted-foreground/70">
                「{t.text}」
              </blockquote>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
          <Quote className="size-4 text-rose-400" />
          金句摘录
        </h3>
        <div className="space-y-3">
          {analysis.quotes.map((q, i) => (
            <Card
              key={i}
              className="relative overflow-hidden border-rose-200/40 p-4 pl-10 dark:border-rose-900/30"
            >
              <Quote className="absolute left-3 top-3 size-5 text-rose-300/40 dark:text-rose-700/40" />
              <p className="text-sm font-medium leading-relaxed">{q}</p>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
          <PenLine className="size-4 text-blue-500" />
          今日互动练习
        </h3>
        <Card className="mb-4 bg-gradient-to-br from-blue-50/60 to-violet-50/40 p-4 dark:from-blue-950/20 dark:to-violet-950/15">
          <p className="text-sm leading-relaxed">{analysis.exercise_prompt}</p>
        </Card>

        {submitted ? (
          <Card className="border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 p-4 text-center dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-teal-950/20">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                练习已提交，今日演讲拆解已完成！
              </p>
            </div>
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden rounded-2xl border-border/60">
              <EditorContent editor={editor} />
            </Card>
            <Button
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white"
              onClick={handleSubmit}
            >
              提交练习
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
