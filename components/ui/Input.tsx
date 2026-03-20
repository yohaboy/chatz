import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export function Input(props: InputProps) {
    const { label, error, containerStyle, inputStyle, ...rest } = props;
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const themeColors = isDark ? Colors.dark : Colors.light;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, { color: isDark ? '#B0BEC5' : '#333' }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: isDark ? '#002626' : '#FFFFFF',
                        color: themeColors.text,
                        borderColor: error ? '#E53935' : (isDark ? '#004D40' : '#CFD8DC')
                    },
                    inputStyle
                ]}
                placeholderTextColor={isDark ? '#546E7A' : '#90A4AE'}
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
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 2,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    errorText: {
        color: '#E53935',
        fontSize: 12,
        marginTop: 4,
    },
});
