"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { PenLine, Mic, FileText, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getWritings, getSpeeches, getProfile } from "@/lib/store";
import { WRITING_TYPE_LABELS, SPEECH_TYPE_LABELS } from "@/lib/types";
import { writingMaterials } from "@/lib/data/writing-materials";
import { speechMaterials } from "@/lib/data/speech-materials";
import type { Writing, Speech, UserProfile } from "@/lib/types";

interface EntryItem {
  id: string;
  date: string;
  kind: "writing" | "speech";
  typeLabel: string;
  content: string;
  wordCount: number;
  timeSpent: number;
}

function formatTimeSpent(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return format(d, "M月d日 EEEE", { locale: zhCN });
}

function buildEntries(writings: Writing[], speeches: Speech[]): EntryItem[] {
  const wMap = new Map(writingMaterials.map((m) => [m.id, m]));
  const sMap = new Map(speechMaterials.map((m) => [m.id, m]));

  const items: EntryItem[] = [];

  for (const w of writings) {
    const mat = wMap.get(w.material_id);
    items.push({
      id: w.id,
      date: w.created_at,
      kind: "writing",
      typeLabel: mat ? WRITING_TYPE_LABELS[mat.type] : "写作",
      content: w.content,
      wordCount: w.word_count,
      timeSpent: w.time_spent,
    });
  }

  for (const s of speeches) {
    const mat = sMap.get(s.speech_material_id);
    items.push({
      id: s.id,
      date: s.created_at,
      kind: "speech",
      typeLabel: mat ? SPEECH_TYPE_LABELS[mat.type] : "演讲",
      content: s.content,
      wordCount: s.word_count,
      timeSpent: s.time_spent,
    });
  }

  items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return items;
}

function EntryCard({ entry }: { entry: EntryItem }) {
  const preview =
    entry.content.length > 50
      ? entry.content.slice(0, 50) + "…"
      : entry.content;

  return (
    <Card className="px-4 py-3 gap-2 border-border/50 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatDate(entry.date)}
        </span>
        <Badge
          variant="secondary"
          className={`rounded-full text-[10px] px-2 py-0 ${
            entry.kind === "writing"
              ? "bg-blue-100/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              : "bg-orange-100/80 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
          }`}
        >
          {entry.kind === "writing" ? (
            <PenLine className="mr-0.5 h-3 w-3" />
          ) : (
            <Mic className="mr-0.5 h-3 w-3" />
          )}
          {entry.typeLabel}
        </Badge>
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">{preview}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{entry.wordCount} 字</span>
        <span>·</span>
        <span>{formatTimeSpent(entry.timeSpent)}</span>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <FileText className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground">
        还没有练习记录，今天就开始吧
      </p>
      <Link
        href="/"
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <Sparkles className="h-3.5 w-3.5" />
        去练习
      </Link>
    </div>
  );
}

function EntryList({ entries }: { entries: EntryItem[] }) {
  if (entries.length === 0) return <EmptyState />;
  return (
    <div className="flex flex-col gap-3">
      {entries.map((e) => (
        <EntryCard key={e.id} entry={e} />
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const writings = getWritings();
    const speeches = getSpeeches();
    setEntries(buildEntries(writings, speeches));
    setProfile(getProfile());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const writingEntries = entries.filter((e) => e.kind === "writing");
  const speechEntries = entries.filter((e) => e.kind === "speech");

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 pt-6">
      <h1 className="mb-4 text-xl font-bold tracking-tight">练习记录</h1>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="items-center px-3 py-3 gap-1 border-blue-200/40 dark:border-blue-900/30">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile?.total_days ?? 0}</span>
          <span className="text-[11px] text-muted-foreground">总天数</span>
        </Card>
        <Card className="items-center px-3 py-3 gap-1 border-orange-200/40 dark:border-orange-900/30">
          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {(profile?.total_words ?? 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground">总字数</span>
        </Card>
        <Card className="items-center px-3 py-3 gap-1 border-violet-200/40 dark:border-violet-900/30">
          <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">Lv.{profile?.level ?? 1}</span>
          <span className="text-[11px] text-muted-foreground">当前等级</span>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">全部 ({entries.length})</TabsTrigger>
          <TabsTrigger value="writing" className="rounded-lg">
            写作 ({writingEntries.length})
          </TabsTrigger>
          <TabsTrigger value="speech" className="rounded-lg">
            演讲 ({speechEntries.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <EntryList entries={entries} />
        </TabsContent>
        <TabsContent value="writing" className="mt-4">
          <EntryList entries={writingEntries} />
        </TabsContent>
        <TabsContent value="speech" className="mt-4">
          <EntryList entries={speechEntries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
