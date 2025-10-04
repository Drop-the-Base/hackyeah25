import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Phone, Ambulance, FireExtinguisher, Shield, Bot } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const emergencyContacts = [
  {
    id: 1,
    name: "Emergency Services",
    number: "911",
    icon: Shield,
    color: "bg-red-500",
  },
  {
    id: 2,
    name: "Fire Department",
    number: "911",
    icon: FireExtinguisher,
    color: "bg-orange-500",
  },
  {
    id: 3,
    name: "Medical Emergency",
    number: "911",
    icon: Ambulance,
    color: "bg-blue-500",
  },
  {
    id: 4,
    name: "Poison Control",
    number: "1-800-222-1222",
    icon: Phone,
    color: "bg-purple-500",
  },
];

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function HelpPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your emergency assistant. I can help you with disaster preparedness, first aid guidance, and emergency procedures. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I understand you need assistance. For immediate life-threatening emergencies, please call 911. For general guidance, I can help with disaster preparedness, evacuation procedures, and basic first aid. What specific information do you need?",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      {/* Emergency Contacts Section */}
      <div className="p-4 border-b border-border">
        <h2 className="mb-3">Emergency Contacts</h2>
        <div className="grid grid-cols-2 gap-3">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <Card
                key={contact.id}
                className="p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${contact.color} rounded-lg p-2`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.number}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <div className="bg-primary rounded-full p-2">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3>AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for help..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
