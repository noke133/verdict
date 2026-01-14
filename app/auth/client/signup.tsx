import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Api } from '../../../services/Api';

export default function ClientSignupScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('❌ Missing Information', 'Please fill in all fields to continue.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('❌ Password Mismatch', 'Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('❌ Weak Password', 'Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            const userData = {
                name: fullName,
                email,
                password,
                role: 'client' // Explicitly set role for client signup
            };

            console.log('[CLIENT-SIGNUP] Calling signup API...', { ...userData, password: '***' });
            // Use Api.auth.signup as per backend refactor
            const response = await Api.auth.signup(userData);
            console.log('[CLIENT-SIGNUP] Response:', response);

            if (response.success) {
                // Store token (handled in Api.ts usually, but let's be sure)
                if (response.data?.token) {
                    await Api.auth.logout(); // Clear any old token
                    // Token storage might need to be explicit if Api.auth.signup doesn't do it automatically like login might not?
                    // Actually Api.auth.verifyOtp did it. Api.auth.signup in Api.ts returns response. 
                    // We should manually set token if the response includes it.
                    const { token, user } = response.data;
                    if (token) {
                        await import('../../../services/Api').then(m => m.TokenManager.setToken(token));
                    }

                    Alert.alert(
                        '🎉 Welcome!',
                        'Your account has been created successfully!',
                        [{
                            text: 'Continue',
                            onPress: () => {
                                if (user?.id) {
                                    router.replace(`/profile-setup/client?userId=${user.id}`);
                                } else {
                                    router.replace('/home');
                                }
                            }
                        }]
                    );
                } else {
                    // Should not happen if success is true based on backend
                    router.replace('/auth/client/login');
                }
            } else {
                Alert.alert('❌ Registration Failed', response.message || 'Unable to create account.');
            }
        } catch (error: any) {
            console.error('[CLIENT-SIGNUP] Error:', error);
            Alert.alert('❌ Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: 'apple' | 'google') => {
        Alert.alert('Coming Soon', `${provider === 'apple' ? 'Apple' : 'Google'} Sign-In will be available soon.`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.headerBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join Verdict to find the right legal help</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#94A3B8"
                                autoCapitalize="words"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
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
                                placeholder="Create a password"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <Text style={styles.signupButtonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('apple')}>
                                <Ionicons name="logo-apple" size={24} color="black" />
                                <Text style={styles.socialButtonText}>Continue with Apple</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('google')}>
                                <Ionicons name="logo-google" size={24} color="black" />
                                <Text style={styles.socialButtonText}>Continue with Google</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.linkText}>Sign In</Text>
                            </TouchableOpacity>
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
    headerBar: {
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: Layout.spacing.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        padding: Layout.spacing.xl,
        justifyContent: 'center',
    },
    header: {
        marginBottom: Layout.spacing.xxl,
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
    signupButton: {
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
    signupButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Layout.spacing.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        marginHorizontal: Layout.spacing.md,
        color: '#94A3B8',
        fontWeight: '600',
    },
    socialContainer: {
        gap: Layout.spacing.md,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: Layout.borderRadius.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
        backgroundColor: Colors.white,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
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
