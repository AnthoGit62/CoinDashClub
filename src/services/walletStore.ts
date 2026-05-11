import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PlayerProgress } from "../types";

const STORAGE_KEY = "@coin_dash_club/player_progress";

export function createInitialProgress(): PlayerProgress {
  return {
    coins: 120,
    highScore: 0,
    roundsPlayed: 0,
    adsWatched: 0,
    premium: {
      active: false
    }
  };
}

export async function loadProgress(): Promise<PlayerProgress> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createInitialProgress();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return sanitizeProgress(parsed);
  } catch {
    return createInitialProgress();
  }
}

export async function saveProgress(progress: PlayerProgress) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function clearProgress() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

function sanitizeProgress(progress: Partial<PlayerProgress>): PlayerProgress {
  const fallback = createInitialProgress();

  return {
    coins: numberOr(progress.coins, fallback.coins),
    highScore: numberOr(progress.highScore, fallback.highScore),
    roundsPlayed: numberOr(progress.roundsPlayed, fallback.roundsPlayed),
    adsWatched: numberOr(progress.adsWatched, fallback.adsWatched),
    lastDailyBonusAt: progress.lastDailyBonusAt,
    premium: {
      active: Boolean(progress.premium?.active),
      expiresAt: progress.premium?.expiresAt,
      monthlyBonusClaimedAt: progress.premium?.monthlyBonusClaimedAt
    }
  };
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
