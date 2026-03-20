import { useRouter } from 'expo-router';
import { Check, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAgentTemplates } from '../../api/agents';
import { register } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);

    // Form State
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        age: '',
        gender: 'male' as 'male' | 'female',
    });

    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    const [agentCustomization, setAgentCustomization] = useState({
        name: '',
        age: '',
        personality: 'romantic' as 'romantic' | 'friend' | 'emotional',
    });

    useEffect(() => {
        if (step === 1) {
            loadTemplates();
        }
    }, [step]);

    async function loadTemplates() {
        try {
            setLoading(true);
            const response = await getAgentTemplates();
            setTemplates(response.data);
        } catch (error) {
            // For demo purposes if API doesn't exist yet, we'll use fallback
            setTemplates([
                { id: '1', name: 'Alpha Agent', description: 'A reliable assistant' },
                { id: '2', name: 'Beta Bot', description: 'A funny companion' },
                { id: '3', name: 'Gamma Guide', description: 'Helpful and wise' },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (step === 0) {
            if (!userInfo.email || !userInfo.password || !userInfo.age) {
                Alert.alert('Missing Info', 'Please fill all fields');
                return;
            }
            setStep(1);
        } else if (step === 1) {
            if (!selectedTemplate) {
                Alert.alert('Selection Required', 'Please select an agent template');
                return;
            }
            // Initialize agent name from template
            setAgentCustomization({
                ...agentCustomization,
                name: selectedTemplate.name,
            });
            setStep(2);
        } else if (step === 2) {
            if (!agentCustomization.name || !agentCustomization.age) {
                Alert.alert('Missing Info', 'Please fill agent details');
                return;
            }
            handleFinish();
        }
    };

    const handleFinish = async () => {
        try {
            setLoading(true);
            const signupData = {
                ...userInfo,
                agent: {
                    templateId: selectedTemplate.id,
                    ...agentCustomization,
                    age: parseInt(agentCustomization.age),
                },
            };

            const response = await register(signupData);
            const { access_token } = response.data;
            if (access_token) {
                await signIn(access_token);
                router.replace('/(tabs)');
            } else {
                throw new Error('No access token received');
            }
        } catch (error) {
            Alert.alert('Signup Failed', 'Something went wrong. Please try again.');
            // router.replace('/(tabs)'); // Fallback for demo
        } finally {
            setLoading(false);
        }
    };

    const renderStep0User = () => (
        <View>
            <Text style={styles.stepTitle}>Create Profile</Text>
            <Input
                label="Email"
                placeholder="Enter your email"
                value={userInfo.email}
                onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <Input
                label="Password"
                placeholder="Choose a password"
                value={userInfo.password}
                onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
                secureTextEntry
            />
            <View style={{ flexDirection: 'row', gap: 15 }}>
                <Input
                    label="Age"
                    placeholder="Years"
                    value={userInfo.age}
                    onChangeText={(text) => setUserInfo({ ...userInfo, age: text })}
                    keyboardType="numeric"
                    containerStyle={{ flex: 1 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity
                            style={[styles.genderBox, userInfo.gender === 'male' && styles.genderActive]}
                            onPress={() => setUserInfo({ ...userInfo, gender: 'male' })}
                        >
                            <Text style={[styles.genderText, userInfo.gender === 'male' && styles.genderTextActive]}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.genderBox, userInfo.gender === 'female' && styles.genderActive]}
                            onPress={() => setUserInfo({ ...userInfo, gender: 'female' })}
                        >
                            <Text style={[styles.genderText, userInfo.gender === 'female' && styles.genderTextActive]}>Female</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderStep1Template = () => (
        <View>
            <Text style={styles.stepTitle}>Select AI Template</Text>
            <Text style={styles.stepSub}>Choose a base persona for your agent</Text>
            <ScrollView contentContainerStyle={styles.templateList}>
                {templates.map((t: any) => (
                    <TouchableOpacity
                        key={t.id}
                        style={[styles.templateCard, selectedTemplate?.id === t.id && styles.templateCardActive]}
                        onPress={() => setSelectedTemplate(t)}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={styles.templateName}>{t.name}</Text>
                            <Text style={styles.templateDesc}>{t.description}</Text>
                        </View>
                        {selectedTemplate?.id === t.id && <Check size={20} color={Colors.light.tint} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderStep2Agent = () => (
        <View>
            <Text style={styles.stepTitle}>Customize Agent</Text>
            <Input
                label="Agent Name"
                placeholder="Agent's name"
                value={agentCustomization.name}
                onChangeText={(text) => setAgentCustomization({ ...agentCustomization, name: text })}
            />
            <Input
                label="Agent Age"
                placeholder="Agent's age"
                value={agentCustomization.age}
                onChangeText={(text) => setAgentCustomization({ ...agentCustomization, age: text })}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Personality</Text>
            <View style={styles.personalityGrid}>
                {(['romantic', 'friend', 'emotional'] as const).map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[styles.pBox, agentCustomization.personality === p && styles.pBoxActive]}
                        onPress={() => setAgentCustomization({ ...agentCustomization, personality: p })}
                    >
                        <Text style={[styles.pText, agentCustomization.personality === p && styles.pTextActive]}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {step > 0 && (
                    <TouchableOpacity onPress={() => setStep(step - 1)}>
                        <ChevronLeft color="#000" />
                    </TouchableOpacity>
                )}
                <View style={styles.progressBar}>
                    <View style={[styles.progressIndicator, { width: `${((step + 1) / 3) * 100}%` }]} />
                </View>
                <Text style={styles.stepIndicator}>{step + 1}/3</Text>
            </View>

            <ScrollView style={styles.content}>
                {step === 0 && renderStep0User()}
                {step === 1 && renderStep1Template()}
                {step === 2 && renderStep2Agent()}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={step === 2 ? "Finish" : "Continue"}
                    onPress={handleNext}
                    disabled={loading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#E0F2F1',
        borderRadius: 0,
        overflow: 'hidden',
    },
    progressIndicator: {
        height: '100%',
        backgroundColor: Colors.light.tint,
    },
    stepIndicator: {
        fontSize: 14,
        fontWeight: '600',
        color: '#90A4AE',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 10,
    },
    stepSub: {
        fontSize: 16,
        color: '#546E7A',
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
        marginTop: 10,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 10,
        height: 48,
    },
    genderBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CFD8DC',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderActive: {
        borderColor: Colors.light.tint,
        backgroundColor: Colors.light.secondary,
    },
    genderText: {
        color: '#546E7A',
    },
    genderTextActive: {
        color: Colors.light.tint,
        fontWeight: '600',
    },
    templateList: {
        gap: 12,
    },
    templateCard: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#CFD8DC',
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    templateCardActive: {
        borderColor: Colors.light.tint,
        backgroundColor: Colors.light.secondary,
    },
    templateName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    templateDesc: {
        fontSize: 14,
        color: '#546E7A',
        marginTop: 4,
    },
    personalityGrid: {
        gap: 12,
    },
    pBox: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#CFD8DC',
        borderRadius: 2,
        alignItems: 'center',
    },
    pBoxActive: {
        borderColor: Colors.light.tint,
        backgroundColor: Colors.light.secondary,
    },
    pText: {
        fontSize: 16,
        color: '#546E7A',
    },
    pTextActive: {
        color: Colors.light.tint,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ECEFF1',
    },
});
