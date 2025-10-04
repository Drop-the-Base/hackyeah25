import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
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

const survivalKnowledge = {
  fire: [
    "Gather dry tinder (birch bark, dry grass) and kindling before starting a fire.",
    "Clear the area and keep water nearby for safety.",
  ],
  water: [
    "Boil water for at least 1 minute to kill bacteria and parasites.",
    "Look for running water sources, not stagnant ones.",
  ],
  shelter: [
    "Find a dry spot protected from wind and rain.",
    "Use branches and leaves for insulation.",
  ],
  navigation: [
    "The sun rises in the east and sets in the west.",
    "Follow rivers downstream — they often lead to civilization.",
  ],
  signaling: [
    "Three of anything is a distress signal (whistles, fires).",
    "Use reflective surfaces to signal aircraft.",
  ],
  food: [
    "Never eat what you can't identify.",
    "Cook food when possible to kill parasites.",
  ],
  firstaid: [
    "Stop bleeding with direct pressure and elevation.",
    "For sprains, use RICE: Rest, Ice, Compression, Elevation.",
  ],
};

function generateResponse(message) {
  const msg = message.toLowerCase();
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (msg.includes('fire')) return pick(survivalKnowledge.fire);
  if (msg.includes('water')) return pick(survivalKnowledge.water);
  if (msg.includes('shelter')) return pick(survivalKnowledge.shelter);
  if (msg.includes('navigate') || msg.includes('lost')) return pick(survivalKnowledge.navigation);
  if (msg.includes('signal')) return pick(survivalKnowledge.signaling);
  if (msg.includes('food')) return pick(survivalKnowledge.food);
  if (msg.includes('aid') || msg.includes('injury')) return pick(survivalKnowledge.firstaid);

  const general = [
    "Ask me about fire, water, shelter, navigation, signaling, food, or first aid.",
    "Remember the Rule of 3s: 3 minutes without air, 3 hours without shelter, 3 days without water, 3 weeks without food.",
    "Stay calm and prioritize safety, shelter, signaling, water, then food.",
  ];
  return pick(general);
}

export default function EmergencyTab() {
  const [tab, setTab] = useState('contacts');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      message: "Hello! I'm your survival assistant. Ask me about fire, water, shelter, navigation, signaling, food, or first aid.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => alert('Unable to make a call.'));
  };

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const reply = generateResponse(newMessage.message);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'assistant', message: reply, timestamp: new Date() },
      ]);
      setIsLoading(false);
    }, 1200);
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

      {/* Content */}
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
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatMessages}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.messageRow, msg.sender === 'user' ? styles.userMsg : styles.assistantMsg]}>
                <View style={[styles.avatar, msg.sender === 'user' ? styles.userAvatar : styles.assistantAvatar]}>
                  {msg.sender === 'user' ? <User color="#fff" size={16} /> : <Bot color="#fff" size={16} />}
                </View>
                <View style={styles.bubble}>
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.timestamp}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
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
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              style={styles.sendButton}
            >
              <Send color="#fff" size={18} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  iconCircle: {
    borderRadius: 9999,
    padding: 8,
    marginRight: 10,
  },
  cardText: { flex: 1 },
  service: { fontWeight: '600' },
  number: { color: '#6b7280', fontSize: 12 },
  desc: { color: '#9ca3af', fontSize: 11 },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  callText: { color: '#fff', marginLeft: 4, fontWeight: '600' },
  chatContainer: { flex: 1 },
  chatMessages: { padding: 12 },
  messageRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end' },
  userMsg: { justifyContent: 'flex-end' },
  assistantMsg: { justifyContent: 'flex-start' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  userAvatar: { backgroundColor: '#22c55e' },
  assistantAvatar: { backgroundColor: '#3b82f6' },
  bubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 8,
    maxWidth: '75%',
  },
  messageText: { fontSize: 14, color: '#111' },
  timestamp: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
  inputRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 10,
  },
});
