import { useRouter } from 'expo-router';
import { ChevronRight, MessageCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getChats } from '../../../api/chats';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Screen } from '../../../components/ui/Screen';
import { Surface } from '../../../components/ui/Surface';
import { Text } from '../../../components/ui/Text';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function ChatsScreen() {
  const [chats, setChats] = useState<any[]>([]);
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  useEffect(() => {
    loadChats();
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
                <MessageCircle size={22} color={colors.tint} />
              </Avatar>
              <View style={styles.info}>
                <View style={styles.header}>
                  <Text variant="bodyStrong">{chat.title || chat.name || 'Agent'}</Text>
                  <Text variant="caption" color={colors.textMuted}>{chat.time}</Text>
                </View>
                <View style={styles.footer}>
                  <Text variant="label" color={colors.textMuted} numberOfLines={1} style={{ flex: 1 }}>
                    {chat.lastMessage}
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
});
