import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

type IconButtonVariant = 'ghost' | 'soft';

interface IconButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: IconButtonVariant;
  size?: number;
  style?: ViewStyle;
}

export function IconButton({
  onPress,
  children,
  variant = 'ghost',
  size = 40,
  style,
}: IconButtonProps) {
  const { colors, radius } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          backgroundColor: variant === 'soft' ? colors.surfaceAlt : 'transparent',
          borderColor: variant === 'soft' ? colors.border : 'transparent',
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
      hitSlop={10}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
