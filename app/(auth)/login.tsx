import * as Google from 'expo-auth-session/providers/google';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { login } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { Surface } from '../../components/ui/Surface';
import { Text } from '../../components/ui/Text';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors, spacing, radius, typography } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, , promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const response = await login({ email, password });
      const { access_token } = response.data;
      if (access_token) {
        await signIn(access_token, response.data.user);
        router.replace('/(tabs)');
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Google Login Failed', 'Could not authenticate with Google');
    }
  };

  return (
    <Screen scroll>
      <View style={[styles.header, { marginBottom: spacing.xxl }]}> 
        <View style={[styles.logo, { backgroundColor: colors.tint, borderRadius: radius.lg }]}>
          <Text variant="headline" style={{ color: colors.surface, fontFamily: typography.fonts.bold }}>
            CZ
          </Text>
        </View>
        <Text variant="title">Welcome back</Text>
        <Text variant="body" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
          Sign in to keep the conversation going.
        </Text>
      </View>

      <Surface style={{ gap: spacing.lg }}>
        <Input
          label="Email Address"
          placeholder="you@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Password"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end' }}>
          <Text variant="label" color={colors.tint}>Forgot password?</Text>
        </Pressable>

        <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} loading={loading} />

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text variant="caption" color={colors.textMuted} style={{ marginHorizontal: spacing.md }}>
            OR
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <Button
          title="Continue with Google"
          onPress={handleGoogleLogin}
          variant="secondary"
          disabled={!request}
        />
      </Surface>

      <View style={[styles.footer, { marginTop: spacing.xxl }]}> 
        <Text variant="label" color={colors.textMuted}>Don't have an account?</Text>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text variant="label" color={colors.tint} style={{ marginLeft: spacing.xs }}>
              Sign Up
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
