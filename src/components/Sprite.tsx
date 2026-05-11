import { StyleSheet, Text, View } from "react-native";

import { theme } from "../constants/theme";

export type SpriteKind = "coin" | "gem" | "bomb" | "player";

type Props = {
  kind: SpriteKind;
  size?: number;
};

export function Sprite({ kind, size = 64 }: Props) {
  if (kind === "coin") {
    return (
      <View style={[styles.coinOuter, square(size)]}>
        <View style={[styles.coinInner, square(size * 0.72)]}>
          <Text style={[styles.coinText, { fontSize: size * 0.34 }]}>C</Text>
        </View>
      </View>
    );
  }

  if (kind === "gem") {
    return (
      <View style={[styles.gemWrap, square(size)]}>
        <View style={[styles.gem, square(size * 0.62)]} />
        <View style={[styles.gemCore, square(size * 0.26)]} />
      </View>
    );
  }

  if (kind === "bomb") {
    return (
      <View style={[styles.bombWrap, square(size)]}>
        <View style={[styles.fuse, { width: size * 0.12, height: size * 0.32 }]} />
        <View style={[styles.spark, square(size * 0.18)]} />
        <View style={[styles.bomb, square(size * 0.78)]}>
          <View style={[styles.bombShine, square(size * 0.16)]} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.playerWrap, square(size)]}>
      <View style={[styles.playerHead, square(size * 0.42)]} />
      <View style={[styles.playerBody, { width: size * 0.66, height: size * 0.42 }]} />
    </View>
  );
}

function square(size: number) {
  return {
    width: size,
    height: size,
    borderRadius: size / 2
  };
}

const styles = StyleSheet.create({
  coinOuter: {
    backgroundColor: theme.colors.gold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.goldDark,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  coinInner: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffe9a8",
    backgroundColor: "#ffd966"
  },
  coinText: {
    color: theme.colors.goldDark,
    fontWeight: "900"
  },
  gemWrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  gem: {
    backgroundColor: theme.colors.violet,
    borderRadius: 8,
    transform: [{ rotate: "45deg" }]
  },
  gemCore: {
    position: "absolute",
    backgroundColor: "#c4b5fd",
    borderRadius: 5,
    transform: [{ rotate: "45deg" }]
  },
  bombWrap: {
    alignItems: "center",
    justifyContent: "flex-end"
  },
  fuse: {
    position: "absolute",
    top: 0,
    backgroundColor: theme.colors.ink,
    borderRadius: 8,
    transform: [{ rotate: "25deg" }]
  },
  spark: {
    position: "absolute",
    top: 0,
    right: "20%",
    backgroundColor: theme.colors.coral,
    borderRadius: 999
  },
  bomb: {
    backgroundColor: theme.colors.ink,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 8
  },
  bombShine: {
    backgroundColor: "#94a3b8"
  },
  playerWrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  playerHead: {
    backgroundColor: theme.colors.teal,
    marginBottom: -4,
    borderWidth: 3,
    borderColor: "#99f6e4"
  },
  playerBody: {
    backgroundColor: theme.colors.blue,
    borderRadius: 14
  }
});
