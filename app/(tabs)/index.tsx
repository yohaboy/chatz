import { Bot, Clock, ShieldCheck, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getMyAgents } from '../../api/agents';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      const response = await getMyAgents();
      setAgents(response.data);
    } catch (error) {
      // Dummy data for demo
      setAgents([
        { id: '1', name: 'Zia', age: 24, personality: 'romantic', presence: 'online' }
      ]);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.subGreeting}>Your AI companion is ready to chat.</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Agents</Text>
      </View>

      {agents.length > 0 ? (
        <View style={styles.agentsGrid}>
          {agents.map((agent: any) => (
            <View key={agent.id} style={styles.agentCard}>
              <View style={styles.agentIcon}>
                <Bot color={Colors.light.tint} size={32} />
                <View style={[styles.statusDot, { backgroundColor: agent.presence === 'online' ? '#4CAF50' : '#bdbdbd' }]} />
              </View>
              <Text style={styles.agentName}>{agent.name}</Text>
              <Text style={styles.agentInfo}>{agent.age} years • {agent.personality}</Text>
              <TouchableOpacity style={styles.chatBtn}>
                <Text style={styles.chatBtnText}>Chat Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No agents found. Go to profile to create one.</Text>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Zap color={Colors.light.tint} size={20} />
            <Text style={styles.statVal}>128</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          <View style={styles.statItem}>
            <Clock color={Colors.light.tint} size={20} />
            <Text style={styles.statVal}>4.2h</Text>
            <Text style={styles.statLabel}>Chat Time</Text>
          </View>
          <View style={styles.statItem}>
            <ShieldCheck color={Colors.light.tint} size={20} />
            <Text style={styles.statVal}>Pro</Text>
            <Text style={styles.statLabel}>Secure</Text>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  agentsGrid: {
    marginBottom: 30,
  },
  agentCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 2,
    padding: 20,
    alignItems: 'center',
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
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
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
