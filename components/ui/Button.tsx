import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';

interface ButtonProps {
    onPress: () => void;
    title: string;
    outline?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export function Button({ onPress, title, outline, style, textStyle, disabled }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                outline ? styles.outlineButton : styles.primaryButton,
                disabled && styles.disabledButton,
                style
            ]}
        >
            <Text style={[
                styles.text,
                outline ? styles.outlineText : styles.primaryText,
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
        borderRadius: 2, // Slightly rounded but feels square
        borderWidth: 1,
        marginVertical: 10,
        width: '100%',
    },
    primaryButton: {
        backgroundColor: Colors.light.tint,
        borderColor: Colors.light.tint,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderColor: Colors.light.tint,
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
        borderColor: '#E0E0E0',
        opacity: 0.6,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
    primaryText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: Colors.light.tint,
    },
});
