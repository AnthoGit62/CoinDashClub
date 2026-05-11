import { MONETIZATION } from "../config/monetization";
import type { EntitlementState } from "../types";

export type AdResult = {
  shown: boolean;
  rewardCoins: number;
  rewardSpins: number;
  reason?: "ad_free" | "loaded" | "mock";
};

export async function initializeAds() {
  await delay(100);
}

export async function showInterstitialAd(entitlements: EntitlementState): Promise<AdResult> {
  if (entitlements.isAdFree) {
    return {
      shown: false,
      rewardCoins: 0,
      rewardSpins: 0,
      reason: "ad_free"
    };
  }

  await delay(450);

  return {
    shown: true,
    rewardCoins: 0,
    rewardSpins: 0,
    reason: "mock"
  };
}

export async function showRewardedAd(entitlements: EntitlementState): Promise<AdResult> {
  if (entitlements.isAdFree) {
    return {
      shown: false,
      rewardCoins: MONETIZATION.rewardedAdCoins,
      rewardSpins: MONETIZATION.rewardedAdSpins,
      reason: "ad_free"
    };
  }

  await delay(650);

  return {
    shown: true,
    rewardCoins: MONETIZATION.rewardedAdCoins,
    rewardSpins: MONETIZATION.rewardedAdSpins,
    reason: "mock"
  };
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
