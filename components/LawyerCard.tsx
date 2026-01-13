import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Layout } from '../constants/Colors';
import { BlurView } from 'expo-blur';
import { Briefcase, MapPin, Award } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
export const CARD_WIDTH = width * 0.95;
export const CARD_HEIGHT = height * 0.75;

export interface Lawyer {
    id: string;
    name: string;
    title: string;
    image: string;
    location: string;
    yearsLicensed: number;
    firm: string;
    badges: string[];
    bio: string;
}

interface LawyerCardProps {
    lawyer: Lawyer;
}

export default function LawyerCard({ lawyer }: LawyerCardProps) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: lawyer.image }} style={styles.image} resizeMode="cover" />

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.9)']}
                style={styles.gradient}
            />

            <View style={styles.infoContainer}>
                <View style={styles.badgesRow}>
                    {lawyer.badges.map((badge, index) => (
                        <View key={index} style={styles.badge}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.name}>{lawyer.name}</Text>
                    <View style={styles.row}>
                        <Briefcase size={16} color={Colors.accent} />
                        <Text style={styles.subtitle}>{lawyer.title} • {lawyer.firm}</Text>
                    </View>
                    <View style={styles.row}>
                        <MapPin size={16} color={Colors.accent} />
                        <Text style={styles.subtitle}>{lawyer.location} • {lawyer.yearsLicensed} Years Licensed</Text>
                    </View>
                </View>
            </View>

            {/* Detail hint */}
            <View style={styles.infoButton}>
                <Award size={24} color={Colors.white} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: Layout.borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Layout.spacing.lg,
        paddingBottom: Layout.spacing.xl,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: Layout.spacing.md,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    textContainer: {
        gap: 4,
    },
    name: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    subtitle: {
        color: '#E2E8F0',
        fontSize: 16,
        fontWeight: '500',
    },
    infoButton: {
        position: 'absolute',
        top: Layout.spacing.lg,
        right: Layout.spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 8,
    }
});
