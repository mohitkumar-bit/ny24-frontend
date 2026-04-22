import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { authService } from '@/services/auth.service';
import { workerService } from '@/services/worker.service';
import type { User } from '@/types';

const ProfileMenuItem = ({
  icon,
  title,
  onPress,
  textColor = '#000',
  iconColor = '#000'
}: {
  icon: keyof typeof Ionicons.glyphMap,
  title: string,
  onPress: () => void,
  textColor?: string,
  iconColor?: string
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemContent}>
      <Ionicons name={icon} size={22} color={iconColor} style={styles.menuIcon} />
      <Text style={[styles.menuTitle, { color: textColor }]}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/auth/login' as any);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FF9500', '#FFFFFF', '#FFFFFF']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => router.push('/edit-profile' as any)}>
              <Ionicons name="pencil-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* User Section */}
          <View style={styles.userSection}>
            <LinearGradient
              colors={['#FF9500', '#FFD200']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
            </LinearGradient>

            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || ''}</Text>

            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={16} color="#ccc" />
              <Text style={styles.locationText}>{user?.location || 'Location not set'}</Text>
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => router.push('/edit-profile' as any)}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            {!user?.isWorker && (
              <TouchableOpacity
                style={styles.workerBtn}
                onPress={() => router.push('/worker-register' as any)}
              >
                <LinearGradient
                  colors={['#FF9500', '#FFB800']}
                  style={styles.workerBtnGradient}
                >
                  <Ionicons name="briefcase" size={20} color="#fff" />
                  <Text style={styles.workerBtnText}>Become a Worker</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>My Ads</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Worker Profile Detail Section */}

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <ProfileMenuItem
              icon="megaphone-outline"
              title="My Ads"
              onPress={() => router.push('/my-ads' as any)}
            />
            {user?.isWorker && (
              <ProfileMenuItem
                icon="briefcase-outline"
                title="Working Profile"
                onPress={() => router.push('/worker-profile' as any)}
              />
            )}
            <ProfileMenuItem
              icon="star-outline"
              title="Subscription"
              onPress={() => router.push('/subscription' as any)}
            />
            <ProfileMenuItem
              icon="bookmark-outline"
              title="Saved Jobs"
              onPress={() => router.push('/saved' as any)}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionSubtitle}>Support & Legal</Text>

            <ProfileMenuItem
              icon="information-circle-outline"
              title="About Us"
              onPress={() => router.push('/about' as any)}
            />
            <ProfileMenuItem
              icon="help-buoy-outline"
              title="Help & Support"
              onPress={() => router.push('/support' as any)}
            />
            <ProfileMenuItem
              icon="document-text-outline"
              title="Terms & Conditions"
              onPress={() => router.push('/terms' as any)}
            />
            <ProfileMenuItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => router.push('/privacy' as any)}
            />

            <View style={styles.sectionDivider} />
            <ProfileMenuItem
              icon="trash-outline"
              title="Delete Account"
              textColor="#FF4D4D"
              onPress={() => { }}
              iconColor="#FF4D4D"
            />
            <ProfileMenuItem
              icon="log-out-outline"
              title="Logout"
              onPress={handleLogout}
              textColor="#FF4D4D"
              iconColor="#FF4D4D"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 120
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  userSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 5,
  },
  editBtn: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF9500',
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
  },
  editBtnText: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: 'bold',
  },
  workerBtn: {
    marginTop: 15,
    width: '100%',
  },
  workerBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  workerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF9500',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
    letterSpacing: 1,
  },
});
