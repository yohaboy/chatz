import { useRouter } from 'expo-router';
import { ChevronRight, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getChats } from '../../../api/chats';
import Colors from '../../../constants/Colors';
import { useTheme } from '../../../context/ThemeContext';

export default function ChatsScreen() {
    const [chats, setChats] = useState<any[]>([]);
    const router = useRouter();
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

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
            pathname: '/(tabs)/chats/[id]',
            params: { id: chat.id, title: chat.title || chat.name }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                {chats.map((chat: any) => (
                    <TouchableOpacity
                        key={chat.id}
                        style={[styles.chatCard, { backgroundColor: isDark ? themeColors.background : '#FFF', borderBottomColor: isDark ? themeColors.border : '#ECEFF1' }]}
                        onPress={() => handleChatPress(chat)}
                    >
                        <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
                            <User color={themeColors.tint} size={28} />
                        </View>
                        <View style={styles.chatInfo}>
                            <View style={styles.chatHeader}>
                                <Text style={[styles.chatName, { color: themeColors.text }]}>{chat.title || chat.name || 'Agent'}</Text>
                                <Text style={[styles.chatTime, { color: isDark ? themeColors.tabIconDefault : '#90A4AE' }]}>{chat.time}</Text>
                            </View>
                            <View style={styles.chatFooter}>
                                <Text style={[styles.lastMessage, { color: isDark ? '#B0BEC5' : '#546E7A' }]} numberOfLines={1}>{chat.lastMessage}</Text>
                                {chat.unread > 0 && (
                                    <View style={[styles.unreadBadge, { backgroundColor: themeColors.tint }]}>
                                        <Text style={styles.unreadText}>{chat.unread}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <ChevronRight color={isDark ? themeColors.border : "#CFD8DC"} size={20} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingVertical: 10,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        gap: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatInfo: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatName: {
        fontSize: 16,
        fontWeight: '700',
    },
    chatTime: {
        fontSize: 12,
    },
    lastMessage: {
        fontSize: 14,
        flex: 1,
        marginRight: 8,
    },
    unreadBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 0,
        minWidth: 20,
        alignItems: 'center',
    },
    unreadText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
