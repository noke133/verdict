import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../constants/Colors';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    {/* Placeholder for the illustration from the reference image. 
                        Using the logo for now, but styled to float in the center. */}
                    <Image
                        source={require('../assets/images/splash-logo.jpg')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* Content Section */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Discover Your</Text>
                    <Text style={styles.titleAccent}>Legal Solution here</Text>

                    <Text style={styles.description}>
                        Explore the best attorneys based on your needs and location.
                    </Text>
                </View>

                {/* Action Section */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.9}
                        onPress={() => router.push('/auth/client/login')}
                    >
                        <Text style={styles.primaryButtonText}>I need legal help</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.textButton} // "Register" style from reference
                        activeOpacity={0.9}
                        onPress={() => router.push('/auth/attorney/login')}
                    >
                        <Text style={styles.textButtonLabel}>I am an Attorney</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: Layout.spacing.xxl,
        paddingBottom: Layout.spacing.xxl,
        justifyContent: 'center',
    },
    illustrationContainer: {
        alignItems: 'center',
        marginTop: Layout.spacing.xl,
        marginBottom: Layout.spacing.xl, // Reduced spacing
    },
    illustration: {
        width: 200, // Fixed size for better control
        height: 200,
        resizeMode: 'contain',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
    },
    titleAccent: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: Layout.spacing.sm,
    },
    description: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: Layout.spacing.xl,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Layout.spacing.md,
        marginTop: Layout.spacing.xl, // Fixed spacing instead of auto
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: Layout.borderRadius.xl, // Fully rounded/pill shape? Or matches reference
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        minWidth: 160,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    textButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        minWidth: 140,
        alignItems: 'center',
    },
    textButtonLabel: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
