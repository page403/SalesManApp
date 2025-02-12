import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '@/utils/supabase';

interface OrderDetail {
  id: number;
  totalValue: number;
  quantity: number;
  created_at: string;
  products: {
    id: number;
    productName: string;
  };
}

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch customer name
      const { data: customerData } = await supabase
        .from('customer')
        .select('namaToko')
        .eq('id', id)
        .single();

      if (customerData) {
        setCustomerName(customerData.namaToko);
      }

      // Fetch order details with product information
      const { data: orderData, error } = await supabase
        .from('order')
        .select(`
          id,
          totalValue,
          quantity,
          created_at,
          products (
            id,
            productName
          )
        `)
        .eq('customerId', id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      if (error) throw error;

      // Merge orders with the same product ID
      const mergedOrders = orderData?.reduce((acc: OrderDetail[], current) => {
        const existingOrder = acc.find(
          order => order.products.id === current.products.id
        );

        if (existingOrder) {
          existingOrder.quantity += current.quantity;
          existingOrder.totalValue += current.totalValue;
        } else {
          acc.push(current);
        }

        return acc;
      }, []) || [];

      setOrders(mergedOrders);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: OrderDetail }) => (
    <View style={styles.orderItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.products.productName}</Text>
        {/* <Text style={styles.orderTime}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text> */}
        <Text style={styles.quantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.orderValue}>
        Rp {item.totalValue.toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Order Detail',
          headerShown: true
        }} 
      />
      <View style={styles.container}>
        <Text style={styles.customerName}>{customerName}</Text>
        <Text style={styles.dateHeader}>
          {new Date().toLocaleDateString()}
        </Text>
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            Rp {orders.reduce((sum, order) => sum + order.totalValue, 0).toLocaleString()}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 4,
  },
  dateHeader: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  orderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  totalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
}); 