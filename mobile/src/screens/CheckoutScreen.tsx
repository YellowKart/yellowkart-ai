import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '../config';

const CheckoutScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const user = useSelector((state: any) => state.auth.user);
  const [address, setAddress] = useState('');
  const total = cartItems.reduce((sum: number, item: any) => sum + (item.total || 0), 0);

  const placeOrder = async () => {
    try {
      await axios.post(`${API.orders}/bulk`, {
        userId: user.id,
        shippingAddress: address || 'Site delivery',
        paymentMethod: 'COD',
        items: cartItems.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          brand: item.brand,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
      });
      dispatch({ type: 'CLEAR_CART' });
      Alert.alert('Success', 'Order placed');
      navigation.navigate('Orders');
    } catch (error) {
      Alert.alert('Error', 'Checkout failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.meta}>Total: ₹{total.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Shipping address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.btn} onPress={placeOrder}>
        <Text style={styles.btnText}>Place order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4EF', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#232F3E' },
  meta: { marginVertical: 12, color: '#6b7280' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#FF9900',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { fontWeight: '700' },
});

export default CheckoutScreen;
