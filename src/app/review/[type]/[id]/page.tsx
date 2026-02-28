"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { saveReview, getReviewByTargetId } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { AIReview } from "@/lib/types";
import Link from "next/link";

const WRITING_DIMENSIONS = ["表达清晰度", "逻辑连贯性", "用词准确性"];
const SPEECH_DIMENSIONS = ["结构完整性", "开场吸引力", "论证说服力", "收尾力度"];

function randomScore() {
  return Math.round((6 + Math.random() * 3) * 10) / 10;
}

function generateMockReview(
  type: "writing" | "speech",
  targetId: string,
): Omit<AIReview, "id" | "created_at"> {
  const dims = type === "writing" ? WRITING_DIMENSIONS : SPEECH_DIMENSIONS;
  const scores: Record<string, number> = {};
  for (const d of dims) scores[d] = randomScore();

  const writingSuggestions = [
    "尝试在开头使用具体场景描写，而非直接陈述观点，更容易抓住读者注意力。",
    "部分长句可以拆分为短句，增强节奏感和可读性。",
    "结尾处可以回扣开头的意象，形成「首尾呼应」的闭环结构。",
    "适当加入一些感官描写（视觉、听觉、触觉），让文字更有画面感。",
  ];
  const speechSuggestions = [
    "开场可以尝试用一个悬念式的问题，让听众产生好奇心。",
    "每个论点之间需要更清晰的过渡句，帮助听众跟上你的思路。",
    "收尾可以使用「回旋结构」——重复开头的核心句，增强记忆点。",
    "尝试加入一个具体的个人故事或案例，增强说服力和情感共鸣。",
  ];

  const suggestions = type === "writing" ? writingSuggestions : speechSuggestions;

  const writingReview = `整体表达流畅，思路清晰。文章结构基本完整，开头能较好地引入主题。

在用词方面，部分表达可以更加精准。例如一些常见的形容词可以替换为更具画面感的动词或比喻，让文字的表现力更强。

逻辑上，主要论点之间的衔接还可以加强，建议在段落过渡处添加关联词或承上启下的过渡句。结尾部分有提升空间，可以通过回扣主题或留下思考来增强收束感。`;

  const speechReview = `演讲结构较为完整，能看出有意识地进行了开场、主体、结尾的安排。

开场部分表现不错，能够吸引注意力。主体论证环节，论据基本充实，但可以尝试使用更多具体案例和数据来增强说服力。

收尾部分还有提升空间，建议使用更有力的行动号召或总结性金句来结束，让听众印象深刻。整体来说，如果能在节奏感和情感起伏上做更多设计，演讲效果会更上一层楼。`;

  const writingRewrite = `清晨的阳光斜斜地穿过窗帘缝隙，在书桌上投下一道细长的光影。我坐在那里，手边的咖啡已经凉了，但我没有注意到——我的注意力全部被眼前的文字吸引。

这就是阅读的力量：它不需要宏大的场景，不需要特殊的道具，只需要一个人、一段文字、和一小段不被打扰的时间。`;

  const speechRewrite = `想象一下，你站在一个十字路口。左边是一条平坦的柏油路，你看得到终点；右边是一条看不见尽头的小径，杂草丛生。你会走哪一条？

大多数人会选左边。但今天我想告诉你，那些改变世界的人，几乎无一例外地走了右边那条路。`;

  return {
    target_type: type,
    target_id: targetId,
    review_content: type === "writing" ? writingReview : speechReview,
    scores,
    suggestions,
    rewrite_demo: type === "writing" ? writingRewrite : speechRewrite,
  };
}

const SCORE_COLORS = [
  "from-rose-400 to-orange-400",
  "from-orange-400 to-amber-400",
  "from-amber-400 to-yellow-400",
  "from-emerald-400 to-teal-400",
];

function ScoreBar({ label, value, index }: { label: string; value: number; index: number }) {
  const pct = (value / 10) * 100;
  const gradient = SCORE_COLORS[index % SCORE_COLORS.length];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as "writing" | "speech";
  const targetId = params.id as string;

  const [review, setReview] = useState<AIReview | null>(null);

  useEffect(() => {
    const existing = getReviewByTargetId(targetId);
    if (existing) {
      setReview(existing);
    } else {
      const mock = generateMockReview(type, targetId);
      const saved = saveReview(mock);
      setReview(saved);
    }
  }, [type, targetId]);

  if (!review) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <p>正在生成 AI 点评…</p>
        </div>
      </div>
    );
  }

  const avgScore =
    Object.values(review.scores).reduce((a, b) => a + b, 0) /
    Object.values(review.scores).length;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-bold">AI 点评</h1>
      </div>

      <Badge variant="secondary" className="mb-6 rounded-full">
        {type === "writing" ? "写作点评" : "演讲点评"}
      </Badge>

      <Card className="mb-6 flex flex-col items-center p-6 border-none bg-gradient-to-br from-rose-100/60 via-orange-100/60 to-amber-100/60 dark:from-rose-950/30 dark:via-orange-950/30 dark:to-amber-950/30">
        <p className="text-sm text-muted-foreground">综合评分</p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-primary">
          {avgScore.toFixed(1)}
        </p>
        <p className="text-xs text-muted-foreground">/ 10</p>
      </Card>

      <section className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">各维度评分</h3>
        <Card className="space-y-3 p-4 border-border/50">
          {Object.entries(review.scores).map(([label, value], index) => (
            <ScoreBar key={label} label={label} value={value} index={index} />
          ))}
        </Card>
      </section>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">详细点评</h3>
        <Card className="p-4 border-border/50">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {review.review_content}
          </p>
        </Card>
      </section>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">改进建议</h3>
        <Card className="p-4 border-border/50">
          <ol className="list-inside list-decimal space-y-2">
            {review.suggestions.map((s, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <Separator className="my-6 bg-border/40" />

      <section className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">改写示范</h3>
        <Card className="border-l-4 border-l-primary/40 bg-gradient-to-br from-amber-50/40 to-orange-50/30 p-4 dark:from-amber-950/20 dark:to-orange-950/15">
          <p className="whitespace-pre-wrap text-sm italic leading-relaxed text-muted-foreground">
            {review.rewrite_demo}
          </p>
        </Card>
      </section>

      <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white" asChild>
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
