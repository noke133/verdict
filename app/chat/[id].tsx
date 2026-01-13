import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Layout } from '../../constants/Colors';
import { Send } from 'lucide-react-native';
import { useState } from 'react';

export default function ChatScreen() {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hi! I saw your profile and would like to simplify my divorce proceedings.', sender: 'me' },
        { id: '2', text: 'Hello! I would be happy to help. Do you have a moment to discuss the details?', sender: 'them' },
    ]);

    const sendMessage = () => {
        if (!text.trim()) return;
        setMessages([...messages, { id: Date.now().toString(), text, sender: 'me' }]);
        setText('');
    };

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[
            styles.bubble,
            item.sender === 'me' ? styles.myBubble : styles.theirBubble
        ]}>
            <Text style={[
                styles.messageText,
                item.sender === 'me' ? styles.myText : styles.theirText
            ]}>{item.text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={text}
                    onChangeText={setText}
                    placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Send size={20} color={Colors.white} />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    messageList: {
        padding: Layout.spacing.md,
        gap: 12,
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
        maxWidth: '80%',
        marginBottom: 4,
    },
    myBubble: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    myText: {
        color: Colors.white,
    },
    theirText: {
        color: Colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: Layout.spacing.md,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        alignItems: 'center',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        color: Colors.text,
    },
    sendButton: {
        backgroundColor: Colors.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
