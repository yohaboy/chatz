import { storage } from '@/utils/storage';
import axios from 'axios';
import { Compass, Lightbulb, MessageSquare, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getMyAgents } from '../../api/agents';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
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

      // Fetch new data for the day
      const [jokeRes, factRes, adviceRes] = await Promise.all([
        axios.get('https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist'),
        axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random'),
        axios.get('https://api.adviceslip.com/advice')
      ]);

      const joke = jokeRes.data.type === 'single'
        ? jokeRes.data.joke
        : `${jokeRes.data.setup}\n\n${jokeRes.data.delivery}`;

      const data = {
        date: today,
        joke,
        fact: factRes.data.text,
        advice: adviceRes.data.slip.advice
      };

      await storage.setItem('daily_pulse', JSON.stringify(data));
      setDailyData(data);
    } catch (error) {
      console.error('Failed to load daily pulse', error);
    } finally {
      setLoadingDaily(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.subGreeting}>Welcome back to your own world.</Text>
      </View>

      {/* Daily Pulse Section */}
      <View style={styles.sectionHeader}>
        <Sparkles color={Colors.light.tint} size={20} />
        <Text style={styles.sectionTitle}>The Daily Feed</Text>
      </View>

      {loadingDaily ? (
        <View style={styles.loadingPulse}>
          <ActivityIndicator color={Colors.light.tint} />
        </View>
      ) : (
        <View style={styles.pulseContainer}>
          {/* Card 1: Joke */}
          <View style={[styles.pulseCard, { borderColor: '#FFF176', backgroundColor: '#FFFDE7' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#FBC02D' }]}>
                <MessageSquare color="#FFF" size={18} />
              </View>
              <Text style={styles.cardTitle}>Daily Laugh</Text>
            </View>
            <Text style={styles.cardText}>{dailyData?.joke}</Text>
          </View>

          {/* Card 2: Fact */}
          <View style={[styles.pulseCard, { borderColor: '#81D4FA', backgroundColor: '#E1F5FE' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#0288D1' }]}>
                <Lightbulb color="#FFF" size={18} />
              </View>
              <Text style={styles.cardTitle}>Daily Fact</Text>
            </View>
            <Text style={styles.cardText}>{dailyData?.fact}</Text>
          </View>

          {/* Card 3: Advice */}
          <View style={[styles.pulseCard, { borderColor: '#A5D6A7', backgroundColor: '#E8F5E9' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#388E3C' }]}>
                <Compass color="#FFF" size={18} />
              </View>
              <Text style={styles.cardTitle}>Daily Advice</Text>
            </View>
            <Text style={styles.cardText}>{dailyData?.advice}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
  },
  heroSection: {
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  subGreeting: {
    fontSize: 16,
    color: '#546E7A',
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loadingPulse: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    gap: 12,
    marginBottom: 30,
  },
  pulseCard: {
    padding: 20,
    borderRadius: 2, // Keeping the user's preferred square style
    borderWidth: 1,
    borderLeftWidth: 6, // Thick left accent for "modern-meets-fixed" look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    padding: 6,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
    textTransform: 'uppercase',
  },
  cardText: {
    fontSize: 15,
    color: '#263238',
    lineHeight: 22,
    fontWeight: '500',
  },
  agentsGrid: {
    marginBottom: 30,
  },
  agentCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    borderRadius: 2,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  agentIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.light.secondary,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  agentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  agentInfo: {
    fontSize: 14,
    color: '#546E7A',
    marginTop: 4,
    marginBottom: 16,
  },
  chatBtn: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.light.tint,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    borderRadius: 2,
    marginBottom: 30,
  },
  emptyText: {
    color: '#90A4AE',
    textAlign: 'center',
  },
  statsSection: {
    gap: 16,
    marginBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    padding: 16,
    borderRadius: 2,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#546E7A',
    marginTop: 2,
  },
});
