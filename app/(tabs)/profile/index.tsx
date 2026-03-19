import { ChevronRight, Edit3, LogOut, Shield, User } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <User size={48} color={Colors.light.tint} />
                </View>
                <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
                <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
                <TouchableOpacity style={styles.editBtn}>
                    <Edit3 size={16} color={Colors.light.tint} />
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Details</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Age</Text>
                    <Text style={styles.infoValue}>{user?.age || '25'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Gender</Text>
                    <Text style={styles.infoValue}>{user?.gender || 'Male'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Member Since</Text>
                    <Text style={styles.infoValue}>March 2026</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions</Text>
                <TouchableOpacity style={styles.actionBtn}>
                    <Shield size={20} color="#546E7A" />
                    <Text style={styles.actionBtnText}>Privacy & Security</Text>
                    <ChevronRight size={20} color="#CFD8DC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={handleSignOut}>
                    <LogOut size={20} color="#F44336" />
                    <Text style={[styles.actionBtnText, { color: '#F44336' }]}>Sign Out</Text>
                    <ChevronRight size={20} color="#CFD8DC" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    avatar: {
        width: 90,
        height: 90,
        backgroundColor: Colors.light.secondary,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#90A4AE',
        marginBottom: 20,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.light.tint,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 2,
    },
    editBtnText: {
        fontSize: 14,
        color: Colors.light.tint,
        fontWeight: '600',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ECEFF1',
    },
    infoLabel: {
        fontSize: 16,
        color: '#546E7A',
    },
    infoValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#ECEFF1',
    },
    actionBtnText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
        fontWeight: '500',
    },
});
