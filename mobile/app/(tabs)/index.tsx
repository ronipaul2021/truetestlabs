import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL, COLORS } from '../../config';

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Center {
  id: number;
  generatedId: string;
  name: string;
  phoneNumber: string;
  services: Service[];
}

export default function HomeScreen() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCenters = async () => {
    try {
      const response = await fetch(`${API_URL}/centers`);
      const data = await response.json();
      setCenters(data.centers);
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const renderItem = ({ item }: { item: Center }) => (
    <View style={styles.centerCard}>
      <View style={styles.centerInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.centerName}>{item.name}</Text>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.SUCCESS} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        </View>
        <Text style={styles.centerPhone}>{item.phoneNumber}</Text>
        
        {/* Services List */}
        <View style={styles.servicesContainer}>
          {item.services.map((service: Service) => (
            <View key={service.id} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{service.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Locating nearest clinics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={centers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCenters(); }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No diagnostic centers found nearby.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_LIGHT,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  centerCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  centerPhone: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  badgeText: {
    color: COLORS.SUCCESS,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  serviceText: {
    fontSize: 11,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
  },
});
