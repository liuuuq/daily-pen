"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWritingById, saveWriting } from "@/lib/store";
import { WRITING_TYPE_LABELS } from "@/lib/types";
import type { WritingMaterial } from "@/lib/types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Clock, ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`size-4 ${i <= level ? "fill-amber-400 text-amber-400" : "text-border"}`}
        />
      ))}
    </span>
  );
}

function MaterialSection({ material }: { material: WritingMaterial }) {
  switch (material.type) {
    case "copy":
      return (
        <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-4 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-orange-950/20">
          <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
            {material.content}
          </p>
        </Card>
      );

    case "fill_blank":
      return (
        <Card className="border-blue-200/60 bg-blue-50/40 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
          <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
            {material.content.split(/(____(?:（[^）]*）)?)/).map((seg, i) =>
              seg.startsWith("____") ? (
                <span key={i} className="font-semibold text-blue-600 dark:text-blue-400">
                  {seg}
                </span>
              ) : (
                <span key={i}>{seg}</span>
              ),
            )}
          </p>
        </Card>
      );

    case "imitate": {
      const parts = material.content.split(/【仿写要求】/);
      return (
        <div className="space-y-3">
          <Card className="border-emerald-200/60 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-4 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-teal-950/20">
            <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
              {parts[0]?.trim()}
            </p>
          </Card>
          {parts[1] && (
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground/80">仿写要求：</span>
              {parts[1].trim()}
            </p>
          )}
        </div>
      );
    }

    case "summarize":
      return (
        <div className="space-y-2">
          <Card className="max-h-60 overflow-y-auto border-secondary p-4">
            <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
              {material.content}
            </p>
          </Card>
          <p className="text-xs text-muted-foreground">
            原文约 {material.content.replace(/[^\u4e00-\u9fff]/g, "").length} 字
          </p>
        </div>
      );

    case "rewrite": {
      const rwParts = material.content.split(/【改写要求】/);
      return (
        <div className="space-y-3">
          <Card className="border-violet-200/60 bg-gradient-to-br from-violet-50/60 to-purple-50/40 p-4 dark:border-violet-900/40 dark:from-violet-950/30 dark:to-purple-950/20">
            <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
              {rwParts[0]?.trim()}
            </p>
          </Card>
          {rwParts[1] && (
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground/80">改写要求：</span>
              {rwParts[1].trim()}
            </p>
          )}
        </div>
      );
    }

    case "image_write":
      return (
        <div className="space-y-3">
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100/60 to-amber-100/60 dark:from-rose-950/20 dark:to-amber-950/20">
            <ImageIcon className="size-12 text-muted-foreground/30" />
          </div>
          <p className="whitespace-pre-line text-sm leading-6 text-foreground/80">
            {material.content}
          </p>
        </div>
      );

    case "continue_write": {
      const cwParts = material.content.split(/【续写要求】/);
      return (
        <div className="space-y-3">
          <Card className="border-orange-200/60 bg-gradient-to-br from-orange-50/60 to-amber-50/40 p-4 dark:border-orange-900/40 dark:from-orange-950/30 dark:to-amber-950/20">
            <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/90">
              {cwParts[0]?.trim()}
            </p>
          </Card>
          {cwParts[1] && (
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground/80">请续写：</span>
              {cwParts[1].trim()}
            </p>
          )}
        </div>
      );
    }

    case "topic":
      return (
        <Card className="border-sky-200/60 bg-gradient-to-br from-sky-50/60 to-blue-50/40 p-5 dark:border-sky-900/40 dark:from-sky-950/30 dark:to-blue-950/20">
          <p className="text-center text-lg font-medium leading-8 text-foreground/90">
            {material.content}
          </p>
        </Card>
      );

    case "free":
      return (
        <Card className="border-rose-200/60 bg-gradient-to-br from-rose-50/70 to-orange-50/50 p-5 dark:border-rose-900/40 dark:from-rose-950/30 dark:to-orange-950/20">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-400" />
            <p className="text-center text-base leading-7 text-foreground/80">
              自由书写，不要停笔，写满10分钟
            </p>
          </div>
        </Card>
      );

    default:
      return null;
  }
}

export default function WritingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = useState<WritingMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "深呼吸，然后开始写吧..." }),
      CharacterCount,
    ],
    editorProps: {
      attributes: {
        class:
          "tiptap-content prose prose-zinc dark:prose-invert max-w-none min-h-[200px] p-4 outline-none focus:outline-none",
      },
    },
    onUpdate: () => {
      if (!started) setStarted(true);
    },
  });

  useEffect(() => {
    if (params.id) {
      const m = getWritingById(params.id);
      setMaterial(m);
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (started && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [started]);

  const handleSubmit = useCallback(() => {
    if (!editor || !material) return;
    const text = editor.getText();
    if (!text.trim()) return;

    setSubmitting(true);
    const saved = saveWriting({
      material_id: material.id,
      content: editor.getHTML(),
      word_count: text.replace(/\s/g, "").length,
      time_spent: elapsed,
    });
    router.push(`/review/writing/${saved.id}`);
  }, [editor, material, elapsed, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">未找到该写作素材</p>
        <Link href="/">
          <Button variant="outline" size="sm">
            返回首页
          </Button>
        </Link>
      </div>
    );
  }

  const charCount = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div className="min-h-screen">
      <style>{`
        .tiptap-editor .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          outline: none;
        }
        .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
          color: #c4a882;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>

      <div className="mx-auto max-w-lg px-4 pb-8 pt-6">
        <div className="mb-5 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm" className="rounded-xl">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">写作练习</h1>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full">{WRITING_TYPE_LABELS[material.type]}</Badge>
          <DifficultyStars level={material.difficulty} />
        </div>

        <h2 className="mb-4 text-base font-semibold text-foreground/90">
          {material.title}
        </h2>

        <div className="mb-6">
          <MaterialSection material={material} />
        </div>

        <div className="tiptap-editor mb-2 overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
          <EditorContent editor={editor} />
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            {charCount} 字
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5">
            <Clock className="size-3.5" />
            {formatTime(elapsed)}
          </span>
        </div>

        <Button
          className="w-full rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white"
          size="lg"
          onClick={handleSubmit}
          disabled={submitting || charCount === 0}
        >
          {submitting ? "提交中..." : "完成提交"}
        </Button>
      </div>
    </div>
  );
}
