import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export interface Worker {
  _id: string;
  title: string;
  skills: { _id: string; name: string; icon: string }[];
  hourlyRate: number;
  experience: string;
  location: { city: string; address: string };
  user: { _id: string; name: string };
  rating?: number;
  totalReviews?: number;
  availability?: boolean;
}

interface WorkerCardProps {
  worker: Worker;
}

export const WorkerCard = ({ worker }: WorkerCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: "/worker-details/[id]",
        params: { id: worker._id } as any
      })}
    >
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{worker.user.name[0]}</Text>
          <View style={[
            styles.statusDot,
            { backgroundColor: worker.availability !== false ? '#00A300' : '#FF4D4D' }
          ]} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{worker.user.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{worker.rating && worker.rating > 0 ? worker.rating : '4.5'}</Text>
            </View>
          </View>
          
          <Text style={styles.title} numberOfLines={1}>
            {worker.skills.map(s => s.name).join(', ') || 'Professional'}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.price}>{worker.hourlyRate}</Text>
            <Text style={styles.rateSuffix}>/hr</Text>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color="#666" />
            <Text style={styles.locationText} numberOfLines={1}>
              {worker.location.address || worker.location.city}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF9500',
    textTransform: 'uppercase',
  },
  infoSection: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  title: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  currency: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00A300',
    marginRight: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00A300',
  },
  rateSuffix: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    maxWidth: 80,
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 15,
    height: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
