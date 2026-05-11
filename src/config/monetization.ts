import type { CoinPackId } from "../types";

export const MONETIZATION = {
  interstitialEveryRounds: 2,
  rewardedAdCoins: 60,
  monthlySubscription: {
    id: "premium_monthly",
    title: "Club Premium",
    priceEur: 4.99,
    priceLabel: "4.99 EUR / mois",
    monthlyCoins: 500,
    dailyCoins: 50,
    coinMultiplier: 2,
    benefits: [
      "Aucune pub interstitielle",
      "Multiplicateur x2 sur les pieces",
      "500 pieces immediates",
      "Bonus quotidien de 50 pieces"
    ]
  },
  coinPacks: [
    {
      id: "coins_small",
      title: "Petit pack",
      coins: 300,
      priceEur: 1.99,
      priceLabel: "1.99 EUR"
    },
    {
      id: "coins_medium",
      title: "Pack joueur",
      coins: 900,
      priceEur: 4.99,
      priceLabel: "4.99 EUR"
    },
    {
      id: "coins_big",
      title: "Pack coffre",
      coins: 2200,
      priceEur: 9.99,
      priceLabel: "9.99 EUR"
    }
  ] satisfies Array<{
    id: CoinPackId;
    title: string;
    coins: number;
    priceEur: number;
    priceLabel: string;
  }>,
  adUnits: {
    android: {
      interstitial: "TODO_ADMOB_ANDROID_INTERSTITIAL_ID",
      rewarded: "TODO_ADMOB_ANDROID_REWARDED_ID"
    },
    ios: {
      interstitial: "TODO_ADMOB_IOS_INTERSTITIAL_ID",
      rewarded: "TODO_ADMOB_IOS_REWARDED_ID"
    }
  }
};
