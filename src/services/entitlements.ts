import { MONETIZATION } from "../config/monetization";
import type { EntitlementState, PlayerProgress } from "../types";
import { isFutureDate } from "../utils/dates";

export function getEntitlements(progress: PlayerProgress): EntitlementState {
  const subscriptionActive = progress.premium.active && isFutureDate(progress.premium.expiresAt);

  return {
    isAdFree: subscriptionActive,
    coinMultiplier: subscriptionActive ? MONETIZATION.monthlySubscription.coinMultiplier : 1,
    hasDailyBonus: subscriptionActive
  };
}
