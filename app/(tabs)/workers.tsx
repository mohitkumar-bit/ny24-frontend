import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { workerService } from '@/services/worker.service';
import { CategoryList } from '@/components/home/CategoryList';
import { WorkerCard, Worker } from '@/components/workers/WorkerCard';
import { Skeleton } from '@/components/Skeleton';
import { FilterModal } from '@/components/home/FilterModal';

const WorkersScreen = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const workersData = await workerService.searchWorkers();
      setWorkers(workersData);
    } catch (error) {
      console.error('Error fetching workers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, filters: any = activeFilters) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const params: any = { ...filters };
      if (query) params.city = query;
      
      const data = await workerService.searchWorkers(params);
      setWorkers(data);
    } catch (error) {
      console.error('Error searching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    const newCategory = activeCategory === categoryId ? null : categoryId;
    setActiveCategory(newCategory);
    const updatedFilters = { ...activeFilters, category: newCategory || undefined };
    setActiveFilters(updatedFilters);
    handleSearch(searchQuery, updatedFilters);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setActiveCategory(filters.category || null);
    setSearchQuery(filters.city || '');
    handleSearch(filters.city || '', filters);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <Text style={styles.headerTitle}>Find Workers</Text>
        <TouchableOpacity style={styles.mapBtn}>
          <Ionicons name="map-outline" size={20} color="#FF9500" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={22} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Search posts, jobs, service..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); handleSearch('', { ...activeFilters, city: undefined }); }}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterBtnMain}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={24} color="#fff" />
          {Object.keys(activeFilters).length > 0 && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <CategoryList 
          activeCategoryId={activeCategory || 'all'} 
          onSelectCategory={(id) => handleCategorySelect(id === 'all' ? null : id)} 
        />
      </View>
      
      <View style={styles.resultsRow}>
        <Text style={styles.resultsCount}>{workers.length} workers available</Text>
       
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FF9500', '#FFFFFF', '#FFFFFF']}
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={loading ? ([1, 2, 3, 4] as any) : workers}
          keyExtractor={(item, index) => (loading ? `skeleton-${index}` : (item as Worker)._id)}
          renderItem={({ item }) => loading ? (
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonContent}>
                <Skeleton width={48} height={48} borderRadius={24} />
                <View style={styles.skeletonInfo}>
                  <Skeleton width="60%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
                  <Skeleton width="40%" height={14} borderRadius={4} />
                </View>
                <View style={styles.skeletonRight}>
                  <Skeleton width={60} height={22} borderRadius={4} style={{ marginBottom: 8 }} />
                  <Skeleton width={50} height={14} borderRadius={4} />
                </View>
              </View>
            </View>
          ) : (
            <WorkerCard worker={item as Worker} />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF9500"
              colors={["#FF9500"]}
            />
          }
          ListEmptyComponent={!loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No workers found matching your criteria</Text>
            </View>
          ) : null}
        />
      </SafeAreaView>

      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        initialFilters={activeFilters}
        onApply={handleApplyFilters}
      />
    </View>
  );
};

export default WorkersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingTop:20,
    paddingBottom: 10,
  },
  topRow: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  mapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

    searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterBtnMain: {
    width: 50,
    height: 50,
    backgroundColor: '#FF9500',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  filterBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    backgroundColor: '#FF4D4D',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  categoriesSection: {
    width: "100%",
    marginBottom: 0,
  },
  categoryList: {
    paddingRight: 20,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  skeletonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonInfo: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
});