import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bot, Calendar, Info, MessageSquare, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getChatDetails } from '../../../../api/chats';
import Colors from '../../../../constants/Colors';
import { useTheme } from '../../../../context/ThemeContext';

export default function ChatInfoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

    const [chat, setChat] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChatDetails();
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

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: themeColors.background }]}>
                <ActivityIndicator color={themeColors.tint} />
            </View>
        );
    }

    const isGroup = chat?.chat_type?.toLowerCase() === 'group';

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color={themeColors.text} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: themeColors.text }]}>Details</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={[styles.profileAvatar, { backgroundColor: themeColors.secondary }]}>
                    <Bot size={60} color={themeColors.tint} />
                </View>
                <Text style={[styles.profileName, { color: themeColors.text }]}>{chat?.title || 'Chat'}</Text>
                <Text style={[styles.profileType, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>
                    {isGroup ? 'Group Chat' : 'Personal Agent'}
                </Text>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statItem, { backgroundColor: isDark ? themeColors.secondary : '#FFF', borderColor: isDark ? themeColors.border : themeColors.border }]}>
                    <MessageSquare size={20} color={themeColors.tint} />
                    <Text style={[styles.statValue, { color: themeColors.text }]}>-</Text>
                    <Text style={[styles.statLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Messages</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: isDark ? themeColors.secondary : '#FFF', borderColor: isDark ? themeColors.border : themeColors.border }]}>
                    <Calendar size={20} color={themeColors.tint} />
                    <Text style={[styles.statValue, { color: themeColors.text }]}>
                        {chat?.last_message_at ? new Date(chat.last_message_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}
                    </Text>
                    <Text style={[styles.statLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Activity</Text>
                </View>
            </View>

            <View style={[styles.section, { borderTopColor: isDark ? themeColors.secondary : themeColors.border }]}>
                <View style={styles.sectionHeader}>
                    <Info size={18} color={themeColors.tint} />
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>General Info</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Type:</Text>
                    <Text style={[styles.infoValue, { color: themeColors.text }]}>{isGroup ? 'Public Group' : 'Direct Access'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Created:</Text>
                    <Text style={[styles.infoValue, { color: themeColors.text }]}>
                        {new Date(chat?.created_at || Date.now()).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                </View>
            </View>

            {isGroup && (
                <View style={[styles.section, { borderTopColor: isDark ? themeColors.secondary : themeColors.border }]}>
                    <View style={styles.sectionHeader}>
                        <User size={18} color={themeColors.tint} />
                        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Members ({chat?.participants?.length || 0})</Text>
                    </View>
                    {chat?.participants?.map((p: any) => (
                        <View key={p.id} style={[styles.memberCard, { backgroundColor: isDark ? themeColors.secondary : '#FFF', borderColor: isDark ? themeColors.border : themeColors.border }]}>
                            <View style={[styles.memberAvatar, { backgroundColor: themeColors.secondary }]}>
                                <Bot size={20} color={themeColors.tint} />
                            </View>
                            <View style={styles.memberInfo}>
                                <Text style={[styles.memberName, { color: themeColors.text }]}>{p.agent_name}</Text>
                                <Text style={[styles.memberStatus, { color: p.is_online ? '#4CAF50' : '#FF9800' }]}>
                                    {p.is_online ? 'online' : 'away'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {!isGroup && chat?.participants?.[0] && (
                <View style={[styles.section, { borderTopColor: isDark ? themeColors.secondary : themeColors.border, borderBottomWidth: 0 }]}>
                    <View style={styles.sectionHeader}>
                        <User size={18} color={themeColors.tint} />
                        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Agent Profile</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Gender:</Text>
                        <Text style={[styles.infoValue, { color: themeColors.text }]}>{chat.participants[0].agent_gender}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Role:</Text>
                        <Text style={[styles.infoValue, { color: themeColors.text }]}>Personalized AI Assistant</Text>
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
        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '700',
    },
    profileType: {
        fontSize: 14,
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 20,
        gap: 12,
    },
    statItem: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 2,
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    section: {
        paddingTop: 24,
        marginHorizontal: 20,
        borderTopWidth: 1,
        paddingBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
    },
    infoValue: {
        fontWeight: '600',
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 2,
        marginBottom: 8,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontWeight: '600',
    },
    memberStatus: {
        fontSize: 12,
    },
});
