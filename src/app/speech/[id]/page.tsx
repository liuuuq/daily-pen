"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSpeechById, saveSpeech } from "@/lib/store";
import { SPEECH_TYPE_LABELS } from "@/lib/types";
import type { SpeechMaterial } from "@/lib/types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Mic } from "lucide-react";
import Link from "next/link";

type TimerState = "ready" | "running" | "paused" | "finished";

export default function SpeechPracticePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [material, setMaterial] = useState<SpeechMaterial | null>(null);
  const [timerState, setTimerState] = useState<TimerState>("ready");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReference, setShowReference] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "写下你要说的内容..." }),
      CharacterCount,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  useEffect(() => {
    setMounted(true);
    const m = getSpeechById(id);
    if (m) {
      setMaterial(m);
      setTimeLeft(m.time_limit_seconds);
    }
  }, [id]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (timerState === "running" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setTimerState("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [timerState, clearTimer]);

  const handleStart = () => {
    if (timerState === "ready" || timerState === "paused") {
      setTimerState("running");
    }
  };

  const handlePause = () => {
    if (timerState === "running") {
      clearTimer();
      setTimerState("paused");
    }
  };

  const handleReset = () => {
    clearTimer();
    setTimerState("ready");
    if (material) setTimeLeft(material.time_limit_seconds);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const charCount = editor?.storage.characterCount.characters() ?? 0;

  const handleSubmit = () => {
    if (!material || !editor) return;
    const content = editor.getHTML();
    if (!content || content === "<p></p>") return;

    const totalTime = material.time_limit_seconds - timeLeft;
    const saved = saveSpeech({
      speech_material_id: material.id,
      content,
      word_count: charCount,
      time_spent: totalTime,
    });
    router.push(`/review/speech/${saved.id}`);
  };

  const canSubmit =
    timerState !== "ready" && charCount > 0 && editor?.getText().trim();

  if (!mounted || !material) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const difficultyStars = "★".repeat(material.difficulty) + "☆".repeat(3 - material.difficulty);

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm" className="rounded-xl">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Mic className="size-5 text-orange-500" />
            <h1 className="text-lg font-bold">演讲练习</h1>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full bg-orange-100/80 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {SPEECH_TYPE_LABELS[material.type]}
          </Badge>
          <span className="text-sm text-amber-500">{difficultyStars}</span>
          <Badge variant="outline" className="ml-auto gap-1 rounded-full">
            <Clock className="size-3" />
            限时 {material.time_limit_seconds} 秒
          </Badge>
        </div>

        <Card className="mb-4 border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-amber-50/60 dark:border-orange-900/30 dark:from-orange-950/30 dark:to-amber-950/20">
          <div className="px-5 py-4">
            <h2 className="mb-2 text-base font-bold text-foreground/90">
              {material.title}
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/75">
              {material.prompt}
            </p>
          </div>
        </Card>

        {material.reference_text && (
          <Card className="mb-4 border-blue-200/50 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/20">
            <div className="px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/80">
                  📖 参考原文
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-blue-600 dark:text-blue-400"
                  onClick={() => setShowReference(!showReference)}
                >
                  {showReference ? "收起" : "展开"}
                </Button>
              </div>
              {showReference && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/70">
                  {material.reference_text}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Timer */}
        <div className="mb-6 flex flex-col items-center gap-4 py-4">
          <div
            className={`
              flex size-32 items-center justify-center rounded-full border-4 transition-all duration-300
              ${timerState === "ready" ? "border-muted text-muted-foreground" : ""}
              ${timerState === "running" ? "border-orange-400 text-orange-500 shadow-[0_0_24px_rgba(251,146,60,0.2)] animate-pulse" : ""}
              ${timerState === "paused" ? "border-amber-400 text-amber-500" : ""}
              ${timerState === "finished" && timeLeft === 0 ? "border-rose-400 text-rose-500" : ""}
              ${timerState === "finished" && timeLeft > 0 ? "border-emerald-400 text-emerald-500" : ""}
            `}
          >
            <span className="text-3xl font-mono font-bold tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {(timerState === "ready" || timerState === "paused") && (
              <Button
                onClick={handleStart}
                size="sm"
                className="gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                <Play className="size-3.5" />
                {timerState === "ready" ? "开始" : "继续"}
              </Button>
            )}
            {timerState === "running" && (
              <Button
                onClick={handlePause}
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-xl"
              >
                <Pause className="size-3.5" />
                暂停
              </Button>
            )}
            {timerState !== "ready" && (
              <Button
                onClick={handleReset}
                size="sm"
                variant="ghost"
                className="gap-1.5 rounded-xl"
              >
                <RotateCcw className="size-3.5" />
                重置
              </Button>
            )}
          </div>
        </div>

        <Card className="mb-4 overflow-hidden rounded-2xl border-border/60">
          <EditorContent editor={editor} />
          <div className="flex items-center justify-end border-t border-border/40 px-4 py-2">
            <span className="text-xs text-muted-foreground">
              {charCount} 字
            </span>
          </div>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          size="lg"
        >
          <Mic className="size-4" />
          提交练习
        </Button>
      </div>
    </div>
  );
}
