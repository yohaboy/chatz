import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  outline,
  disabled,
  loading,
  style,
  textStyle,
}: ButtonProps) {
  const { colors, radius, spacing, typography } = useAppTheme();

  const resolvedVariant: ButtonVariant = outline ? 'outline' : variant;
  const sizeStyle = sizeStyles[size];
  const { backgroundColor, borderColor, textColor } = getVariantStyles(resolvedVariant, colors);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        {
          backgroundColor,
          borderColor,
          borderRadius: radius.md,
          opacity: disabled ? 0.55 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          variant="label"
          style={[
            {
              color: textColor,
              fontFamily: typography.fonts.semibold,
              letterSpacing: 0.2,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { minHeight: 40, paddingHorizontal: 16 },
  md: { minHeight: 48, paddingHorizontal: 20 },
  lg: { minHeight: 56, paddingHorizontal: 24 },
};

function getVariantStyles(variant: ButtonVariant, colors: ReturnType<typeof useAppTheme>['colors']) {
  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.border,
        textColor: colors.text,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: colors.border,
        textColor: colors.text,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: colors.tint,
      };
    case 'destructive':
      return {
        backgroundColor: colors.danger,
        borderColor: colors.danger,
        textColor: colors.surface,
      };
    case 'primary':
    default:
      return {
        backgroundColor: colors.tint,
        borderColor: colors.tint,
        textColor: colors.surface,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    width: '100%',
  },
});
