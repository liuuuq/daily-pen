export type WritingType =
  | "copy"
  | "fill_blank"
  | "imitate"
  | "summarize"
  | "rewrite"
  | "image_write"
  | "continue_write"
  | "topic"
  | "free";

export type SpeechType =
  | "self_intro"
  | "retell"
  | "explain_quote"
  | "elevator"
  | "impromptu"
  | "storytelling"
  | "persuade"
  | "ted"
  | "scenario";

export type Phase = 1 | 2 | 3;

export interface WritingMaterial {
  id: string;
  type: WritingType;
  title: string;
  content: string;
  image_url?: string;
  difficulty: 1 | 2 | 3;
  day_number: number;
  phase: Phase;
}

export interface SpeechMaterial {
  id: string;
  type: SpeechType;
  title: string;
  prompt: string;
  reference_text?: string;
  difficulty: 1 | 2 | 3;
  day_number: number;
  phase: Phase;
  time_limit_seconds: number;
}

export interface SpeechTechnique {
  text: string;
  technique: string;
  explanation: string;
}

export interface SpeechAnalysis {
  id: string;
  title: string;
  speaker: string;
  occasion: string;
  background: string;
  full_text: string;
  structure_breakdown: {
    type: "opening" | "body" | "closing";
    label: string;
    content: string;
  }[];
  techniques: SpeechTechnique[];
  quotes: string[];
  exercise_prompt: string;
  video_url?: string;
  day_number: number;
}

export interface Writing {
  id: string;
  user_id: string;
  material_id: string;
  content: string;
  word_count: number;
  time_spent: number;
  created_at: string;
}

export interface Speech {
  id: string;
  user_id: string;
  speech_material_id: string;
  content: string;
  word_count: number;
  time_spent: number;
  created_at: string;
}

export interface AIReview {
  id: string;
  target_type: "writing" | "speech";
  target_id: string;
  review_content: string;
  scores: Record<string, number>;
  suggestions: string[];
  rewrite_demo: string;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  date: string;
  writing_done: boolean;
  speech_done: boolean;
  analysis_done: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  level: number;
  total_words: number;
  total_days: number;
  created_at: string;
}

export interface DailyPlan {
  day: number;
  phase: Phase;
  writing: WritingMaterial | null;
  speech: SpeechMaterial | null;
  analysis: SpeechAnalysis | null;
  streak?: Streak;
}

export const WRITING_TYPE_LABELS: Record<WritingType, string> = {
  copy: "抄写批注",
  fill_blank: "填空补全",
  imitate: "仿写练习",
  summarize: "缩写训练",
  rewrite: "改写练习",
  image_write: "看图写话",
  continue_write: "续写练习",
  topic: "观点表达",
  free: "自由写作",
};

export const SPEECH_TYPE_LABELS: Record<SpeechType, string> = {
  self_intro: "自我介绍",
  retell: "复述练习",
  explain_quote: "名言解读",
  elevator: "电梯演讲",
  impromptu: "即兴表达",
  storytelling: "故事化表达",
  persuade: "说服演讲",
  ted: "TED分享",
  scenario: "场景模拟",
};

export const PHASE_LABELS: Record<Phase, string> = {
  1: "模仿期",
  2: "转化期",
  3: "创造期",
};

export const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  1: "降低门槛，建立习惯",
  2: "有引导的自主表达",
  3: "自由创作，形成风格",
};
