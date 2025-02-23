import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Button } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityIndicator } from 'react-native';

interface OrderSummary {
  customerId: string;
  namaToko: string;
  totalValue: number;
  orderCount: number;
}

export default function Cart() {
  const [orderSummaries, setOrderSummaries] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalDayValue, setTotalDayValue] = useState(0);

  useEffect(() => {
    fetchOrdersByDate(selectedDate);
  }, [selectedDate]);

  const fetchOrdersByDate = async (date: Date) => {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      // Fetch orders with customer details
      const { data: orders, error } = await supabase
        .from('order')
        .select(`
          *,
          customer:customerId (
            namaToko
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());

      if (error) throw error;

      // Calculate total value for the day
      const dayTotal = orders.reduce((sum, order) => sum + order.totalValue, 0);
      setTotalDayValue(dayTotal);

      // Group orders by customer
      const summaries = orders.reduce((acc: { [key: string]: OrderSummary }, order) => {
        const customerId = order.customerId;
        if (!acc[customerId]) {
          acc[customerId] = {
            customerId,
            namaToko: order.customer.namaToko,
            totalValue: 0,
            orderCount: 0
          };
        }
        acc[customerId].totalValue += order.totalValue;
        acc[customerId].orderCount += 1;
        return acc;
      }, {});

      setOrderSummaries(Object.values(summaries));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerPress = (customerId: string) => {
    router.push(`/order-detail/${customerId}`);
  };

  const renderItem = ({ item }: { item: OrderSummary }) => (
    <TouchableOpacity 
      style={styles.orderItem}
      onPress={() => handleCustomerPress(item.customerId)}
    >
      <View>
        <Text style={styles.storeName}>{item.namaToko}</Text>
        <Text style={styles.orderCount}>Orders: {item.orderCount}</Text>
      </View>
      <Text style={styles.totalValue}>
        Rp {item.totalValue.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchOrdersByDate(selectedDate);
    } finally {
      setRefreshing(false);
    }
  }, [selectedDate]);

  const onDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{alignSelf: 'center', flex:1}} size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>
            Orders for {selectedDate.toLocaleDateString()}
          </Text> 
        </View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>Select Date</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <FlatList
        data={orderSummaries}
        renderItem={renderItem}
        keyExtractor={(item) => item.customerId}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      />

      <View style={styles.totalContainer}>
      <Text style={styles.subHeader}>
            EC: {orderSummaries.length}
          </Text>
        <Text style={styles.totalText}>
          Total Value: Rp {totalDayValue.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
  },
  dateButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6,
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderCount: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  totalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});