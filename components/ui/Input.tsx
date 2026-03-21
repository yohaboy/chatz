import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...rest
}: InputProps) {
  const { colors, radius, spacing, typography } = useAppTheme();
  const [focused, setFocused] = React.useState(false);

  const borderColor = error ? colors.danger : focused ? colors.tint : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.sm }}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            borderRadius: radius.md,
            borderColor,
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: typography.fonts.regular,
              fontSize: typography.sizes.md,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text variant="caption" color={colors.danger} style={{ marginTop: spacing.xs }}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
});
