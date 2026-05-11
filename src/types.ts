export type AppScreen = "game" | "store" | "profile";

export type LandmarkId = "vault" | "station" | "tower" | "harbor";

export type LandmarkLevels = Record<LandmarkId, number>;

export type BoardTileType = "coins" | "bonus" | "shield" | "raid" | "attack" | "jackpot";

export type PremiumState = {
  active: boolean;
  expiresAt?: string;
  monthlyBonusClaimedAt?: string;
};

export type PlayerProgress = {
  coins: number;
  spins: number;
  shields: number;
  boardPosition: number;
  districtIndex: number;
  landmarks: LandmarkLevels;
  highScore: number;
  roundsPlayed: number;
  adsWatched: number;
  premium: PremiumState;
  lastDailyBonusAt?: string;
};

export type GameResult = {
  steps: number;
  tileIndex: number;
  tileType: BoardTileType;
  tileLabel: string;
  coinsDelta: number;
  spinsDelta: number;
  shieldsDelta: number;
  message: string;
};

export type UpgradeResult = {
  success: boolean;
  landmarkId: LandmarkId;
  title: string;
  level: number;
  cost: number;
  completedDistrict: boolean;
  message: string;
};

export type EntitlementState = {
  isAdFree: boolean;
  coinMultiplier: number;
  hasDailyBonus: boolean;
};

export type CoinPackId = "coins_small" | "coins_medium" | "coins_big";
