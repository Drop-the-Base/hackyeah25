import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  AlertTriangle,
  CloudRain,
  Wind,
  Thermometer,
  Zap,
  Mountain,
  Clock
} from 'lucide-react-native';

// --- Mock dane ---
export const mockAlerts = [
  {
    id: 1,
    title: 'Severe Weather Warning',
    message: 'Heavy thunderstorms expected in your area. Seek shelter immediately.',
    type: 'weather',
    severity: 'high',
    timestamp: '2 minutes ago',
    icon: CloudRain,
    location: 'Your Area'
  },
  {
    id: 2,
    title: 'Flash Flood Watch',
    message: 'Flash flooding possible in low-lying areas. Avoid crossing streams.',
    type: 'weather',
    severity: 'high',
    timestamp: '15 minutes ago',
    icon: AlertTriangle,
    location: 'Valley Region'
  },
  {
    id: 3,
    title: 'High Wind Advisory',
    message: 'Winds up to 45 mph expected. Secure loose objects and avoid exposed areas.',
    type: 'weather',
    severity: 'medium',
    timestamp: '1 hour ago',
    icon: Wind,
    location: 'Mountain Ridge'
  },
  {
    id: 4,
    title: 'Temperature Drop',
    message: 'Temperatures falling rapidly. Hypothermia risk increased.',
    type: 'health',
    severity: 'medium',
    timestamp: '2 hours ago',
    icon: Thermometer,
    location: 'All Areas'
  },
  {
    id: 5,
    title: 'Lightning Strike Nearby',
    message: 'Lightning activity detected within 5 miles. Take immediate shelter.',
    type: 'weather',
    severity: 'high',
    timestamp: '3 hours ago',
    icon: Zap,
    location: 'North Trail'
  },
  {
    id: 6,
    title: 'Rockfall Warning',
    message: 'Unstable conditions on mountain face. Avoid climbing routes.',
    type: 'terrain',
    severity: 'medium',
    timestamp: '4 hours ago',
    icon: Mountain,
    location: 'East Face'
  },
  {
    id: 7,
    title: 'Search and Rescue Update',
    message: 'Missing hiker found safe. All search operations concluded.',
    type: 'rescue',
    severity: 'low',
    timestamp: '6 hours ago',
    icon: AlertTriangle,
    location: 'South Ridge'
  },
  {
    id: 8,
    title: 'Trail Closure Notice',
    message: 'Main trail closed due to bridge damage. Use alternate route.',
    type: 'trail',
    severity: 'low',
    timestamp: '1 day ago',
    icon: Mountain,
    location: 'Main Trail'
  }
];

export function AlertsTab() {
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'high':
        return { borderLeftColor: '#DC2626', backgroundColor: '#FEE2E2' };
      case 'medium':
        return { borderLeftColor: '#EAB308', backgroundColor: '#FEF9C3' };
      case 'low':
        return { borderLeftColor: '#3B82F6', backgroundColor: '#DBEAFE' };
      default:
        return { borderLeftColor: '#9CA3AF', backgroundColor: '#F3F4F6' };
    }
  };

  const getTypeColor = (type) => {
    const map = {
      weather: '#3B82F6',
      health: '#EF4444',
      terrain: '#EAB308',
      rescue: '#22C55E',
      trail: '#8B5CF6'
    };
    return map[type] || '#6B7280';
  };

  const highCount = mockAlerts.filter((a) => a.severity === 'high').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Nagłówek */}
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Alerts</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{highCount} Active</Text>
        </View>
      </View>

      {/* Lista alertów */}
      {mockAlerts.map((alert) => {
        const IconComponent = alert.icon;
        const severityStyle = getSeverityStyle(alert.severity);

        return (
          <View key={alert.id} style={[styles.card, severityStyle]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrapper, { backgroundColor: getTypeColor(alert.type) }]}>
                <IconComponent size={18} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{alert.title}</Text>
                  <View style={[styles.severityBadge, severityStyle]}>
                    <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.message}>{alert.message}</Text>
                <View style={styles.meta}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.metaText}>{alert.timestamp}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Mountain size={12} color="#6B7280" />
                    <Text style={styles.metaText}>{alert.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      })}

      {/* Pusty stan */}
      {mockAlerts.length === 0 && (
        <View style={styles.emptyCard}>
          <AlertTriangle size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No active alerts</Text>
          <Text style={styles.emptySubText}>
            You'll be notified of any emergency situations
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '600'
  },
  badge: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  badgeText: {
    color: '#B91C1C',
    fontWeight: '500'
  },
  card: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 999,
    marginTop: 2
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 15,
    flexShrink: 1
  },
  severityBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1F2937'
  },
  message: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6
  },
  meta: {
    flexDirection: 'row',
    gap: 16
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280'
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 8
  },
  emptySubText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4
  }
});
