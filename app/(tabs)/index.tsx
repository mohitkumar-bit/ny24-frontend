import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text, SafeAreaView, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { HomeHeader } from '@/components/home/HomeHeader';
import { CategoryList } from '@/components/home/CategoryList';
import { FeedCard, Post } from '@/components/home/FeedCard';
import { FloatingButton } from '@/components/home/FloatingButton';
import { jobService, JobPost } from '@/services/job.service';
import { FilterModal } from '@/components/home/FilterModal';

const mapBackendToPost = (job: JobPost): Post => ({
  id: job._id,
  title: job.title,
  category: job.categories && job.categories.length > 0
    ? job.categories.map((c: any) => c.name).join(', ')
    : 'General',
  price: `₹${job.price}`,
  location: job.location?.address || 'Unknown',
  author: typeof job.author === 'object' ? job.author.name : 'Anonymous',
  time: new Date(job.createdAt).toLocaleDateString(),
  gradient: ['#FF9500', '#FFD200'],
  icon: job.categories && job.categories.length > 0
    ? job.categories[0].icon
    : 'briefcase-outline',
});

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Electrician Available – Home & Commercial Wiring',
    category: 'Electric',
    price: '₹800',
    location: 'Bistupur, Jamshedpur',
    author: 'Ravi Kumar',
    time: '2h ago',
    gradient: ['#FF9500', '#FFD200'],
    icon: 'flash-outline',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'AC Taxi Driver – City & Outstation Trips',
    category: 'Taxi',
    price: '₹1500',
    location: 'Sakchi, Jamshedpur',
    author: 'Sameer Singh',
    time: '4h ago',
    gradient: ['#6A11CB', '#2575FC'],
    icon: 'car-outline',
    isFeatured: true,
  },
];

import { saveService } from '@/services/save.service';

const HEADER_HEIGHT = 180;

export default function HomeScreen() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<{ category?: string; city?: string }>({});

  const scrollY = useRef(new Animated.Value(0)).current;

  const clampedScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = clampedScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (filters: any = activeFilters) => {
    setLoading(true);
    try {
      const [jobs, savedJobs] = await Promise.all([
        jobService.getJobs(filters),
        saveService.getSavedJobs().catch(() => [])
      ]);

      const savedIds = new Set(savedJobs.map((j: any) => j._id));

      setPosts(jobs.map((job: JobPost) => ({
        ...mapBackendToPost(job),
        isSaved: savedIds.has(job._id)
      })));
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    fetchJobs(filters);
  };
  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Feed Stats - Stays in scrollable area */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>{posts.length} posts found</Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortText}>Newest</Text>
          <Ionicons name="chevron-down" size={16} color="#00A300" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FF9500', '#FFFFFF', '#FFFFFF', '#00A300']}
        locations={[0, 0.25, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Sticky Animated Header Section */}
        <Animated.View
          style={[
            styles.stickyHeader,
            {
              transform: [{ translateY: headerTranslateY }],
              opacity: headerOpacity
            }
          ]}
        >
          <LinearGradient
            colors={['#FF9500', '#FFFFFF']}
            style={StyleSheet.absoluteFill}
          />
          <HomeHeader />

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                placeholder="Search posts, jobs, service..."
                placeholderTextColor="#999"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setIsFilterVisible(true)}
            >
              <Ionicons name="options-outline" size={20} color="#fff" />
              {Object.keys(activeFilters).length > 0 && <View style={styles.filterBadge} />}
            </TouchableOpacity>
          </View>

          <CategoryList
            activeCategoryId={activeFilters.category || 'all'}
            onSelectCategory={(id) => handleApplyFilters({ ...activeFilters, category: id === 'all' ? undefined : id })}
          />
        </Animated.View>

        <Animated.FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedCard post={item} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshing={loading}
          onRefresh={fetchJobs}
          ListHeaderComponent={() => (
            <View>
              <View style={{ height: HEADER_HEIGHT + 20 }} />
              {renderHeader()}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <View >
        <FloatingButton />
      </View>

      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        initialFilters={activeFilters}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 7,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listHeader: {
    marginBottom: 5,
  },
  searchContainer: {
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
  filterBtn: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  statsText: {
    paddingTop: 10,
    fontSize: 14,
    color: '#666',
  },
  sortBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00A300',
  },
  filterBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: '#FF4D4D',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
});
