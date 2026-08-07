import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '../config';

const OrdersScreen = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API.orders}/user/${user.id}`)
      .then((res) => {
        const data = (res.data || []).map((entry: any) =>
          entry.order ? { ...entry.order, items: entry.items || [] } : entry
        );
        setOrders(data);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF9900" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders yet</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.orderNumber}</Text>
              <Text style={styles.meta}>
                ₹{item.totalAmount} · {item.status}
              </Text>
              <Text style={styles.meta}>
                {item.items?.length
                  ? item.items.map((line: any) => `${line.productName}×${line.quantity}`).join(', ')
                  : `${item.itemCount || 0} items`}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4EF', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#232F3E' },
  empty: { color: '#6b7280' },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: { fontWeight: '700', color: '#232F3E' },
  meta: { color: '#6b7280', marginTop: 4 },
});

export default OrdersScreen;
