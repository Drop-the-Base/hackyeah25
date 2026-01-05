import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking
} from 'react-native';
import {
  Phone,
  Shield,
  Flame,
  Ambulance,
  AlertTriangle,
  Bot,
  Send,
  User,
  Loader2
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- KONFIGURACJA API ---
// Android Emulator: 'http://10.0.2.2:8000/query'
// iOS Simulator: 'http://localhost:8000/query'
// Fizyczny telefon: 'http://TWOJE_IP_Z_SIECI:8000/query'

//const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP || 'localhost';
const LOCAL_IP = '192.168.1.168'; // Honestly, nie chce mi się nawet do env'a jednak, bo EXPO_PUBLIC i cośtam cośtam errors
const API_URL = `http://${LOCAL_IP}:8000/query`;

const emergencyNumbers = [
  { id: 1, service: 'Emergency Services', number: '112', icon: AlertTriangle, color: '#ef4444', description: 'Life-threatening emergencies' },
  { id: 2, service: 'Police', number: '997', icon: Shield, color: '#3b82f6', description: 'Crime, violence, theft' },
  { id: 3, service: 'Fire Department', number: '998', icon: Flame, color: '#f97316', description: 'Fire, explosion, hazmat' },
  { id: 4, service: 'Medical Emergency', number: '999', icon: Ambulance, color: '#22c55e', description: 'Serious injury, illness' },
  { id: 5, service: 'GOPR / TOPR', number: '601 300 300', icon: AlertTriangle, color: '#ea580c', description: 'Search and rescue' },
  { id: 6, service: 'MOPR / WOPR', number: '601 100 100', icon: Phone, color: '#2563eb', description: 'Water emergencies' },
  { id: 7, service: 'Energy Emergency', number: '991', icon: AlertTriangle, color: '#f87171', description: 'Power outages, electrical hazards' },
  { id: 8, service: 'Gas Emergency', number: '992', icon: Flame, color: '#fbbf24', description: 'Gas leaks, explosions' },
  { id: 9, service: 'Heating Emergency', number: '993', icon: Flame, color: '#f97316', description: 'Heating system failures' },
  { id: 10, service: 'Water & Sewage Emergency', number: '994', icon: Phone, color: '#3b82f6', description: 'Water supply or sewage issues' },
  { id: 11, service: 'Child Alert', number: '995', icon: Shield, color: '#22c55e', description: 'Serious injury, illness' },
];

export default function EmergencyTab() {
  const [tab, setTab] = useState('contacts');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'assistant', message: "Hello! I'm your AI survival assistant. Ask me anything about safety or survival protocols.", timestamp: new Date() },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => alert('Unable to make a call.'));
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // 1. Dodaj wiadomość użytkownika do UI
    const userMsgText = inputMessage.trim();
    const newUserMessage = { id: Date.now(), sender: 'user', message: userMsgText, timestamp: new Date() };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMsgText,
          k: 4 // Opcjonalnie: ilość dokumentów kontekstu? chyba? co to za parametr XD
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const botResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        message: data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("API Connection Error:", error);

      const errorResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        message: "⚠️ Connection error. Please check if the backend server is running and reachable.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('contacts')} style={[styles.tab, tab === 'contacts' && styles.activeTab]}>
          <Text style={[styles.tabText, tab === 'contacts' && styles.activeTabText]}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('assistant')} style={[styles.tab, tab === 'assistant' && styles.activeTab]}>
          <Text style={[styles.tabText, tab === 'assistant' && styles.activeTabText]}>Assistant</Text>
        </TouchableOpacity>
      </View>

      {tab === 'contacts' ? (
        <ScrollView contentContainerStyle={styles.list}>
          {emergencyNumbers.map((s) => {
            const Icon = s.icon;
            return (
              <View key={s.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: s.color }]}>
                    <Icon color="white" size={20} />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.service}>{s.service}</Text>
                    <Text style={styles.number}>{s.number}</Text>
                    <Text style={styles.desc}>{s.description}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={() => handleCall(s.number)}>
                  <Phone size={16} color="#fff" />
                  <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {/* ScrollView wiadomości */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 12 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map(msg => (
              <View key={msg.id} style={[styles.messageRow, msg.sender === 'user' ? styles.userMsg : styles.assistantMsg]}>
                <View style={[styles.avatar, msg.sender === 'user' ? styles.userAvatar : styles.assistantAvatar]}>
                  {msg.sender === 'user' ? <User color="#fff" size={16} /> : <Bot color="#fff" size={16} />}
                </View>
                <View style={styles.bubble}>
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.timestamp}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageRow, styles.assistantMsg]}>
                <View style={[styles.avatar, styles.assistantAvatar]}>
                  <Loader2 color="#fff" size={16} style={{ transform: [{ rotate: '45deg' }] }} />
                </View>
                <View style={styles.bubble}>
                  <Text style={styles.messageText}>Thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input zawsze na dole */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          >
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="Ask about survival..."
                editable={!isLoading}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={handleSend} disabled={!inputMessage.trim() || isLoading} style={styles.sendButton}>
                <Send color="#fff" size={18} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderColor: '#22c55e' },
  tabText: { color: '#555' },
  activeTabText: { color: '#22c55e', fontWeight: '600' },
  list: { padding: 12 },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { borderRadius: 9999, padding: 8, marginRight: 10 },
  cardText: { flex: 1 },
  service: { fontWeight: '600' },
  number: { color: '#6b7280', fontSize: 12 },
  desc: { color: '#9ca3af', fontSize: 11 },
  callButton: { flexDirection: 'row', backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, alignItems: 'center' },
  callText: { color: '#fff', marginLeft: 4, fontWeight: '600' },
  chatContainer: { flex: 1 },
  chatMessages: { padding: 12 },
  messageRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end' },
  userMsg: { justifyContent: 'flex-end' },
  assistantMsg: { justifyContent: 'flex-start' },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
  userAvatar: { backgroundColor: '#22c55e' },
  assistantAvatar: { backgroundColor: '#3b82f6' },
  bubble: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 8, maxWidth: '75%' },
  messageText: { fontSize: 14, color: '#111' },
  timestamp: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
  inputRow: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#ddd', padding: 8, backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  sendButton: { marginLeft: 8, backgroundColor: '#22c55e', borderRadius: 8, padding: 10 },
});
