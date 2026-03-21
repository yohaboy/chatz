import { useRouter } from 'expo-router';
import { ArrowLeft, Fingerprint, KeyRound, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function SecurityScreen() {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();
  const [twoFactor, setTwoFactor] = useState(false);
  const [passcode, setPasscode] = useState(true);
  const [biometric, setBiometric] = useState(false);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft size={20} color={colors.text} />
        </IconButton>
        <Text variant="headline">Security</Text>
      </View>

      <Surface style={{ marginTop: spacing.xl }}>
        <Text variant="overline" color={colors.textMuted}>Protection</Text>
        <View style={{ marginTop: spacing.md }}>
          <SecurityToggle
            icon={<ShieldCheck size={20} color={colors.tint} />}
            title="Two-factor authentication"
            description="Add an extra layer of security"
            value={twoFactor}
            onValueChange={setTwoFactor}
          />
          <SecurityToggle
            icon={<KeyRound size={20} color={colors.tint} />}
            title="App passcode"
            description="Require a passcode on open"
            value={passcode}
            onValueChange={setPasscode}
          />
          <SecurityToggle
            icon={<Fingerprint size={20} color={colors.tint} />}
            title="Biometric unlock"
            description="Use Face ID or fingerprint"
            value={biometric}
            onValueChange={setBiometric}
            showDivider={false}
          />
        </View>
      </Surface>
    </Screen>
  );
}

function SecurityToggle({
  icon,
  title,
  description,
  value,
  onValueChange,
  showDivider = true,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  showDivider?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.toggleRow, { borderBottomColor: showDivider ? colors.border : 'transparent' }]}>
      <View style={styles.toggleLeft}>
        {icon}
        <View style={{ marginLeft: 12 }}>
          <Text variant="bodyStrong">{title}</Text>
          <Text variant="caption" color={colors.textMuted}>{description}</Text>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    flex: 1,
  },
});
