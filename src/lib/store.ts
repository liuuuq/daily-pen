import { writingMaterials } from "./data/writing-materials";
import { speechMaterials } from "./data/speech-materials";
import { speechAnalyses } from "./data/speech-analyses";
import type {
  DailyPlan,
  Phase,
  Streak,
  Writing,
  Speech,
  AIReview,
  UserProfile,
} from "./types";

const STORAGE_KEYS = {
  writings: "dailypen_writings",
  speeches: "dailypen_speeches",
  reviews: "dailypen_reviews",
  streaks: "dailypen_streaks",
  profile: "dailypen_profile",
  startDate: "dailypen_start_date",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStartDate(): string {
  const stored = getItem<string | null>(STORAGE_KEYS.startDate, null);
  if (stored) return stored;
  const today = new Date().toISOString().split("T")[0];
  setItem(STORAGE_KEYS.startDate, today);
  return today;
}

export function getCurrentDay(): number {
  const start = new Date(getStartDate());
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
}

export function getCurrentPhase(): Phase {
  const day = getCurrentDay();
  if (day <= 14) return 1;
  if (day <= 30) return 2;
  return 3;
}

export function getDailyPlan(): DailyPlan {
  const day = getCurrentDay();
  const phase = getCurrentPhase();
  const dayInCycle = ((day - 1) % 30) + 1;

  const writing = writingMaterials.find((m) => m.day_number === dayInCycle) || null;
  const speech = speechMaterials.find((m) => m.day_number === dayInCycle) || null;
  const analysis = speechAnalyses.find((a) => a.day_number === dayInCycle) || null;

  const todayStr = new Date().toISOString().split("T")[0];
  const streaks = getStreaks();
  const streak = streaks.find((s) => s.date === todayStr);

  return { day, phase, writing, speech, analysis, streak };
}

export function getWritings(): Writing[] {
  return getItem<Writing[]>(STORAGE_KEYS.writings, []);
}

export function saveWriting(writing: Omit<Writing, "id" | "user_id" | "created_at">): Writing {
  const writings = getWritings();
  const newWriting: Writing = {
    ...writing,
    id: `w-${Date.now()}`,
    user_id: "local",
    created_at: new Date().toISOString(),
  };
  writings.push(newWriting);
  setItem(STORAGE_KEYS.writings, writings);
  updateStreak("writing");
  updateProfile(writing.word_count);
  return newWriting;
}

export function getSpeeches(): Speech[] {
  return getItem<Speech[]>(STORAGE_KEYS.speeches, []);
}

export function saveSpeech(speech: Omit<Speech, "id" | "user_id" | "created_at">): Speech {
  const speeches = getSpeeches();
  const newSpeech: Speech = {
    ...speech,
    id: `s-${Date.now()}`,
    user_id: "local",
    created_at: new Date().toISOString(),
  };
  speeches.push(newSpeech);
  setItem(STORAGE_KEYS.speeches, speeches);
  updateStreak("speech");
  updateProfile(speech.word_count);
  return newSpeech;
}

export function getReviews(): AIReview[] {
  return getItem<AIReview[]>(STORAGE_KEYS.reviews, []);
}

export function saveReview(review: Omit<AIReview, "id" | "created_at">): AIReview {
  const reviews = getReviews();
  const newReview: AIReview = {
    ...review,
    id: `r-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  reviews.push(newReview);
  setItem(STORAGE_KEYS.reviews, reviews);
  return newReview;
}

export function getStreaks(): Streak[] {
  return getItem<Streak[]>(STORAGE_KEYS.streaks, []);
}

function updateStreak(type: "writing" | "speech" | "analysis") {
  const streaks = getStreaks();
  const todayStr = new Date().toISOString().split("T")[0];
  let streak = streaks.find((s) => s.date === todayStr);

  if (!streak) {
    streak = {
      id: `streak-${Date.now()}`,
      user_id: "local",
      date: todayStr,
      writing_done: false,
      speech_done: false,
      analysis_done: false,
    };
    streaks.push(streak);
  }

  if (type === "writing") streak.writing_done = true;
  if (type === "speech") streak.speech_done = true;
  if (type === "analysis") streak.analysis_done = true;

  setItem(STORAGE_KEYS.streaks, streaks);
}

export function markAnalysisDone() {
  updateStreak("analysis");
}

export function getProfile(): UserProfile {
  return getItem<UserProfile>(STORAGE_KEYS.profile, {
    id: "local",
    user_id: "local",
    display_name: "写作者",
    level: 1,
    total_words: 0,
    total_days: 0,
    created_at: new Date().toISOString(),
  });
}

function updateProfile(wordsAdded: number) {
  const profile = getProfile();
  profile.total_words += wordsAdded;

  const streaks = getStreaks();
  profile.total_days = streaks.length;
  profile.level = Math.floor(profile.total_days / 7) + 1;

  setItem(STORAGE_KEYS.profile, profile);
}

export function getConsecutiveDays(): number {
  const streaks = getStreaks().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (streaks.length === 0) return 0;

  let count = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < streaks.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];

    if (streaks[i].date === expectedStr) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

export function getWritingById(materialId: string) {
  return writingMaterials.find((m) => m.id === materialId) || null;
}

export function getSpeechById(materialId: string) {
  return speechMaterials.find((m) => m.id === materialId) || null;
}

export function getAnalysisById(analysisId: string) {
  return speechAnalyses.find((a) => a.id === analysisId) || null;
}

export function getReviewByTargetId(targetId: string): AIReview | null {
  const reviews = getReviews();
  return reviews.find((r) => r.target_id === targetId) || null;
}

export function updateProfileName(name: string) {
  const profile = getProfile();
  profile.display_name = name;
  setItem(STORAGE_KEYS.profile, profile);
}

export function resetAllData() {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
