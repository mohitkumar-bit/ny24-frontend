import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { categoryService, Category } from '@/services/category.service';

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: { category?: string; city?: string }) => void;
  initialFilters?: { category?: string; city?: string };
}

export const FilterModal = ({ isVisible, onClose, onApply, initialFilters }: FilterModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters?.category || '');
  const [city, setCity] = useState(initialFilters?.city || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories for filter:', error);
    }
  };

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      city: city.trim(),
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategory('');
    setCity('');
    onApply({});
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Filter Posts</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {/* City Filter */}
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter city (e.g. Ranchi)"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                {/* Category Filter */}
                <Text style={styles.sectionTitle}>Category</Text>
                <View style={styles.categoriesContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat._id}
                      style={[
                        styles.categoryChip,
                        selectedCategory === cat._id && styles.activeChip
                      ]}
                      onPress={() => setSelectedCategory(selectedCategory === cat._id ? '' : cat._id)}
                    >
                      <Ionicons 
                        name={cat.icon as any} 
                        size={16} 
                        color={selectedCategory === cat._id ? '#fff' : '#666'} 
                      />
                      <Text style={[
                        styles.categoryText,
                        selectedCategory === cat._id && styles.activeCategoryText
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ height: 40 }} />
              </ScrollView>

              <SafeAreaView style={styles.footer}>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                  <LinearGradient
                    colors={['#FF9500', '#FFD200']}
                    style={styles.applyGradient}
                  >
                    <Text style={styles.applyBtnText}>Apply Filter</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '60%',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeBtn: {
    padding: 5,
  },
  content: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  activeChip: {
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    backgroundColor: '#fff',
  },
  clearBtn: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  clearBtnText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
  },
  applyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
