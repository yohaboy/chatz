import { useRouter } from 'expo-router';
import { ChevronRight, Edit3, LogOut, Shield, User } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { ListItem } from '../../../components/ui/ListItem';
import { Screen } from '../../../components/ui/Screen';
import { Surface } from '../../../components/ui/Surface';
import { Text } from '../../../components/ui/Text';
import { useAuth } from '../../../context/AuthContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { colors, spacing } = useAppTheme();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <Screen
      scroll
      padded={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl }}
    >
      <Surface style={{ marginTop: spacing.xl }}>
        <View style={styles.profileHeader}>
          <Avatar size={84}>
            <User size={32} color={colors.tint} />
          </Avatar>
          <View style={{ flex: 1 }}>
            <Text variant="headline">{user?.email?.split('@')[0] || 'User'}</Text>
            <Text variant="label" color={colors.textMuted}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/profile/edit')} style={styles.editIcon}>
            <Edit3 size={18} color={colors.tint} />
          </Pressable>
        </View>
        <Button
          title="Edit Profile"
          variant="secondary"
          onPress={() => router.push('/profile/edit')}
        />
      </Surface>

      <Surface style={{ marginTop: spacing.xl, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm }} padded={false}>
        <ListItem title="Age" subtitle={`${user?.age || '25'} years`} showDivider />
        <ListItem title="Gender" subtitle={user?.gender || 'Male'} showDivider />
        <ListItem title="Member since" subtitle="March 2026" showDivider={false} />
      </Surface>

      <Surface style={{ marginTop: spacing.xl, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm }} padded={false}>
        <ListItem
          title="Privacy & Security"
          subtitle="Manage your protections"
          left={<Shield size={20} color={colors.tint} />}
          right={<ChevronRight size={18} color={colors.textMuted} />}
          onPress={() => router.push('/settings/security')}
        />
        <ListItem
          title="Sign Out"
          subtitle="End your current session"
          left={<LogOut size={20} color={colors.danger} />}
          right={<ChevronRight size={18} color={colors.textMuted} />}
          onPress={handleSignOut}
          showDivider={false}
        />
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  editIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
