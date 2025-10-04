import React, { useState, useRef, useEffect } from 'react';
import { Phone, Shield, Flame, Ambulance, AlertTriangle, Bot, Send, User, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';

const emergencyNumbers = [
  { id: 1, service: 'Emergency Services', number: '911', icon: AlertTriangle, color: 'bg-red-500', description: 'Life-threatening emergencies' },
  { id: 2, service: 'Fire Department', number: '911', icon: Flame, color: 'bg-orange-500', description: 'Fire, explosion, hazmat' },
  { id: 3, service: 'Police', number: '911', icon: Shield, color: 'bg-blue-500', description: 'Crime, violence, theft' },
  { id: 4, service: 'Medical Emergency', number: '911', icon: Ambulance, color: 'bg-green-500', description: 'Serious injury, illness' },
  { id: 5, service: 'Poison Control', number: '1-800-222-1222', icon: Phone, color: 'bg-purple-500', description: 'Poisoning, overdose' },
  { id: 6, service: 'Park Rangers', number: '(555) 123-4567', icon: Shield, color: 'bg-green-600', description: 'Wilderness emergencies' },
  { id: 7, service: 'Mountain Rescue', number: '(555) 234-5678', icon: AlertTriangle, color: 'bg-orange-600', description: 'Search and rescue' },
  { id: 8, service: 'Coast Guard', number: '(555) 345-6789', icon: Phone, color: 'bg-blue-600', description: 'Water emergencies' },
];

interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

// Mock survival knowledge base for RAG responses
const survivalKnowledge = {
  fire: [
    "To start a fire, gather dry tinder (birch bark, dry grass), kindling (pencil-thin twigs), and fuel wood.",
    "Create a fire lay with tinder nest surrounded by a kindling tepee structure.",
    "In wet conditions, look for dead branches still attached to trees - they're usually drier.",
    "Always clear the area around your fire and have water nearby for safety."
  ],
  water: [
    "Look for running water sources like streams and rivers - avoid stagnant water.",
    "Boil water for at least 1 minute to kill harmful bacteria and parasites.",
    "You can collect rainwater using clean containers or tarps.",
    "Signs of water include animal tracks, green vegetation, and following valleys downhill."
  ],
  shelter: [
    "Find a dry location protected from wind and rain.",
    "Your shelter should be just big enough for your body to conserve heat.",
    "Use natural materials like branches, leaves, and pine needles for insulation.",
    "Always leave a ventilation gap to prevent carbon dioxide buildup."
  ],
  navigation: [
    "The sun rises in the east and sets in the west - use this for basic direction.",
    "Find the North Star using the Big Dipper constellation at night.",
    "Rivers and streams usually flow toward civilization.",
    "Mark your path with stones or broken branches to avoid walking in circles."
  ],
  signaling: [
    "Three of anything is a universal distress signal (whistle blasts, fires, etc.).",
    "Use mirrors or reflective surfaces to signal aircraft during the day.",
    "Create smoke signals with green vegetation on your fire.",
    "Arrange rocks or logs in large X or SOS patterns visible from above."
  ],
  food: [
    "Never eat anything you cannot 100% identify - when in doubt, don't risk it.",
    "Focus on finding nuts, berries, and green leaves from known edible plants.",
    "Insects are a good protein source - avoid bright colors and strong smells.",
    "Always cook food when possible to kill parasites and bacteria."
  ],
  firstaid: [
    "Stop bleeding with direct pressure and elevation when possible.",
    "For hypothermia, gradually warm the person and give warm (not hot) drinks.",
    "Treat shock by keeping the person warm and elevating their legs.",
    "For sprains, remember RICE: Rest, Ice, Compression, Elevation."
  ]
};

function generateResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Check for keywords and provide relevant survival advice
  if (message.includes('fire') || message.includes('warm') || message.includes('heat')) {
    return survivalKnowledge.fire[Math.floor(Math.random() * survivalKnowledge.fire.length)];
  } else if (message.includes('water') || message.includes('drink') || message.includes('thirst')) {
    return survivalKnowledge.water[Math.floor(Math.random() * survivalKnowledge.water.length)];
  } else if (message.includes('shelter') || message.includes('cold') || message.includes('rain')) {
    return survivalKnowledge.shelter[Math.floor(Math.random() * survivalKnowledge.shelter.length)];
  } else if (message.includes('lost') || message.includes('direction') || message.includes('navigate')) {
    return survivalKnowledge.navigation[Math.floor(Math.random() * survivalKnowledge.navigation.length)];
  } else if (message.includes('help') || message.includes('rescue') || message.includes('signal')) {
    return survivalKnowledge.signaling[Math.floor(Math.random() * survivalKnowledge.signaling.length)];
  } else if (message.includes('food') || message.includes('eat') || message.includes('hungry')) {
    return survivalKnowledge.food[Math.floor(Math.random() * survivalKnowledge.food.length)];
  } else if (message.includes('injury') || message.includes('hurt') || message.includes('pain') || message.includes('first aid')) {
    return survivalKnowledge.firstaid[Math.floor(Math.random() * survivalKnowledge.firstaid.length)];
  } else {
    // General responses for other queries
    const generalResponses = [
      "I'm here to help with survival situations. Ask me about fire, water, shelter, navigation, signaling for help, food, or first aid.",
      "For wilderness survival, remember the Rule of 3s: 3 minutes without air, 3 hours without shelter in harsh conditions, 3 days without water, 3 weeks without food.",
      "Stay calm and assess your situation. Priorities are usually: safety, shelter, signaling, water, then food.",
      "Remember STOP: Sit, Think, Observe, Plan. Don't panic and make hasty decisions."
    ];
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }
}

export function EmergencyTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      message: "Hello! I'm your survival assistant. I can help with wilderness survival questions about fire, water, shelter, navigation, signaling, food, and first aid. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCall = (number: string, service: string) => {
    // In a real app, this would initiate a phone call
    alert(`Calling ${service} at ${number}`);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        message: generateResponse(userMessage.message),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="contacts" className="h-full flex flex-col">
        <div className="px-4 pt-4">
          <h2 className="mb-4">Emergency Services</h2>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="assistant">Survival Assistant</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="contacts" className="flex-1 p-4 space-y-3 overflow-y-auto">
          {emergencyNumbers.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`${service.color} rounded-full p-2 flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{service.service}</p>
                      <p className="text-sm text-gray-500 truncate">{service.number}</p>
                      <p className="text-xs text-gray-400 truncate">{service.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCall(service.number, service.service)}
                    variant="outline"
                    size="sm"
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 flex-shrink-0"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="assistant" className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-primary' : 'bg-green-500'}`}>
                        {msg.sender === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-green-500">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about survival techniques..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ask about: fire, water, shelter, navigation, signaling, food, first aid
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}