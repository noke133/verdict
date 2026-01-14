import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Api } from '../../../services/Api';

export default function AttorneySignupScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        console.log('[ATTORNEY-SIGNUP] ===== SIGNUP BUTTON CLICKED =====');

        if (!email || !password || !confirmPassword) {
            Alert.alert('❌ Missing Information', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('❌ Password Mismatch', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            // Using generic signup with attorney role. 
            // Sending email part as name since user requested to remove name field.
            const response = await Api.auth.signup({
                name: email.split('@')[0],
                email,
                password,
                role: 'attorney'
            });
            console.log('[ATTORNEY-SIGNUP] API Response:', JSON.stringify(response, null, 2));

            if (response.success) {
                console.log('[ATTORNEY-SIGNUP] Registration successful');
                // Navigate to profile setup
                router.replace('/profile-setup/attorney');
            } else if (response.message && response.message.includes('already registered')) {
                Alert.alert('⚠️ Email Already Exists', 'This email is already registered. Please login instead.');
            } else {
                Alert.alert('❌ Error', response.message || 'Failed to register. Please try again.');
            }
        } catch (error: any) {
            console.error('[ATTORNEY-SIGNUP] Error:', error);
            Alert.alert('❌ Connection Error', 'Unable to connect to server.');
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Attorney Signup</Text>
                        <Text style={styles.subtitle}>Create your professional account</Text>
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
                                placeholder="Create a secure password"
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
                                <Text style={styles.signupButtonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already a member? </Text>
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
