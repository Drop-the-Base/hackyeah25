import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  AlertTriangle,
  CloudRain,
  Wind,
  Thermometer,
  Zap,
  Mountain,
  Clock,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ───────────────────────────────── Local UI ───────────────────────────────────
const Card = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

const Badge = ({ children, outline, style }) => (
  <View style={[styles.badgeBase, outline ? styles.badgeOutline : styles.badgeSolid, style]}>
    <Text style={styles.badgeText}>{children}</Text>
  </View>
);

// ───────────────────────────────── Data ───────────────────────────────────────
export const mockAlerts = [
  {
    id: 1,
    title: 'Drone Activity Detected',
    message:
      'Unidentified drones spotted near the eastern border. Stay indoors and avoid open areas until authorities confirm safety.',
    type: 'security',
    severity: 'high',
    timestamp: '5 minutes ago',
    icon: AlertTriangle,
    location: 'Podlaskie Voivodeship',
  },
  {
    id: 2,
    title: 'Severe Storm Warning',
    message:
      'Intense thunderstorms with hail and strong winds expected this evening. Avoid travel if possible.',
    type: 'weather',
    severity: 'high',
    timestamp: '20 minutes ago',
    icon: CloudRain,
    location: 'Mazovia Region',
  },
  {
    id: 3,
    title: 'Flood Risk Alert',
    message:
      'Vistula River water levels rising due to heavy rainfall. Low-lying areas may flood overnight.',
    type: 'weather',
    severity: 'high',
    timestamp: '1 hour ago',
    icon: Wind,
    location: 'Kujawsko-Pomorskie',
  },
  {
    id: 4,
    title: 'Air Pollution Warning',
    message:
      'High smog levels detected. Limit outdoor activity and use masks if necessary.',
    type: 'health',
    severity: 'medium',
    timestamp: '2 hours ago',
    icon: Thermometer,
    location: 'Kraków',
  },
  {
    id: 5,
    title: 'Power Outage Reported',
    message:
      'Strong winds caused partial power outages in several districts. Repair crews are working to restore electricity.',
    type: 'infrastructure',
    severity: 'medium',
    timestamp: '3 hours ago',
    icon: Zap,
    location: 'Łódź Region',
  },
  {
    id: 6,
    title: 'Railway Disruption',
    message:
      'Train delays and cancellations due to technical failures near Warsaw Central. Check PKP schedule updates.',
    type: 'transport',
    severity: 'medium',
    timestamp: '4 hours ago',
    icon: Mountain,
    location: 'Warsaw',
  },
  {
    id: 8,
    title: 'Heatwave Advisory',
    message:
      'Temperatures expected to exceed 35°C. Stay hydrated and avoid direct sunlight during midday hours.',
    type: 'weather',
    severity: 'medium',
    timestamp: '1 day ago',
    icon: Thermometer,
    location: 'Wrocław',
  },
  {
    id: 9,
    title: 'Cybersecurity Notice',
    message:
      'Government services experiencing DDoS attacks. Online portals may be temporarily unavailable.',
    type: 'security',
    severity: 'low',
    timestamp: '1 day ago',
    icon: Zap,
    location: 'Nationwide',
  },
  {
    id: 10,
    title: 'Forest Fire Warning',
    message:
      'Dry conditions increase fire risk in forested areas. Campfires and open flames are prohibited.',
    type: 'environment',
    severity: 'medium',
    timestamp: '2 days ago',
    icon: Mountain,
    location: 'Bieszczady Mountains',
  },
];


// ─────────────────────────────── Style maps ───────────────────────────────────
const severityStyles = {
  high: {
    container: { borderLeftColor: '#ef4444', backgroundColor: '#fef2f2' },
    badge: { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
    text: { color: '#991b1b' },
  },
  medium: {
    container: { borderLeftColor: '#f59e0b', backgroundColor: '#fffbeb' },
    badge: { backgroundColor: '#fef3c7', borderColor: '#fde68a' },
    text: { color: '#92400e' },
  },
  low: {
    container: { borderLeftColor: '#3b82f6', backgroundColor: '#eff6ff' },
    badge: { backgroundColor: '#dbeafe', borderColor: '#bfdbfe' },
    text: { color: '#1e40af' },
  },
  default: {
    container: { borderLeftColor: '#9ca3af', backgroundColor: '#f3f4f6' },
    badge: { backgroundColor: '#e5e7eb', borderColor: '#d1d5db' },
    text: { color: '#374151' },
  },
};

const typeDotColors = {
  weather: '#3b82f6',
  health: '#ef4444',
  terrain: '#f59e0b',
  rescue: '#10b981',
  trail: '#8b5cf6',
  default: '#6b7280',
};

// ───────────────────────────────── Screen ─────────────────────────────────────
export default function AlertsScreen() {
  const highCount = mockAlerts.filter(a => a.severity === 'high').length;

  const renderItem = ({ item }) => {
    const IconComp = item.icon;
    const sev = severityStyles[item.severity] || severityStyles.default;
    const typeColor = typeDotColors[item.type] || typeDotColors.default;

    return (
      <Card
        key={item.id}
        style={[
          styles.alertCard,
          { borderLeftColor: sev.container.borderLeftColor, backgroundColor: sev.container.backgroundColor },
        ]}
      >
        <View style={styles.row}>
          <View style={[styles.typeIconWrap, { backgroundColor: typeColor }]}>
            <IconComp size={16} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Badge
                outline
                style={[
                  styles.severityBadge,
                  { backgroundColor: sev.badge.backgroundColor, borderColor: sev.badge.borderColor },
                ]}
              >
                <Text style={[styles.severityBadgeText, sev.text]}>{String(item.severity).toUpperCase()}</Text>
              </Badge>
            </View>

            <Text style={styles.messageText}>{item.message}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={12} color="#6b7280" />
                <Text style={styles.metaText}>{item.timestamp}</Text>
              </View>
              <View style={styles.metaItem}>
                <Mountain size={12} color="#6b7280" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Emergency Alerts</Text>
          <Badge outline style={[styles.countBadge, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
            <Text style={[styles.countBadgeText, { color: '#b91c1c' }]}>{highCount} Active</Text>
          </Badge>
        </View>

        {mockAlerts.length > 0 ? (
          <ScrollView contentContainerStyle={{ paddingVertical: 12, gap: 12 }}>
            {mockAlerts.map(item => renderItem({ item }))}
          </ScrollView>
        ) : (
          <Card style={styles.emptyCard}>
            <AlertTriangle size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No active alerts</Text>
            <Text style={styles.emptySub}>You'll be notified of any emergency situations</Text>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

// ───────────────────────────────── Styles ─────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16 },
  headerRow: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  countBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  countBadgeText: { fontSize: 12, fontWeight: '600' },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 12,
  },
  alertCard: { borderLeftWidth: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  typeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleText: { fontSize: 16, fontWeight: '600', color: '#111827', marginRight: 8 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  severityBadgeText: { fontSize: 10, fontWeight: '700' },
  messageText: { marginTop: 4, fontSize: 13, color: '#374151' },

  metaRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  metaText: { marginLeft: 4, fontSize: 11, color: '#6b7280' },

  badgeBase: { alignSelf: 'flex-start' },
  badgeSolid: {},
  badgeOutline: { borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#111827' },

  emptyCard: { paddingVertical: 24, alignItems: 'center', gap: 6 },
  emptyTitle: { marginTop: 8, fontSize: 16, fontWeight: '600', color: '#6b7280' },
  emptySub: { fontSize: 12, color: '#9ca3af' },
});
