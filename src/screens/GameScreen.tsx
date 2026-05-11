import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";

import { ActionButton } from "../components/ActionButton";
import { Sprite, type SpriteKind } from "../components/Sprite";
import { StatPill } from "../components/StatPill";
import { theme } from "../constants/theme";
import { getEntitlements } from "../services/entitlements";
import type { GameResult, PlayerProgress } from "../types";

const ROUND_SECONDS = 30;

type ArenaSize = {
  width: number;
  height: number;
};

type Target = {
  kind: Extract<SpriteKind, "coin" | "gem" | "bomb">;
  x: number;
  y: number;
  size: number;
};

type Props = {
  progress: PlayerProgress;
  onRoundFinished: (result: GameResult) => Promise<void>;
  onRewardAd: () => Promise<void>;
};

export function GameScreen({ progress, onRoundFinished, onRewardAd }: Props) {
  const entitlements = getEntitlements(progress);
  const [arena, setArena] = useState<ArenaSize>({ width: 0, height: 0 });
  const [target, setTarget] = useState<Target>(() => createTarget({ width: 320, height: 360 }));
  const [status, setStatus] = useState<"idle" | "running" | "ended">("idle");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [roundCoins, setRoundCoins] = useState(0);
  const [bombsHit, setBombsHit] = useState(0);
  const [message, setMessage] = useState("Pret a jouer");
  const finishingRef = useRef(false);

  const spawnTarget = useCallback(() => {
    setTarget(createTarget(arena));
  }, [arena]);

  const finishRound = useCallback(async () => {
    if (finishingRef.current) {
      return;
    }

    finishingRef.current = true;
    setStatus("ended");
    setMessage("Partie terminee");
    await onRoundFinished({
      score,
      coinsEarned: roundCoins,
      bombsHit
    });
  }, [bombsHit, onRoundFinished, roundCoins, score]);

  useEffect(() => {
    if (arena.width > 0 && arena.height > 0) {
      spawnTarget();
    }
  }, [arena.height, arena.width, spawnTarget]);

  useEffect(() => {
    if (status !== "running") {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [status]);

  useEffect(() => {
    if (status === "running" && timeLeft === 0) {
      void finishRound();
    }
  }, [finishRound, status, timeLeft]);

  function handleArenaLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setArena({ width, height });
  }

  function startRound() {
    finishingRef.current = false;
    setStatus("running");
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setCombo(0);
    setRoundCoins(0);
    setBombsHit(0);
    setMessage("Attrape les pieces");
    setTarget(createTarget(arena));
  }

  function handleTargetPress() {
    if (status !== "running") {
      return;
    }

    if (target.kind === "bomb") {
      setScore((current) => Math.max(0, current - 3));
      setCombo(0);
      setBombsHit((current) => current + 1);
      setTimeLeft((current) => Math.max(0, current - 2));
      setMessage("Bombe: -3 score, -2 sec");
      spawnTarget();
      return;
    }

    const nextCombo = combo + 1;
    const baseScore = target.kind === "gem" ? 5 : 1;
    const comboBonus = nextCombo > 0 && nextCombo % 5 === 0 ? 2 : 0;
    const coinReward = (target.kind === "gem" ? 8 : 2) + comboBonus;
    const finalCoins = coinReward * entitlements.coinMultiplier;

    setScore((current) => current + baseScore + comboBonus);
    setCombo(nextCombo);
    setRoundCoins((current) => current + finalCoins);
    setMessage(`+${finalCoins} pieces`);
    spawnTarget();
  }

  return (
    <View style={styles.root}>
      <View style={styles.statsRow}>
        <StatPill label="Score" value={score} tone="teal" />
        <StatPill label="Temps" value={`${timeLeft}s`} tone={timeLeft < 8 ? "coral" : "plain"} />
        <StatPill label="Pieces" value={roundCoins} tone="gold" />
      </View>

      <View style={styles.arena} onLayout={handleArenaLayout}>
        <View style={styles.arenaGrid} />
        <View style={styles.playerBadge}>
          <Sprite kind="player" size={42} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cible ${target.kind}`}
          onPress={handleTargetPress}
          style={[
            styles.target,
            {
              left: target.x,
              top: target.y,
              width: target.size,
              height: target.size
            }
          ]}
        >
          <Sprite kind={target.kind} size={target.size} />
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>{message}</Text>
        <Text style={styles.comboText}>Combo {combo}</Text>
      </View>

      <View style={styles.controls}>
        <ActionButton
          label={status === "running" ? "Terminer" : status === "ended" ? "Rejouer" : "Jouer"}
          tone={status === "running" ? "danger" : "primary"}
          onPress={status === "running" ? finishRound : startRound}
          style={styles.controlButton}
        />
        <ActionButton
          label={entitlements.isAdFree ? "Bonus premium" : "Pub bonus +60"}
          tone="secondary"
          onPress={onRewardAd}
          style={styles.controlButton}
        />
      </View>
    </View>
  );
}

function createTarget(arena: ArenaSize): Target {
  const width = Math.max(arena.width, 280);
  const height = Math.max(arena.height, 320);
  const size = clamp(Math.round(width * 0.16), 50, 72);
  const padding = 12;
  const roll = Math.random();
  const kind: Target["kind"] = roll > 0.84 ? "bomb" : roll > 0.68 ? "gem" : "coin";

  return {
    kind,
    size,
    x: randomInt(padding, Math.max(padding, width - size - padding)),
    y: randomInt(padding + 16, Math.max(padding + 16, height - size - padding))
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: theme.spacing.md
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "space-between"
  },
  arena: {
    flex: 1,
    minHeight: 330,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: "#dff7ef",
    borderWidth: 1,
    borderColor: "#99f6e4"
  },
  arenaGrid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#dff7ef"
  },
  playerBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.84)"
  },
  target: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  statusRow: {
    minHeight: 42,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceMuted,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  statusText: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: "800"
  },
  comboText: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: "800"
  },
  controls: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  controlButton: {
    flex: 1
  }
});
