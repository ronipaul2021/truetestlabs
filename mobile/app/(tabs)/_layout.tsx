import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function TabLayout() {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/');
  };

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#1E3A8A', 
      headerTitleStyle: { color: '#1E3A8A', fontWeight: 'bold' },
      tabBarStyle: { height: 60, paddingBottom: 10 },
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
          <Ionicons name="log-out-outline" size={24} color="#1E3A8A" />
        </TouchableOpacity>
      )
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nearby Clinics',
          tabBarIcon: ({ color }) => <Ionicons name="medical" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="prescription"
        options={{
          title: 'Drop Prescription',
          tabBarIcon: ({ color }) => <Ionicons name="cloud-upload" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
