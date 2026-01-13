import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../constants/Colors';
import { ChevronRight } from 'lucide-react-native';

const MOCK_MESSAGES = [
    {
        id: '1',
        lawyer: 'Sarah Jenkins',
        lastMessage: 'I reviewed your case details. When can we talk?',
        time: '2m ago',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
        unread: true,
    },
    {
        id: '2',
        lawyer: 'Michael Ross',
        lastMessage: 'Please bring the documents to our meeting.',
        time: '1d ago',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop',
        unread: false,
    },
];

export default function MessagesScreen() {
    const router = useRouter();

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.messageItem}
            onPress={() => router.push(`/chat/${item.id}`)}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{item.lawyer}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={[styles.preview, item.unread && styles.unreadPreview]} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
            {item.unread && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={MOCK_MESSAGES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No messages yet.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    list: {
        padding: Layout.spacing.md,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontWeight: '600',
        fontSize: 16,
        color: Colors.text,
    },
    time: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    preview: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    unreadPreview: {
        color: Colors.text,
        fontWeight: '500',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: 8,
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
    },
});
