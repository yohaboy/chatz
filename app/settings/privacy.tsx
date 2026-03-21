import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft size={20} color={colors.text} />
        </IconButton>
        <Text variant="headline">Privacy Policy</Text>
      </View>

      <Surface style={{ marginTop: spacing.xl }}>
        <Text variant="body" color={colors.textMuted}>
          We respect your privacy. Here's a summary of how ChatZ handles your data.
        </Text>
      </Surface>

      <Surface style={{ marginTop: spacing.xl, gap: spacing.md }}>
        <Text variant="bodyStrong">What we collect</Text>
        <Text variant="body" color={colors.textMuted}>
          We store your account details, chat metadata, and preferences to provide the service.
        </Text>
        <Text variant="bodyStrong">How we use it</Text>
        <Text variant="body" color={colors.textMuted}>
          Data is used to personalize your experience, improve the app, and keep your account secure.
        </Text>
        <Text variant="bodyStrong">Your controls</Text>
        <Text variant="body" color={colors.textMuted}>
          You can update personal info, manage security settings, and request data deletion anytime.
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
