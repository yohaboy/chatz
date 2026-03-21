import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface AvatarProps {
  size?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function Avatar({ size = 48, style, children }: AvatarProps) {
  const { colors, radius } = useAppTheme();
  const rounded = size / 2;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: rounded,
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
