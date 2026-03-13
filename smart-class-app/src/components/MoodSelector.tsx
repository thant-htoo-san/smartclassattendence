import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MoodSelectorProps {
  value: number;
  onChange: (mood: number) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => {
  const moods = [
    { level: 1, emoji: '😡', label: 'Very Negative' },
    { level: 2, emoji: '🙁', label: 'Negative' },
    { level: 3, emoji: '😐', label: 'Neutral' },
    { level: 4, emoji: '🙂', label: 'Positive' },
    { level: 5, emoji: '😄', label: 'Very Positive' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>How is your mood?</Text>
      <View style={styles.moods}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.level}
            style={[
              styles.moodButton,
              value === mood.level && styles.moodButtonActive,
            ]}
            onPress={() => onChange(mood.level)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.moodLabel,
                value === mood.level && styles.moodLabelActive,
              ]}
            >
              {mood.level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {value > 0 && (
        <Text style={styles.selected}>
          Selected: {moods.find((m) => m.level === value)?.label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  moods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  moodButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  moodButtonActive: {
    borderColor: '#FFB300',
    backgroundColor: '#FFF8E1',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  moodLabelActive: {
    color: '#FFB300',
  },
  selected: {
    textAlign: 'center',
    fontSize: 12,
    color: '#FFB300',
    fontWeight: '600',
  },
});
