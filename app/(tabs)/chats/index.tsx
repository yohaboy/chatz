import { useRouter } from 'expo-router';
import { ChevronRight, MessageCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { getChats } from '../../../api/chats';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Screen } from '../../../components/ui/Screen';
import { Surface } from '../../../components/ui/Surface';
import { Text } from '../../../components/ui/Text';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { getAgentImageSource } from '../../../utils/agentImages';
import { storage } from '../../../utils/storage';

export default function ChatsScreen() {
  const [chats, setChats] = useState<any[]>([]);
  const [storedAgentImages, setStoredAgentImages] = useState<Record<string, string>>({});
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  useEffect(() => {
    loadChats();
    loadStoredAgentImages();
  }, []);

  async function loadChats() {
    try {
      const response = await getChats();
      const personalChats = (response.data || []).filter((c: any) => c.chat_type?.toLowerCase() === 'personal');
      setChats(personalChats);
    } catch (error) {
      setChats([
        { id: '1', name: 'Zia Chat', lastMessage: 'How are you today?', time: '10:45 AM', unread: 2, chat_type: 'personal' },
        { id: '2', name: 'Alex Bot', lastMessage: 'I understand.', time: 'Yesterday', unread: 0, chat_type: 'personal' },
      ]);
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

  const handleChatPress = (chat: any) => {
    router.push({
      pathname: '/chats/[id]',
      params: { id: chat.id, title: chat.title || chat.name },
    });
  };

  return (
    <Screen scroll>
      <PageHeader title="Chats" subtitle="Stay close to your agents" />

      <Surface style={{ marginTop: spacing.xl }} padded={false}>
        {chats.map((chat: any, index: number) => {
          const isLast = index === chats.length - 1;
          const agentImage = getPersonalChatAgentImage(chat, storedAgentImages);
          return (
            <Pressable
              key={chat.id}
              onPress={() => handleChatPress(chat)}
              style={({ pressed }) => [
                styles.row,
                {
                  borderBottomColor: isLast ? 'transparent' : colors.border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <Avatar size={52}>
                <Image source={agentImage} style={styles.avatarImage} />
              </Avatar>
              <View style={styles.info}>
                <View style={styles.header}>
                  <Text variant="bodyStrong">{chat.title || chat.name || 'Agent'}</Text>
                  <Text variant="caption" color={colors.textMuted}>{chat.time}</Text>
                </View>
                <View style={styles.footer}>
                  <Text variant="label" color={colors.textMuted} numberOfLines={1} style={{ flex: 1 }}>
                    {formatLastMessage(chat)}
                  </Text>
                  {chat.unread > 0 ? <Badge label={chat.unread} /> : null}
                </View>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </Pressable>
          );
        })}
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
});

function formatLastMessage(chat: any) {
  const name = chat.title || chat.name || 'Agent';
  const lastMessage = String(chat.lastMessage || '');
  if (lastMessage.toLowerCase().startsWith('chat with ')) {
    return name;
  }
  return lastMessage;
}

function getPersonalChatAgentImage(chat: any, storedAgentImages: Record<string, string>) {
  const agentId =
    chat?.participants?.[0]?.agent_id ||
    chat?.agent_id ||
    chat?.selected_agent_id;
  const storedKey = agentId ? storedAgentImages?.[agentId] : null;
  const imageKey =
    storedKey ||
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
