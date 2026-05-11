import { Alert, StyleSheet, Text, View } from "react-native";

import { ActionButton } from "../components/ActionButton";
import { StatPill } from "../components/StatPill";
import { theme } from "../constants/theme";
import { getEntitlements } from "../services/entitlements";
import type { PlayerProgress } from "../types";

type Props = {
  progress: PlayerProgress;
  onReset: () => Promise<void>;
};

export function ProfileScreen({ progress, onReset }: Props) {
  const entitlements = getEntitlements(progress);

  function confirmReset() {
    Alert.alert("Reinitialiser", "Effacer la sauvegarde locale du prototype ?", [
      {
        text: "Annuler",
        style: "cancel"
      },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          void onReset();
        }
      }
    ]);
  }

  return (
    <View style={styles.root}>
      <View style={styles.profileTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CD</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.title}>Coin Dash Club</Text>
          <Text style={styles.subtitle}>
            Prototype mobile gratuit avec pubs et abonnement.
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatPill label="Pieces" value={progress.coins} tone="gold" />
        <StatPill label="Record" value={progress.highScore} tone="teal" />
        <StatPill label="Parties" value={progress.roundsPlayed} />
        <StatPill label="Pubs" value={progress.adsWatched} tone="coral" />
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.panelTitle}>Etat premium</Text>
        <Text style={styles.infoLine}>Sans pub: {entitlements.isAdFree ? "oui" : "non"}</Text>
        <Text style={styles.infoLine}>Multiplicateur: x{entitlements.coinMultiplier}</Text>
        <Text style={styles.infoLine}>
          Expiration: {progress.premium.expiresAt ? formatDate(progress.premium.expiresAt) : "aucune"}
        </Text>
      </View>

      <ActionButton label="Reset prototype" tone="danger" onPress={confirmReset} />
    </View>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing.md
  },
  profileTop: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center"
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.teal
  },
  avatarText: {
    color: theme.colors.surface,
    fontSize: 22,
    fontWeight: "900"
  },
  profileText: {
    flex: 1
  },
  title: {
    color: theme.colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  subtitle: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  infoPanel: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceMuted,
    gap: theme.spacing.sm
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4
  },
  infoLine: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    fontWeight: "700"
  }
});
