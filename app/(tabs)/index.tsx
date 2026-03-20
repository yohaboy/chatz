import { storage } from '@/utils/storage';
import axios from 'axios';
import { Compass, Lightbulb, MessageSquare, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getMyAgents } from '../../api/agents';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colorScheme } = useTheme();
  const [agents, setAgents] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any>(null);
  const [loadingDaily, setLoadingDaily] = useState(true);

  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;

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
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.heroSection, { borderBottomColor: themeColors.border }]}>
        <Text style={[styles.greeting, { color: themeColors.text }]}>Hello, {user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={[styles.subGreeting, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Welcome back to your own world.</Text>
      </View>

      {/* Daily Pulse Section */}
      <View style={styles.sectionHeader}>
        <Sparkles color={themeColors.tint} size={20} />
        <Text style={[styles.sectionTitle, { color: isDark ? themeColors.tint : '#333' }]}>The Daily Feed</Text>
      </View>

      {loadingDaily ? (
        <View style={styles.loadingPulse}>
          <ActivityIndicator color={themeColors.tint} />
        </View>
      ) : (
        <View style={styles.pulseContainer}>
          {/* Card 1: Joke */}
          <View style={[styles.pulseCard, {
            borderColor: isDark ? '#FBC02D' : '#FFF176',
            backgroundColor: isDark ? '#1A1A00' : '#FFFDE7'
          }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#FBC02D' }]}>
                <MessageSquare color="#FFF" size={18} />
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? themeColors.text : '#333' }]}>Daily Laugh</Text>
            </View>
            <Text style={[styles.cardText, { color: isDark ? '#ECEFF1' : '#263238' }]}>{dailyData?.joke}</Text>
          </View>

          {/* Card 2: Fact */}
          <View style={[styles.pulseCard, {
            borderColor: isDark ? '#0288D1' : '#81D4FA',
            backgroundColor: isDark ? '#001320' : '#E1F5FE'
          }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#0288D1' }]}>
                <Lightbulb color="#FFF" size={18} />
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? themeColors.text : '#333' }]}>Daily Fact</Text>
            </View>
            <Text style={[styles.cardText, { color: isDark ? '#ECEFF1' : '#263238' }]}>{dailyData?.fact}</Text>
          </View>

          {/* Card 3: Advice */}
          <View style={[styles.pulseCard, {
            borderColor: isDark ? '#388E3C' : '#A5D6A7',
            backgroundColor: isDark ? '#001A00' : '#E8F5E9'
          }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#388E3C' }]}>
                <Compass color="#FFF" size={18} />
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? themeColors.text : '#333' }]}>Daily Advice</Text>
            </View>
            <Text style={[styles.cardText, { color: isDark ? '#ECEFF1' : '#263238' }]}>{dailyData?.advice}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  heroSection: {
    paddingVertical: 30,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  subGreeting: {
    fontSize: 16,
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
    borderRadius: 2,
    borderWidth: 1,
    borderLeftWidth: 6,
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
    textTransform: 'uppercase',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
});
