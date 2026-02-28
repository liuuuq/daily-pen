"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  PenLine,
  Mic,
  BookOpen,
  ChevronRight,
  Check,
  Sparkles,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getDailyPlan,
  getStreaks,
  getProfile,
  getConsecutiveDays,
  getCurrentDay,
} from "@/lib/store";
import {
  WRITING_TYPE_LABELS,
  SPEECH_TYPE_LABELS,
  PHASE_LABELS,
} from "@/lib/types";
import type { DailyPlan, UserProfile, Streak } from "@/lib/types";

function formatTime(seconds: number) {
  const m = Math.ceil(seconds / 60);
  return `${m} 分钟`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return { text: "夜深了，早点休息", emoji: "🌙" };
  if (h < 9) return { text: "早安，新的一天开始啦", emoji: "🌅" };
  if (h < 12) return { text: "上午好，元气满满", emoji: "☀️" };
  if (h < 14) return { text: "中午好，记得吃饭哦", emoji: "🍱" };
  if (h < 17) return { text: "下午好，来杯奶茶吧", emoji: "🧋" };
  if (h < 19) return { text: "傍晚好，辛苦啦", emoji: "🌇" };
  return { text: "晚上好，放松一下吧", emoji: "🌛" };
}

interface HeatmapDay {
  date: string;
  level: 0 | 1 | 2 | 3;
}

function buildHeatmap(streaks: Streak[]): HeatmapDay[] {
  const map = new Map<string, number>();
  for (const s of streaks) {
    const count =
      (s.writing_done ? 1 : 0) +
      (s.speech_done ? 1 : 0) +
      (s.analysis_done ? 1 : 0);
    map.set(s.date, count);
  }

  const days: HeatmapDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = map.get(dateStr) || 0;
    days.push({
      date: dateStr,
      level: Math.min(count, 3) as 0 | 1 | 2 | 3,
    });
  }
  return days;
}

const HEATMAP_COLORS = [
  "bg-secondary",
  "bg-orange-200 dark:bg-orange-900",
  "bg-orange-300 dark:bg-orange-700",
  "bg-orange-500 dark:bg-orange-500",
];

