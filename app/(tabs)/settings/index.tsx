import { Bell, ChevronRight, FileText, HelpCircle, Moon, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ListItem } from '../../../components/ui/ListItem';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Screen } from '../../../components/ui/Screen';
import { Surface } from '../../../components/ui/Surface';
import { Text } from '../../../components/ui/Text';
import { useTheme } from '../../../context/ThemeContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function SettingsScreen() {
  const { setThemeMode, colorScheme } = useTheme();
  const { colors, spacing } = useAppTheme();
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  return (
    <Screen scroll>
      <PageHeader title="Settings" subtitle="Tune your experience" />

      <Surface style={{ marginTop: spacing.xl }}>
        <Text variant="overline" color={colors.textMuted}>Preferences</Text>
        <View style={{ marginTop: spacing.md }}>
          <SettingToggle
            icon={<Bell size={20} color={colors.tint} />}
            title="Push notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingToggle
            icon={<Moon size={20} color={colors.tint} />}
            title="Dark mode"
            value={colorScheme === 'dark'}
            onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
            showDivider={false}
          />
        </View>
      </Surface>

      <Surface style={{ marginTop: spacing.xl }} padded={false}>
        <View style={styles.sectionHeader}>
          <Text variant="overline" color={colors.textMuted}>Security & Support</Text>
        </View>
        <ListItem
          title="Security"
          subtitle="Two-factor and passcode"
          left={<Shield size={20} color={colors.tint} />}
          right={<ChevronRight size={18} color={colors.textMuted} />}
          onPress={() => router.push('/settings/security')}
        />
        <ListItem
          title="Support Center"
          subtitle="Get help or contact us"
          left={<HelpCircle size={20} color={colors.tint} />}
          right={<ChevronRight size={18} color={colors.textMuted} />}
          onPress={() => router.push('/settings/support')}
          showDivider={false}
        />
      </Surface>

      <Surface style={{ marginTop: spacing.xl }} padded={false}>
        <View style={styles.sectionHeader}>
          <Text variant="overline" color={colors.textMuted}>Legal</Text>
        </View>
        <ListItem
          title="Privacy Policy"
          subtitle="How we handle your data"
          left={<FileText size={20} color={colors.tint} />}
          right={<ChevronRight size={18} color={colors.textMuted} />}
          onPress={() => router.push('/settings/privacy')}
        />
        <ListItem
          title="Terms of Service"
          subtitle="Rules and guidelines"
          left={<FileText size={20} color={colors.tint} />}
          right={<ChevronRight size={18} color={colors.textMuted} />}
          onPress={() => router.push('/settings/terms')}
          showDivider={false}
        />
      </Surface>

      <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
        <Text variant="caption" color={colors.textMuted}>Version 1.0.0</Text>
      </View>
    </Screen>
  );
}

function SettingToggle({
  icon,
  title,
  value,
  onValueChange,
  showDivider = true,
}: {
  icon: React.ReactNode;
  title: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  showDivider?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.toggleRow, { borderBottomColor: showDivider ? colors.border : 'transparent' }]}>
      <View style={styles.toggleLeft}>
        {icon}
        <Text variant="bodyStrong" style={{ marginLeft: 12 }}>
          {title}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.tint }}
        thumbColor={value ? colors.surface : colors.surfaceAlt}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
