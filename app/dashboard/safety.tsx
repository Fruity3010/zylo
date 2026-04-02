import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SafetyPage() {
  const handleSOS = () => {
    Alert.alert('SOS Alert', 'Emergency contacts will be notified');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Center</Text>
      </View>

      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <Ionicons name="warning" size={32} color="white" />
        <Text style={styles.sosText}>EMERGENCY SOS</Text>
        <Text style={styles.sosSubtext}>Tap to alert emergency contacts</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Features</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="lightgreen" />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Share Live Location</Text>
            <Text style={styles.menuSubtext}>Share your location during errands</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="people-outline" size={24} color="lightgreen" />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Emergency Contacts</Text>
            <Text style={styles.menuSubtext}>Manage trusted contacts</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="lightgreen" />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Safety Notifications</Text>
            <Text style={styles.menuSubtext}>Get alerts for unusual activity</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={24} color="lightgreen" />
          <Text style={styles.tipText}>
            Always verify the identity of your errander before sharing personal information
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={24} color="lightgreen" />
          <Text style={styles.tipText}>
            Use in-app chat instead of sharing your phone number
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'lightgreen',
  },
  sosButton: {
    backgroundColor: '#ff4444',
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  sosText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  sosSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#111',
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuContent: {
    flex: 1,
    marginLeft: 15,
  },
  menuText: {
    fontSize: 16,
    color: 'white',
  },
  menuSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#ccc',
    marginLeft: 15,
    lineHeight: 20,
  },
});
