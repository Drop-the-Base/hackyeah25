import React, { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { Star } from 'lucide-react-native';
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


// 🟢 Definicje kolorów dla priorytetów
const priorityTheme = {
  essential: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
  important: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  useful: { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
};

// 🧾 Dane przykładowe — możesz je podmienić na dynamiczne
const checklistItems = [
  { id: 1, name: 'Apteczka pierwszej pomocy', category: 'Bezpieczeństwo', priority: 'essential', description: 'Plastry, bandaże, środki odkażające.', quantity: 1 },
  { id: 2, name: 'Latarka', category: 'Sprzęt', priority: 'important', description: 'Najlepiej z zapasowymi bateriami.', quantity: 2 },
  { id: 3, name: 'Mapa papierowa', category: 'Nawigacja', priority: 'useful', description: 'Na wypadek braku zasięgu GPS.', quantity: 1 },
  { id: 4, name: 'Woda butelkowana', category: 'Żywność', priority: 'essential', description: 'Minimum 1,5L na osobę.', quantity: 4 },
  { id: 5, name: 'Powerbank', category: 'Sprzęt', priority: 'important', description: 'Naładowany i gotowy do użycia.', quantity: 1 },
];

export default function ChecklistScreen() {
  const [checkedIds, setCheckedIds] = useState(new Set());

  const handleItemToggle = (id) => {
    setCheckedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const renderItem = ({ item }) => {
    const isChecked = checkedIds.has(item.id);
    const theme = priorityTheme[item.priority] || priorityTheme.useful;

    return (
      <Pressable
        onPress={() => handleItemToggle(item.id)}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <Card
          style={[
            { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 },
            isChecked && { backgroundColor: '#ecfdf5', borderColor: '#86efac' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <Checkbox checked={isChecked} onToggle={() => handleItemToggle(item.id)} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Text
                  style={[
                    { fontSize: 16, fontWeight: '600', flexShrink: 1 },
                    isChecked && { textDecorationLine: 'line-through', color: '#9ca3af' },
                  ]}
                >
                  {item.name}
                </Text>

                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  <Badge outline>
                    <Text style={{ fontSize: 12 }}>{item.category}</Text>
                  </Badge>

                  <Badge
                    outline
                    style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      {item.priority === 'essential' ? (
                        <Star size={12} color={theme.text} />
                      ) : null}
                      <Text style={{ fontSize: 12, color: theme.text }}>
                        {item.priority.toUpperCase()}
                      </Text>
                    </View>
                  </Badge>
                </View>
              </View>

              <Text style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>
                {item.description}
              </Text>

              {item.quantity ? (
                <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                  Ilość: {item.quantity}
                </Text>
              ) : null}
            </View>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        <FlatList
          data={checklistItems}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}
