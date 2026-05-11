import { Platform } from "react-native";

import { MONETIZATION } from "../config/monetization";
import type { CoinPackId, PlayerProgress } from "../types";
import { addDays, isSameUtcDay } from "../utils/dates";

export function getMonthlySubscriptionProductId() {
  return Platform.OS === "ios" ? "ios_premium_monthly" : "android_premium_monthly";
}

export function getCoinPackProductId(packId: CoinPackId) {
  return Platform.OS === "ios" ? `ios_${packId}` : `android_${packId}`;
}

export async function purchaseMonthlySubscription(progress: PlayerProgress): Promise<PlayerProgress> {
  const now = new Date();

  return {
    ...progress,
    coins: progress.coins + MONETIZATION.monthlySubscription.monthlyCoins,
    spins: progress.spins + MONETIZATION.monthlySubscription.monthlySpins,
    premium: {
      active: true,
      expiresAt: addDays(now, 31).toISOString(),
      monthlyBonusClaimedAt: now.toISOString()
    }
  };
}

export async function purchaseCoinPack(progress: PlayerProgress, packId: CoinPackId): Promise<PlayerProgress> {
  const pack = MONETIZATION.coinPacks.find((item) => item.id === packId);

  if (!pack) {
    return progress;
  }

  return {
    ...progress,
    coins: progress.coins + pack.coins,
    spins: progress.spins + pack.spins
  };
}

export async function claimDailyPremiumBonus(progress: PlayerProgress): Promise<PlayerProgress> {
  if (!progress.premium.active || isSameUtcDay(progress.lastDailyBonusAt)) {
    return progress;
  }

  return {
    ...progress,
    coins: progress.coins + MONETIZATION.monthlySubscription.dailyCoins,
    spins: progress.spins + MONETIZATION.monthlySubscription.dailySpins,
    lastDailyBonusAt: new Date().toISOString()
  };
}
