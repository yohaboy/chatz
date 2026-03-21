import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Text } from './Text';

interface BadgeProps {
  label: string | number;
  style?: ViewStyle;
}

export function Badge({ label, style }: BadgeProps) {
  const { colors, radius, spacing, typography } = useAppTheme();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.tint,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.sm,
          minHeight: 20,
        },
        style,
      ]}
    >
      <Text
        variant="caption"
        style={{ color: colors.surface, fontFamily: typography.fonts.bold }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
