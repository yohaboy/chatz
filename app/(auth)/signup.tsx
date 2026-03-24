import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { getAgentTemplates } from '../../api/agents';
import { register } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { Surface } from '../../components/ui/Surface';
import { Text } from '../../components/ui/Text';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../context/AuthContext';
import { getAgentImageKeyByName, getAgentImageSourceByName } from '../../utils/agentImages';

export default function SignupScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors, spacing, radius, typography } = useAppTheme();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    age: '',
    gender: 'male' as 'male' | 'female',
  });

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const [agentCustomization, setAgentCustomization] = useState({
    name: '',
    age: '',
    personality: 'romantic' as 'romantic' | 'friend' | 'emotional',
  });

  useEffect(() => {
    if (step === 1) {
      loadTemplates();
    }
  }, [step]);

  async function loadTemplates() {
    try {
      setLoading(true);
      const response = await getAgentTemplates();
      setTemplates(response.data);
    } catch (error) {
      setTemplates([
        { id: '1', name: 'Alpha Agent', description: 'A reliable assistant' },
        { id: '2', name: 'Beta Bot', description: 'A funny companion' },
        { id: '3', name: 'Gamma Guide', description: 'Helpful and wise' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (step === 0) {
      if (!userInfo.email || !userInfo.password || !userInfo.age) {
        Alert.alert('Missing Info', 'Please fill all fields');
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!selectedTemplate) {
        Alert.alert('Selection Required', 'Please select an agent template');
        return;
      }
      setAgentCustomization({
        ...agentCustomization,
        name: selectedTemplate.name,
      });
      setStep(2);
    } else if (step === 2) {
      if (!agentCustomization.name || !agentCustomization.age) {
        Alert.alert('Missing Info', 'Please fill agent details');
        return;
      }
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      const selectedImageKey = getAgentImageKeyByName(selectedTemplate?.name);
      const signupData = {
        email: userInfo.email,
        password: userInfo.password,
        google_id: null,
        age: Number(userInfo.age),
        gender: userInfo.gender,
        selected_agent_id: selectedTemplate.id,
        selected_agent_image: selectedImageKey,
        agent_name: agentCustomization.name,
        agent_age: Number(agentCustomization.age),
        agent_category: agentCustomization.personality,
      };

      const response = await register(signupData);
      const { access_token } = response.data;
      if (access_token) {
        await signIn(access_token);
        router.replace('/(tabs)');
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      Alert.alert('Signup Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep0User = () => (
    <View style={{ gap: spacing.lg }}>
      <View>
        <Text variant="title">Create your profile</Text>
        <Text variant="body" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
          Let us personalize your experience.
        </Text>
      </View>

      <Input
        label="Email"
        placeholder="you@email.com"
        value={userInfo.email}
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        label="Password"
        placeholder="Choose a password"
        value={userInfo.password}
        onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
        secureTextEntry
      />

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Input
            label="Age"
            placeholder="Years"
            value={userInfo.age}
            onChangeText={(text) => setUserInfo({ ...userInfo, age: text })}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Text variant="label" color={colors.textMuted}>Gender</Text>
          <View style={{ gap: spacing.sm }}>
            {(['male', 'female'] as const).map((g) => {
              const selected = userInfo.gender === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setUserInfo({ ...userInfo, gender: g })}
                  style={({ pressed }) => [
                    styles.choiceChip,
                    {
                      borderColor: selected ? colors.tint : colors.border,
                      backgroundColor: selected ? colors.tintSoft : colors.surface,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <Text variant="label" color={selected ? colors.tint : colors.text}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep1Template = () => (
    <View style={{ gap: spacing.lg }}>
      <View>
        <Text variant="title">Select an AI template</Text>
        <Text variant="body" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
          Choose a base persona to start from.
        </Text>
      </View>

      <View style={styles.templateGrid}>
        {templates.map((t: any) => {
          const selected = selectedTemplate?.id === t.id;
          const imageSource = getAgentImageSourceByName(t.name);
          return (
            <Pressable
              key={t.id}
              onPress={() => setSelectedTemplate(t)}
              style={({ pressed }) => [
                styles.templateCard,
                {
                  borderColor: selected ? colors.tint : colors.border,
                  backgroundColor: selected ? colors.tintSoft : colors.surface,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <View style={styles.templateCardContent}>
                <View
                  style={[
                    styles.templateImageFrame,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Image source={imageSource} style={styles.templateImage} />
                </View>
                <Text variant="bodyStrong" style={{ textAlign: 'center' }}>
                  {t.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderStep2Agent = () => (
    <View style={{ gap: spacing.lg }}>
      <View>
        <Text variant="title">Customize your agent</Text>
        <Text variant="body" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
          Add the final touch before you start.
        </Text>
      </View>

      <Input
        label="Agent name"
        placeholder="Agent's name"
        value={agentCustomization.name}
        onChangeText={(text) => setAgentCustomization({ ...agentCustomization, name: text })}
      />
      <Input
        label="Agent age"
        placeholder="Agent's age"
        value={agentCustomization.age}
        onChangeText={(text) => setAgentCustomization({ ...agentCustomization, age: text })}
        keyboardType="numeric"
      />

      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color={colors.textMuted}>Personality</Text>
        <View style={{ gap: spacing.sm }}>
          {(['romantic', 'friend', 'emotional'] as const).map((p) => {
            const selected = agentCustomization.personality === p;
            return (
              <Pressable
                key={p}
                onPress={() => setAgentCustomization({ ...agentCustomization, personality: p })}
                style={({ pressed }) => [
                  styles.choiceChip,
                  {
                    borderColor: selected ? colors.tint : colors.border,
                    backgroundColor: selected ? colors.tintSoft : colors.surface,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <Text variant="label" color={selected ? colors.tint : colors.text}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <Screen scroll>
      <View style={styles.header}>
        {step > 0 ? (
          <Pressable onPress={() => setStep(step - 1)} style={styles.backButton}>
            <ChevronLeft color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        <View style={[styles.progressBar, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}> 
          <View
            style={{
              height: '100%',
              width: `${((step + 1) / 3) * 100}%`,
              backgroundColor: colors.tint,
              borderRadius: radius.pill,
            }}
          />
        </View>
        <Text variant="caption" color={colors.textMuted} style={{ fontFamily: typography.fonts.semibold }}>
          {step + 1}/3
        </Text>
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        {step === 0 && renderStep0User()}
        {step === 1 && renderStep1Template()}
        {step === 2 && renderStep2Agent()}
      </View>

      <Surface style={{ marginTop: spacing.xxl }}>
        <Button
          title={step === 2 ? 'Finish' : 'Continue'}
          onPress={handleNext}
          loading={loading}
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
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
  choiceChip: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  templateCard: {
    width: '48%',
    aspectRatio: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  templateImageFrame: {
    width: '100%',
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  templateImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
