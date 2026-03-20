import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
    onPress: () => void;
    title: string;
    outline?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export function Button({ onPress, title, outline, style, textStyle, disabled }: ButtonProps) {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                outline
                    ? { backgroundColor: 'transparent', borderColor: themeColors.tint }
                    : { backgroundColor: themeColors.tint, borderColor: themeColors.tint },
                disabled && (isDark ? styles.disabledButtonDark : styles.disabledButton),
                style
            ]}
        >
            <Text style={[
                styles.text,
                outline ? { color: themeColors.tint } : { color: '#FFFFFF' },
                textStyle
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        borderWidth: 1,
        marginVertical: 10,
        width: '100%',
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
        borderColor: '#E0E0E0',
        opacity: 0.6,
    },
    disabledButtonDark: {
        backgroundColor: '#333',
        borderColor: '#333',
        opacity: 0.6,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
});
