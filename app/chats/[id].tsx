import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bot, Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getChatDetails, getMessages, sendMessage } from '../../api/chats';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ChatDetailScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
    const { user } = useAuth();
    const router = useRouter();
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

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

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender_user_id === user?.id || item.is_user_message;
        const isGroup = chat?.chat_type?.toLowerCase() === 'group';

        let agentName = '';
        if (isGroup && !isMe) {
            const participant = chat?.participants?.find((p: any) => p.agent_id === item.sender_agent_id);
            agentName = participant?.agent_name || 'Agent';
        }

        return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                {isGroup && !isMe && (
                    <View style={[styles.senderAvatar, { backgroundColor: themeColors.secondary }]}>
                        <Bot size={16} color={themeColors.tint} />
                    </View>
                )}
                <View style={[styles.messageBubbleContainer, isMe ? styles.myBubbleContainer : styles.theirBubbleContainer]}>
                    {isGroup && !isMe && (
                        <Text style={[styles.senderName, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>{agentName}</Text>
                    )}
                    <View style={[styles.messageBubble, isMe ? styles.myBubble : (isDark ? styles.theirBubbleDark : styles.theirBubble)]}>
                        <Text style={[styles.messageText, isMe ? styles.myMessageText : (isDark ? styles.theirMessageTextDark : styles.theirMessageText)]}>
                            {item.content || item.text}
                        </Text>
                        <Text style={[styles.timestamp, { color: isMe ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }]}>
                            {new Date(item.created_at || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: themeColors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <View style={[styles.header, { backgroundColor: isDark ? themeColors.background : themeColors.tint }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#FFF" size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerInfoContainer}
                    onPress={() => router.push({
                        pathname: '/chats/[id]/info',
                        params: { id, title: title || chat?.title }
                    })}
                >
                    <View style={[styles.headerAvatar, { backgroundColor: isDark ? themeColors.secondary : '#FFF' }]}>
                        <Bot size={20} color={themeColors.tint} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{title || chat?.title || 'Chat'}</Text>
                        <Text style={[styles.headerStatus, { color: isDark ? themeColors.tint : '#E0F2F1' }]}>
                            {chat?.chat_type === 'group'
                                ? `${chat?.participants?.length || 0} members`
                                : chat?.is_online ? 'Online' : 'Offline'
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={themeColors.tint} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
            )}

            <View style={[styles.inputArea, { backgroundColor: isDark ? themeColors.background : '#FFF', borderTopColor: isDark ? themeColors.secondary : themeColors.border }]}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? themeColors.secondary : '#F5F5F5',
                                color: themeColors.text,
                                maxHeight: 100
                            }
                        ]}
                        placeholder="Type a message..."
                        placeholderTextColor={isDark ? '#546E7A' : '#90A4AE'}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: themeColors.tint }, !inputText.trim() && (isDark ? styles.sendButtonDisabledDark : styles.sendButtonDisabled)]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Send color="#FFF" size={20} />
                        )}
                    </TouchableOpacity>
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
        paddingTop: 45,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        marginRight: 10,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    headerStatus: {
        fontSize: 12,
    },
    headerInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    messageList: {
        padding: 16,
        paddingBottom: 24,
    },
    messageRow: {
        marginBottom: 16,
        flexDirection: 'row',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    theirMessageRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        minWidth: 50,
    },
    myBubble: {
        backgroundColor: '#008B8B',
        borderBottomRightRadius: 4,
        alignSelf: 'flex-end',
    },
    theirBubble: {
        backgroundColor: '#E9F0F2',
        borderBottomLeftRadius: 4,
        alignSelf: 'flex-start',
    },
    theirBubbleDark: {
        backgroundColor: '#262626',
        borderBottomLeftRadius: 4,
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    myMessageText: {
        color: '#FFF',
    },
    theirMessageText: {
        color: '#000',
    },
    theirMessageTextDark: {
        color: '#FFFFFF',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputArea: {
        padding: 12,
        borderTopWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingTop: 8,
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#B2DFDB',
    },
    sendButtonDisabledDark: {
        backgroundColor: '#004D40',
        opacity: 0.5,
    },
    senderAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        alignSelf: 'flex-end',
        marginBottom: 4,
    },
    messageBubbleContainer: {
        maxWidth: '95%',
    },
    myBubbleContainer: {
        alignItems: 'flex-end',
    },
    theirBubbleContainer: {
        alignItems: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
        marginBottom: 2,
    },
});
