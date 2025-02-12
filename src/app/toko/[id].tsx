import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Image } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';

// Add this interface near the top of the file
interface Toko {
  namaToko: string;
  alamat: string;
}

interface Product {
  id: number;
  productName: string;
  pricePerCarton: number;
  pricePerMiddle: number;
  pricePerPcs: number;
  category: string;
  productImg: string;
}

interface OrderItem {
  productId: number;
  quantity: string;
  pricePerUnit: number;
}

export default function Toko() {
  const { id } = useLocalSearchParams();
  const [toko, setToko] = useState<Toko | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<{ [key: number]: OrderItem }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch toko details
        const { data: tokoData, error: tokoError } = await supabase
          .from('customer')
          .select('*')
          .eq('id', id)
          .single();

        if (tokoError) throw tokoError;
        setToko(tokoData);

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (productId: number, quantity: string, pricePerUnit: number) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        productId,
        quantity,
        pricePerUnit
      }
    }));
  };

  const calculateTotal = () => {
    const total = Object.values(orderItems).reduce((total, item) => {
      const quantity = parseInt(item.quantity) || 0;
      return total + (quantity * item.pricePerUnit);
    }, 0);
    
    return total.toLocaleString('id-ID'); // Format number with Indonesian locale
  };

  const handleSubmitOrder = async () => {
    try {
      const orderDetails = Object.values(orderItems).filter(item => parseInt(item.quantity) > 0);
      
      if (orderDetails.length === 0) {
        Alert.alert('Error', 'Please add at least one item to order');
        return;
      }

      // Prepare order rows for each product
      const orderRows = orderDetails.map(item => ({
        customerId: id,
        totalValue: parseInt(item.quantity) * item.pricePerUnit,
        status: 'pending',
        products: item.productId,
        quantity: parseInt(item.quantity)
      }));

      // Insert all orders at once
      const { data, error } = await supabase
        .from('order')
        .insert(orderRows)
        .select();

      if (error) {
        console.error('Order creation error:', error);
        throw error;
      }

      Alert.alert('Success', 'Order placed successfully', [
        {
          text: 'OK',
          onPress: () => router.replace('/')
        }
      ]);
      setOrderItems({}); // Reset order items
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order');
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.productName}</Text>
        <View style={styles.priceContainer}>
          <Image 
            source={{uri: item.productImg}} 
            style={styles.productImage}
          />
          <View>
          <TouchableOpacity 
            style={styles.priceButton}
            onPress={() => handleQuantityChange(item.id, 
              orderItems[item.id]?.quantity || '', 
              item.pricePerCarton
            )}
          >
            <Text style={styles.productPrice}>Carton: Rp {item.pricePerCarton}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.priceButton}
            onPress={() => handleQuantityChange(item.id, 
              orderItems[item.id]?.quantity || '', 
              item.pricePerMiddle
            )}
          >
            <Text style={styles.productPrice}>Middle: Rp {item.pricePerMiddle}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.priceButton}
            onPress={() => handleQuantityChange(item.id, 
              orderItems[item.id]?.quantity || '', 
              item.pricePerPcs
            )}
          >
            <Text style={styles.productPrice}>Pcs: Rp {item.pricePerPcs}</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
      <TextInput
        style={styles.quantityInput}
        keyboardType="numeric"
        placeholder="Qty"
        value={orderItems[item.id]?.quantity || ''}
        onChangeText={(text) => handleQuantityChange(
          item.id,
          text,
          orderItems[item.id]?.pricePerUnit || item.pricePerCarton
        )}
      />
    </View>
  );

  if (loading) return <Text>Loading...</Text>;
  if (!toko) return <Text>Toko not found</Text>;

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <TouchableOpacity>
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{toko.namaToko}</Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </View>
            </TouchableOpacity>
          ),
          headerShown: true,
        }} 
      />
      <View style={styles.container}>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
        />
        <View style={styles.orderSummary}>
          <Text style={styles.totalText}>Total: Rp {calculateTotal()}</Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitOrder}
          >
            <Text style={styles.submitButtonText}>Place Order</Text>
          </TouchableOpacity>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productList: {
    padding: 16,
  },
  productItem: {
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
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  productInfo: {
    flex: 1,
  },
  priceContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceButton: {
    paddingVertical: 2,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: 60,
    marginLeft: 8,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    minWidth: 120,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 4,
  },
}); 