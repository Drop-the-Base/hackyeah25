import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Check, Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ───────────────────────────── Local UI ─────────────────────────────
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Badge = ({ children, outline, style, textStyle }) => (
  <View
    style={[
      styles.badgeBase,
      outline ? styles.badgeOutline : styles.badgeSolid,
      style,
    ]}
  >
    <Text style={[styles.badgeText, textStyle]}>{children}</Text>
  </View>
);

const Checkbox = ({ checked, onToggle, size = 20 }) => (
  <Pressable
    onPress={onToggle}
    style={[
      styles.checkbox,
      { width: size, height: size },
      checked ? styles.checkboxChecked : null,
    ]}
  >
    {checked ? <Check size={size - 6} color="#fff" /> : null}
  </Pressable>
);

// ───────────────────────────── Types & Data ─────────────────────────
/** Checklist items from your web version (unchanged) */
const survivalItems = [
  // Essential
  { id: 1, name: 'First Aid Kit', category: 'Medical', priority: 'essential', description: 'Bandages, antiseptic, pain relievers', quantity: '1 complete kit' },
  { id: 2, name: 'Water Purification Tablets', category: 'Water', priority: 'essential', description: 'Purify contaminated water sources', quantity: '20-30 tablets' },
  { id: 3, name: 'Emergency Whistle', category: 'Signaling', priority: 'essential', description: 'Signal for rescue teams', quantity: '1-2 whistles' },
  { id: 4, name: 'Fire Starter Kit', category: 'Fire', priority: 'essential', description: 'Waterproof matches, lighter, tinder', quantity: '1 kit' },
  { id: 5, name: 'Emergency Blanket', category: 'Shelter', priority: 'essential', description: 'Reflective thermal blanket', quantity: '2-3 blankets' },
  { id: 6, name: 'Knife/Multi-tool', category: 'Tools', priority: 'essential', description: 'Fixed blade or folding knife with tools', quantity: '1 primary tool' },
  { id: 7, name: 'Flashlight', category: 'Light', priority: 'essential', description: 'LED flashlight with extra batteries', quantity: '1-2 lights' },
  { id: 8, name: 'Water Bottles', category: 'Water', priority: 'essential', description: 'Durable water containers', quantity: '2-3 bottles' },

  // Important
  { id: 9, name: 'Rope/Paracord', category: 'Tools', priority: 'important', description: '50ft+ of strong cordage', quantity: '50-100 feet' },
  { id: 10, name: 'Compass', category: 'Navigation', priority: 'important', description: 'Backup navigation tool', quantity: '1 compass' },
  { id: 11, name: 'Emergency Food Bars', category: 'Food', priority: 'important', description: 'High-calorie survival bars', quantity: '6-12 bars' },
  { id: 12, name: 'Duct Tape', category: 'Tools', priority: 'important', description: 'Repairs and emergency fixes', quantity: '1 roll' },
  { id: 13, name: 'Signal Mirror', category: 'Signaling', priority: 'important', description: 'Heliograph for aircraft signaling', quantity: '1 mirror' },
  { id: 14, name: 'Plastic Sheeting', category: 'Shelter', priority: 'important', description: 'Waterproof shelter material', quantity: '6x8 feet' },

  // Useful
  { id: 16, name: 'Fishing Kit', category: 'Food', priority: 'useful', description: 'Hooks, line, small weights', quantity: '1 compact kit' },
  { id: 17, name: 'Sewing Kit', category: 'Tools', priority: 'useful', description: 'Needle, thread, buttons', quantity: '1 small kit' },
  { id: 18, name: 'Playing Cards', category: 'Mental', priority: 'useful', description: 'Morale and mental health', quantity: '1 deck' },
  { id: 19, name: 'Notebook & Pencil', category: 'Communication', priority: 'useful', description: 'Record information, leave messages', quantity: '1 set' },
  { id: 20, name: 'Solar Charger', category: 'Electronics', priority: 'useful', description: 'Charge small devices', quantity: '1 charger' },
  { id: 21, name: 'Binoculars', category: 'Navigation', priority: 'useful', description: 'Scout terrain and resources', quantity: '1 pair' },
  { id: 22, name: 'Hand Sanitizer', category: 'Medical', priority: 'useful', description: 'Prevent infections', quantity: '1-2 bottles' },
  { id: 23, name: 'Cash', category: 'Emergency', priority: 'useful', description: 'Emergency funds in small bills', quantity: '$100-200' },
  { id: 25, name: 'Non-Perishable Food (3–7 days)', category: 'Food', priority: 'essential', description: 'Canned goods, rice, pasta, MRE, high-calorie bars', quantity: '~2000 kcal/day/person' },
  { id: 26, name: 'Headlamp', category: 'Light', priority: 'essential', description: 'Hands-free light with spare batteries', quantity: '1 per person' },
  { id: 27, name: 'Spare Batteries', category: 'Electronics', priority: 'important', description: 'AA/AAA or specific formats for lights/radios', quantity: 'Set for 1–2 full swaps' },
  { id: 28, name: 'Power Bank', category: 'Electronics', priority: 'essential', description: 'High-capacity (20–30k mAh) with cables', quantity: '1–2 units' },
  { id: 29, name: 'Emergency Radio', category: 'Communication', priority: 'important', description: 'Hand-crank/solar radio with FM and flashlight', quantity: '1 unit' },
  { id: 30, name: 'FFP2/FFP3 Masks', category: 'Medical', priority: 'important', description: 'Protection from smoke/dust/airborne particles', quantity: '2–5 per person' },
  { id: 31, name: 'Work Gloves & Safety Glasses', category: 'Tools', priority: 'important', description: 'Debris handling and eye protection', quantity: '1 set' },
  { id: 32, name: 'Important Documents (copies)', category: 'Emergency', priority: 'essential', description: 'ID, passport, insurance, medical, contacts in waterproof sleeve', quantity: '1 set + USB copy' },
  { id: 33, name: 'Paper Map & Meeting Plan', category: 'Navigation', priority: 'important', description: 'Local paper map, printed routes and rendezvous points', quantity: '1 set' },
  { id: 34, name: 'Rain Gear & Warm Layers', category: 'Shelter', priority: 'important', description: 'Waterproof jacket, hat, gloves, socks', quantity: '1 set per person' },
  { id: 35, name: 'Dry Bags / Phone Pouches', category: 'Water', priority: 'important', description: 'Waterproof storage for documents/electronics', quantity: '2–3 bags' },
  { id: 36, name: 'Vehicle Go-Kit', category: 'Transport', priority: 'useful', description: '12V charger, booster cables, tow strap, blanket, water, snacks', quantity: '1 kit' },
  { id: 37, name: 'Personal Prescription Medicines', category: 'Medical', priority: 'essential', description: 'Reserve supply + list of doses', quantity: '7–14 days' },
  { id: 38, name: 'Sanitation Kit', category: 'Hygiene', priority: 'important', description: 'Wet wipes, toilet paper, trash bags, emergency toilet bags', quantity: 'Family pack' },
];

