import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Api } from '../../../services/Api';

export default function AttorneySignupScreen() {
    const router = useRouter();
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [loading, setLoading] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [license, setLicense] = useState('');

    // OTP State
    const [otp, setOtp] = useState('');
    const [resendCountdown, setResendCountdown] = useState(0);

    const [userId, setUserId] = useState<string | null>(null);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const handleSendOtp = async () => {
        console.log('[ATTORNEY-SIGNUP] ===== SEND OTP BUTTON CLICKED =====');

        if (!fullName || !email || !password || !license) {
            console.log('[ATTORNEY-SIGNUP] Validation failed - missing fields');
            Alert.alert('❌ Missing Information', 'Please fill in all fields including your license number.');
            return;
        }

        console.log('[ATTORNEY-SIGNUP] Validation passed, calling Register API...');
        setLoading(true);
        try {
            // Updated to use registerAndSendOtp which calls signup.php
            const response = await Api.attorney.registerAndSendOtp({
                name: fullName,
                email,
                password,
                license
            });
            console.log('[ATTORNEY-SIGNUP] API Response:', JSON.stringify(response, null, 2));

            if (response.success) {
                console.log('[ATTORNEY-SIGNUP] User registered & OTP sent, moving to OTP step');
                setResendCountdown(30); // Start 30-second countdown
                setStep('otp');
                Alert.alert(
                    '✅ Success',
                    response.message || 'Verification code sent. Please check your email.',
                    [{ text: 'OK' }]
                );
            } else if (response.message && response.message.includes('already registered')) {
                console.log('[ATTORNEY-SIGNUP] Email already registered');
                Alert.alert('⚠️ Email Already Exists', 'This email is already registered. Please login instead.');
            } else {
                console.log('[ATTORNEY-SIGNUP] Registration failed:', response.message);
                Alert.alert('❌ Error', response.message || 'Failed to register. Please try again.');
            }
        } catch (error: any) {
            console.error('[ATTORNEY-SIGNUP] Error:', error);
            Alert.alert('❌ Connection Error', 'Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async () => {
        console.log('[ATTORNEY-SIGNUP] ===== VERIFY CLICKED =====');

        if (!otp) {
            Alert.alert('❌ Missing Code', 'Please enter the verification code.');
            return;
        }

        setLoading(true);
        try {
            // Updated to use verifyOtp which calls verify_otp.php
            const response = await Api.attorney.verifyOtp(email, otp);
            console.log('[ATTORNEY-SIGNUP] Verify API Response:', JSON.stringify(response, null, 2));

            if (response.success) {
                console.log('[ATTORNEY-SIGNUP] Verification successful!');
                // Auto-navigate to profile setup
                router.replace(`/profile-setup/attorney?userId=${userId}`);
            } else {
                Alert.alert('❌ Invalid Code', response.message || 'Verification failed.');
            }
        } catch (error: any) {
            console.error('[ATTORNEY-SIGNUP] Error:', error);
            Alert.alert('❌ Connection Error', 'Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        console.log('[ATTORNEY-SIGNUP] ===== RESEND OTP CLICKED =====');
        setLoading(true);
        try {
            const response = await Api.attorney.resendOtp(email);
            console.log('[ATTORNEY-SIGNUP] Resend OTP Response:', JSON.stringify(response, null, 2));

            if (response.success) {
                setResendCountdown(30); // Reset countdown
                Alert.alert('✅ Code Sent', response.message || 'A new verification code has been sent to your email.');
            } else {
                Alert.alert('❌ Error', response.message || 'Failed to resend code.');
            }
        } catch (error: any) {
            console.error('[ATTORNEY-SIGNUP] Resend error:', error);
            Alert.alert('❌ Connection Error', 'Unable to resend code.');
        } finally {
            setLoading(false);
        }
    };


    const debugConnection = async () => {
        setLoading(true);
        try {
            // 1. Check Google (Internet)
            console.log('Checking Internet...');
            try {
                await fetch('https://google.com');
                Alert.alert('✅ Internet OK', 'Connected to internet');
            } catch (e) {
                Alert.alert('❌ Internet Fail', 'No internet connection');
                setLoading(false);
                return;
            }

            // 2. Check Backend
            console.log('Checking Backend...');
            const backendUrl = 'https://slategray-cat-464882.hostingersite.com/backend_php/test_api.php';
            try {
                const response = await fetch(backendUrl);
                const text = await response.text();
                Alert.alert('Backend Status', `Code: ${response.status}\nBody: ${text.substring(0, 100)}`);
            } catch (e: any) {
                Alert.alert('❌ Backend Fail', e.message);
            }

        } catch (e) {
            Alert.alert('Error', 'Unknown error');
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
                <View style={styles.headerBar}>
                    <TouchableOpacity onPress={() => step === 'otp' ? setStep('details') : router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {step === 'details' ? (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>Attorney Application</Text>
                                <Text style={styles.subtitle}>Join our network of legal professionals</Text>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Jane Doe, Esq."
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
                                        placeholder="attorney@lawfirm.com"
                                        placeholderTextColor="#94A3B8"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>State Bar / License Number</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. 12345678"
                                        placeholderTextColor="#94A3B8"
                                        autoCapitalize="characters"
                                        value={license}
                                        onChangeText={setLicense}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Create a secure password"
                                        placeholderTextColor="#94A3B8"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={{ padding: 10, alignItems: 'center', backgroundColor: '#eee', borderRadius: 8 }}
                                    onPress={debugConnection}
                                >
                                    <Text>Debug Connection (Tap if stuck)</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.signupButton}
                                    onPress={handleSendOtp}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={Colors.white} />
                                    ) : (
                                        <Text style={styles.signupButtonText}>Next</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Already a member? </Text>
                                    <TouchableOpacity onPress={() => router.back()}>
                                        <Text style={styles.linkText}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>Check your Email</Text>
                                <Text style={styles.subtitle}>We sent a verification code to {email}</Text>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Verification Code</Text>
                                    <TextInput
                                        style={[styles.input, { textAlign: 'center', letterSpacing: 8, fontSize: 24 }]}
                                        placeholder="000000"
                                        placeholderTextColor="#94A3B8"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        value={otp}
                                        onChangeText={setOtp}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.signupButton}
                                    onPress={handleVerifyAndRegister}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={Colors.white} />
                                    ) : (
                                        <Text style={styles.signupButtonText}>Verify & Submit</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.resendButton, resendCountdown > 0 && styles.resendButtonDisabled]}
                                    onPress={handleResendOtp}
                                    disabled={loading || resendCountdown > 0}
                                >
                                    <Text style={styles.resendButtonText}>
                                        {resendCountdown > 0
                                            ? `Resend Code (${resendCountdown}s)`
                                            : 'Resend Code'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.footer} onPress={() => setStep('details')}>
                                    <Text style={styles.linkText}>Change Email</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
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
    resendButton: {
        padding: 14,
        alignItems: 'center',
        marginTop: 12,
        borderRadius: Layout.borderRadius.lg,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    resendButtonDisabled: {
        opacity: 0.5,
        borderColor: '#94A3B8',
    },
    resendButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});
