import { useRouter } from 'expo-router';
import { ChevronRight, Shield, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getChats } from '../../../api/chats';
import Colors from '../../../constants/Colors';
import { useTheme } from '../../../context/ThemeContext';

export default function GroupsScreen() {
    const [groups, setGroups] = useState<any[]>([]);
    const router = useRouter();
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

    useEffect(() => {
        loadGroups();
    }, []);

    async function loadGroups() {
        try {
            const response = await getChats();
            const groupChats = (response.data || []).filter((c: any) => c.chat_type?.toLowerCase() === 'group');
            setGroups(groupChats);
        } catch (error) {
            setGroups([
                { id: '1', title: 'Agent Support', participants: [{}, {}, {}], lastMessage: 'System update finished.', time: '11:00 AM', chat_type: 'group' },
                { id: '2', title: 'Developer Community', participants: [{}, {}, {}], lastMessage: 'Check the new API docs.', time: '9:30 AM', chat_type: 'group' },
            ]);
        }
    }

    const handleGroupPress = (group: any) => {
        router.push({
            pathname: '/chats/[id]',
            params: { id: group.id, title: group.title || group.name }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                {groups.map((group: any) => (
                    <TouchableOpacity
                        key={group.id}
                        style={[styles.groupCard, { backgroundColor: isDark ? themeColors.background : '#FFF', borderBottomColor: isDark ? themeColors.border : '#ECEFF1' }]}
                        onPress={() => handleGroupPress(group)}
                    >
                        <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
                            <Users color={themeColors.tint} size={28} />
                        </View>
                        <View style={styles.groupInfo}>
                            <View style={styles.groupHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={[styles.groupName, { color: themeColors.text }]}>{group.title || group.name}</Text>
                                    {group.id === '1' && <Shield size={14} color={themeColors.tint} />}
                                </View>
                                <Text style={[styles.groupTime, { color: isDark ? themeColors.tabIconDefault : '#90A4AE' }]}>{group.time || 'now'}</Text>
                            </View>
                            <Text style={[styles.memberCount, { color: themeColors.tint }]}>{group.participants?.length || group.members || 0} members</Text>
                            <Text style={[styles.lastMessage, { color: isDark ? '#B0BEC5' : '#546E7A' }]} numberOfLines={1}>{group.lastMessage || 'No messages yet'}</Text>
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
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        gap: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupInfo: {
        flex: 1,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    groupName: {
        fontSize: 16,
        fontWeight: '700',
    },
    groupTime: {
        fontSize: 12,
    },
    memberCount: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    lastMessage: {
        fontSize: 14,
        flex: 1,
    },
});
