import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

import { MONETIZATION } from "./src/config/monetization";
import { theme } from "./src/constants/theme";
import { GameScreen } from "./src/screens/GameScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { StoreScreen } from "./src/screens/StoreScreen";
import { initializeAds, showInterstitialAd, showRewardedAd } from "./src/services/ads";
import { getEntitlements } from "./src/services/entitlements";
import {
  claimDailyPremiumBonus,
  purchaseCoinPack,
  purchaseMonthlySubscription
} from "./src/services/purchases";
import {
  clearProgress,
  createInitialProgress,
  loadProgress,
  saveProgress
} from "./src/services/walletStore";
import type { AppScreen, CoinPackId, GameResult, PlayerProgress } from "./src/types";

const TABS: Array<{ id: AppScreen; label: string }> = [
  { id: "game", label: "Jeu" },
  { id: "store", label: "Boutique" },
  { id: "profile", label: "Profil" }
];

export default function App() {
  const initialProgress = createInitialProgress();
  const progressRef = useRef<PlayerProgress>(initialProgress);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progress, setProgress] = useState<PlayerProgress>(initialProgress);
  const [screen, setScreen] = useState<AppScreen>("game");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      await initializeAds();
      const savedProgress = await loadProgress();

      if (!mounted) {
        return;
      }

      progressRef.current = savedProgress;
      setProgress(savedProgress);
      setLoading(false);
    }

    void boot();

    return () => {
      mounted = false;
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const flash = useCallback((message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast(message);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2400);
  }, []);

  const commitProgress = useCallback(async (updater: (current: PlayerProgress) => PlayerProgress) => {
    const next = updater(progressRef.current);
    progressRef.current = next;
    setProgress(next);
    await saveProgress(next);
    return next;
  }, []);

  const handleRoundFinished = useCallback(
    async (result: GameResult) => {
      const next = await commitProgress((current) => ({
        ...current,
        coins: current.coins + result.coinsEarned,
        highScore: Math.max(current.highScore, result.score),
        roundsPlayed: current.roundsPlayed + 1
      }));

      const entitlements = getEntitlements(next);
      const shouldShowInterstitial =
        !entitlements.isAdFree && next.roundsPlayed % MONETIZATION.interstitialEveryRounds === 0;

      if (shouldShowInterstitial) {
        const adResult = await showInterstitialAd(entitlements);

        if (adResult.shown) {
          await commitProgress((current) => ({
            ...current,
            adsWatched: current.adsWatched + 1
          }));
          flash("Pub interstitielle simulee");
          return;
        }
      }

      flash(`${result.coinsEarned} pieces ajoutees`);
    },
    [commitProgress, flash]
  );

  const handleRewardAd = useCallback(async () => {
    setBusy(true);

    try {
      const entitlements = getEntitlements(progressRef.current);
      const adResult = await showRewardedAd(entitlements);

      await commitProgress((current) => ({
        ...current,
        coins: current.coins + adResult.rewardCoins,
        adsWatched: adResult.shown ? current.adsWatched + 1 : current.adsWatched
      }));

      flash(adResult.shown ? "+60 pieces apres pub" : "+60 pieces premium");
    } finally {
      setBusy(false);
    }
  }, [commitProgress, flash]);

  const handleSubscribe = useCallback(async () => {
    setBusy(true);

    try {
      const next = await purchaseMonthlySubscription(progressRef.current);
      await commitProgress(() => next);
      flash("Premium actif: pubs coupees");
    } finally {
      setBusy(false);
    }
  }, [commitProgress, flash]);

  const handleBuyCoins = useCallback(
    async (packId: CoinPackId) => {
      setBusy(true);

      try {
        const next = await purchaseCoinPack(progressRef.current, packId);
        await commitProgress(() => next);
        flash("Pack de pieces ajoute");
      } finally {
        setBusy(false);
      }
    },
    [commitProgress, flash]
  );

  const handleClaimDaily = useCallback(async () => {
    setBusy(true);

    try {
      const before = progressRef.current.coins;
      const next = await claimDailyPremiumBonus(progressRef.current);
      await commitProgress(() => next);
      flash(next.coins > before ? "Bonus quotidien ajoute" : "Bonus deja pris");
    } finally {
      setBusy(false);
    }
  }, [commitProgress, flash]);

  const handleReset = useCallback(async () => {
    const next = createInitialProgress();
    progressRef.current = next;
    setProgress(next);
    await clearProgress();
    flash("Sauvegarde locale effacee");
  }, [flash]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.teal} />
          <Text style={styles.loadingText}>Chargement du jeu</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.titleBlock}>
            <Text style={styles.appTitle}>Coin Dash Club</Text>
            <Text style={styles.appSubtitle}>Jeu gratuit iOS / Android</Text>
          </View>
          <View style={styles.walletBadge}>
            <Text style={styles.walletLabel}>Pieces</Text>
            <Text style={styles.walletValue}>{progress.coins}</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const active = screen === tab.id;

            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setScreen(tab.id)}
                style={[styles.tab, active && styles.activeTab]}
              >
                <Text style={[styles.tabText, active && styles.activeTabText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.content}>
          {screen === "game" ? (
            <GameScreen progress={progress} onRoundFinished={handleRoundFinished} onRewardAd={handleRewardAd} />
          ) : null}
          {screen === "store" ? (
            <StoreScreen
              progress={progress}
              busy={busy}
              onSubscribe={handleSubscribe}
              onBuyCoins={handleBuyCoins}
              onWatchAd={handleRewardAd}
              onClaimDaily={handleClaimDaily}
            />
          ) : null}
          {screen === "profile" ? <ProfileScreen progress={progress} onReset={handleReset} /> : null}
        </View>

        {toast ? (
          <View style={styles.toast} pointerEvents="none">
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md
  },
  topBar: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  titleBlock: {
    flex: 1
  },
  appTitle: {
    color: theme.colors.ink,
    fontSize: 28,
    fontWeight: "900"
  },
  appSubtitle: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2
  },
  walletBadge: {
    minWidth: 86,
    minHeight: 58,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fff7dc",
    borderWidth: 1,
    borderColor: "#f6d365",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md
  },
  walletLabel: {
    color: theme.colors.goldDark,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  walletValue: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 2
  },
  tabs: {
    minHeight: 48,
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.sm,
    padding: 4,
    gap: 4
  },
  tab: {
    flex: 1,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  activeTab: {
    backgroundColor: theme.colors.surface
  },
  tabText: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    fontWeight: "900"
  },
  activeTabText: {
    color: theme.colors.ink
  },
  content: {
    flex: 1
  },
  toast: {
    position: "absolute",
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    minHeight: 46,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg
  },
  toastText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md
  },
  loadingText: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    fontWeight: "700"
  }
});