function Heatmap({ streaks }: { streaks: Streak[] }) {
  const days = useMemo(() => buildHeatmap(streaks), [streaks]);

  const weeks: HeatmapDay[][] = [];
  let week: HeatmapDay[] = [];
  const firstDate = new Date(days[0].date);
  const startPad = firstDate.getDay();
  for (let i = 0; i < startPad; i++) {
    week.push({ date: "", level: 0 });
  }
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    weeks.push(week);
  }

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, wi) => {
    const firstReal = w.find((d) => d.date !== "");
    if (firstReal) {
      const m = new Date(firstReal.date).getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        monthLabels.push({
          label: `${m + 1}月`,
          col: wi,
        });
      }
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-0.5">
        <div className="flex gap-0.5 pl-0">
          {monthLabels.map((ml) => (
            <span
              key={ml.col}
              className="text-[10px] text-muted-foreground"
              style={{
                position: "relative",
                left: `${ml.col * 13}px`,
              }}
            >
              {ml.label}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {w.map((d, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`h-[11px] w-[11px] rounded-[3px] ${
                    d.date ? HEATMAP_COLORS[d.level] : "bg-transparent"
                  }`}
                  title={d.date ? `${d.date}: ${d.level}/3` : ""}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [consecutive, setConsecutive] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlan(getDailyPlan());
    setProfile(getProfile());
    setStreaks(getStreaks());
    setConsecutive(getConsecutiveDays());
    setCurrentDay(getCurrentDay());
    setMounted(true);
  }, []);

  if (!mounted || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const { writing, speech, analysis, streak } = plan;
  const greeting = getGreeting();

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 pt-6">
      {/* Greeting */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{greeting.emoji}</span>
          <h1 className="text-xl font-bold tracking-tight">{greeting.text}</h1>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full text-xs font-medium">
            {PHASE_LABELS[plan.phase]} · 第{currentDay}天
          </Badge>
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-100 to-rose-100 px-3 py-1 dark:from-orange-950/50 dark:to-rose-950/50">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {consecutive} 天
            </span>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <Card className="mb-5 border-none bg-gradient-to-r from-rose-100/80 via-orange-100/80 to-amber-100/80 dark:from-rose-950/40 dark:via-orange-950/40 dark:to-amber-950/40">
        <div className="flex items-center gap-3 px-4 py-3">
          <Sparkles className="h-5 w-5 shrink-0 text-orange-400" />
          <p className="text-sm font-medium text-foreground/80">
            每一次练习都是在给未来的自己写情书
          </p>
          <Heart className="h-4 w-4 shrink-0 text-rose-400" />
        </div>
      </Card>

      {/* Practice Cards */}
      <div className="mb-2">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          今日练习
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {writing && (
          <Link href={`/writing/${writing.id}`}>
            <Card className="group relative overflow-hidden border-blue-200/60 py-0 transition-all hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 dark:border-blue-900/40 dark:hover:shadow-blue-950/30">
              <div className="flex">
                <div className="w-1.5 shrink-0 rounded-l-lg bg-gradient-to-b from-blue-400 to-sky-400" />
                <div className="flex flex-1 items-center px-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 dark:bg-blue-950/40">
                    <PenLine className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-sm">
                        {writing.title}
                      </span>
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full text-[10px] px-2 py-0"
                      >
                        {WRITING_TYPE_LABELS[writing.type]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      预计 10 分钟
                    </p>
                  </div>
                  <div className="ml-2 shrink-0">
                    {streak?.writing_done ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : (
                      <ChevronRight className="h-4.5 w-4.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {speech && (
          <Link href={`/speech/${speech.id}`}>
            <Card className="group relative overflow-hidden border-orange-200/60 py-0 transition-all hover:border-orange-300 hover:shadow-md hover:shadow-orange-100/50 dark:border-orange-900/40 dark:hover:shadow-orange-950/30">
              <div className="flex">
                <div className="w-1.5 shrink-0 rounded-l-lg bg-gradient-to-b from-orange-400 to-amber-400" />
                <div className="flex flex-1 items-center px-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100/80 dark:bg-orange-950/40">
                    <Mic className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-sm">
                        {speech.title}
                      </span>
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full text-[10px] px-2 py-0"
                      >
                        {SPEECH_TYPE_LABELS[speech.type]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatTime(speech.time_limit_seconds)}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0">
                    {streak?.speech_done ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : (
                      <ChevronRight className="h-4.5 w-4.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {analysis && (
          <Link href={`/analysis/${analysis.id}`}>
            <Card className="group relative overflow-hidden border-violet-200/60 py-0 transition-all hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 dark:border-violet-900/40 dark:hover:shadow-violet-950/30">
              <div className="flex">
                <div className="w-1.5 shrink-0 rounded-l-lg bg-gradient-to-b from-violet-400 to-purple-400" />
                <div className="flex flex-1 items-center px-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100/80 dark:bg-violet-950/40">
                    <BookOpen className="h-5 w-5 text-violet-500" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-sm">
                        {analysis.speaker}《{analysis.title}》
                      </span>
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full text-[10px] px-2 py-0"
                      >
                        拆解
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {analysis.occasion}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0">
                    {streak?.analysis_done ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : (
                      <ChevronRight className="h-4.5 w-4.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      {/* Heatmap */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          成长足迹
        </h2>
        <Card className="px-4 py-4 gap-3 border-none bg-card/80 backdrop-blur-sm">
          <Heatmap streaks={streaks} />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>累计练习 {profile?.total_days || 0} 天</span>
            <span>·</span>
            <span>写下 {(profile?.total_words || 0).toLocaleString()} 字</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
