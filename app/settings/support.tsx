import { useRouter } from 'expo-router';
import { ArrowLeft, Headphones, Mail, MessageCircle, Sparkles } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from '@/components/ui/IconButton';
import { ListItem } from '@/components/ui/ListItem';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function SupportScreen() {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft size={20} color={colors.text} />
        </IconButton>
        <Text variant="headline">Support Center</Text>
      </View>

      <Surface style={{ marginTop: spacing.xl }}>
        <Text variant="body" color={colors.textMuted}>
          Find answers fast or reach out to our team.
        </Text>
      </Surface>

      <Surface style={{ marginTop: spacing.xl }} padded={false}>
        <View style={styles.sectionHeader}>
          <Text variant="overline" color={colors.textMuted}>Popular topics</Text>
        </View>
        <ListItem
          title="Account access"
          subtitle="Reset password or update email"
          left={<Sparkles size={20} color={colors.tint} />}
          right={<MessageCircle size={18} color={colors.textMuted} />}
        />
        <ListItem
          title="Payments & billing"
          subtitle="Invoices, receipts, and plans"
          left={<Sparkles size={20} color={colors.tint} />}
          right={<MessageCircle size={18} color={colors.textMuted} />}
        />
        <ListItem
          title="Troubleshooting"
          subtitle="App performance and bugs"
          left={<Sparkles size={20} color={colors.tint} />}
          right={<MessageCircle size={18} color={colors.textMuted} />}
          showDivider={false}
        />
      </Surface>

      <Surface style={{ marginTop: spacing.xl }} padded={false}>
        <View style={styles.sectionHeader}>
          <Text variant="overline" color={colors.textMuted}>Contact</Text>
        </View>
        <ListItem
          title="Live chat"
          subtitle="Chat with a support agent"
          left={<Headphones size={20} color={colors.tint} />}
          right={<MessageCircle size={18} color={colors.textMuted} />}
        />
        <ListItem
          title="Email us"
          subtitle="support@chatz.app"
          left={<Mail size={20} color={colors.tint} />}
          right={<MessageCircle size={18} color={colors.textMuted} />}
          showDivider={false}
        />
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
