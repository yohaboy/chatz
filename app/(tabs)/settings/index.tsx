import { Bell, ChevronRight, FileText, HelpCircle, Moon, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';

export default function SettingsScreen() {
    const [darkTheme, setDarkTheme] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        <Bell size={20} color="#546E7A" />
                    </View>
                    <Text style={styles.rowText}>Push Notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#CFD8DC', true: Colors.light.tint }}
                        thumbColor={notifications ? '#FFF' : '#ECEFF1'}
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        <Moon size={20} color="#546E7A" />
                    </View>
                    <Text style={styles.rowText}>Dark Mode</Text>
                    <Switch
                        value={darkTheme}
                        onValueChange={setDarkTheme}
                        trackColor={{ false: '#CFD8DC', true: Colors.light.tint }}
                        thumbColor={darkTheme ? '#FFF' : '#ECEFF1'}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security & Updates</Text>
                <TouchableOpacity style={styles.row}>
                    <View style={styles.iconContainer}>
                        <Shield size={20} color="#546E7A" />
                    </View>
                    <Text style={styles.rowText}>Two-Factor Auth</Text>
                    <ChevronRight size={20} color="#CFD8DC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <View style={styles.iconContainer}>
                        <HelpCircle size={20} color="#546E7A" />
                    </View>
                    <Text style={styles.rowText}>Support Center</Text>
                    <ChevronRight size={20} color="#CFD8DC" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Legal</Text>
                <TouchableOpacity style={styles.row}>
                    <View style={styles.iconContainer}>
                        <FileText size={20} color="#546E7A" />
                    </View>
                    <Text style={styles.rowText}>Privacy Policy</Text>
                    <ChevronRight size={20} color="#CFD8DC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <View style={styles.iconContainer}>
                        <FileText size={20} color="#546E7A" />
                    </View>
                    <Text style={styles.rowText}>Terms of Service</Text>
                    <ChevronRight size={20} color="#CFD8DC" />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.version}>Version 1.0.0 (Building ChatZ...)</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    section: {
        marginTop: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ECEFF1',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        paddingVertical: 12,
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.tint,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#ECEFF1',
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        backgroundColor: Colors.light.secondary,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    footer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    version: {
        fontSize: 12,
        color: '#90A4AE',
    },
});
