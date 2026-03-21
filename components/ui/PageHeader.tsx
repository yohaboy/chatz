import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Text } from './Text';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function PageHeader({ title, subtitle, right, style }: PageHeaderProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <Text variant="display">{title}</Text>
        {subtitle ? (
          <Text variant="body" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
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
