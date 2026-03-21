import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function SectionHeader({ title, subtitle, right, style }: SectionHeaderProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <Text variant="headline">{title}</Text>
        {subtitle ? (
          <Text variant="label" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
});
