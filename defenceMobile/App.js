// App.js (React Native / Expo)
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, AlertTriangle, BookOpen, Bell, Package, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import MapTab from './components/MapTab';
import EmergencyTab from './components/EmergencyTab';
import GuidesTab from './components/GuidesTab';
import ChecklistTab from './components/ChecklistTab';
import AlertsTab from './components/AlertsTab';


// Mock danych z alertami
const mockAlerts = [
  { id: 1, severity: 'high', title: 'Drone Activity Detected', message: 'Unidentified drones spotted near the eastern border. Stay indoors and avoid open areas until authorities confirm safety.', icon: AlertTriangle },
  { id: 2, severity: 'medium', title: 'Heatwave', message: 'Stay hydrated and avoid sun', icon: AlertTriangle },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('emergency');
  const [alertDismissed, setAlertDismissed] = useState(false);

  const urgentAlert = mockAlerts.find(a => a.severity === 'high');
  const IconComponent = urgentAlert?.icon;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'map': return <MapTab />;
      case 'emergency': return <EmergencyTab />;
      case 'guides': return <GuidesTab />;
      case 'gear': return <ChecklistTab />;
      case 'alerts': return <AlertsTab />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="auto" />

      {/* Alert banner */}
      {urgentAlert && !alertDismissed && (
        <View style={styles.alertBanner}>
          <View style={styles.alertTextContainer}>
            {IconComponent && <IconComponent size={20} color="white" style={{ marginRight: 8 }} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{urgentAlert.title}</Text>
              <Text style={styles.alertMessage}>{urgentAlert.message}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setAlertDismissed(true)}>
            <X size={18} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Main content */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderTabContent()}
        </ScrollView>
      </View>

      {/* Bottom navigation */}
      <View style={styles.navbar}>
        <NavButton
          label="Map"
          icon={MapPin}
          active={activeTab === 'map'}
          onPress={() => setActiveTab('map')}
        />
        <NavButton
          label="Emergency"
          icon={AlertTriangle}
          active={activeTab === 'emergency'}
          onPress={() => setActiveTab('emergency')}
        />
        <NavButton
          label="Guides"
          icon={BookOpen}
          active={activeTab === 'guides'}
          onPress={() => setActiveTab('guides')}
        />
        <NavButton
          label="Gear"
          icon={Package}
          active={activeTab === 'gear'}
          onPress={() => setActiveTab('gear')}
        />
        <NavButton
          label="Alerts"
          icon={Bell}
          badge="3"
          active={activeTab === 'alerts'}
          onPress={() => setActiveTab('alerts')}
        />
      </View>
    </SafeAreaView>
  );
}

// Komponent przycisku w nawigacji
function NavButton({ label, icon: Icon, active, onPress, badge }) {
  return (
    <TouchableOpacity style={[styles.navButton, active && styles.navButtonActive]} onPress={onPress}>
      <View style={{ position: 'relative' }}>
        <Icon size={22} color={active ? '#007AFF' : '#444'} />
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.navLabel, active && { color: '#007AFF' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// --- STYLE ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    padding: 12,
    justifyContent: 'space-between',
  },
  alertTextContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  alertTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  alertMessage: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#222',
    marginTop: 20,
  },
  navbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    height: 70,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    backgroundColor: '#E5F0FF',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#444',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
