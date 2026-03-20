import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === 'web') {
            try {
                return await AsyncStorage.getItem(key);
            } catch (e) {
                console.error('AsyncStorage error:', e);
                return null;
            }
        }
        try {
            return await SecureStore.getItemAsync(key);
        } catch (e) {
            console.error('SecureStore error:', e);
            return null;
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        if (Platform.OS === 'web') {
            try {
                await AsyncStorage.setItem(key, value);
            } catch (e) {
                console.error('AsyncStorage set error:', e);
            }
            return;
        }
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (e) {
            console.error('SecureStore set error:', e);
        }
    },

    async deleteItem(key: string): Promise<void> {
        if (Platform.OS === 'web') {
            try {
                await AsyncStorage.removeItem(key);
            } catch (e) {
                console.error('AsyncStorage delete error:', e);
            }
            return;
        }
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (e) {
            console.error('SecureStore delete error:', e);
        }
    }
};
