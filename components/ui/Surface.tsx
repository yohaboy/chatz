import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

type SurfaceVariant = 'default' | 'muted' | 'transparent';

interface SurfaceProps {
  children: React.ReactNode;
  variant?: SurfaceVariant;
  style?: ViewStyle;
  padded?: boolean;
}

export function Surface({ children, variant = 'default', style, padded = true }: SurfaceProps) {
  const { colors, radius, spacing, shadows, isDark } = useAppTheme();

  const backgroundColor = variant === 'muted' ? colors.surfaceAlt : variant === 'transparent' ? 'transparent' : colors.surface;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor,
          borderColor: variant === 'transparent' ? 'transparent' : colors.border,
          borderRadius: radius.lg,
          padding: padded ? spacing.lg : 0,
        },
        !isDark && variant !== 'transparent' ? shadows.card : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
});
