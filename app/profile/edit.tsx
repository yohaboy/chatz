import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { colors, spacing } = useAppTheme();

  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [gender, setGender] = useState<'male' | 'female'>(user?.gender || 'male');

  const handleSave = () => {
    if (!user) return;
    if (!age) {
      Alert.alert('Missing Info', 'Please enter your age.');
      return;
    }
    updateUser({
      ...user,
      email,
      age: parseInt(age, 10),
      gender,
    });
    router.back();
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft size={20} color={colors.text} />
        </IconButton>
        <Text variant="headline">Edit Profile</Text>
      </View>

      <Surface style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <View style={{ gap: spacing.sm }}>
          <Text variant="label" color={colors.textMuted}>Gender</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {(['male', 'female'] as const).map((g) => (
              <Pressable
                key={g}
                onPress={() => setGender(g)}
                style={({ pressed }) => [
                  styles.choiceChip,
                  {
                    borderColor: gender === g ? colors.tint : colors.border,
                    backgroundColor: gender === g ? colors.tintSoft : colors.surface,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Text variant="label" color={gender === g ? colors.tint : colors.text}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Button title="Save Changes" onPress={handleSave} />
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
  choiceChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});
