import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Layout } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Gavel } from 'lucide-react-native';

export default function MatchScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // In a real app, fetch lawyer by ID
    const lawyerImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop';

    return (
        <BlurView intensity={90} tint="dark" style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Gavel size={60} color={Colors.white} />
                </View>

                <Text style={styles.title}>Request Sent!</Text>
                <Text style={styles.subtitle}>
                    Sarah Jenkins has received your consultation request. Look out for a message in your inbox.
                </Text>

                <View style={styles.avatars}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop' }}
                        style={[styles.avatar, styles.userAvatar]}
                    />
                    <Image
                        source={{ uri: lawyerImage }}
                        style={[styles.avatar, styles.lawyerAvatar]}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
                    <Text style={styles.buttonText}>Keep Browsing</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(`/chat/${id}`)}>
                    <Text style={styles.secondaryButtonText}>Send a Message</Text>
                </TouchableOpacity>
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(11, 37, 69, 0.8)',
    },
    content: {
        width: '85%',
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.xl,
        padding: Layout.spacing.xl,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        backgroundColor: Colors.gavel,
        padding: 20,
        borderRadius: 100,
        marginBottom: Layout.spacing.lg,
        marginTop: -60,
        borderWidth: 6,
        borderColor: Colors.white,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.primary,
        marginBottom: Layout.spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Layout.spacing.xl,
        lineHeight: 22,
    },
    avatars: {
        flexDirection: 'row',
        marginBottom: Layout.spacing.xl,
        height: 80,
        width: 140,
        justifyContent: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: Colors.white,
    },
    userAvatar: {
        right: -15,
        zIndex: 1,
    },
    lawyerAvatar: {
        left: -15,
    },
    button: {
        backgroundColor: Colors.primary,
        width: '100%',
        padding: 16,
        borderRadius: Layout.borderRadius.md,
        alignItems: 'center',
        marginBottom: Layout.spacing.sm,
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButton: {
        padding: 16,
    },
    secondaryButtonText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
});
