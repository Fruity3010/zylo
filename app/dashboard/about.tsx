import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About Zylo</Text>
      </View>

      <View style={styles.logoSection}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>ZYLO</Text>
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.tagline}>Your Trusted Errand Marketplace</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is Zylo?</Text>
        <Text style={styles.description}>
          Zylo connects people who need errands done with trusted erranders in their area.
          Whether it's shopping, deliveries, or any task you need help with, Zylo makes it
          simple, safe, and affordable.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.description}>
          To create a platform where anyone can earn money by helping others with their daily
          tasks, while providing convenient and reliable errand services to those who need them.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect With Us</Text>

        <TouchableOpacity
          style={styles.socialItem}
          onPress={() => Linking.openURL('https://twitter.com/zyloapp')}
        >
          <Ionicons name="logo-twitter" size={24} color="lightgreen" />
          <Text style={styles.socialText}>Follow us on Twitter</Text>
          <Ionicons name="open-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialItem}
          onPress={() => Linking.openURL('https://instagram.com/zyloapp')}
        >
          <Ionicons name="logo-instagram" size={24} color="lightgreen" />
          <Text style={styles.socialText}>Follow us on Instagram</Text>
          <Ionicons name="open-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialItem}
          onPress={() => Linking.openURL('https://facebook.com/zyloapp')}
        >
          <Ionicons name="logo-facebook" size={24} color="lightgreen" />
          <Text style={styles.socialText}>Like us on Facebook</Text>
          <Ionicons name="open-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialItem}
          onPress={() => Linking.openURL('https://zylo.app')}
        >
          <Ionicons name="globe-outline" size={24} color="lightgreen" />
          <Text style={styles.socialText}>Visit our website</Text>
          <Ionicons name="open-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Licenses</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ in Nigeria</Text>
        <Text style={styles.footerText}>© 2026 Zylo. All rights reserved.</Text>
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
  logoSection: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#111',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#118c55ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  version: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'lightgreen',
    fontStyle: 'italic',
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
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
  },
  socialText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  footer: {
    alignItems: 'center',
    padding: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});
