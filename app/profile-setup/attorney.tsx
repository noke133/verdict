import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Layout } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Api } from '../../services/Api';

const PRACTICE_AREAS = [
    'Criminal Law',
    'Family Law',
    'Corporate Law',
    'Real Estate Law',
    'Immigration Law',
    'Personal Injury',
    'Employment Law',
    'Intellectual Property',
    'Tax Law',
    'Estate Planning'
];

export default function AttorneyProfileSetup() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const userId = params.userId as string;

    const [loading, setLoading] = useState(false);
    const [showPracticeModal, setShowPracticeModal] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [practiceArea, setPracticeArea] = useState('');
    const [yearsExperience, setYearsExperience] = useState('');
    const [lawFirm, setLawFirm] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [bio, setBio] = useState('');

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCompleteProfile = async () => {
        console.log('[PROFILE-SETUP] Completing attorney profile...');

        if (!phone || !city || !practiceArea || !yearsExperience) {
            Alert.alert('❌ Missing Information', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const profileData = {
                phone,
                city,
                practiceAreas: [practiceArea],
                yearsExperience: parseInt(yearsExperience),
                lawFirm: lawFirm || null,
                hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
                bio: bio || null,
                profilePictureUrl: image // Add image to payload
            };

            const response = await Api.user.updateProfile(profileData);
            console.log('[PROFILE-SETUP] Response:', response);

            if (response.success) {
                Alert.alert(
                    '🎉 Profile Complete!',
                    'Your attorney profile has been set up successfully!',
                    [{ text: 'Get Started', onPress: () => router.replace('/attorney/dashboard') }]
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
                { text: 'Skip', onPress: () => router.replace('/attorney/dashboard'), style: 'destructive' }
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
                        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Ionicons name="camera" size={32} color={Colors.textSecondary} />
                                    <Text style={styles.addPhotoText}>Add Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.title}>Complete Your Attorney Profile</Text>
                        <Text style={styles.subtitle}>
                            Help clients find and connect with you
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
                                placeholder="e.g. Los Angeles, CA"
                                placeholderTextColor="#94A3B8"
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Primary Practice Area *</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowPracticeModal(true)}
                            >
                                <Text style={{ color: practiceArea ? Colors.text : '#94A3B8' }}>
                                    {practiceArea || 'Select practice area...'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Practice Area Modal */}
                        <Modal
                            visible={showPracticeModal}
                            transparent
                            animationType="slide"
                            onRequestClose={() => setShowPracticeModal(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Select Practice Area</Text>
                                        <TouchableOpacity onPress={() => setShowPracticeModal(false)}>
                                            <Ionicons name="close" size={28} color={Colors.text} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView>
                                        {PRACTICE_AREAS.map((area) => (
                                            <TouchableOpacity
                                                key={area}
                                                style={styles.modalOption}
                                                onPress={() => {
                                                    setPracticeArea(area);
                                                    setShowPracticeModal(false);
                                                }}
                                            >
                                                <Text style={styles.modalOptionText}>{area}</Text>
                                                {practiceArea === area && (
                                                    <Ionicons name="checkmark" size={24} color={Colors.primary} />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Years of Experience *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 10"
                                placeholderTextColor="#94A3B8"
                                keyboardType="number-pad"
                                value={yearsExperience}
                                onChangeText={setYearsExperience}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Law Firm (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Smith & Associates"
                                placeholderTextColor="#94A3B8"
                                value={lawFirm}
                                onChangeText={setLawFirm}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Hourly Rate (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 350"
                                placeholderTextColor="#94A3B8"
                                keyboardType="decimal-pad"
                                value={hourlyRate}
                                onChangeText={setHourlyRate}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>About You (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Tell clients about your experience and expertise..."
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
        marginBottom: 30,
        marginTop: 20,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    profileImage: {
        width: 100,
        height: 100,
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoText: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
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
        marginTop: 8,
    },
    skipButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalOptionText: {
        fontSize: 16,
        color: Colors.text,
    },
});
