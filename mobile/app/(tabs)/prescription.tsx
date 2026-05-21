import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { API_URL, COLORS } from '../../config';

export default function PrescriptionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to upload prescriptions.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSuccess(false);
    }
  };

  const uploadPrescription = async () => {
    if (!image) return;

    setUploading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      const formData = new FormData();
      const filename = image.split('/').pop() || 'prescription.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('prescription', {
        uri: image,
        name: filename,
        type: type,
      } as any);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        setImage(null);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={80} color="#14B8A6" />
          <Text style={styles.successTitle}>Sent successfully!</Text>
          <Text style={styles.successSubtitle}>
            Clinics will text you their quotes shortly.
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => setSuccess(false)}
          >
            <Text style={styles.primaryButtonText}>Send Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prescription Drop</Text>
        <Text style={styles.subtitle}>Upload your prescription to get quotes from the 5 nearest labs.</Text>
      </View>

      <TouchableOpacity 
        style={[styles.uploadBox, image ? styles.uploadBoxWithImage : null]} 
        onPress={pickImage}
        disabled={uploading}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={48} color="#1E3A8A" />
            <Text style={styles.uploadText}>Select Handwritten Prescription</Text>
          </>
        )}
      </TouchableOpacity>

      {image && (
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={uploadPrescription}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Send to Nearest Centers</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {image && !uploading && (
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => setImage(null)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadBox: {
    height: 240,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG_LIGHT,
    marginBottom: 24,
    overflow: 'hidden',
  },
  uploadBoxWithImage: {
    borderStyle: 'solid',
    borderColor: COLORS.PRIMARY,
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  successCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#134E4A',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.SUCCESS,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});
