import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { jobService } from '@/services/job.service';
import { categoryService, Category } from '@/services/category.service';

export default function CreatePostScreen() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
      if (data.length > 0) setSelectedCategories([data[0]]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setFetchingCategories(false);
    }
  };

  const handlePublish = async () => {
    if (!title || selectedCategories.length === 0 || !location || !description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await jobService.createJob({
        title,
        categories: selectedCategories.map(c => c._id),
        price: Number(price) || 0,
        location: {
          address: location,
          city: '', // Could be parsed or added as another field
          state: ''
        },
        description
      });
      alert('Post published successfully!');
      router.replace('/(tabs)');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
            <Text style={styles.infoText}>
              Your post will be visible for 7 days at no cost.
            </Text>
          </View>

          {/* Image Upload Area */}
          <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
            <View style={styles.uploadInner}>
              <Ionicons name="image-outline" size={40} color="#FF9500" />
              <Text style={styles.uploadTitle}>Add Photo (Optional)</Text>
              <Text style={styles.uploadSub}>Camera or Gallery</Text>
            </View>
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.form}>
            <CustomInput
              label="Title *"
              placeholder="E.g. Plumber for house work"
              value={title}
              onChangeText={setTitle}
              icon="text-outline"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categories *</Text>
              <TouchableOpacity
                style={styles.pickerTrigger}
                onPress={() => setShowCategoryModal(true)}
              >
                <Ionicons name="shapes-outline" size={22} color="#666" style={styles.inputIcon} />
                <View style={styles.selectedTagsContainer}>
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(cat => (
                      <View key={cat._id} style={styles.miniBadge}>
                        <Text style={styles.miniBadgeText}>{cat.name}</Text>
                        <TouchableOpacity
                          onPress={() => setSelectedCategories(selectedCategories.filter(c => c._id !== cat._id))}
                          style={styles.removeIcon}
                        >
                          <Ionicons name="close-circle" size={16} color="#FF9500" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.pickerText}>Select Categories</Text>
                  )}
                </View>
                <Ionicons name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <CustomInput
              label="Price (₹) — leave blank for Free"
              placeholder="Enter amount"
              value={price}
              onChangeText={setPrice}
              icon="cash-outline"
              keyboardType="numeric"
            />

            <CustomInput
              label="Location *"
              placeholder="e.g. Bistupur, Jamshedpur"
              value={location}
              onChangeText={setLocation}
              icon="location-outline"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <View style={styles.textAreaContainer}>
                <Ionicons name="document-text-outline" size={22} color="#666" style={styles.textAreaIcon} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Tell us more about what you're posting..."
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => {
                const isSelected = selectedCategories.some(c => c._id === item._id);
                return (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedCategories(selectedCategories.filter(c => c._id !== item._id));
                      } else {
                        setSelectedCategories([...selectedCategories, item]);
                      }
                    }}
                  >
                    <View style={styles.categoryIconContainer}>
                      <Ionicons name={item.icon as any} size={20} color="#FF9500" />
                    </View>
                    <Text style={styles.categoryItemText}>{item.name}</Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#00A300" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.publishBtn, loading && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={handlePublish}
          disabled={loading}
        >
          <Text style={styles.publishBtnText}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA', // Light green
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
  },
  freeBadge: {
    backgroundColor: '#00A300', // Solid green
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  uploadArea: {
    width: '100%',
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFD79D', // Light orange border
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  uploadInner: {
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9500',
    marginTop: 10,
  },
  uploadSub: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.7,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  selectedTagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniBadge: {
    backgroundColor: '#FFF5E6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0CC',
    gap: 4,
  },
  miniBadgeText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  removeIcon: {
    padding: 2,
  },
  textAreaContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 120,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  publishBtn: {
    backgroundColor: '#00A300', // Green
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  publishBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '70%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalList: {
    padding: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
