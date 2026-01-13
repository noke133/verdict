import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, StatusBar as RNStatusBar } from 'react-native';
import { Colors, Layout } from '../constants/Colors';
import LawyerCard, { Lawyer, CARD_WIDTH, CARD_HEIGHT } from '../components/LawyerCard';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    runOnJS,
    withTiming
} from 'react-native-reanimated';
import { Gavel, X, MessageSquare, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

// Mock Data
const MOCK_LAWYERS: Lawyer[] = [
    {
        id: '1',
        name: 'Sarah Jenkins',
        title: 'Criminal Defense',
        firm: 'Jenkins & Partners',
        location: 'New York, NY',
        yearsLicensed: 12,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
        badges: ['Former Prosecutor', 'Free Consultation', 'Top Rated'],
        bio: 'Former Manhattan ADA with over a decade of experience defending complex criminal cases. I fight aggressively for my clients\' rights.',
    },
    {
        id: '2',
        name: 'Michael Ross',
        title: 'Corporate Law',
        firm: 'Pearson Specter',
        location: 'Boston, MA',
        yearsLicensed: 8,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop',
        badges: ['Harvard Law', 'M&A Expert', 'Bar Verified'],
        bio: 'Specializing in mergers and acquisitions for tech startups. I help founders navigate complex legal landscapes.',
    },
    {
        id: '3',
        name: 'Elena Rodriguez',
        title: 'Family Law',
        firm: 'Rodriguez Law Group',
        location: 'Miami, FL',
        yearsLicensed: 15,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop',
        badges: ['Divorce Specialist', 'Mediation Certified', 'Bilingual'],
        bio: 'Compassionate representation for family matters. I prioritize the well-being of children and fair asset division.',
    },
];

export default function HomeScreen() {
    const [lawyers, setLawyers] = useState(MOCK_LAWYERS);
    const router = useRouter();

    // Animation values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const cardRotation = useSharedValue(0);
    const nextCardScale = useSharedValue(0.95);

    const handleSwipeComplete = (direction: 'left' | 'right') => {
        // Determine target based on direction
        const targetX = direction === 'right' ? width * 1.5 : -width * 1.5;

        translateX.value = withTiming(targetX, { duration: 200 }, () => {
            runOnJS(finalizeSwipe)(direction);
        });
    };

    const finalizeSwipe = (direction: 'left' | 'right') => {
        // Reset values for next card
        translateX.value = 0;
        translateY.value = 0;
        cardRotation.value = 0;
        nextCardScale.value = 0.95; // Reset scale for the new background card

        const swipedLawyer = lawyers[0];

        // Optimistic UI update
        setLawyers(prev => prev.slice(1));

        if (direction === 'right') {
            router.push({ pathname: '/match', params: { id: swipedLawyer.id } });
        }
    };

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
            cardRotation.value = interpolate(event.translationX, [-width / 2, 0, width / 2], [-10, 0, 10]);

            // Scale up the next card as we swipe
            nextCardScale.value = interpolate(
                Math.abs(event.translationX),
                [0, width / 2],
                [0.95, 1],
                'clamp'
            );
        })
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                runOnJS(handleSwipeComplete)('right');
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                runOnJS(handleSwipeComplete)('left');
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                cardRotation.value = withSpring(0);
                nextCardScale.value = withSpring(0.95);
            }
        });

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${cardRotation.value}deg` },
        ],
    }));

    const nextCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: nextCardScale.value }],
        opacity: interpolate(nextCardScale.value, [0.95, 1], [0.6, 1]),
    }));

    // Gavel Icon Opacity (Right Swipe)
    const likeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, width / 4], [0, 1]),
    }));

    // X Icon Opacity (Left Swipe)
    const nopeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, -width / 4], [0, 1]),
    }));

    const onSelectProfile = () => {
        if (lawyers.length > 0) {
            router.push(`/attorney/${lawyers[0].id}`);
        }
    };

    if (lawyers.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No more lawyers in your area.</Text>
                <TouchableOpacity style={styles.resetButton} onPress={() => setLawyers(MOCK_LAWYERS)}>
                    <Text style={styles.resetText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <User size={24} color={Colors.textSecondary} />
                <Text style={styles.headerTitle}>Verdict</Text>
                <TouchableOpacity onPress={() => router.push('/messages')}>
                    <MessageSquare size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
                {/* Background Card (Next Profile) */}
                {lawyers.length > 1 && (
                    <Animated.View style={[styles.cardWrapper, styles.nextCard, nextCardStyle]}>
                        <LawyerCard lawyer={lawyers[1]} />
                    </Animated.View>
                )}

                {/* Top Card (Active Profile) */}
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
                        <TouchableOpacity activeOpacity={1} onPress={onSelectProfile}>
                            <LawyerCard lawyer={lawyers[0]} />
                        </TouchableOpacity>

                        {/* Swipe Overlays */}
                        <Animated.View style={[styles.overlay, styles.likeOverlay, likeOpacity]}>
                            <View style={styles.overlayIconContainer}>
                                <Gavel size={48} color={Colors.gavel} strokeWidth={4} />
                                <Text style={[styles.overlayText, { color: Colors.gavel }]}>REQUEST</Text>
                            </View>
                        </Animated.View>

                        <Animated.View style={[styles.overlay, styles.nopeOverlay, nopeOpacity]}>
                            <View style={styles.overlayIconContainer}>
                                <X size={48} color={Colors.pass} strokeWidth={4} />
                                <Text style={[styles.overlayText, { color: Colors.pass }]}>PASS</Text>
                            </View>
                        </Animated.View>
                    </Animated.View>
                </GestureDetector>
            </View>

            {/* Manual Actions */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.smallButton, { borderColor: Colors.pass }]}
                    onPress={() => handleSwipeComplete('left')}
                >
                    <X size={32} color={Colors.pass} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.smallButton, { borderColor: Colors.gavel }]}
                    onPress={() => handleSwipeComplete('right')}
                >
                    <Gavel size={32} color={Colors.gavel} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: RNStatusBar.currentHeight ? RNStatusBar.currentHeight + 10 : 50,
        paddingBottom: Layout.spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.primary,
        letterSpacing: -0.5,
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    cardWrapper: {
        position: 'absolute',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
    },
    nextCard: {
        zIndex: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    resetButton: {
        padding: 12,
        backgroundColor: Colors.primary,
        borderRadius: 8,
    },
    resetText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: Layout.borderRadius.xl,
    },
    likeOverlay: {

    },
    nopeOverlay: {

    },
    overlayIconContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        width: 140,
        height: 140,
    },
    overlayText: {
        fontSize: 14,
        fontWeight: '900',
        marginTop: 8,
        letterSpacing: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        paddingBottom: 40,
    },
    smallButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
    }
});
