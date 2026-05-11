import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../constants/theme";

type ButtonTone = "primary" | "secondary" | "danger" | "ghost";

type Props = Omit<PressableProps, "children" | "style"> & {
  label: string;
  tone?: ButtonTone;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ActionButton({ label, tone = "primary", compact = false, disabled, style, ...props }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[tone],
        compact && styles.compact,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style
      ]}
      {...props}
    >
      <Text style={[styles.label, tone === "ghost" && styles.ghostLabel, disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  compact: {
    minHeight: 40,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  primary: {
    backgroundColor: theme.colors.teal
  },
  secondary: {
    backgroundColor: theme.colors.ink
  },
  danger: {
    backgroundColor: theme.colors.coral
  },
  ghost: {
    backgroundColor: theme.colors.surfaceMuted
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }]
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center"
  },
  ghostLabel: {
    color: theme.colors.ink
  },
  disabledLabel: {
    color: theme.colors.inkMuted
  }
});
