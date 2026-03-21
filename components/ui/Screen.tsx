import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  background = false,
  style,
  contentContainerStyle,
}: ScreenProps) {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  const basePadding = padded ? spacing.xl : 0;
  const contentStyle = {
    paddingHorizontal: basePadding,
    paddingTop: basePadding + insets.top,
    paddingBottom: basePadding + insets.bottom,
    flexGrow: 1,
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]}>
      {background ? <ScreenBackground /> : null}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[contentStyle, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle, contentContainerStyle]}>
          {children}
        </View>
      )}
    </View>
  );
}

function ScreenBackground() {
  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
  },
});
