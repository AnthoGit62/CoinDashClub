import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton } from "../components/ActionButton";
import { StatPill } from "../components/StatPill";
import {
  BOARD_TILES,
  getDistrictCompletion,
  getDistrictName,
  getLandmarkCost,
  LANDMARK_MAX_LEVEL,
  LANDMARKS
} from "../config/game";
import { theme } from "../constants/theme";
import type { BoardTileType, GameResult, LandmarkId, PlayerProgress, UpgradeResult } from "../types";

type Props = {
  progress: PlayerProgress;
  busy: boolean;
  onRoll: () => Promise<GameResult | null>;
  onUpgradeLandmark: (landmarkId: LandmarkId) => Promise<UpgradeResult>;
  onRewardAd: () => Promise<void>;
};

export function GameScreen({ progress, busy, onRoll, onUpgradeLandmark, onRewardAd }: Props) {
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);
  const completion = getDistrictCompletion(progress.landmarks);

  async function roll() {
    setUpgradeMessage(null);
    const result = await onRoll();

    if (result) {
      setLastResult(result);
    }
  }

  async function upgrade(landmarkId: LandmarkId) {
    const result = await onUpgradeLandmark(landmarkId);
    setUpgradeMessage(result.message);
  }

  return (
    <ScrollView contentContainerStyle={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.statsRow}>
        <StatPill label="Quartier" value={progress.districtIndex + 1} tone="teal" />
        <StatPill label="Progression" value={`${completion}%`} tone="gold" />
        <StatPill label="Fortune max" value={progress.highScore} />
      </View>

      <View style={styles.boardPanel}>
        <View style={styles.boardHeader}>
          <View>
            <Text style={styles.panelKicker}>Plateau</Text>
            <Text style={styles.panelTitle}>{getDistrictName(progress.districtIndex)}</Text>
          </View>
          <View style={styles.diceBadge}>
            <Text style={styles.diceLabel}>Dernier</Text>
            <Text style={styles.diceValue}>{lastResult ? lastResult.steps : "-"}</Text>
          </View>
        </View>

        <View style={styles.boardGrid}>
          {BOARD_TILES.map((tile, index) => {
            const active = progress.boardPosition === index;

            return (
              <View key={`${tile.type}-${index}`} style={[styles.tile, tileTone(tile.type), active && styles.activeTile]}>
                <Text style={[styles.tileShort, active && styles.activeTileShort]}>{tile.shortLabel}</Text>
                <Text style={[styles.tileLabel, active && styles.activeTileLabel]} numberOfLines={1}>
                  {tile.label}
                </Text>
                {active ? (
                  <View style={styles.pawn}>
                    <Text style={styles.pawnText}>CD</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.eventPanel}>
          <Text style={styles.eventTitle}>
            {lastResult ? `${lastResult.tileLabel} - ${lastResult.steps} pas` : "Pret a lancer"}
          </Text>
          <Text style={styles.eventCopy}>
            {lastResult
              ? lastResult.message
              : "Lance le de, avance sur le plateau, puis reinvestis tes gains dans le quartier."}
          </Text>
        </View>

        <View style={styles.controls}>
          <ActionButton
            label={progress.spins > 0 ? "Lancer" : "Plus de lancers"}
            disabled={busy || progress.spins <= 0}
            onPress={roll}
            style={styles.controlButton}
          />
          <ActionButton
            label="Bonus pub"
            tone="secondary"
            disabled={busy}
            onPress={onRewardAd}
            style={styles.controlButton}
          />
        </View>
      </View>

      <View style={styles.cityPanel}>
        <View style={styles.cityHeader}>
          <View>
            <Text style={[styles.panelKicker, styles.cityKicker]}>Construction</Text>
            <Text style={[styles.panelTitle, styles.cityTitle]}>Ton quartier</Text>
          </View>
          <Text style={styles.cityPercent}>{completion}%</Text>
        </View>

        <View style={styles.landmarkList}>
          {LANDMARKS.map((landmark) => {
            const level = progress.landmarks[landmark.id];
            const cost = getLandmarkCost(landmark.id, level, progress.districtIndex);
            const complete = level >= LANDMARK_MAX_LEVEL;
            const disabled = busy || complete || progress.coins < cost;

            return (
              <View key={landmark.id} style={styles.landmarkCard}>
                <View style={styles.landmarkTop}>
                  <View style={[styles.landmarkIcon, { backgroundColor: landmark.color }]}>
                    <Text style={styles.landmarkIconText}>{landmark.title.slice(0, 1)}</Text>
                  </View>
                  <View style={styles.landmarkText}>
                    <Text style={styles.landmarkTitle}>{landmark.title}</Text>
                    <Text style={styles.landmarkMeta}>Niveau {level}/{LANDMARK_MAX_LEVEL}</Text>
                  </View>
                </View>

                <View style={styles.levelTrack}>
                  {Array.from({ length: LANDMARK_MAX_LEVEL }).map((_, index) => (
                    <View
                      key={`${landmark.id}-${index}`}
                      style={[styles.levelDot, index < level && styles.levelDotFilled]}
                    />
                  ))}
                </View>

                <Pressable
                  accessibilityRole="button"
                  disabled={disabled}
                  onPress={() => {
                    void upgrade(landmark.id);
                  }}
                  style={({ pressed }) => [
                    styles.upgradeButton,
                    complete && styles.completeButton,
                    disabled && !complete && styles.disabledUpgrade,
                    pressed && !disabled && styles.pressed
                  ]}
                >
                  <Text style={[styles.upgradeText, disabled && !complete && styles.disabledUpgradeText]}>
                    {complete ? "Complet" : `${cost} pieces`}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {upgradeMessage ? (
          <View style={styles.upgradeNotice}>
            <Text style={styles.upgradeNoticeText}>{upgradeMessage}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function tileTone(type: BoardTileType) {
  if (type === "coins") {
    return styles.coinTile;
  }

  if (type === "bonus") {
    return styles.bonusTile;
  }

  if (type === "shield") {
    return styles.shieldTile;
  }

  if (type === "raid") {
    return styles.raidTile;
  }

  if (type === "attack") {
    return styles.attackTile;
  }

  return styles.jackpotTile;
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  boardPanel: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceMuted,
    gap: theme.spacing.md
  },
  boardHeader: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  panelKicker: {
    color: theme.colors.inkMuted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2
  },
  diceBadge: {
    width: 62,
    minHeight: 54,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.ink
  },
  diceLabel: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  diceValue: {
    color: theme.colors.surface,
    fontSize: 24,
    fontWeight: "900"
  },
  boardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs
  },
  tile: {
    width: "23.8%",
    aspectRatio: 1,
    borderRadius: theme.radius.sm,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)"
  },
  activeTile: {
    borderWidth: 2,
    borderColor: theme.colors.ink,
    transform: [{ scale: 1.02 }]
  },
  coinTile: {
    backgroundColor: "#fff7dc"
  },
  bonusTile: {
    backgroundColor: "#d8fbf4"
  },
  shieldTile: {
    backgroundColor: "#dbeafe"
  },
  raidTile: {
    backgroundColor: "#ede9fe"
  },
  attackTile: {
    backgroundColor: "#ffe5e1"
  },
  jackpotTile: {
    backgroundColor: "#fef3c7"
  },
  tileShort: {
    color: theme.colors.ink,
    fontSize: 19,
    fontWeight: "900"
  },
  activeTileShort: {
    color: theme.colors.ink
  },
  tileLabel: {
    maxWidth: "100%",
    color: theme.colors.inkMuted,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 2
  },
  activeTileLabel: {
    color: theme.colors.ink
  },
  pawn: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.ink
  },
  pawnText: {
    color: theme.colors.surface,
    fontSize: 9,
    fontWeight: "900"
  },
  eventPanel: {
    minHeight: 70,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: theme.colors.surfaceMuted,
    justifyContent: "center"
  },
  eventTitle: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  eventCopy: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 4
  },
  controls: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  controlButton: {
    flex: 1
  },
  cityPanel: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.ink,
    gap: theme.spacing.md
  },
  cityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  cityPercent: {
    color: theme.colors.gold,
    fontSize: 24,
    fontWeight: "900"
  },
  cityKicker: {
    color: "#cbd5e1"
  },
  cityTitle: {
    color: theme.colors.surface
  },
  landmarkList: {
    gap: theme.spacing.sm
  },
  landmarkCard: {
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    gap: theme.spacing.sm
  },
  landmarkTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  landmarkIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  landmarkIconText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: "900"
  },
  landmarkText: {
    flex: 1
  },
  landmarkTitle: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: "900"
  },
  landmarkMeta: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  levelTrack: {
    flexDirection: "row",
    gap: theme.spacing.xs
  },
  levelDot: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  levelDotFilled: {
    backgroundColor: theme.colors.gold
  },
  upgradeButton: {
    minHeight: 40,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.gold
  },
  completeButton: {
    backgroundColor: theme.colors.success
  },
  disabledUpgrade: {
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  },
  upgradeText: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: "900"
  },
  disabledUpgradeText: {
    color: "#cbd5e1"
  },
  upgradeNotice: {
    minHeight: 42,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.1)"
  },
  upgradeNoticeText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center"
  }
});
