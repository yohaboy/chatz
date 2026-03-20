import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bot, Calendar, Info, MessageSquare, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getChatDetails } from '../../../../api/chats';
import Colors from '../../../../constants/Colors';

export default function ChatInfoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
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
            <View style={styles.center}>
                <ActivityIndicator color={Colors.light.tint} />
            </View>
        );
    }

    const isGroup = chat?.chat_type?.toLowerCase() === 'group';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Details</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                    <Bot size={60} color={Colors.light.tint} />
                </View>
                <Text style={styles.profileName}>{chat?.title || 'Chat'}</Text>
                <Text style={styles.profileType}>
                    {isGroup ? 'Group Chat' : 'Personal Agent'}
                </Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <MessageSquare size={20} color={Colors.light.tint} />
                    <Text style={styles.statValue}>-</Text>
                    <Text style={styles.statLabel}>Messages</Text>
                </View>
                <View style={styles.statItem}>
                    <Calendar size={20} color={Colors.light.tint} />
                    <Text style={styles.statValue}>
                        {new Date(chat?.last_message_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={styles.statLabel}>Activity</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Info size={18} color={Colors.light.tint} />
                    <Text style={styles.sectionTitle}>General Info</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Type:</Text>
                    <Text style={styles.infoValue}>{isGroup ? 'Public Group' : 'Direct Access'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Created:</Text>
                    <Text style={styles.infoValue}>
                        {new Date(chat?.created_at || Date.now()).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                </View>
            </View>

            {isGroup && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <User size={18} color={Colors.light.tint} />
                        <Text style={styles.sectionTitle}>Members ({chat?.participants?.length || 0})</Text>
                    </View>
                    {chat?.participants?.map((p: any) => (
                        <View key={p.id} style={styles.memberCard}>
                            <View style={styles.memberAvatar}>
                                <Bot size={20} color={Colors.light.tint} />
                            </View>
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{p.agent_name}</Text>
                                <Text style={styles.memberStatus}>
                                    {p.is_online ? 'online' : 'away'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {!isGroup && chat?.participants?.[0] && (
                <View style={[styles.section, { borderBottomWidth: 0 }]}>
                    <View style={styles.sectionHeader}>
                        <User size={18} color={Colors.light.tint} />
                        <Text style={styles.sectionTitle}>Agent Profile</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Gender:</Text>
                        <Text style={styles.infoValue}>{chat.participants[0].agent_gender}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Role:</Text>
                        <Text style={styles.infoValue}>Personalized AI Assistant</Text>
                    </View>
                </View>
            )}
        </ScrollView>
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
        backgroundColor: Colors.light.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    profileType: {
        fontSize: 14,
        color: '#546E7A',
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
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: Colors.light.border,
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
        color: '#546E7A',
        marginTop: 2,
    },
    section: {
        paddingTop: 24,
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
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
        color: '#000',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        color: '#546E7A',
    },
    infoValue: {
        fontWeight: '600',
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 2,
        marginBottom: 8,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        backgroundColor: Colors.light.secondary,
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
        color: '#000',
    },
    memberStatus: {
        fontSize: 12,
        color: '#4CAF50',
    },
});
