"use client";

import { useEffect, useState, useRef } from "react";
import {
  User,
  Calendar,
  PenLine,
  Flame,
  Target,
  Trophy,
  Lock,
  Moon,
  Sun,
  Trash2,
  Mic,
  Heart,
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getProfile,
  getWritings,
  getSpeeches,
  getConsecutiveDays,
  getCurrentPhase,
  getStreaks,
  updateProfileName,
  resetAllData,
} from "@/lib/store";
import { PHASE_LABELS } from "@/lib/types";
import { WRITING_TYPE_LABELS, SPEECH_TYPE_LABELS } from "@/lib/types";
import { writingMaterials } from "@/lib/data/writing-materials";
import { speechMaterials } from "@/lib/data/speech-materials";
import type { UserProfile, Writing, Speech } from "@/lib/types";

interface AchievementDef {
  emoji: string;
  label: string;
  check: (ctx: AchievementCtx) => boolean;
}

interface AchievementCtx {
  totalDays: number;
  totalWords: number;
  consecutive: number;
  writingsCount: number;
  speechesCount: number;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    emoji: "🌱",
    label: "初次动笔",
    check: (c) => c.writingsCount > 0,
  },
  {
    emoji: "🎤",
    label: "演讲新星",
    check: (c) => c.speechesCount > 0,
  },
  {
    emoji: "🔥",
    label: "三日连续",
    check: (c) => c.consecutive >= 3,
  },
  {
    emoji: "⚡",
    label: "一周坚持",
    check: (c) => c.consecutive >= 7,
  },
  {
    emoji: "📝",
    label: "万字达人",
    check: (c) => c.totalWords >= 10000,
  },
  {
    emoji: "🏆",
    label: "月度坚持",
    check: (c) => c.totalDays >= 30,
  },
];

interface RecentEntry {
  id: string;
  date: string;
  kind: "writing" | "speech";
  label: string;
}

