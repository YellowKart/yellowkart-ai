import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API } from '../config';

const ProductListScreen = ({ navigation, route }: any) => {
  const category = route?.params?.category;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API.products)
      .then((res) => {
        const data = res.data || [];
        setProducts(category ? data.filter((p: any) => p.category === category) : data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF9900" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category || 'All Products'}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.brand || 'YellowKart'} · ₹{item.price}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4EF', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#232F3E' },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: { fontWeight: '600', color: '#232F3E' },
  meta: { color: '#6b7280', marginTop: 4 },
});

export default ProductListScreen;
