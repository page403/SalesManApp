import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Modal, TextInput, Alert } from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust the import path
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SummaryData {
  totalValue: number;
  percentageChange: number;
}

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
  const [todayVsYesterday, setTodayVsYesterday] = useState<SummaryData>({ totalValue: 0, percentageChange: 0 });
  const [todayVsMonthAvg, setTodayVsMonthAvg] = useState<SummaryData>({ totalValue: 0, percentageChange: 0 });

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

  const fetchSummaryData = async () => {
    try {
      // Get today's total
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: todayData } = await supabase
        .from('order')
        .select('totalValue')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      // Get yesterday's total
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: yesterdayData } = await supabase
        .from('order')
        .select('totalValue')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString());

      // Get month data
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const { data: monthData } = await supabase
        .from('order')
        .select('totalValue, created_at')
        .gte('created_at', monthStart.toISOString())
        .lt('created_at', tomorrow.toISOString());

      const todayTotal = todayData?.reduce((sum, order) => sum + order.totalValue, 0) || 0;
      const yesterdayTotal = yesterdayData?.reduce((sum, order) => sum + order.totalValue, 0) || 0;
      
      // Calculate month average excluding today
      const monthOrders = monthData?.filter(order => new Date(order.created_at).getDate() !== today.getDate());
      const monthDays = new Set(monthOrders?.map(order => new Date(order.created_at).getDate())).size;
      const monthAverage = monthDays ? (monthOrders?.reduce((sum, order) => sum + order.totalValue, 0) || 0) / monthDays : 0;

      setTodayVsYesterday({
        totalValue: todayTotal,
        percentageChange: yesterdayTotal ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0
      });

      setTodayVsMonthAvg({
        totalValue: todayTotal,
        percentageChange: monthAverage ? ((todayTotal - monthAverage) / monthAverage) * 100 : 0
      });

    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchSummaryData();
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

  const ComparisonWidget = ({ title, data }: { title: string, data: SummaryData }) => (
    <View style={[
      styles.widget,
      { backgroundColor: data.percentageChange >= 0 ? '#e7f5e9' : '#ffebee' }
    ]}>
      <Text style={styles.widgetTitle}>{title}</Text>
      <Text style={styles.widgetValue}>Rp {data.totalValue.toLocaleString()}</Text>
      <View style={styles.percentageContainer}>
        <Ionicons 
          name={data.percentageChange >= 0 ? 'arrow-up' : 'arrow-down'} 
          size={16} 
          color={data.percentageChange >= 0 ? '#2e7d32' : '#c62828'} 
        />
        <Text style={[
          styles.percentageText,
          { color: data.percentageChange >= 0 ? '#2e7d32' : '#c62828' }
        ]}>
          {Math.abs(data.percentageChange).toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.widgetContainer}>
        <ComparisonWidget title="vs Yesterday" data={todayVsYesterday} />
        <ComparisonWidget title="vs Month Avg" data={todayVsMonthAvg} />
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={customers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
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
  widgetContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
    marginBottom: 16,
  },
  widget: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  widgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});