import { useRouter } from 'expo-router';
import { ChevronRight, Shield, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getChats } from '../../../api/chats';
import { Avatar } from '../../../components/ui/Avatar';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Screen } from '../../../components/ui/Screen';
import { Surface } from '../../../components/ui/Surface';
import { Text } from '../../../components/ui/Text';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function GroupsScreen() {
  const [groups, setGroups] = useState<any[]>([]);
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

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
      params: { id: group.id, title: group.title || group.name },
    });
  };

  return (
    <Screen scroll>
      <PageHeader title="Groups" subtitle="Shared spaces with your agents" />

      <Surface style={{ marginTop: spacing.xl }} padded={false}>
        {groups.map((group: any, index: number) => {
          const isLast = index === groups.length - 1;
          return (
            <Pressable
              key={group.id}
              onPress={() => handleGroupPress(group)}
              style={({ pressed }) => [
                styles.row,
                {
                  borderBottomColor: isLast ? 'transparent' : colors.border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <Avatar size={56}>
                <Users size={22} color={colors.tint} />
              </Avatar>
              <View style={styles.info}>
                <View style={styles.header}>
                  <View style={styles.titleRow}>
                    <Text variant="bodyStrong">{group.title || group.name}</Text>
                    {group.id === '1' ? <Shield size={14} color={colors.tint} /> : null}
                  </View>
                  <Text variant="caption" color={colors.textMuted}>{group.time || 'now'}</Text>
                </View>
                <Text variant="label" color={colors.textMuted}>
                  {group.participants?.length || group.members || 0} members
                </Text>
                <Text variant="label" color={colors.textMuted} numberOfLines={1}>
                  {group.lastMessage || 'No messages yet'}
                </Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
