import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function ClientLoginScreen() {
    const router = useRouter();

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
                            {/* Added Logo */}
                            <Image
                                source={require('../../../assets/images/splash-logo.jpg')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your legal search</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="name@example.com"
                                    placeholderTextColor="#94A3B8"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/home')}>
                                <Text style={styles.loginButtonText}>Sign In</Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/auth/client/signup')}>
                                    <Text style={styles.linkText}>Sign Up</Text>
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
        paddingTop: 40, // Ensure space from top
        paddingBottom: 40, // Ensure space at bottom
    },
    header: {
        marginBottom: Layout.spacing.xxl,
        alignItems: 'center', // Center logo and text
    },
    logo: {
        width: 80,
        height: 80,
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
        borderRadius: Layout.borderRadius.xl, // Pill for buttons
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
        marginBottom: Layout.spacing.xl, // Extra space at bottom for scrolling
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
