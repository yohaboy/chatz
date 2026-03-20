import { useRouter } from 'expo-router';
import { ChevronRight, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getChats } from '../../../api/chats';
import Colors from '../../../constants/Colors';

export default function ChatsScreen() {
    const [chats, setChats] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadChats();
    }, []);

    async function loadChats() {
        try {
            const response = await getChats();
            // Filter only personal chats for this screen
            const personalChats = (response.data || []).filter((c: any) => c.chat_type?.toLowerCase() === 'personal');
            setChats(personalChats);
        } catch (error) {
            // Dummy data for demo
            setChats([
                { id: '1', name: 'Zia Chat', lastMessage: 'How are you today?', time: '10:45 AM', unread: 2, chat_type: 'personal' },
                { id: '2', name: 'Alex Bot', lastMessage: 'I understand.', time: 'Yesterday', unread: 0, chat_type: 'personal' },
            ]);
        }
    }

    const handleChatPress = (chat: any) => {
        router.push({
            pathname: '/(tabs)/chats/[id]',
            params: { id: chat.id, title: chat.name }
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {chats.map((chat: any) => (
                    <TouchableOpacity
                        key={chat.id}
                        style={styles.chatCard}
                        onPress={() => handleChatPress(chat)}
                    >
                        <View style={styles.avatar}>
                            <User color={Colors.light.tint} size={28} />
                        </View>
                        <View style={styles.chatInfo}>
                            <View style={styles.chatHeader}>
                                <Text style={styles.chatName}>{chat.name}</Text>
                                <Text style={styles.chatTime}>{chat.time}</Text>
                            </View>
                            <View style={styles.chatFooter}>
                                <Text style={styles.lastMessage} numberOfLines={1}>{chat.lastMessage}</Text>
                                {chat.unread > 0 && (
                                    <View style={styles.unreadBadge}>
                                        <Text style={styles.unreadText}>{chat.unread}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <ChevronRight color="#CFD8DC" size={20} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        paddingVertical: 10,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#ECEFF1',
        gap: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        backgroundColor: Colors.light.secondary,
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
        color: '#000',
    },
    chatTime: {
        fontSize: 12,
        color: '#90A4AE',
    },
    lastMessage: {
        fontSize: 14,
        color: '#546E7A',
        flex: 1,
        marginRight: 8,
    },
    unreadBadge: {
        backgroundColor: Colors.light.tint,
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
