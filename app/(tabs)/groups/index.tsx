import { useRouter } from 'expo-router';
import { ChevronRight, PlusCircle, Shield, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getChats } from '../../../api/chats';
import Colors from '../../../constants/Colors';

export default function GroupsScreen() {
    const [groups, setGroups] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadGroups();
    }, []);

    async function loadGroups() {
        try {
            const response = await getChats();
            // Filter only group chats for this screen
            const groupChats = response.data.filter((c: any) => c.chat_type?.toLowerCase() === 'group');
            setGroups(groupChats);
        } catch (error) {
            // Dummy data for demo
            setGroups([
                { id: '1', title: 'Agent Support', participants: [{}, {}, {}], lastMessage: 'System update finished.', time: '11:00 AM', chat_type: 'group' },
                { id: '2', title: 'Developer Community', participants: [{}, {}, {}], lastMessage: 'Check the new API docs.', time: '9:30 AM', chat_type: 'group' },
            ]);
        }
    }

    const handleGroupPress = (group: any) => {
        router.push({
            pathname: '/(tabs)/chats/[id]',
            params: { id: group.id, title: group.title || group.name }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.createBtn}>
                <PlusCircle color={Colors.light.tint} size={24} />
                <Text style={styles.createBtnText}>Create New Group</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                {groups.map((group: any) => (
                    <TouchableOpacity
                        key={group.id}
                        style={styles.groupCard}
                        onPress={() => handleGroupPress(group)}
                    >
                        <View style={styles.avatar}>
                            <Users color={Colors.light.tint} size={28} />
                        </View>
                        <View style={styles.groupInfo}>
                            <View style={styles.groupHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={styles.groupName}>{group.title || group.name}</Text>
                                    {group.id === '1' && <Shield size={14} color={Colors.light.tint} />}
                                </View>
                                <Text style={styles.groupTime}>{group.time || 'now'}</Text>
                            </View>
                            <Text style={styles.memberCount}>{group.participants?.length || group.members || 0} members</Text>
                            <Text style={styles.lastMessage} numberOfLines={1}>{group.lastMessage || 'No messages yet'}</Text>
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
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        gap: 12,
    },
    createBtnText: {
        fontSize: 16,
        color: Colors.light.tint,
        fontWeight: '600',
    },
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#ECEFF1',
        gap: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        backgroundColor: Colors.light.secondary,
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
        color: '#000',
    },
    groupTime: {
        fontSize: 12,
        color: '#90A4AE',
    },
    memberCount: {
        fontSize: 12,
        color: Colors.light.tint,
        fontWeight: '600',
        marginBottom: 4,
    },
    lastMessage: {
        fontSize: 14,
        color: '#546E7A',
        flex: 1,
    },
});