function buildRecentEntries(
  writings: Writing[],
  speeches: Speech[]
): RecentEntry[] {
  const wMap = new Map(writingMaterials.map((m) => [m.id, m]));
  const sMap = new Map(speechMaterials.map((m) => [m.id, m]));

  const all: RecentEntry[] = [];

  for (const w of writings) {
    const mat = wMap.get(w.material_id);
    all.push({
      id: w.id,
      date: w.created_at,
      kind: "writing",
      label: mat ? WRITING_TYPE_LABELS[mat.type] : "写作",
    });
  }

  for (const s of speeches) {
    const mat = sMap.get(s.speech_material_id);
    all.push({
      id: s.id,
      date: s.created_at,
      kind: "speech",
      label: mat ? SPEECH_TYPE_LABELS[mat.type] : "演讲",
    });
  }

  all.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return all.slice(0, 5);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [consecutive, setConsecutive] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [writings, setWritings] = useState<Writing[]>([]);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [dark, setDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(getProfile());
    setConsecutive(getConsecutiveDays());
    setPhase(getCurrentPhase());
    setWritings(getWritings());
    setSpeeches(getSpeeches());
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!mounted || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const achievementCtx: AchievementCtx = {
    totalDays: profile.total_days,
    totalWords: profile.total_words,
    consecutive,
    writingsCount: writings.length,
    speechesCount: speeches.length,
  };

  const recentEntries = buildRecentEntries(writings, speeches);

  function handleSaveName() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== profile!.display_name) {
      updateProfileName(trimmed);
      setProfile({ ...profile!, display_name: trimmed });
    }
    setEditing(false);
  }

  function handleReset() {
    resetAllData();
    setShowReset(false);
    window.location.reload();
  }

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  const firstChar = profile.display_name.charAt(0);

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 pt-6">
      {/* Avatar + Name */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-orange-200 text-3xl font-bold text-rose-600 dark:from-rose-950/50 dark:to-orange-950/50 dark:text-rose-400">
          {firstChar}
        </div>

        {editing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-40 border-b border-primary bg-transparent text-center text-lg font-bold outline-none"
          />
        ) : (
          <button
            onClick={() => {
              setEditName(profile.display_name);
              setEditing(true);
            }}
            className="text-lg font-bold hover:text-primary/80 transition-colors"
          >
            {profile.display_name}
          </button>
        )}

        <Badge variant="secondary" className="rounded-full text-xs">
          <Heart className="mr-1 h-3 w-3 text-rose-400" />
          Lv.{profile.level} 表达者
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Card className="flex-row items-center gap-3 px-4 py-3 border-blue-200/40 dark:border-blue-900/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 dark:bg-blue-950/40">
            <Calendar className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">
              {profile.total_days}
            </p>
            <p className="text-[11px] text-muted-foreground">累计天数</p>
          </div>
        </Card>

        <Card className="flex-row items-center gap-3 px-4 py-3 border-emerald-200/40 dark:border-emerald-900/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40">
            <PenLine className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">
              {profile.total_words.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">累计字数</p>
          </div>
        </Card>

        <Card className="flex-row items-center gap-3 px-4 py-3 border-orange-200/40 dark:border-orange-900/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100/80 dark:bg-orange-950/40">
            <Flame className="h-4.5 w-4.5 text-orange-500" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">{consecutive}</p>
            <p className="text-[11px] text-muted-foreground">连续打卡</p>
          </div>
        </Card>

        <Card className="flex-row items-center gap-3 px-4 py-3 border-violet-200/40 dark:border-violet-900/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100/80 dark:bg-violet-950/40">
            <Target className="h-4.5 w-4.5 text-violet-500" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">
              {PHASE_LABELS[phase]}
            </p>
            <p className="text-[11px] text-muted-foreground">当前阶段</p>
          </div>
        </Card>
      </div>

      {/* Achievement Badges */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Trophy className="h-4 w-4" />
          成就徽章
        </h2>
        <Card className="px-4 py-4 gap-0 border-amber-200/40 dark:border-amber-900/30">
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const earned = a.check(achievementCtx);
              return (
                <div
                  key={a.label}
                  className={`flex flex-col items-center gap-1.5 rounded-xl py-3 transition-all ${
                    earned ? "bg-amber-50/60 dark:bg-amber-950/20" : "opacity-35"
                  }`}
                >
                  <span className="text-2xl">
                    {earned ? a.emoji : ""}
                  </span>
                  {!earned && (
                    <Lock className="h-6 w-6 text-muted-foreground/50" />
                  )}
                  <span className="text-[11px] font-medium text-center">
                    {a.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            最近动态
          </h2>
          <Card className="px-4 py-3 gap-0">
            <div className="flex flex-col">
              {recentEntries.map((entry, i) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 py-2.5 ${
                    i < recentEntries.length - 1
                      ? "border-b border-border/30"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      entry.kind === "writing"
                        ? "bg-blue-100/80 dark:bg-blue-950/40"
                        : "bg-orange-100/80 dark:bg-orange-950/40"
                    }`}
                  >
                    {entry.kind === "writing" ? (
                      <PenLine className="h-3.5 w-3.5 text-blue-500" />
                    ) : (
                      <Mic className="h-3.5 w-3.5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {entry.label}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(entry.date), "M/d", { locale: zhCN })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Settings */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          设置
        </h2>
        <Card className="px-4 py-1 gap-0">
          <button
            onClick={toggleDark}
            className="flex w-full items-center justify-between py-3 border-b border-border/30"
          >
            <div className="flex items-center gap-3">
              {dark ? (
                <Moon className="h-4.5 w-4.5 text-indigo-400" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-amber-500" />
              )}
              <span className="text-sm font-medium">深色模式</span>
            </div>
            <div
              className={`h-6 w-10 rounded-full p-0.5 transition-colors ${
                dark ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  dark ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </button>

          <button
            onClick={() => setShowReset(true)}
            className="flex w-full items-center gap-3 py-3 text-destructive"
          >
            <Trash2 className="h-4.5 w-4.5" />
            <span className="text-sm font-medium">重置数据</span>
          </button>
        </Card>
      </div>

      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认重置</DialogTitle>
            <DialogDescription>
              此操作将清除所有练习记录、个人数据和成就，且无法恢复。确定要继续吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReset(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              确认重置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
