import { Bell, ChevronRight, FileText, HelpCircle, Moon, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { useTheme } from '../../../context/ThemeContext';

export default function SettingsScreen() {
    const { themeMode, setThemeMode, colorScheme } = useTheme();
    const [notifications, setNotifications] = useState(true);

    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.section, { backgroundColor: isDark ? themeColors.background : '#FFF', borderTopColor: themeColors.border, borderBottomColor: themeColors.border }]}>
                <Text style={[styles.sectionTitle, { color: themeColors.tint }]}>Preferences</Text>
                <View style={[styles.row, { borderTopColor: isDark ? themeColors.border : '#ECEFF1' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.secondary }]}>
                        <Bell size={20} color={isDark ? themeColors.tint : "#546E7A"} />
                    </View>
                    <Text style={[styles.rowText, { color: themeColors.text }]}>Push Notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: isDark ? '#333' : '#CFD8DC', true: themeColors.tint }}
                        thumbColor={notifications ? '#FFF' : '#ECEFF1'}
                    />
                </View>
                <View style={[styles.row, { borderTopColor: isDark ? themeColors.border : '#ECEFF1' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.secondary }]}>
                        <Moon size={20} color={isDark ? themeColors.tint : "#546E7A"} />
                    </View>
                    <Text style={[styles.rowText, { color: themeColors.text }]}>Dark Mode</Text>
                    <Switch
                        value={isDark}
                        onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
                        trackColor={{ false: isDark ? '#333' : '#CFD8DC', true: themeColors.tint }}
                        thumbColor={isDark ? '#FFF' : '#ECEFF1'}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: isDark ? themeColors.background : '#FFF', borderTopColor: themeColors.border, borderBottomColor: themeColors.border }]}>
                <Text style={[styles.sectionTitle, { color: themeColors.tint }]}>Security & Updates</Text>
                <TouchableOpacity style={[styles.row, { borderTopColor: isDark ? themeColors.border : '#ECEFF1' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.secondary }]}>
                        <Shield size={20} color={isDark ? themeColors.tint : "#546E7A"} />
                    </View>
                    <Text style={[styles.rowText, { color: themeColors.text }]}>Two-Factor Auth</Text>
                    <ChevronRight size={20} color={isDark ? themeColors.border : "#CFD8DC"} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.row, { borderTopColor: isDark ? themeColors.border : '#ECEFF1' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.secondary }]}>
                        <HelpCircle size={20} color={isDark ? themeColors.tint : "#546E7A"} />
                    </View>
                    <Text style={[styles.rowText, { color: themeColors.text }]}>Support Center</Text>
                    <ChevronRight size={20} color={isDark ? themeColors.border : "#CFD8DC"} />
                </TouchableOpacity>
            </View>

            <View style={[styles.section, { backgroundColor: isDark ? themeColors.background : '#FFF', borderTopColor: themeColors.border, borderBottomColor: themeColors.border }]}>
                <Text style={[styles.sectionTitle, { color: themeColors.tint }]}>Legal</Text>
                <TouchableOpacity style={[styles.row, { borderTopColor: isDark ? themeColors.border : '#ECEFF1' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.secondary }]}>
                        <FileText size={20} color={isDark ? themeColors.tint : "#546E7A"} />
                    </View>
                    <Text style={[styles.rowText, { color: themeColors.text }]}>Privacy Policy</Text>
                    <ChevronRight size={20} color={isDark ? themeColors.border : "#CFD8DC"} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.row, { borderTopColor: isDark ? themeColors.border : '#ECEFF1' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.secondary }]}>
                        <FileText size={20} color={isDark ? themeColors.tint : "#546E7A"} />
                    </View>
                    <Text style={[styles.rowText, { color: themeColors.text }]}>Terms of Service</Text>
                    <ChevronRight size={20} color={isDark ? themeColors.border : "#CFD8DC"} />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.version, { color: isDark ? themeColors.tabIconDefault : '#90A4AE' }]}>Version 1.0.0 (Building ChatZ...)</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginTop: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        paddingVertical: 12,
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    version: {
        fontSize: 12,
    },
});
