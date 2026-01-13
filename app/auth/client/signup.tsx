import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Api } from '../../../services/Api';

export default function ClientSignupScreen() {
    const router = useRouter();
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [loading, setLoading] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // OTP State
    const [otp, setOtp] = useState('');

    const handleSendOtp = async () => {
        console.log('[CLIENT-SIGNUP] ===== SEND OTP BUTTON CLICKED =====');
        console.log('[CLIENT-SIGNUP] Full Name:', fullName);
        console.log('[CLIENT-SIGNUP] Email:', email);
        console.log('[CLIENT-SIGNUP] Password length:', password.length);

        if (!fullName || !email || !password) {
            console.log('[CLIENT-SIGNUP] Validation failed - missing fields');
            Alert.alert('❌ Missing Information', 'Please fill in all fields to continue.');
            return;
        }

        console.log('[CLIENT-SIGNUP] Validation passed, calling API...');
        setLoading(true);
        try {
            const response = await Api.client.sendOtp(email);
            console.log('[CLIENT-SIGNUP] API Response:', JSON.stringify(response, null, 2));

            if (response.status === 'success') {
                console.log('[CLIENT-SIGNUP] OTP sent successfully, moving to OTP step');
                setStep('otp');
                Alert.alert(
                    '✅ Success',
                    response.message || 'Verification code sent to your email. Please check your inbox.',
                    [{ text: 'OK' }]
                );
            } else if (response.message && response.message.includes('already registered')) {
                console.log('[CLIENT-SIGNUP] Email already registered');
                Alert.alert('⚠️ Email Already Exists', 'This email is already registered. Please login instead.');
            } else {
                console.log('[CLIENT-SIGNUP] OTP sending failed:', response.message);
                Alert.alert('❌ Error', response.message || 'Failed to send verification code. Please try again.');
            }
        } catch (error: any) {
            console.error('[CLIENT-SIGNUP] Send OTP Unexpected Error:', error);
            console.error('[CLIENT-SIGNUP] Error stack:', error.stack);
            Alert.alert(
                '❌ Connection Error',
                'Unable to connect to server. Please check your internet connection and try again.'
            );
        } finally {
            setLoading(false);
            console.log('[CLIENT-SIGNUP] ===== SEND OTP PROCESS COMPLETE =====');
        }
    };

    const handleVerifyAndRegister = async () => {
        console.log('[CLIENT-SIGNUP] ===== VERIFY AND REGISTER CLICKED =====');
        console.log('[CLIENT-SIGNUP] OTP entered:', otp);

        if (!otp) {
            console.log('[CLIENT-SIGNUP] OTP validation failed - empty OTP');
            Alert.alert('❌ Missing Code', 'Please enter the verification code sent to your email.');
            return;
        }

        const userData = {
            email,
            otp,
            full_name: fullName,
            password
        };

        console.log('[CLIENT-SIGNUP] User data prepared (password hidden):', {
            ...userData,
            password: '***HIDDEN***'
        });

        setLoading(true);
        try {
            console.log('[CLIENT-SIGNUP] Calling register API...');
            const response = await Api.client.signup(userData);
            console.log('[CLIENT-SIGNUP] Register API Response:', JSON.stringify(response, null, 2));

            if (response.status === 'success') {
                console.log('[CLIENT-SIGNUP] Registration successful! Redirecting to profile setup');
                const userId = response.user?.id;
                console.log('[CLIENT-SIGNUP] User ID from response:', userId);
                console.log('[CLIENT-SIGNUP] Full user object:', JSON.stringify(response.user, null, 2));

                if (!userId) {
                    console.error('[CLIENT-SIGNUP] ERROR: No user ID in response!');
                    // Fallback - go to home without profile setup
                    Alert.alert(
                        '🎉 Welcome!',
                        'Your account has been created successfully!',
                        [{ text: 'Continue', onPress: () => router.replace('/home') }]
                    );
                } else {
                    Alert.alert(
                        '🎉 Welcome!',
                        'Your account has been created successfully!',
                        [{
                            text: 'Continue',
                            onPress: () => {
                                console.log('[CLIENT-SIGNUP] Navigating to:', `/profile-setup/client?userId=${userId}`);
                                router.replace(`/profile-setup/client?userId=${userId}`);
                            }
                        }]
                    );
                }
            } else if (response.message && response.message.toLowerCase().includes('invalid')) {
                console.log('[CLIENT-SIGNUP] Invalid OTP');
                Alert.alert('❌ Invalid Code', 'The verification code you entered is incorrect or has expired. Please try again.');
            } else if (response.message && response.message.toLowerCase().includes('already')) {
                console.log('[CLIENT-SIGNUP] Registration failed - duplicate');
                Alert.alert('⚠️ Already Registered', 'This email is already registered. Please login instead.');
            } else {
                console.log('[CLIENT-SIGNUP] Registration failed:', response.message);
                Alert.alert('❌ Registration Failed', response.message || 'Unable to create account. Please try again.');
            }
        } catch (error: any) {
            console.error('[CLIENT-SIGNUP] Register Unexpected Error:', error);
            console.error('[CLIENT-SIGNUP] Error stack:', error?.stack);
            Alert.alert(
                '❌ Connection Error',
                'Unable to connect to server. Please check your internet connection and try again.'
            );
        } finally {
            setLoading(false);
            console.log('[CLIENT-SIGNUP] ===== VERIFY AND REGISTER COMPLETE =====');
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
                                    <Text style={styles.footerText}>Already have an account? </Text>
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
                                        <Text style={styles.signupButtonText}>Verify & Create Account</Text>
                                    )}
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
});
