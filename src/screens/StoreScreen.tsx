import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton } from "../components/ActionButton";
import { StatPill } from "../components/StatPill";
import { MONETIZATION } from "../config/monetization";
import { theme } from "../constants/theme";
import { getEntitlements } from "../services/entitlements";
import type { CoinPackId, PlayerProgress } from "../types";
import { isSameUtcDay } from "../utils/dates";

type Props = {
  progress: PlayerProgress;
  busy: boolean;
  onSubscribe: () => Promise<void>;
  onBuyCoins: (packId: CoinPackId) => Promise<void>;
  onWatchAd: () => Promise<void>;
  onClaimDaily: () => Promise<void>;
};

export function StoreScreen({ progress, busy, onSubscribe, onBuyCoins, onWatchAd, onClaimDaily }: Props) {
  const entitlements = getEntitlements(progress);
  const dailyClaimed = isSameUtcDay(progress.lastDailyBonusAt);

  return (
    <ScrollView contentContainerStyle={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.balanceRow}>
        <StatPill label="Solde" value={progress.coins} tone="gold" />
        <StatPill label="Premium" value={entitlements.isAdFree ? "Actif" : "Off"} tone="teal" />
      </View>

      <View style={styles.subscriptionPanel}>
        <View style={styles.subscriptionHeader}>
          <Text style={[styles.panelTitle, styles.subscriptionTitle]}>
            {MONETIZATION.monthlySubscription.title}
          </Text>
          <Text style={styles.price}>{MONETIZATION.monthlySubscription.priceLabel}</Text>
        </View>
        <View style={styles.benefitList}>
          {MONETIZATION.monthlySubscription.benefits.map((benefit) => (
            <Text key={benefit} style={styles.benefit}>
              {benefit}
            </Text>
          ))}
        </View>
        <ActionButton
          label={entitlements.isAdFree ? "Abonnement actif" : "S'abonner"}
          disabled={busy || entitlements.isAdFree}
          onPress={onSubscribe}
        />
      </View>

      <View style={styles.rewardPanel}>
        <View>
          <Text style={styles.panelTitle}>Pieces bonus</Text>
          <Text style={styles.panelCopy}>
            Recompense pub ou bonus direct si premium.
          </Text>
        </View>
        <ActionButton
          label={entitlements.isAdFree ? "Bonus premium +60" : "Regarder une pub +60"}
          tone="secondary"
          disabled={busy}
          onPress={onWatchAd}
        />
        <ActionButton
          label={dailyClaimed ? "Bonus quotidien pris" : "Bonus quotidien premium"}
          tone="ghost"
          disabled={busy || !entitlements.hasDailyBonus || dailyClaimed}
          onPress={onClaimDaily}
        />
      </View>

      <View style={styles.packList}>
        {MONETIZATION.coinPacks.map((pack) => (
          <View key={pack.id} style={styles.packCard}>
            <View>
              <Text style={styles.packTitle}>{pack.title}</Text>
              <Text style={styles.packCoins}>{pack.coins} pieces</Text>
            </View>
            <ActionButton
              label={pack.priceLabel}
              compact
              tone="ghost"
              disabled={busy}
              onPress={() => onBuyCoins(pack.id)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl
  },
  balanceRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  subscriptionPanel: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.ink,
    gap: theme.spacing.md
  },
  subscriptionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  subscriptionTitle: {
    color: theme.colors.surface
  },
  price: {
    color: "#d8fbf4",
    fontSize: 16,
    fontWeight: "900"
  },
  benefitList: {
    gap: theme.spacing.sm
  },
  benefit: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "700"
  },
  rewardPanel: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceMuted,
    gap: theme.spacing.md
  },
  panelCopy: {
    marginTop: 4,
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 20
  },
  packList: {
    gap: theme.spacing.sm
  },
  packCard: {
    minHeight: 76,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceMuted,
    gap: theme.spacing.md
  },
  packTitle: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  packCoins: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2
  }
});
