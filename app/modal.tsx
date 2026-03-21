import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ModalScreen() {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="headline">Quick Actions</Text>
        <Text variant="body" color={colors.textMuted}>
          Start a new chat or spin up a group space.
        </Text>
      </View>

      <Surface style={{ marginTop: spacing.xl, gap: spacing.md }}>
        <Button title="Start New Chat" onPress={() => router.back()} />
        <Button title="Create Group" variant="secondary" onPress={() => router.back()} />
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
});