// Priority → colors
const priorityTheme = {
  essential: { bg: '#fee2e2', border: '#fecaca', text: '#991b1b', bar: '#ef4444' }, // red
  important: { bg: '#fef3c7', border: '#fde68a', text: '#92400e', bar: '#f59e0b' }, // amber
  useful: { bg: '#dbeafe', border: '#bfdbfe', text: '#1e40af', bar: '#3b82f6' },     // blue
};

// ───────────────────────────── Screen ─────────────────────────────
export default function ChecklistScreen() {
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(survivalItems.map(i => i.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredItems = useMemo(() => {
    return selectedCategory === 'all'
      ? survivalItems
      : survivalItems.filter(i => i.category === selectedCategory);
  }, [selectedCategory]);

  const handleItemToggle = (id) => {
    const next = new Set(checkedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setCheckedIds(next);
  };

  const completionStats = useMemo(() => {
    const byPriority = (p) => survivalItems.filter(i => i.priority === p);
    const countChecked = (arr) => arr.filter(i => checkedIds.has(i.id)).length;
    const essential = byPriority('essential');
    const important = byPriority('important');
    const useful = byPriority('useful');
    return {
      essential: { total: essential.length, checked: countChecked(essential) },
      important: { total: important.length, checked: countChecked(important) },
      useful: { total: useful.length, checked: countChecked(useful) },
    };
  }, [checkedIds]);

  const renderProgressRow = (label, priKey) => {
    const st = completionStats[priKey];
    const theme = priorityTheme[priKey];
    const pct = st.total ? (st.checked / st.total) * 100 : 0;
    return (
      <View style={styles.progressRow} key={priKey}>
        <Text style={styles.progressLabel}>{label}</Text>
        <View style={styles.progressRight}>
          <Text style={styles.progressCount}>
            {st.checked}/{st.total}
          </Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: theme.bar }]} />
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isChecked = checkedIds.has(item.id);
    const theme = priorityTheme[item.priority] || priorityTheme.useful;

    return (
      <Card style={[isChecked && { backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' }]}>
      <Pressable onPress={() => handleItemToggle(item.id)}>

          <Text style={[styles.itemTitle, isChecked && styles.strike]}>{item.name}</Text>

          <View style={styles.itemBody}>
            <View style={styles.itemHeader}>
              <View style={styles.badgesRow}>
                <Badge outline>
                  <Text style={styles.badgeText}>{item.category}</Text>
                </Badge>
                <Badge
                    outline
                    style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                    textStyle={{ color: theme.text }}
                >
                  <View style={styles.priorityBadgeContent}>
                    {item.priority === 'essential' ? <Star size={12} color={theme.text} style={{ marginRight: 4 }} /> : null}
                    <Text style={[styles.badgeText, { color: theme.text }]}>{item.priority.toUpperCase()}</Text>
                  </View>
                </Badge>
              </View>
            </View>

            <Text style={styles.itemDesc}>{item.description}</Text>
            {item.quantity ? <Text style={styles.itemQty}>Quantity: {item.quantity}</Text> : null}
          </View>

        <View style={styles.itemRow}>
          <Checkbox checked={isChecked} onToggle={() => handleItemToggle(item.id)} />
        </View>
        </Pressable>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Survival Gear Checklist</Text>

        {/* Progress Overview */}
        <Card>
          {renderProgressRow('Essential Items', 'essential')}
          {renderProgressRow('Important Items', 'important')}
          {renderProgressRow('Useful Items', 'useful')}
        </Card>

        {/* Category Filter (chips zamiast Tabs) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  active ? styles.chipActive : null,
                ]}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Items */}
        <FlatList
          data={filteredItems}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        {/* Completion Summary */}
        {checkedIds.size > 0 && (
          <Card style={{ backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' }}>
            <View style={styles.summaryRow}>
              <Check size={20} color="#16a34a" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.summaryMain}>
                  {checkedIds.size} of {survivalItems.length} items completed
                </Text>
                <Text style={styles.summarySub}>
                  {completionStats.essential.checked === completionStats.essential.total
                    ? '✅ All essential items ready!'
                    : `${completionStats.essential.total - completionStats.essential.checked} essential items remaining`}
                </Text>
              </View>
            </View>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

// ───────────────────────────── Styles ─────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },

  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  progressLabel: { fontSize: 14, color: '#111827' },
  progressRight: { flexDirection: 'row', alignItems: 'center' },
  progressCount: { fontSize: 12, color: '#6b7280', marginRight: 8 },
  progressBarTrack: {
    width: 90,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%' },

  // Chips (Tabs)
  chipsRow: { paddingVertical: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  chipText: { fontSize: 12, color: '#111827' },
  chipTextActive: { color: '#fff', fontWeight: '600' },

  // Item row
  itemRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: '#10b981', borderColor: '#10b981' },

  itemBody: { flex: 1 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  strike: { textDecorationLine: 'line-through', color: '#6b7280' },

  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeBase: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  badgeSolid: { backgroundColor: '#111827' },
  badgeOutline: { borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#111827' },
  priorityBadgeContent: { flexDirection: 'row', alignItems: 'center' },

  itemDesc: { marginTop: 4, fontSize: 13, color: '#374151' },
  itemQty: { marginTop: 2, fontSize: 11, color: '#6b7280' },

  // Summary
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryMain: { color: '#065f46', fontWeight: '700' },
  summarySub: { color: '#047857', fontSize: 12 },
});
