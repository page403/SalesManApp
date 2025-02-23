import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable, StatusBar, Modal, TextInput, Alert, Touchable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust the import path
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SummaryData {
  totalValue: number;
  percentageChange: number;
}

interface Customer {
  id: string;
  namaToko: string;
  alamat: string;
  limitCredit: string;
  jadwal: string;
  minggu: 'ganjil' | 'genap';
}

export default function Home() {
  const getDayInIndonesian = () => {
    const days = {
      0: 'Minggu',
      1: 'Senin',
      2: 'Selasa',
      3: 'Rabu',
      4: 'Kamis',
      5: 'Jumat',
      6: 'Sabtu'
    };
    return days[new Date().getDay() as keyof typeof days];
  };

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    namaToko: '',
    alamat: '',
    limitCredit: '2500000',
    jadwal: getDayInIndonesian(),
    minggu: 'ganjil'
  });
  const [todayVsYesterday, setTodayVsYesterday] = useState<SummaryData>({ totalValue: 0, percentageChange: 0 });
  const [todayVsMonthAvg, setTodayVsMonthAvg] = useState<SummaryData>({ totalValue: 0, percentageChange: 0 });
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const getWeekType = () => {
    // const currentDate = new Date();
    // const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    // const weekNumber = Math.ceil((((currentDate.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
    // return weekNumber % 2 === 0 ? 'genap' : 'ganjil';
    // Define the start date (Monday, February 24, 2025) which is "ganjil"
    const startDate = new Date('2025-02-24T00:00:00Z');
    
    // Calculate the difference in milliseconds between the given date and the start date
    const diffInMs = new Date().getTime() - startDate.getTime();
    
    // Convert the difference to weeks
    const weekNumber = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    
    // If the number of weeks is even, it's "genap", otherwise "ganjil"
    return weekNumber % 2 === 0 ? 'ganjil' : 'genap';
  };

  const fetchCustomers = async () => {
    try {
      const currentDay = getDayInIndonesian();
      const weekType = getWeekType();

      const { data, error } = await supabase
        .from('customer')
        .select('*')
        .eq('jadwal', currentDay)
        .eq('minggu', weekType);

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

  const searchCustomers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('customer')
        .select('*')
        .ilike('namaToko', `%${query}%`);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching customers:', error);
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
            jadwal: newCustomer.jadwal,
            minggu: newCustomer.minggu // Use the selected minggu value
          }
        ])
        .select();

      if (error) throw error;

      Alert.alert('Success', 'Customer added successfully');
      setModalVisible(false);
      setNewCustomer({
        namaToko: '',
        alamat: '',
        limitCredit: '2500000',
        jadwal: getDayInIndonesian(),
        minggu: 'ganjil'
      });
      
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      Alert.alert('Error', 'Failed to add customer');
    }
  };

  // Render each item in the FlatList
  const renderItem = ({ item }: { item: Customer }) => (
    <Link href={`/toko/${item.id}`} asChild>
      <Pressable>
        <View style={styles.item}>
          <StatusBar barStyle='dark-content' />
          <Text style={styles.title}>{item.namaToko}</Text>
          <Text style={styles.subtitle}>{item.alamat}</Text>
        </View>
      </Pressable>
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

  const DaySelector = () => (
    <View style={styles.daySelector}>
      {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            newCustomer.jadwal === day && styles.selectedDayButton
          ]}
          onPress={() => setNewCustomer(prev => ({ ...prev, jadwal: day }))}
        >
          <Text style={[
            styles.dayButtonText,
            newCustomer.jadwal === day && styles.selectedDayButtonText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHeader = () => (
    <>
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

    <Text style={styles.dayHeader}>
        {isSearching ? 'Search Results' : getDayInIndonesian()}
      </Text>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginLeft: 10}}> {getWeekType().toLocaleUpperCase()}</Text>
    </View>
      <View style={styles.widgetContainer}>
        <ComparisonWidget title="vs Yesterday" data={todayVsYesterday} />
        <ComparisonWidget title="vs Month Avg" data={todayVsMonthAvg} />
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.searchBarSticky}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customer..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              searchCustomers(text);
            }}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{alignSelf: 'center', flex:1}} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={isSearching ? searchResults : customers}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
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

            {/* <TextInput
              style={styles.input}
              placeholder="Jadwal"
              value={newCustomer.jadwal}
              onChangeText={(text) => setNewCustomer(prev => ({ ...prev, jadwal: text }))}
            /> */}

            <DaySelector />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minggu</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    newCustomer.minggu === 'ganjil' && styles.radioButtonSelected
                  ]}
                  onPress={() => setNewCustomer(prev => ({ ...prev, minggu: 'ganjil' }))}
                >
                  <Text>Ganjil (Pati)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    newCustomer.minggu === 'genap' && styles.radioButtonSelected
                  ]}
                  onPress={() => setNewCustomer(prev => ({ ...prev, minggu: 'genap' }))}
                >
                  <Text>Genap (Rembang)</Text>
                </TouchableOpacity>
              </View>
            </View>

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
        </KeyboardAvoidingView>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarSticky: {
    backgroundColor: 'transparent',
    paddingTop: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 16,  
    paddingHorizontal: 16,
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
    maxHeight: '80%',
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
    paddingVertical: 16,
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedDayButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dayHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});