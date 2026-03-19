import React from 'react';
import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

interface InputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: ViewStyle;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    secureTextEntry?: boolean;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export function Input(props: InputProps) {
    const { label, error, containerStyle, inputStyle, ...rest } = props;
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.errorInput : styles.normalInput,
                    inputStyle
                ]}
                placeholderTextColor="#90A4AE"
                {...rest}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 2,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#FFFFFF',
    },
    normalInput: {
        borderColor: '#CFD8DC',
    },
    errorInput: {
        borderColor: '#E53935',
    },
    errorText: {
        color: '#E53935',
        fontSize: 12,
        marginTop: 4,
    },
});
