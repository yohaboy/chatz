import * as Google from 'expo-auth-session/providers/google';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { login } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Info', 'Please enter email and password');
            return;
        }
        try {
            setLoading(true);
            const response = await login({ email, password });
            const { token, user } = response.data;
            await signIn(token, user);
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await promptAsync();
            if (result.type === 'success') {
                const { authentication } = result;
                // Verify token with backend
                // const response = await verifyGoogleToken(authentication.accessToken);
                // signIn(token, user);
                router.replace('/(tabs)');
            }
        } catch (error) {
            Alert.alert('Google Login Failed', 'Could not authenticate with Google');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>CZ</Text>
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                <Input
                    label="Email Address"
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <Input
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.forgotPass}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <Button title="Sign In" onPress={handleLogin} disabled={loading} />

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                    disabled={!request}
                >
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/(auth)/signup" asChild>
                        <TouchableOpacity>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 64,
        height: 64,
        backgroundColor: Colors.light.tint,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginBottom: 16,
    },
    logoText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#546E7A',
        marginTop: 4,
    },
    forgotPass: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotText: {
        color: Colors.light.tint,
        fontWeight: '600',
        fontSize: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ECEFF1',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#90A4AE',
        fontSize: 12,
        fontWeight: '600',
    },
    googleButton: {
        height: 48,
        borderWidth: 1,
        borderColor: '#CFD8DC',
        borderRadius: 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    googleButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#546E7A',
        fontSize: 14,
    },
    signupLink: {
        color: Colors.light.tint,
        fontWeight: '700',
        fontSize: 14,
    },
});
