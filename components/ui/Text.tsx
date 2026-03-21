import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { typography as baseTypography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export type TextVariant =
  | 'display'
  | 'title'
  | 'headline'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'overline'
  | 'mono';

interface AppTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
}

export function Text({ variant = 'body', color, style, ...props }: AppTextProps) {
  const { colors, typography } = useAppTheme();
  const variantStyle = getVariantStyle(variant, typography);

  return (
    <RNText
      style={[
        variantStyle,
        { color: color ?? colors.text },
        style,
      ]}
      {...props}
    />
  );
}

type Typography = typeof baseTypography;

function getVariantStyle(variant: TextVariant, typography: Typography) {
  const { fonts, sizes, lineHeights } = typography;

  switch (variant) {
    case 'display':
      return { fontFamily: fonts.bold, fontSize: sizes.display, lineHeight: lineHeights.display, letterSpacing: -0.5 };
    case 'title':
      return { fontFamily: fonts.bold, fontSize: sizes.xxl, lineHeight: lineHeights.xxl };
    case 'headline':
      return { fontFamily: fonts.semibold, fontSize: sizes.xl, lineHeight: lineHeights.xl };
    case 'bodyStrong':
      return { fontFamily: fonts.semibold, fontSize: sizes.md, lineHeight: lineHeights.md };
    case 'label':
      return { fontFamily: fonts.medium, fontSize: sizes.sm, lineHeight: lineHeights.sm };
    case 'caption':
      return { fontFamily: fonts.medium, fontSize: sizes.xs, lineHeight: lineHeights.xs };
    case 'overline':
      return { fontFamily: fonts.medium, fontSize: sizes.xs, lineHeight: lineHeights.xs, letterSpacing: 1.4, textTransform: 'uppercase' };
    case 'mono':
      return { fontFamily: fonts.mono, fontSize: sizes.sm, lineHeight: lineHeights.sm };
    case 'body':
    default:
      return { fontFamily: fonts.regular, fontSize: sizes.md, lineHeight: lineHeights.md };
  }
}
