import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { CheckCircle, Clock, GraduationCap, MapPin } from 'lucide-react-native';

export default function AttorneyDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Mock data - would normally fetch
    const lawyer = {
        name: 'Sarah Jenkins',
        title: 'Criminal Defense Attorney',
        firm: 'Jenkins & Partners',
        location: 'New York, NY',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
        about: 'I have dedicated my career to defending the rights of the accused. With over 12 years of experience in criminal law, including 5 years as a District Attorney, I understand how the prosecution thinks and how to build a winning defense strategy.',
        education: ['Columbia Law School, J.D.', 'New York University, B.A.'],
        admissions: ['New York State Bar', 'U.S. District Court, SDNY'],
        badges: ['Former Prosecutor', 'Top 100 Trial Lawyers', '98% Success Rate']
    };

    return (
        <View style={styles.container}>
            <ScrollView bounces={false}>
                <Image source={{ uri: lawyer.image }} style={styles.headerImage} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{lawyer.name}</Text>
                        <Text style={styles.title}>{lawyer.title}</Text>
                        <View style={styles.locationContainer}>
                            <MapPin size={14} color={Colors.textSecondary} />
                            <Text style={styles.location}>{lawyer.location}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Credentials</Text>
                        <View style={styles.badgeContainer}>
                            {lawyer.badges.map((b, i) => (
                                <View key={i} style={styles.badge}>
                                    <CheckCircle size={14} color={Colors.action} />
                                    <Text style={styles.badgeText}>{b}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.bodyText}>{lawyer.about}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {lawyer.education.map((edu, i) => (
                            <View key={i} style={styles.row}>
                                <GraduationCap size={18} color={Colors.textSecondary} />
                                <Text style={styles.detailText}>{edu}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={[styles.section, { marginBottom: 100 }]}>
                        <Text style={styles.sectionTitle}>Bar Admissions</Text>
                        {lawyer.admissions.map((adm, i) => (
                            <View key={i} style={styles.row}>
                                <Ionicons name="scale-outline" size={18} color={Colors.textSecondary} />
                                <Text style={styles.detailText}>{adm}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.requestButton} onPress={() => router.push('/match')}>
                    <Text style={styles.requestButtonText}>Request Consultation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerImage: {
        width: '100%',
        height: 350,
    },
    content: {
        marginTop: -30,
        backgroundColor: Colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: Layout.spacing.xl,
        minHeight: 500,
    },
    header: {
        marginBottom: Layout.spacing.xl,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    section: {
        marginBottom: Layout.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: Layout.spacing.md,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9', // Light Slate
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.primary,
    },
    bodyText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#334155',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    detailText: {
        fontSize: 15,
        color: '#334155',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Layout.spacing.lg,
        paddingBottom: 34,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    requestButton: {
        backgroundColor: Colors.gavel,
        padding: 16,
        borderRadius: Layout.borderRadius.lg,
        alignItems: 'center',
    },
    requestButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
