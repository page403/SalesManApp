import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, Platform, View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Image } from 'react-native';
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
  unit: 'pcs' | 'ctn' | 'mid';
}

export default function Toko() {
  const { id } = useLocalSearchParams();
  const [toko, setToko] = useState<Toko | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<{ [key: number]: OrderItem }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 0],
    extrapolate: 'clamp'
  });

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

        // Extract unique categories
        const uniqueCategories = [...new Set(productsData?.map(p => p.category) || [])];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const handleQuantityChange = (productId: number, quantity: string, pricePerUnit: number, unit: 'pcs' | 'ctn' | 'mid') => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        productId,
        quantity,
        pricePerUnit,
        unit
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
        quantity: parseInt(item.quantity),
        unit: item.unit || 'ctn'
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            !selectedCategory && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.categoryText,
            !selectedCategory && styles.categoryTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

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
              item.pricePerCarton,
              'ctn'
            )}
          >
            <Text style={styles.productPrice}>Carton: Rp {item.pricePerCarton}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.priceButton}
            onPress={() => handleQuantityChange(item.id, 
              orderItems[item.id]?.quantity || '', 
              item.pricePerMiddle,
              'mid'
            )}
          >
            <Text style={styles.productPrice}>Middle: Rp {item.pricePerMiddle}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.priceButton}
            onPress={() => handleQuantityChange(item.id, 
              orderItems[item.id]?.quantity || '', 
              item.pricePerPcs,
              'pcs'
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
        placeholder={`(${orderItems[item.id]?.unit || 'ctn'})`}
        value={orderItems[item.id]?.quantity || ''}
        onChangeText={(text) => handleQuantityChange(
          item.id,
          text,
          orderItems[item.id]?.pricePerUnit || item.pricePerCarton,
          orderItems[item.id]?.unit || 'ctn'
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
                {/* <Ionicons name="chevron-down" size={20} color="#000" /> */}
              </View>
            </TouchableOpacity>
          ),
          headerShown: true,
        }} 
      />
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={filteredProducts}
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    // paddingTop: Platform.OS === 'ios' ? 8 : 16,
    // paddingBottom: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoryList: {
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
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