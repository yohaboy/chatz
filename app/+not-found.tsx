import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function NotFoundScreen() {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="headline">This screen isn't here.</Text>
        <Text variant="body" color={colors.textMuted} style={{ marginTop: spacing.sm, textAlign: 'center' }}>
          Let's get you back to the main experience.
        </Text>
        <View style={{ marginTop: spacing.xl, width: '100%' }}>
          <Button title="Go Home" onPress={() => router.replace('/')} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
