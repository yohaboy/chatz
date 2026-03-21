import { storage } from '@/utils/storage';
import axios from 'axios';
import { Compass, Lightbulb, MessageSquare, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { getMyAgents } from '../../api/agents';
import { Avatar } from '../../components/ui/Avatar';
import { PageHeader } from '../../components/ui/PageHeader';
import { Screen } from '../../components/ui/Screen';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Surface } from '../../components/ui/Surface';
import { Text } from '../../components/ui/Text';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, spacing } = useAppTheme();
  const [agents, setAgents] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any>(null);
  const [loadingDaily, setLoadingDaily] = useState(true);

  useEffect(() => {
    loadAgents();
    loadDailyPulse();
  }, []);

  async function loadAgents() {
    try {
      const response = await getMyAgents();
      setAgents(response.data);
    } catch (error) {
      setAgents([{ id: '1', name: 'Zia', age: 24, personality: 'romantic', presence: 'online' }]);
    }
  }

  async function loadDailyPulse() {
    const today = new Date().toISOString().split('T')[0];
    try {
      const cached = await storage.getItem('daily_pulse');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.date === today) {
          setDailyData(parsed);
          setLoadingDaily(false);
          return;
        }
      }

      const [jokeRes, factRes, adviceRes] = await Promise.all([
        axios.get('https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist'),
        axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random'),
        axios.get('https://api.adviceslip.com/advice'),
      ]);

      const joke = jokeRes.data.type === 'single'
        ? jokeRes.data.joke
        : `${jokeRes.data.setup}\n\n${jokeRes.data.delivery}`;

      const data = {
        date: today,
        joke,
        fact: factRes.data.text,
        advice: adviceRes.data.slip.advice,
      };

      await storage.setItem('daily_pulse', JSON.stringify(data));
      setDailyData(data);
    } catch (error) {
      console.error('Failed to load daily pulse', error);
    } finally {
      setLoadingDaily(false);
    }
  }

  const displayName = user?.email?.split('@')[0] || 'Friend';

  return (
    <Screen scroll>
      <PageHeader
        title={`Hello, ${displayName}`}
        subtitle="Your daily pulse is ready."
      />

      <View style={{ marginTop: spacing.xxl }}>
        <SectionHeader title="Your Agents" subtitle="Tap to start a conversation" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.md }}
        >
          {agents.map((agent) => (
            <Surface key={agent.id} style={[styles.agentCard, { minWidth: 160 }]}>
              <Avatar size={48}>
                <Users color={colors.tint} size={20} />
              </Avatar>
              <Text variant="bodyStrong" style={{ marginTop: spacing.sm }}>
                {agent.name}
              </Text>
              <Text variant="label" color={colors.textMuted}>
                {agent.personality || 'Companion'}
              </Text>
            </Surface>
          ))}
        </ScrollView>
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <SectionHeader title="Daily Feed" subtitle="Fresh insights just for you" />
        {loadingDaily ? (
          <View style={[styles.loadingBox, { borderColor: colors.border }]}> 
            <ActivityIndicator color={colors.tint} />
          </View>
        ) : (
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            <DailyCard
              icon={<MessageSquare color={colors.tint} size={18} />}
              title="Daily Laugh"
              content={dailyData?.joke}
              accent={colors.tint}
            />
            <DailyCard
              icon={<Lightbulb color={colors.warning} size={18} />}
              title="Daily Fact"
              content={dailyData?.fact}
              accent={colors.warning}
            />
            <DailyCard
              icon={<Compass color={colors.success} size={18} />}
              title="Daily Advice"
              content={dailyData?.advice}
              accent={colors.success}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

function DailyCard({
  icon,
  title,
  content,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  content?: string;
  accent: string;
}) {
  const { colors, radius } = useAppTheme();

  return (
    <Surface style={[styles.feedCard, { borderColor: colors.border }]}>
      <View style={styles.feedHeader}>
        <View style={[styles.feedIcon, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}>
          {icon}
        </View>
        <Text variant="label" color={colors.textMuted}>{title}</Text>
      </View>
      <Text variant="body" color={colors.text}>
        {content || 'Loading your update...'}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  agentCard: {
    gap: 8,
  },
  loadingBox: {
    marginTop: 16,
    height: 120,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  feedIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
