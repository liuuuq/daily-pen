"use client";

import Link from "next/link";
import { speechAnalyses } from "@/lib/data/speech-analyses";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalysisListPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-xl font-bold tracking-tight">名人演讲拆解</h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {speechAnalyses.map((a) => (
          <Link key={a.id} href={`/analysis/${a.id}`}>
            <Card className="group relative flex gap-3 p-4 border-border/50 transition-all hover:shadow-md hover:shadow-primary/5 hover:border-primary/30">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-rose-100 text-lg font-bold text-violet-600 dark:from-violet-950/50 dark:to-rose-950/50 dark:text-violet-400">
                {a.speaker[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">
                  {a.speaker}
                </p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {a.title}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground/70">
                  {a.occasion}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="absolute right-3 top-3 rounded-full tabular-nums text-[10px]"
              >
                Day {a.day_number}
              </Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
