import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Text } from './Text';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showDivider?: boolean;
  style?: ViewStyle;
}

export function ListItem({
  title,
  subtitle,
  onPress,
  left,
  right,
  showDivider = true,
  style,
}: ListItemProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: showDivider ? colors.border : 'transparent',
          opacity: onPress && pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {left ? <View style={styles.left}>{left}</View> : null}
      <View style={styles.body}>
        <Text variant="bodyStrong">{title}</Text>
        {subtitle ? (
          <Text variant="label" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  left: {
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  right: {
    marginLeft: 12,
  },
});
