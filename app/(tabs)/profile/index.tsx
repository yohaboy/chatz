import { ChevronRight, Edit3, LogOut, Shield, User } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.header, { backgroundColor: isDark ? '#002626' : '#FFF', borderBottomColor: themeColors.border }]}>
                <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
                    <User size={48} color={themeColors.tint} />
                </View>
                <Text style={[styles.name, { color: themeColors.text }]}>{user?.email?.split('@')[0] || 'User'}</Text>
                <Text style={[styles.email, { color: isDark ? '#90A4AE' : '#90A4AE' }]}>{user?.email || 'user@example.com'}</Text>
                <TouchableOpacity style={[styles.editBtn, { borderColor: themeColors.tint }]}>
                    <Edit3 size={16} color={themeColors.tint} />
                    <Text style={[styles.editBtnText, { color: themeColors.tint }]}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Account Details</Text>
                <View style={[styles.infoRow, { borderBottomColor: isDark ? '#003333' : '#ECEFF1' }]}>
                    <Text style={[styles.infoLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Age</Text>
                    <Text style={[styles.infoValue, { color: themeColors.text }]}>{user?.age || '25'}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomColor: isDark ? '#003333' : '#ECEFF1' }]}>
                    <Text style={[styles.infoLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Gender</Text>
                    <Text style={[styles.infoValue, { color: themeColors.text }]}>{user?.gender || 'Male'}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomColor: isDark ? '#003333' : '#ECEFF1' }]}>
                    <Text style={[styles.infoLabel, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>Member Since</Text>
                    <Text style={[styles.infoValue, { color: themeColors.text }]}>March 2026</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Actions</Text>
                <TouchableOpacity style={[styles.actionBtn, { borderBottomColor: isDark ? '#003333' : '#ECEFF1' }]}>
                    <Shield size={20} color={isDark ? themeColors.tint : "#546E7A"} />
                    <Text style={[styles.actionBtnText, { color: themeColors.text }]}>Privacy & Security</Text>
                    <ChevronRight size={20} color={isDark ? themeColors.border : "#CFD8DC"} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { borderBottomColor: isDark ? '#003333' : '#ECEFF1' }]} onPress={handleSignOut}>
                    <LogOut size={20} color="#F44336" />
                    <Text style={[styles.actionBtnText, { color: '#F44336' }]}>Sign Out</Text>
                    <ChevronRight size={20} color={isDark ? themeColors.border : "#CFD8DC"} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 1,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        marginBottom: 20,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 2,
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    infoLabel: {
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    actionBtnText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
});
