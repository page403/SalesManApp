import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Modal, TextInput, Alert } from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust the import path
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    namaToko: '',
    alamat: '',
    limitCredit: '2500000',
    jadwal: 'Senin'
  });

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customer')
        .select('*');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!newCustomer.namaToko || !newCustomer.alamat || !newCustomer.jadwal) {
        Alert.alert('Error', 'Nama Toko, Alamat, and Jadwal are required');
        return;
      }

      const { data, error } = await supabase
        .from('customer')
        .insert([
          {
            namaToko: newCustomer.namaToko,
            alamat: newCustomer.alamat,
            limitCredit: parseInt(newCustomer.limitCredit),
            jadwal: newCustomer.jadwal
          }
        ])
        .select();

      if (error) throw error;

      Alert.alert('Success', 'Customer added successfully');
      setModalVisible(false);
      // Reset form
      setNewCustomer({
        namaToko: '',
        alamat: '',
        limitCredit: '2500000',
        jadwal: 'Senin'
      });
      
      // Refresh your customer list here if needed
      fetchCustomers(); // Assuming you have this function to refresh the list
    } catch (error) {
      console.error('Error adding customer:', error);
      Alert.alert('Error', 'Failed to add customer');
    }
  };

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <Link href={`/toko/${item.id}`} asChild>
      <TouchableOpacity>
        <View style={styles.item}>
          <StatusBar barStyle='dark-content' />
          <Text style={styles.title}>{item.namaToko}</Text>
          <Text style={styles.subtitle}>{item.alamat}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={customers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Customer</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nama Toko"
              value={newCustomer.namaToko}
              onChangeText={(text) => setNewCustomer(prev => ({ ...prev, namaToko: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Alamat"
              value={newCustomer.alamat}
              onChangeText={(text) => setNewCustomer(prev => ({ ...prev, alamat: text }))}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Limit Credit"
              value={newCustomer.limitCredit}
              onChangeText={(text) => setNewCustomer(prev => ({ ...prev, limitCredit: text }))}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Jadwal"
              value={newCustomer.jadwal}
              onChangeText={(text) => setNewCustomer(prev => ({ ...prev, jadwal: text }))}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});