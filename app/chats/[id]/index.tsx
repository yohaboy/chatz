import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bot, Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getChatDetails, getMessages, sendMessage } from '../../../api/chats';
import { Avatar } from '../../../components/ui/Avatar';
import { IconButton } from '../../../components/ui/IconButton';
import { Text } from '../../../components/ui/Text';
import { useAuth } from '../../../context/AuthContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function ChatDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, typography } = useAppTheme();

  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatDetails();
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [id]);

  async function loadChatDetails() {
    try {
      const response = await getChatDetails(id!);
      setChat(response.data);
    } catch (error) {
      console.error('Failed to load chat details', error);
    }
  }

  async function loadMessages() {
    try {
      const response = await getMessages(id!);
      const msgs = response.data.messages || [];
      setMessages([...msgs].reverse());
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendMessage(id!, textToSend);
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = React.useCallback(({ item }: { item: any }) => {
    const isMe = item.sender_user_id === user?.id || item.is_user_message;
    const isGroup = chat?.chat_type?.toLowerCase() === 'group';

    let agentName = '';
    if (isGroup && !isMe) {
      const participant = chat?.participants?.find((p: any) => p.agent_id === item.sender_agent_id);
      agentName = participant?.agent_name || 'Agent';
    }

    return (
      <View style={[styles.messageRow, isMe ? styles.myRow : styles.theirRow]}>
        {isGroup && !isMe ? (
          <Avatar size={34} style={styles.agentAvatar}>
            <Bot size={16} color={colors.tint} />
          </Avatar>
        ) : null}
        <View style={[styles.bubbleWrap, isMe ? styles.myWrap : styles.theirWrap]}>
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: isMe ? colors.tint : colors.surfaceAlt,
                borderTopLeftRadius: radius.lg,
                borderTopRightRadius: radius.lg,
                borderBottomLeftRadius: isMe ? radius.lg : radius.sm,
                borderBottomRightRadius: isMe ? radius.sm : radius.lg,
              },
            ]}
          >
            {isGroup && !isMe ? (
              <Text variant="caption" color={colors.tint} style={{ marginBottom: spacing.xs }}>
                {agentName}
              </Text>
            ) : null}
            <Text variant="body" color={isMe ? colors.surface : colors.text}>
              {item.content || item.text}
            </Text>
            <Text
              variant="caption"
              color={isMe ? colors.surface : colors.textMuted}
              style={{ marginTop: spacing.xs, alignSelf: 'flex-end', opacity: isMe ? 0.7 : 1 }}
            >
              {new Date(item.created_at || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [user, chat, colors, spacing, radius]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
    >
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface, paddingTop: insets.top + spacing.sm }]}> 
        <IconButton onPress={() => router.back()} variant="soft">
          <ArrowLeft color={colors.text} size={20} />
        </IconButton>

        <Pressable
          style={styles.headerInfo}
          onPress={() => router.push({ pathname: '/chats/[id]/info', params: { id, title: title || chat?.title } })}
        >
          <Avatar size={40}>
            <Bot size={18} color={colors.tint} />
          </Avatar>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" numberOfLines={1}>{title || chat?.title || 'Chat'}</Text>
            <Text variant="caption" color={colors.textMuted}>
              {chat?.chat_type === 'group'
                ? `${chat?.participants?.length || 0} members`
                : chat?.is_online ? 'Online' : 'Offline'}
            </Text>
          </View>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.tint} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={[styles.inputArea, { borderTopColor: colors.border, backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.md }]}> 
        <View style={[styles.inputContainer, { backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, borderColor: colors.border }]}> 
          <TextInput
            style={[styles.input, { color: colors.text, fontFamily: typography.fonts.regular }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? colors.tint : colors.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            {sending ? <ActivityIndicator size="small" color={colors.surface} /> : <Send color={colors.surface} size={18} />}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  myRow: {
    justifyContent: 'flex-end',
  },
  theirRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  bubbleWrap: {
    maxWidth: '84%',
  },
  myWrap: {
    alignItems: 'flex-end',
  },
  theirWrap: {
    alignItems: 'flex-start',
  },
  agentAvatar: {
    marginRight: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputArea: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    padding: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
