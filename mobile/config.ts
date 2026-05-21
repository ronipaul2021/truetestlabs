import { Platform } from 'react-native';

export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const COLORS = {
  PRIMARY: '#2563EB', // Vibrant Blue
  SUCCESS: '#10B981', // Vibrant Green
  DANGER: '#EF4444',  // Vibrant Red
  WHITE: '#FFFFFF',
  TEXT_MUTED: '#64748B',
  BG_LIGHT: '#F8FAFC',
  DARK_BLUE: '#1E3A8A',
};
