import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { categoryService, Category } from '@/services/category.service';

interface CategoryListProps {
  onSelectCategory: (id: string) => void;
  activeCategoryId: string;
}

export const CategoryList = ({ onSelectCategory, activeCategoryId }: CategoryListProps) => {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories([{ _id: 'all', name: 'All', icon: 'grid-outline' }, ...data]);
    } catch (error) {
      console.error('Error fetching categories for list:', error);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={[
            styles.chip,
            activeCategoryId === item._id && styles.activeChip
          ]}
          onPress={() => onSelectCategory(item._id)}
        >
          <Ionicons
            name={item.icon as any}
            size={15}
            color={activeCategoryId === item._id ? '#fff' : '#666'}
            style={styles.icon}
          />
          <Text style={[
            styles.chipText,
            activeCategoryId === item._id && styles.activeChipText
          ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeChip: {
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
  },
  icon: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeChipText: {
    color: '#fff',
  },
});
