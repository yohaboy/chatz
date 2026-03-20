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
import { getChatDetails, getMessages, sendMessage } from '../../../api/chats';
import Colors from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';

export default function ChatDetailScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
    const { user } = useAuth();
    const router = useRouter();
    const [chat, setChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadChatDetails();
        loadMessages();
        // Optional: Poll for new messages every 5 seconds since we don't have WebSocket here yet
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
            // Backend returns messages in descending order (newest first)
            // Reverse them to show newest at bottom of FlatList
            const messages = response.data.messages || [];
            setMessages([...messages].reverse());
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
            await loadMessages(); // Reload messages after sending
        } catch (error) {
            console.error('Failed to send message', error);
            // Optionally restore input text or show alert
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender_user_id === user?.id || item.is_user_message;
        const isGroup = chat?.chat_type?.toLowerCase() === 'group';

        // Find agent info if it's not me in a group chat
        let agentName = '';
        if (isGroup && !isMe) {
            const participant = chat?.participants?.find((p: any) => p.agent_id === item.sender_agent_id);
            agentName = participant?.agent_name || 'Agent';
        }

        return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                {isGroup && !isMe && (
                    <View style={styles.senderAvatar}>
                        <Bot size={16} color={Colors.light.tint} />
                    </View>
                )}
                <View style={[styles.messageBubbleContainer, isMe ? styles.myBubbleContainer : styles.theirBubbleContainer]}>
                    {isGroup && !isMe && (
                        <Text style={styles.senderName}>{agentName}</Text>
                    )}
                    <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
                        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                            {item.content || item.text}
                        </Text>
                        <Text style={styles.timestamp}>
                            {new Date(item.created_at || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#FFF" size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerInfoContainer}
                    onPress={() => router.push({
                        pathname: '/(tabs)/chats/[id]/info',
                        params: { id, title: title || chat?.title }
                    })}
                >
                    <View style={styles.headerAvatar}>
                        <Bot size={20} color={Colors.light.tint} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{title || chat?.title || 'Chat'}</Text>
                        <Text style={styles.headerStatus}>
                            {chat?.chat_type === 'group'
                                ? `${chat?.participants?.length || 0} members`
                                : chat?.is_online ? 'Online' : 'Offline'
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Message List */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={Colors.light.tint} />
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

            {/* Input Area */}
            <View style={styles.inputArea}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { maxHeight: 100 }]}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
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
        backgroundColor: Colors.light.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.tint,
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
        color: '#E0F2F1', // Light shade for the status
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
        backgroundColor: '#FFF',
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
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
    },
    myBubble: {
        backgroundColor: Colors.light.tint,
        borderBottomRightRadius: 2,
    },
    theirBubble: {
        backgroundColor: Colors.light.secondary,
        borderBottomLeftRadius: 2,
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
    timestamp: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.4)',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputArea: {
        padding: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingTop: 8,
        fontSize: 16,
        color: '#000',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.light.tint,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#B2DFDB',
    },
    senderAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.light.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        alignSelf: 'flex-end',
        marginBottom: 4,
    },
    messageBubbleContainer: {
        maxWidth: '80%',
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
        color: '#546E7A',
        marginLeft: 4,
        marginBottom: 2,
    },
});
