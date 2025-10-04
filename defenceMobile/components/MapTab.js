import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  MapPin,
  Mountain,
  TreePine,
  Waves,
  X,
  Navigation,
  Loader2,
} from 'lucide-react-native';

// ───────────────────────── Local UI ─────────────────────────
const Card = ({ children, style, ...rest }) => (
  <View style={[styles.card, style]} {...rest}>
    {children}
  </View>
);

const Button = ({ children, onPress, variant = 'solid', style }) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.btn,
      variant === 'outline' ? styles.btnOutline : styles.btnSolid,
      style,
    ]}
  >
    <Text
      style={[
        styles.btnText,
        variant === 'outline' ? styles.btnTextOutline : styles.btnTextSolid,
      ]}
    >
      {children}
    </Text>
  </Pressable>
);

const Badge = ({ children, tone = 'success', style, textStyle }) => {
  const tones = {
    success: { bg: '#ecfdf5', border: '#bbf7d0', text: '#166534' },
    warn: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    neutral: { bg: '#f3f4f6', border: '#e5e7eb', text: '#374151' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <View
      style={[
        {
          backgroundColor: t.bg,
          borderColor: t.border,
          borderWidth: 1,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
        },
        style,
      ]}
    >
      <Text style={[{ color: t.text, fontWeight: '600', fontSize: 12 }, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

// ───────────────────────── Data ─────────────────────────
const mockLocations = [
  {
    id: 1,
    name: 'Emergency Shelter A',
    type: 'shelter',
    lat: 37.7749,
    lng: -122.4194,
    icon: Mountain,
    description: 'Protected emergency shelter with basic supplies',
    distance: '0.5 km away',
  },
  {
    id: 2,
    name: 'Water Source - Creek',
    type: 'water',
    lat: 37.7849,
    lng: -122.4294,
    icon: Waves,
    description: 'Fresh water creek - requires purification',
    distance: '1.2 km away',
  },
  {
    id: 3,
    name: 'Forest Camp Site',
    type: 'camp',
    lat: 37.7649,
    lng: -122.4094,
    icon: TreePine,
    description: 'Established camping area with fire pit',
    distance: '0.8 km away',
  },
  {
    id: 4,
    name: 'Ranger Station',
    type: 'help',
    lat: 37.7549,
    lng: -122.4394,
    icon: MapPin,
    description: 'Park ranger station - emergency assistance available',
    distance: '2.1 km away',
  },
  {
    id: 5,
    name: 'High Ground Point',
    type: 'shelter',
    lat: 37.7949,
    lng: -122.4494,
    icon: Mountain,
    description: 'Elevated area safe from flooding',
    distance: '1.7 km away',
  },
];

// stałe pozycje (procenty 0..1) przerabiane na px wg. rozmiaru kontenera
const pinNormPositions = [
  { x: 0.30, y: 0.35 },
  { x: 0.55, y: 0.45 },
  { x: 0.40, y: 0.70 },
  { x: 0.75, y: 0.55 },
  { x: 0.20, y: 0.60 },
];

const typeColor = (type) => {
  switch (type) {
    case 'shelter':
      return '#f97316'; // orange-500
    case 'water':
      return '#3b82f6'; // blue-500
    case 'camp':
      return '#22c55e'; // green-500
    case 'help':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

// ───────────────────────── Screen ─────────────────────────
export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  // rozmiary kontenera mapy do pozycjonowania pinów
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });

  // Demo „pobrania” lokalizacji – bez dodatkowych paczek
  useEffect(() => {
    // symulacja asynchroniczna
    const t = setTimeout(() => {
      // fallback/demo coords
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
      setLocationError('Using demo location');
      setLocationLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const header = (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      <Card style={{ backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconWrap}>
              <Navigation size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Your Location</Text>
              {locationLoading ? (
                <View style={styles.loadingRow}>
                  <Loader2 size={12} color="#6b7280" />
                  <Text style={styles.loadingText}>Getting location...</Text>
                </View>
              ) : userLocation ? (
                <>
                  <Text style={styles.coordsText}>
                    {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </Text>
                  {locationError ? (
                    <Text style={styles.demoText}>{locationError}</Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.errorText}>Location unavailable</Text>
              )}
            </View>
          </View>

          {!locationLoading && userLocation ? (
            <Badge tone={locationError ? 'warn' : 'success'}>
              {locationError ? 'Demo' : 'Active'}
            </Badge>
          ) : null}
        </View>
      </Card>
    </View>
  );

  const renderListItem = ({ item: location }) => {
    const Icon = location.icon;
    const isSelected = selectedLocation?.id === location.id;
    return (
      <Card
        style={[
          { marginHorizontal: 16 },
          isSelected && { borderColor: '#6366f1', backgroundColor: '#eef2ff' },
        ]}
      >
        <Pressable onPress={() => setSelectedLocation(location)} style={styles.listRow}>
          <View style={[styles.pinCircleSm, { backgroundColor: typeColor(location.type) }]}>
            <Icon size={16} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.locName} numberOfLines={1}>
              {location.name}
            </Text>
            <Text style={styles.locDesc} numberOfLines={1}>
              {location.description}
            </Text>
            <Text style={styles.locDistance}>{location.distance}</Text>
          </View>
        </Pressable>
      </Card>
    );
  };

  // całość jedną FlatList (nagłówek + mapa + lista) – bez ScrollView
  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={mockLocations}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderListItem}
        ListHeaderComponent={
          <>
            {header}

            {/* MAPA */}
            <View
              style={styles.mapWrap}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setMapSize({ w: width, h: height });
              }}
            >
              <ImageBackground
                        source={
                    require('../assets/map.png')
                }
                style={StyleSheet.absoluteFill}
              />

              {/* pin użytkownika – środek */}
              {userLocation ? (
                <View
                  style={[
                    styles.pinAt,
                    {
                      left: mapSize.w / 2,
                      top: mapSize.h / 2,
                    },
                  ]}
                >
                  <View style={styles.pulseDot} />
                  <Pressable
                    onPress={() => setSelectedLocation(null)}
                    style={[
                      styles.pinCircleLg,
                      { backgroundColor: '#6366f1', borderColor: '#fff' },
                    ]}
                  >
                    <Navigation size={20} color="#fff" />
                  </Pressable>
                </View>
              ) : null}

              {/* inne lokacje */}
              {mockLocations.map((loc, idx) => {
                const Icon = loc.icon;
                const pos = pinNormPositions[idx % pinNormPositions.length];
                const x = pos.x * mapSize.w;
                const y = pos.y * mapSize.h;
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <View
                    key={loc.id}
                    style={[styles.pinAt, { left: x, top: y }]}
                  >
                    <Pressable
                      onPress={() => setSelectedLocation(loc)}
                      style={[
                        styles.pinCircleMd,
                        {
                          backgroundColor: typeColor(loc.type),
                          borderColor: '#fff',
                          transform: [{ scale: isSelected ? 1.15 : 1 }],
                        },
                      ]}
                    >
                      <Icon size={18} color="#fff" />
                    </Pressable>
                  </View>
                );
              })}

              {/* popup wybranej lokacji */}
              {selectedLocation ? (
                <View style={styles.popupWrap}>
                  <Card style={[styles.popupCard, { borderWidth: 2 }]}>
                    <View style={styles.popupRow}>
                      <View
                        style={[
                          styles.pinCircleMd,
                          {
                            backgroundColor: typeColor(selectedLocation.type),
                            marginRight: 10,
                          },
                        ]}
                      >
                        {React.createElement(selectedLocation.icon, {
                          size: 18,
                          color: '#fff',
                        })}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.popupTitle} numberOfLines={1}>
                          {selectedLocation.name}
                        </Text>
                        <Text style={styles.popupDesc} numberOfLines={2}>
                          {selectedLocation.description}
                        </Text>
                        <View style={styles.popupMeta}>
                          <Text style={styles.metaText}>{selectedLocation.distance}</Text>
                          <Text style={styles.metaDot}>•</Text>
                          <Text style={styles.metaText}>
                            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                          </Text>
                        </View>
                      </View>

                      <Pressable onPress={() => setSelectedLocation(null)} style={styles.closeBtn}>
                        <X size={16} color="#6b7280" />
                      </Pressable>
                    </View>
                  </Card>
                </View>
              ) : null}
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>Nearby Locations</Text>
              <Text style={styles.listHeaderCount}>{mockLocations.length} locations</Text>
            </View>
          </>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}

// ───────────────────────── Styles ─────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 12,
  },

  // header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: { fontSize: 12, color: '#111827' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 },
  loadingText: { fontSize: 12, color: '#6b7280', marginLeft: 6 },
  coordsText: { fontSize: 12, color: '#374151', marginTop: 2 },
  demoText: { fontSize: 12, color: '#b45309', marginTop: 2 },
  errorText: { fontSize: 12, color: '#dc2626', marginTop: 2 },

  // map
  mapWrap: {
    height: 380,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pinAt: {
    position: 'absolute',
    transform: [{ translateX: -0.5 }, { translateY: -0.5 }],
    // realne przesunięcie robimy przez centrowanie w komponencie:
    // poniżej elementy mają własne -translate o połowie szer/wys
  },
  pinCircleLg: {
    padding: 10,
    borderRadius: 999,
    borderWidth: 3,
  },
  pinCircleMd: {
    padding: 8,
    borderRadius: 999,
    borderWidth: 2,
  },
  pinCircleSm: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    opacity: 0.25,
  },

  // popup
  popupWrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  popupCard: {
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  popupRow: { flexDirection: 'row', alignItems: 'flex-start' },
  popupTitle: { fontWeight: '700', color: '#111827' },
  popupDesc: { fontSize: 12, color: '#4b5563', marginTop: 2 },
  popupMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { fontSize: 12, color: '#6b7280' },
  metaDot: { marginHorizontal: 8, color: '#9ca3af' },
  closeBtn: { marginLeft: 10, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },

  // list
  listHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  listHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  listHeaderCount: { fontSize: 12, color: '#6b7280' },

  listRow: { flexDirection: 'row', alignItems: 'center' },
  locName: { fontSize: 14, color: '#111827', fontWeight: '600' },
  locDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  locDistance: { fontSize: 11, color: '#9ca3af', marginTop: 2 },

  // buttons
  btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnSolid: { backgroundColor: '#111827' },
  btnOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnText: { fontSize: 14, fontWeight: '600' },
  btnTextSolid: { color: '#fff' },
  btnTextOutline: { color: '#111827' },
});
