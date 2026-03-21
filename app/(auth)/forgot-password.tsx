import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { Surface } from '../../components/ui/Surface';
import { Text } from '../../components/ui/Text';
import { useAppTheme } from '../../hooks/useAppTheme';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) {
      Alert.alert('Missing Info', 'Please enter your email.');
      return;
    }
    setSent(true);
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft color={colors.text} size={20} />
        </IconButton>
        <Text variant="headline">Reset password</Text>
      </View>

      <Surface style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        <Text variant="body" color={colors.textMuted}>
          Enter the email linked to your account. We'll send you a reset link.
        </Text>
        <Input
          label="Email"
          placeholder="you@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Button title={sent ? 'Email sent' : 'Send reset link'} onPress={handleSend} disabled={sent} />
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
