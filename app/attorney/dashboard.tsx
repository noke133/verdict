import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { TrendingUp, Users, Star, Settings, FileText, Bell } from 'lucide-react-native';

export default function AttorneyDashboard() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good morning,</Text>
                        <Text style={styles.name}>Michael Ross</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop' }}
                        style={styles.avatar}
                    />
                </View>

                {/* Stats Grid */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                            <TrendingUp size={20} color="#0284C7" />
                        </View>
                        <Text style={styles.statValue}>124</Text>
                        <Text style={styles.statLabel}>Profile Views</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                            <Users size={20} color="#16A34A" />
                        </View>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>New Leads</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#FEFCE8' }]}>
                            <Star size={20} color="#CA8A04" />
                        </View>
                        <Text style={styles.statValue}>4.9</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Action Menu */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.menuGrid}>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: Colors.surface }]}>
                                <FileText size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.menuText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: Colors.surface }]}>
                                <Settings size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.menuText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: Colors.surface }]}>
                                <Bell size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.menuText}>Notifications</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Inquiries */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Inquiries</Text>

                    <View style={styles.inquiryCard}>
                        <View style={styles.inquiryHeader}>
                            <Text style={styles.inquiryName}>John Doe</Text>
                            <Text style={styles.inquiryTime}>2h ago</Text>
                        </View>
                        <Text style={styles.inquiryText} numberOfLines={2}>
                            Hi, I need assistance with a corporate merger contract review...
                        </Text>
                        <TouchableOpacity style={styles.respondButton}>
                            <Text style={styles.respondButtonText}>Respond</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inquiryCard}>
                        <View style={styles.inquiryHeader}>
                            <Text style={styles.inquiryName}>Sarah Smith</Text>
                            <Text style={styles.inquiryTime}>5h ago</Text>
                        </View>
                        <Text style={styles.inquiryText} numberOfLines={2}>
                            Looking for consultation regarding intellectual property rights for my startup.
                        </Text>
                        <TouchableOpacity style={styles.respondButton}>
                            <Text style={styles.respondButtonText}>Respond</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/welcome')}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        padding: Layout.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.xl,
        marginTop: Layout.spacing.md,
    },
    greeting: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Layout.spacing.xl,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: Layout.borderRadius.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
    },
    iconBox: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    section: {
        marginBottom: Layout.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: Layout.spacing.md,
    },
    menuGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    menuItem: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: Layout.borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text,
    },
    inquiryCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: Layout.borderRadius.lg,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inquiryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    inquiryName: {
        fontWeight: 'bold',
        color: Colors.text,
    },
    inquiryTime: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    inquiryText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    respondButton: {
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
    },
    respondButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
    },
    logoutButton: {
        alignSelf: 'center',
        padding: 16,
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '600',
    },
});
