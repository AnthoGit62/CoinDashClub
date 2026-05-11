import type { CoinPackId } from "../types";

type CoinPackConfig = {
  id: CoinPackId;
  title: string;
  coins: number;
  spins: number;
  priceEur: number;
  priceLabel: string;
};

const coinPacks: CoinPackConfig[] = [
  {
    id: "coins_small",
    title: "Petit pack",
    coins: 300,
    spins: 2,
    priceEur: 1.99,
    priceLabel: "1.99 EUR"
  },
  {
    id: "coins_medium",
    title: "Pack joueur",
    coins: 900,
    spins: 8,
    priceEur: 4.99,
    priceLabel: "4.99 EUR"
  },
  {
    id: "coins_big",
    title: "Pack coffre",
    coins: 2200,
    spins: 20,
    priceEur: 9.99,
    priceLabel: "9.99 EUR"
  }
];

export const MONETIZATION = {
  interstitialEveryRounds: 2,
  rewardedAdCoins: 80,
  rewardedAdSpins: 3,
  monthlySubscription: {
    id: "premium_monthly",
    title: "Club Premium",
    priceEur: 4.99,
    priceLabel: "4.99 EUR / mois",
    monthlyCoins: 1200,
    monthlySpins: 25,
    dailyCoins: 120,
    dailySpins: 4,
    coinMultiplier: 2,
    benefits: [
      "Aucune pub interstitielle",
      "Multiplicateur x2 sur les pieces",
      "1200 pieces et 25 lancers immediats",
      "Bonus quotidien de pieces et lancers"
    ]
  },
  coinPacks,
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
