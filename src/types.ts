export type AppScreen = "game" | "store" | "profile";

export type PremiumState = {
  active: boolean;
  expiresAt?: string;
  monthlyBonusClaimedAt?: string;
};

export type PlayerProgress = {
  coins: number;
  highScore: number;
  roundsPlayed: number;
  adsWatched: number;
  premium: PremiumState;
  lastDailyBonusAt?: string;
};

export type GameResult = {
  score: number;
  coinsEarned: number;
  bombsHit: number;
};

export type EntitlementState = {
  isAdFree: boolean;
  coinMultiplier: number;
  hasDailyBonus: boolean;
};

export type CoinPackId = "coins_small" | "coins_medium" | "coins_big";
