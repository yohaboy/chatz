import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TermsScreen() {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft size={20} color={colors.text} />
        </IconButton>
        <Text variant="headline">Terms of Service</Text>
      </View>

      <Surface style={{ marginTop: spacing.xl }}>
        <Text variant="body" color={colors.textMuted}>
          By using ChatZ, you agree to these key terms.
        </Text>
      </Surface>

      <Surface style={{ marginTop: spacing.xl, gap: spacing.md }}>
        <Text variant="bodyStrong">Respectful use</Text>
        <Text variant="body" color={colors.textMuted}>
          Please keep conversations respectful and avoid harmful or illegal content.
        </Text>
        <Text variant="bodyStrong">Account responsibility</Text>
        <Text variant="body" color={colors.textMuted}>
          Keep your credentials secure and notify us if you suspect unauthorized access.
        </Text>
        <Text variant="bodyStrong">Service updates</Text>
        <Text variant="body" color={colors.textMuted}>
          Features may evolve over time. We'll notify you about significant changes.
        </Text>
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
