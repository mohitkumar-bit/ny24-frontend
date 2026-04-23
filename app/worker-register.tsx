import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { workerService } from '@/services/worker.service';
import { authService } from '@/services/auth.service';
import { categoryService, Category } from '@/services/category.service';
import { CustomInput } from '@/components/CustomInput';

export default function WorkerRegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [interestedInLongDistance, setInterestedInLongDistance] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCategories(), checkExistingProfile()]);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const user = await authService.getProfile();
      if (user.isWorker) {
        setIsEdit(true);
        const workerData = await workerService.getMyProfile();
        const profile = workerData.profile;
        
        setTitle(profile.title);
        setDescription(profile.description);
        setSelectedSkills(profile.skills.map((s: any) => s._id));
        setExperience(String(profile.experience || '0'));
        setHourlyRate(String(profile.hourlyRate || '0'));
        setAddress(profile.location?.address || '');
        setCity(profile.location?.city || '');
        setAge(String(profile.age || ''));
        setGender(profile.gender || '');
        setInterestedInLongDistance(profile.interestedInLongDistance || false);
      }
    } catch (err) {
      console.error('Error checking existing worker profile:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const toggleSkill = (id: string) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills(selectedSkills.filter(s => s !== id));
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
  };

  const handleSubmit = async () => {
    console.log('SUBMITTING PROFILE...', { title, hourlyRate, selectedSkills: selectedSkills.length });
    
    if (!title || !hourlyRate || selectedSkills.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields (Title, Skills, and Hourly Rate)');
      return;
    }

    const payload = {
      title,
      description,
      skills: selectedSkills,
      experience: Number(experience),
      hourlyRate: Number(hourlyRate),
      location: {
        type: 'Point',
        address,
        city,
        coordinates: [0, 0]
      },
      age: age ? Number(age) : undefined,
      gender: gender || undefined,
      interestedInLongDistance
    };

    setLoading(true);
    try {
      if (isEdit) {
        await workerService.updateProfile(payload);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        await workerService.createProfile(payload);
        Alert.alert('Success', 'Worker profile created successfully!');
      }
      router.replace('/(tabs)/profile');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Working Profile' : 'Become a Worker'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Professional Info</Text>

        <CustomInput
          label="Professional Title *"
          placeholder="e.g. Expert Electrician"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us about your experience and services..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <Text style={styles.sectionTitle}>Skills / Categories *</Text>
        <View style={styles.skillsContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat._id}
              style={[
                styles.skillBadge,
                selectedSkills.includes(cat._id) && styles.skillBadgeSelected
              ]}
              onPress={() => toggleSkill(cat._id)}
            >
              <Text style={[
                styles.skillText,
                selectedSkills.includes(cat._id) && styles.skillTextSelected
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <CustomInput
              label="Experience (Years)"
              placeholder="0"
              value={experience}
              onChangeText={setExperience}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomInput
              label="Hourly Rate (₹) *"
              placeholder="0"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <CustomInput
          label="Address"
          placeholder="Flat, House, Area"
          value={address}
          onChangeText={setAddress}
        />
        <CustomInput
          label="City"
          placeholder="Jamshedpur"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.row}>
          <View style={{ flex: 0.35, marginRight: 15 }}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              placeholder="e.g. 25"
              value={age}
              style={styles.input}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 0.65 }}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={[
                styles.dropdownText,
                !gender && { color: '#999' }
              ]}>
                {gender || 'Select'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={showGenderModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowGenderModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {['Male', 'Female', 'Other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionBtn}
                  onPress={() => {
                    setGender(option as any);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    gender === option && styles.optionTextSelected
                  ]}>{option}</Text>
                  {gender === option && (
                    <Ionicons name="checkmark" size={20} color="#00A300" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>Interested in Long Distance Work?</Text>
            <Text style={styles.toggleSubLabel}>Check this if you can travel far for jobs</Text>
          </View>
          <Switch
            value={interestedInLongDistance}
            onValueChange={setInterestedInLongDistance}
            trackColor={{ false: '#767577', true: '#00A300' }}
            thumbColor={interestedInLongDistance ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>{isEdit ? 'Update Profile' : 'Create Worker Profile'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  skillBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillBadgeSelected: {
    backgroundColor: '#00A300',
    borderColor: '#00A300',
  },
  skillText: {
    color: '#4B5563',
    fontSize: 14,
  },
  skillTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  submitBtn: {
    backgroundColor: '#00A300',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    shadowColor: '#00A300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  optionTextSelected: {
    color: '#00A300',
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  toggleSubLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
