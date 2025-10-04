import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ChevronRight, Search as SearchIcon, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ───────────────────────────── Local UI ─────────────────────────────
const Card = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

const Button = ({ children, onPress, variant = 'solid', style }) => {
  const base = [styles.btn, variant === 'outline' ? styles.btnOutline : styles.btnSolid, style];
  const textStyle = [styles.btnText, variant === 'outline' ? styles.btnTextOutline : styles.btnTextSolid];
  return (
    <Pressable onPress={onPress} style={base}>
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  );
};

const ImageWithFallback = ({ source, style, fallbackText = 'Image' }) => {
  const [error, setError] = useState(false);
  if (error || !source?.uri) {
    return (
      <View style={[style, { backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#9ca3af', fontSize: 12 }}>{fallbackText}</Text>
      </View>
    );
  }
  return <Image source={source} style={style} onError={() => setError(true)} />;
};

// ───────────────────────────── Data ─────────────────────────────
const survivalGuides = [
  {
    id: 1,
    title: 'How to Start a Fire',
    image:
      'https://images.unsplash.com/photo-1756633231526-c3fc524fe9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wZmlyZSUyMGZsYW1lcyUyMHN1cnZpdmFsfGVufDF8fHx8MTc1OTU4NjMzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Fire',
    difficulty: 'Easy',
    time: '15 min',
    description: 'Learn the basics of fire starting in survival situations',
    steps: [
      'Gather dry tinder (birch bark, dry grass, paper)',
      'Collect kindling (pencil-thin dry twigs)',
      'Prepare fuel wood (thumb to wrist thick branches)',
      'Create a fire lay: tinder nest surrounded by kindling tepee',
      'Use matches, lighter, or friction method to ignite tinder',
      'Blow gently on flames to help them catch',
      'Gradually add larger pieces of wood',
    ],
  },
  {
    id: 2,
    title: 'Finding Clean Water',
    image:
      'https://images.unsplash.com/photo-1670343740825-ffe84fe9a448?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwc3RyZWFtJTIwbmF0dXJlfGVufDF8fHx8MTc1OTU4NjMzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Water',
    difficulty: 'Medium',
    time: '30 min',
    description: 'Locate and purify water sources in the wilderness',
    steps: [
      'Look for running water sources (streams, rivers)',
      'Check for clear, odorless water',
      'Avoid stagnant water with algae or bad smell',
      'Boil water for at least 1 minute to kill pathogens',
      'Use water purification tablets if available',
      'Filter through cloth to remove debris',
      'Collect rainwater with clean containers',
    ],
  },
  {
    id: 3,
    title: 'Basic Navigation',
    image:
      'https://images.unsplash.com/photo-1553695776-6a5b8cb9b171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYXNzJTIwbmF2aWdhdGlvbiUyMGhpa2luZ3xlbnwxfHx8fDE3NTk1ODYzMzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Navigation',
    difficulty: 'Medium',
    time: '20 min',
    description: 'Navigate without GPS using natural methods',
    steps: [
      'Use the sun: rises in east, sets in west',
      'Find the North Star using the Big Dipper',
      'Moss typically grows on north side of trees',
      'Rivers generally flow toward civilization',
      'Mark your path with stones or broken branches',
      'Create a simple compass with magnetized needle',
      'Study topographic features for landmarks',
    ],
  },
  {
    id: 4,
    title: 'Emergency Shelter',
    image:
      'https://images.unsplash.com/photo-1646928987117-c2c65845f869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2aXZhbCUyMHNoZWx0ZXIlMjB3aWxkZXJuZXNzfGVufDF8fHx8MTc1OTU4NjMzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Shelter',
    difficulty: 'Hard',
    time: '60 min',
    description: 'Build a weatherproof shelter using natural materials',
    steps: [
      'Find a dry location protected from wind',
      'Look for natural windbreaks (rocks, trees)',
      'Build frame using fallen branches',
      'Create a debris hut with thick insulation',
      'Use pine needles, leaves for bedding',
      'Ensure shelter is just big enough for your body',
      'Leave ventilation gap near entrance',
    ],
  },
  {
    id: 5,
    title: 'Signaling for Help',
    image:
      'https://images.unsplash.com/photo-1530413288975-7bb4812760f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXNjdWUlMjBzaWduYWwlMjBmbGFyZSUyMGVtZXJnZW5jeXxlbnwxfHx8fDE3NTk1ODYzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Rescue',
    difficulty: 'Easy',
    time: '10 min',
    description: 'Attract attention from rescue teams',
    steps: [
      'Use mirror or reflective surface to signal aircraft',
      'Create smoke signals during day (green vegetation)',
      'Build bright fires at night',
      'Use whistle: 3 sharp blasts repeatedly',
      'Arrange rocks/logs in large X or SOS pattern',
      'Wear bright colored clothing',
      'Save phone battery for emergency calls',
    ],
  },
  {
    id: 6,
    title: 'Foraging Basics',
    image:
      'https://images.unsplash.com/photo-1697852441303-155c98be9ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3aWxkJTIwYmVycmllcyUyMGZvcmFnaW5nJTIwZm9vZHxlbnwxfHx8fDE3NTk1ODYzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Food',
    difficulty: 'Hard',
    time: '45 min',
    description: 'Safely identify edible plants and insects',
    steps: [
      'Never eat anything you cannot 100% identify',
      'Learn local edible plants before trips',
      'Avoid plants with milky sap or three-leaf patterns',
      'Test unknown plants: rub on skin, then lips, then tongue',
      'Focus on nuts, berries, and green leaves',
      'Insects: avoid bright colors and strong smells',
      'Cook all food when possible to kill parasites',
    ],
  },
];

// ───────────────────────────── Helpers ─────────────────────────────
const difficultyStyles = {
  Easy: { bg: '#dcfce7', text: '#16a34a' },
  Medium: { bg: '#fef3c7', text: '#d97706' },
  Hard: { bg: '#fee2e2', text: '#dc2626' },
};

export default function GuidesScreen() {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return survivalGuides;
    const q = searchQuery.toLowerCase();
    return survivalGuides.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.steps.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const clearSearch = () => setSearchQuery('');

  const renderHeader = (
    <View>
      <Text style={styles.title}>Survival Guides</Text>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <SearchIcon size={18} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          placeholder="Search guides"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
            <X size={16} color="#6b7280" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Search info */}
      {searchQuery ? (
        <Text style={styles.searchInfo}>
          {filteredGuides.length > 0
            ? `Found ${filteredGuides.length} guide${filteredGuides.length === 1 ? '' : 's'} matching "${searchQuery}"`
            : `No guides found matching "${searchQuery}"`}
        </Text>
      ) : null}
    </View>
  );

  const renderItem = ({ item: guide }) => {
    const diff = difficultyStyles[guide.difficulty] || { bg: '#e5e7eb', text: '#374151' };
    return (
      <Pressable onPress={() => setSelectedGuide(guide)}>
        <Card>
          <View style={styles.row}>
            <View style={styles.thumb}>
              <ImageWithFallback source={{ uri: guide.image }} style={styles.thumbImage} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.guideTitle}>{guide.title}</Text>
              <Text style={styles.guideDesc} numberOfLines={2}>
                {guide.description}
              </Text>
              <View style={styles.metaRow}>
                <View style={[styles.diffPill, { backgroundColor: diff.bg }]}>
                  <Text style={[styles.diffText, { color: diff.text }]}>{guide.difficulty}</Text>
                </View>
                <Text style={styles.timeText}>{guide.time}</Text>
              </View>
            </View>

            <ChevronRight size={20} color="#9ca3af" />
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filteredGuides}
        keyExtractor={(g) => String(g.id)}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />

      {/* Dialog / Modal */}
      <Modal visible={!!selectedGuide} animationType="slide" onRequestClose={() => setSelectedGuide(null)} transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedGuide && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalThumb}>
                    <ImageWithFallback source={{ uri: selectedGuide.image }} style={styles.modalThumbImage} />
                  </View>
                  <Text style={styles.modalTitle}>{selectedGuide.title}</Text>
                </View>

                <Text style={styles.modalDesc}>{selectedGuide.description}</Text>

                <View style={styles.modalMetaRow}>
                  <View
                    style={[
                      styles.diffPill,
                      { backgroundColor: (difficultyStyles[selectedGuide.difficulty] || { bg: '#e5e7eb' }).bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diffText,
                        { color: (difficultyStyles[selectedGuide.difficulty] || { text: '#374151' }).text },
                      ]}
                    >
                      {selectedGuide.difficulty}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>⏱️ {selectedGuide.time}</Text>
                </View>

                <FlatList
                  data={selectedGuide.steps}
                  keyExtractor={(s, i) => `${i}-${s.slice(0, 8)}`}
                  renderItem={({ item: step, index }) => (
                    <View style={styles.stepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                  contentContainerStyle={{ paddingBottom: 8 }}
                  ListHeaderComponent={<Text style={styles.stepsTitle}>Step-by-step instructions:</Text>}
                />

                <Button variant="outline" onPress={() => setSelectedGuide(null)} style={{ marginTop: 12 }}>
                  Close
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ───────────────────────────── Styles ─────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },

  // Search
  searchWrap: { position: 'relative', marginBottom: 8 },
  searchIcon: { position: 'absolute', left: 12, top: 12 },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingLeft: 36,
    paddingRight: 36,
    color: '#111827',
    backgroundColor: '#fff',
  },
  clearBtn: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInfo: { fontSize: 12, color: '#6b7280', marginBottom: 8 },

  // Card/List
  card: { borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f3f4f6', marginRight: 12 },
  thumbImage: { width: '100%', height: '100%' },

  guideTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  guideDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  diffPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginRight: 8 },
  diffText: { fontSize: 10, fontWeight: '700' },
  timeText: { fontSize: 12, color: '#6b7280' },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modalThumb: { width: 40, height: 40, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f3f4f6', marginRight: 8 },
  modalThumbImage: { width: '100%', height: '100%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flexShrink: 1 },
  modalDesc: { fontSize: 13, color: '#374151', marginBottom: 6 },
  modalMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },

  stepsTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginTop: 4, marginBottom: 6 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start' },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  stepBadgeText: { fontSize: 11, color: '#6b7280', fontWeight: '700' },
  stepText: { flex: 1, fontSize: 13, color: '#111827' },

  // Buttons
  btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnSolid: { backgroundColor: '#111827' },
  btnOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnText: { fontSize: 14, fontWeight: '600' },
  btnTextSolid: { color: '#fff' },
  btnTextOutline: { color: '#111827' },
});
