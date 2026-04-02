import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupportPage() {
  const handleContact = (method: string) => {
    switch (method) {
      case 'email':
        Linking.openURL('mailto:support@zylo.app');
        break;
      case 'phone':
        Linking.openURL('tel:+2348000000000');
        break;
      case 'whatsapp':
        Linking.openURL('https://wa.me/2348000000000');
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support & Help</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('email')}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={24} color="lightgreen" />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSubtext}>support@zylo.app</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('phone')}>
          <View style={styles.iconContainer}>
            <Ionicons name="call-outline" size={24} color="lightgreen" />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Phone Support</Text>
            <Text style={styles.contactSubtext}>+234 800 000 0000</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('whatsapp')}>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-whatsapp" size={24} color="lightgreen" />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>WhatsApp Support</Text>
            <Text style={styles.contactSubtext}>Chat with us</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I post an errand?</Text>
          <Text style={styles.faqAnswer}>
            Tap the "+" button on the home screen, fill in the errand details, and submit. You'll be matched with available erranders.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I become an errander?</Text>
          <Text style={styles.faqAnswer}>
            Sign up with the "Errander" role during registration. Complete your profile and KYC verification to start accepting errands.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>What payment methods are accepted?</Text>
          <Text style={styles.faqAnswer}>
            We accept card payments, bank transfers, and mobile money through our secure payment partners.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color="lightgreen" />
          <Text style={styles.menuText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-outline" size={24} color="lightgreen" />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
    marginLeft: 15,
  },
  contactTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  contactSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  faqItem: {
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 16,
    color: 'lightgreen',
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
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
    marginLeft: 15,
  },
});
