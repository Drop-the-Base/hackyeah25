// GuidesTab.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { ChevronRight, Search, X } from 'lucide-react-native';
import { Card } from './ui/Card';
import { ImageWithFallback } from './images/ImageWithFallback';
import { survivalGuides } from './resources/SurvivalGuides';


export default function GuidesTab() {
  const [selectedGuide, setSelectedGuide] = useState<typeof survivalGuides[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'Medium': return { backgroundColor: '#fef3c7', color: '#78350f' };
      case 'Hard': return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default: return { backgroundColor: '#e5e7eb', color: '#374151' };
    }
  };

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return survivalGuides;
    const q = searchQuery.toLowerCase();
    return survivalGuides.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.steps.some(step => step.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search guides, categories, or skills..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <X size={16} color="#374151" />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 && (
        <Text style={styles.searchInfo}>
          {filteredGuides.length > 0
            ? `Found ${filteredGuides.length} guide${filteredGuides.length === 1 ? '' : 's'} matching "${searchQuery}"`
            : `No guides found matching "${searchQuery}"`}
        </Text>
      )}

      <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
        {filteredGuides.length === 0 ? (
          <Card style={styles.noResultsCard}>
            <Search size={48} color="#9CA3AF" />
            <Text style={styles.noResultsText}>No guides found</Text>
            <Text style={styles.noResultsSubtext}>Try searching for "fire", "water", "shelter", or "navigation"</Text>
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          filteredGuides.map((guide) => (
            <TouchableOpacity key={guide.id} onPress={() => setSelectedGuide(guide)}>
              <Card style={styles.guideCard}>
                <View style={styles.guideRow}>
                  <ImageWithFallback source={{ uri: guide.image }} style={styles.guideImage} />
                  <View style={styles.guideInfo}>
                    <Text style={styles.guideTitle}>{guide.title}</Text>
                    <Text style={styles.guideDescription}>{guide.description}</Text>
                    <View style={styles.guideMeta}>
                      <View style={[styles.difficultyBadge, getDifficultyColor(guide.difficulty)]}>
                        <Text style={{ color: getDifficultyColor(guide.difficulty).color, fontSize: 12 }}>
                          {guide.difficulty}
                        </Text>
                      </View>
                      <Text style={styles.timeText}>⏱ {guide.time}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for selected guide */}
      <Modal visible={!!selectedGuide} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setSelectedGuide(null)} style={styles.modalClose}>
            <Text style={{ fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          {selectedGuide && (
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <ImageWithFallback source={{ uri: selectedGuide.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedGuide.title}</Text>
              <Text style={styles.modalDescription}>{selectedGuide.description}</Text>
              <View style={styles.guideMeta}>
                <View style={[styles.difficultyBadge, getDifficultyColor(selectedGuide.difficulty)]}>
                  <Text style={{ color: getDifficultyColor(selectedGuide.difficulty).color, fontSize: 12 }}>
                    {selectedGuide.difficulty}
                  </Text>
                </View>
                <Text style={styles.timeText}>⏱ {selectedGuide.time}</Text>
              </View>
              <Text style={styles.stepsTitle}>Step-by-step instructions:</Text>
              {selectedGuide.steps.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{idx + 1}</Text></View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, position: 'relative' },
  searchIcon: { position: 'absolute', left: 8 },
  searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingLeft: 32, paddingRight: 32 },
  clearButton: { position: 'absolute', right: 8 },
  searchInfo: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  noResultsCard: { padding: 16, alignItems: 'center' },
  noResultsText: { fontSize: 16, color: '#374151', marginTop: 8 },
  noResultsSubtext: { fontSize: 12, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
  clearSearchButton: { marginTop: 8, padding: 8, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8 },
  clearSearchText: { color: '#374151' },
  guideCard: { padding: 12, marginBottom: 8 },
  guideRow: { flexDirection: 'row', alignItems: 'center' },
  guideImage: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  guideInfo: { flex: 1 },
  guideTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  guideDescription: { fontSize: 12, color: '#6B7280' },
  guideMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  difficultyBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  timeText: { fontSize: 12, color: '#6B7280' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalClose: { padding: 16, alignItems: 'flex-end' },
  modalImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  modalDescription: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  stepsTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  stepNumberText: { fontSize: 12 },
  stepText: { flex: 1, fontSize: 14, color: '#374151' },
});
