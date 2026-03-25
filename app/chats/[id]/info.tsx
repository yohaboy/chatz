import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bot, Calendar, Info, MessageSquare, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { getChatDetails } from '../../../api/chats';
import { Avatar } from '../../../components/ui/Avatar';
import { IconButton } from '../../../components/ui/IconButton';
import { Screen } from '../../../components/ui/Screen';
import { Surface } from '../../../components/ui/Surface';
import { Text } from '../../../components/ui/Text';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { getAgentImageSource, getAgentImageSourceByName } from '../../../utils/agentImages';
import { storage } from '../../../utils/storage';

export default function ChatInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storedAgentImages, setStoredAgentImages] = useState<Record<string, string>>({});

  useEffect(() => {
    loadChatDetails();
    loadStoredAgentImages();
  }, [id]);

  async function loadChatDetails() {
    try {
      const response = await getChatDetails(id!);
      setChat(response.data);
    } catch (error) {
      console.error('Failed to load chat details', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStoredAgentImages() {
    try {
      const raw = await storage.getItem('agent_image_map');
      setStoredAgentImages(raw ? JSON.parse(raw) : {});
    } catch (error) {
      console.error('Failed to load agent image map', error);
      setStoredAgentImages({});
    }
  }

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.tint} />
        </View>
      </Screen>
    );
  }

  const isGroup = chat?.chat_type?.toLowerCase() === 'group';

  return (
    <Screen scroll>
      <View style={styles.header}>
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft color={colors.text} size={20} />
        </IconButton>
        <Text variant="headline">Details</Text>
      </View>

      <Surface style={{ marginTop: spacing.xl, alignItems: 'center' }}>
        <Avatar size={96}>
          {isGroup ? (
            <Bot size={40} color={colors.tint} />
          ) : (
            <Image source={getPersonalChatAgentImage(chat, storedAgentImages)} style={styles.avatarImage} />
          )}
        </Avatar>
        <Text variant="headline" style={{ marginTop: spacing.md }}>
          {chat?.title || 'Chat'}
        </Text>
        <Text variant="label" color={colors.textMuted}>
          {isGroup ? 'Group Chat' : 'Personal Agent'}
        </Text>
      </Surface>

      <View style={[styles.statsRow, { marginTop: spacing.xl }]}> 
        <Surface style={styles.statCard}>
          <MessageSquare size={20} color={colors.tint} />
          <Text variant="bodyStrong" style={{ marginTop: spacing.sm }}>-</Text>
          <Text variant="caption" color={colors.textMuted}>Messages</Text>
        </Surface>
        <Surface style={styles.statCard}>
          <Calendar size={20} color={colors.tint} />
          <Text variant="bodyStrong" style={{ marginTop: spacing.sm }}>
            {chat?.last_message_at ? new Date(chat.last_message_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}
          </Text>
          <Text variant="caption" color={colors.textMuted}>Activity</Text>
        </Surface>
      </View>

      <Surface style={{ marginTop: spacing.xl }}>
        <View style={styles.sectionHeader}>
          <Info size={18} color={colors.tint} />
          <Text variant="bodyStrong">General Info</Text>
        </View>
        <View style={styles.infoRow}>
          <Text variant="label" color={colors.textMuted}>Type</Text>
          <Text variant="label">{isGroup ? 'Public Group' : 'Direct Access'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text variant="label" color={colors.textMuted}>Created</Text>
          <Text variant="label">
            {new Date(chat?.created_at || Date.now()).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
      </Surface>

      {isGroup ? (
        <Surface style={{ marginTop: spacing.xl }}>
          <View style={styles.sectionHeader}>
            <User size={18} color={colors.tint} />
            <Text variant="bodyStrong">Members ({chat?.participants?.length || 0})</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {chat?.participants?.map((p: any) => (
              <View key={p.id} style={styles.memberRow}>
                <Avatar size={40}>
                  <Image source={getAgentImageSourceByName(p.agent_name)} style={styles.avatarImage} />
                </Avatar>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong">{p.agent_name}</Text>
                  <Text variant="caption" color={p.is_online ? colors.success : colors.warning}>
                    {p.is_online ? 'online' : 'away'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Surface>
      ) : (
        <Surface style={{ marginTop: spacing.xl }}>
          <View style={styles.sectionHeader}>
            <User size={18} color={colors.tint} />
            <Text variant="bodyStrong">Agent Profile</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="label" color={colors.textMuted}>Gender</Text>
            <Text variant="label">{chat?.participants?.[0]?.agent_gender || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="label" color={colors.textMuted}>Role</Text>
            <Text variant="label">Personalized AI Assistant</Text>
          </View>
        </Surface>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
});

function getPersonalChatAgentImage(chat: any, storedAgentImages: Record<string, string>) {
  const agentId =
    chat?.participants?.[0]?.agent_id ||
    chat?.agent_id ||
    chat?.selected_agent_id;
  const storedKey = agentId ? storedAgentImages?.[agentId] : null;
  const nameKey =
    `name:${(chat?.participants?.[0]?.agent_name || chat?.agent_name || chat?.title || chat?.name || '').trim().toLowerCase()}`;
  const storedByName = storedAgentImages?.[nameKey] || null;
  const imageKey =
    storedKey ||
    storedByName ||
    chat?.selected_agent_image ||
    chat?.agent_image ||
    chat?.agent_avatar ||
    chat?.agent_photo ||
    chat?.image ||
    chat?.photo ||
    chat?.avatar ||
    chat?.participants?.[0]?.agent_image ||
    chat?.participants?.[0]?.agent_avatar;
  const nameFallback =
    chat?.participants?.[0]?.agent_name ||
    chat?.agent_name ||
    chat?.title ||
    chat?.name;
  return getAgentImageSource(imageKey, nameFallback);
}
