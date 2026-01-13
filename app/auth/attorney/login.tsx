import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image, ScrollView, Alert } from 'react-native';
import { Api } from '../../../services/Api';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function AttorneyLoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const response = await Api.attorney.login(email, password);
            if (response.status === 'success') {
                // Navigate to dashboard or whatever the post-login screen is
                // Based on User Request: "then go to profile setup page" was for signup.
                // For login, usually dashboard. But if unverified, logic in PHP handles it.
                router.replace('/attorney/dashboard');
            } else {
                Alert.alert('Login Failed', response.message || 'Invalid credentials');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Image
                                source={require('../../../assets/images/splash-logo.jpg')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.title}>Attorney Login</Text>
                            <Text style={styles.subtitle}>Access your practice dashboard</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="attorney@lawfirm.com"
                                    placeholderTextColor="#94A3B8"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text style={styles.loginButtonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>New to Verdict? </Text>
                                <TouchableOpacity onPress={() => router.push('/auth/attorney/signup')}>
                                    <Text style={styles.linkText}>Apply to Join</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    backButton: {
        padding: Layout.spacing.lg,
        alignSelf: 'flex-start',
    },
    content: {
        flex: 1,
        padding: Layout.spacing.xl,
        justifyContent: 'center',
        paddingTop: Layout.spacing.md,
    },
    header: {
        marginBottom: Layout.spacing.xxl,
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: Layout.spacing.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: Layout.spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
    },
    form: {
        gap: Layout.spacing.xl,
    },
    inputContainer: {
        gap: Layout.spacing.xs,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: Layout.borderRadius.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        fontSize: 16,
        color: Colors.primary,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: Layout.borderRadius.xl,
        alignItems: 'center',
        marginTop: Layout.spacing.md,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Layout.spacing.lg,
        marginBottom: Layout.spacing.xl,
    },
    footerText: {
        color: '#64748B',
        fontSize: 15,
    },
    linkText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
});
