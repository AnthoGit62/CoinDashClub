import { StyleSheet, Text, View } from "react-native";

import { theme } from "../constants/theme";

type Props = {
  label: string;
  value: string | number;
  tone?: "plain" | "gold" | "teal" | "coral";
};

export function StatPill({ label, value, tone = "plain" }: Props) {
  return (
    <View style={[styles.root, styles[tone]]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minWidth: 78,
    minHeight: 52,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceMuted
  },
  plain: {
    backgroundColor: theme.colors.surface
  },
  gold: {
    backgroundColor: "#fff7dc",
    borderColor: "#f6d365"
  },
  teal: {
    backgroundColor: "#d8fbf4",
    borderColor: "#7dd3c7"
  },
  coral: {
    backgroundColor: "#ffe5e1",
    borderColor: "#fca5a5"
  },
  label: {
    color: theme.colors.inkMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  value: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2
  }
});
