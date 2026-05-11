import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  BOARD_TILES,
  createEmptyLandmarks,
  MAX_SHIELDS,
  STARTING_COINS,
  STARTING_SHIELDS,
  STARTING_SPINS
} from "../config/game";
import type { LandmarkId, LandmarkLevels, PlayerProgress } from "../types";

const STORAGE_KEY = "@coin_dash_club/player_progress";

export function createInitialProgress(): PlayerProgress {
  return {
    coins: STARTING_COINS,
    spins: STARTING_SPINS,
    shields: STARTING_SHIELDS,
    boardPosition: 0,
    districtIndex: 0,
    landmarks: createEmptyLandmarks(),
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
    spins: Math.max(0, numberOr(progress.spins, fallback.spins)),
    shields: clamp(numberOr(progress.shields, fallback.shields), 0, MAX_SHIELDS),
    boardPosition: normalizeBoardPosition(numberOr(progress.boardPosition, fallback.boardPosition)),
    districtIndex: Math.max(0, Math.floor(numberOr(progress.districtIndex, fallback.districtIndex))),
    landmarks: sanitizeLandmarks(progress.landmarks),
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

function sanitizeLandmarks(value: unknown): LandmarkLevels {
  const fallback = createEmptyLandmarks();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const partial = value as Partial<Record<LandmarkId, unknown>>;

  return {
    vault: clamp(numberOr(partial.vault, fallback.vault), 0, 5),
    station: clamp(numberOr(partial.station, fallback.station), 0, 5),
    tower: clamp(numberOr(partial.tower, fallback.tower), 0, 5),
    harbor: clamp(numberOr(partial.harbor, fallback.harbor), 0, 5)
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeBoardPosition(value: number) {
  const position = Math.floor(value) % BOARD_TILES.length;

  return position >= 0 ? position : 0;
}
