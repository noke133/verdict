import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Api } from '../../services/Api';

export default function ClientProfileSetup() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const userId = params.userId as string;

    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');

    const handleCompleteProfile = async () => {
        console.log('[PROFILE-SETUP] Completing client profile...');

        if (!phone || !city) {
            Alert.alert('❌ Missing Information', 'Please fill in phone number and city.');
            return;
        }

        setLoading(true);
        try {
            const profileData = {
                user_id: parseInt(userId),
                phone,
                city,
                bio: bio || null
            };

            const response = await Api.client.updateProfile(profileData);
            console.log('[PROFILE-SETUP] Response:', response);

            if (response.status === 'success') {
                Alert.alert(
                    '🎉 Profile Complete!',
                    'Your profile has been set up successfully!',
                    [{ text: 'Get Started', onPress: () => router.replace('/home') }]
                );
            } else {
                Alert.alert('❌ Error', response.message || 'Failed to update profile.');
            }
        } catch (error: any) {
            console.error('[PROFILE-SETUP] Error:', error);
            Alert.alert('❌ Connection Error', 'Unable to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        Alert.alert(
            'Skip Profile Setup?',
            'You can complete your profile later from settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Skip', onPress: () => router.replace('/home'), style: 'destructive' }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Ionicons name="person-circle-outline" size={64} color={Colors.primary} />
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Help attorneys know you better
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+1 (234) 567-8900"
                                placeholderTextColor="#94A3B8"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>City / Location *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. New York, NY"
                                placeholderTextColor="#94A3B8"
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>About You (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Tell us about your legal needs..."
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={bio}
                                onChangeText={setBio}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleCompleteProfile}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <Text style={styles.submitButtonText}>Complete Profile</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={handleSkip}
                            disabled={loading}
                        >
                            <Text style={styles.skipButtonText}>Skip for Now</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 8,
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    textArea: {
        height: 100,
        paddingTop: 16,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    skipButton: {
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    skipButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
});
