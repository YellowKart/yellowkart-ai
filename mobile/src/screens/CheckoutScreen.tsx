import { createLogger } from "../utils/logger";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '../config';
const __ykLog = createLogger("CheckoutScreen");
const CheckoutScreen = ({
  navigation
}: any) => {
  __ykLog.info("FLOW_ENTER", {
    op: "CheckoutScreen.CheckoutScreen"
  });
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const user = useSelector((state: any) => state.auth.user);
  const [address, setAddress] = useState('');
  const total = cartItems.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
  const placeOrder = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "CheckoutScreen.placeOrder"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "CheckoutScreen.placeOrder";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "CheckoutScreen#try1"
          });
          await axios.post(`${API.orders}/bulk`, {
            userId: user.id,
            shippingAddress: address || 'Site delivery',
            paymentMethod: 'COD',
            items: cartItems.map((item: any) => ({
              productId: item.productId,
              productName: item.productName,
              brand: item.brand,
              unitPrice: item.price,
              quantity: item.quantity
            }))
          });
          dispatch({
            type: 'CLEAR_CART'
          });
          Alert.alert('Success', 'Order placed');
          navigation.navigate('Orders');
          __ykLog.info("BLOCK_END", {
            op: "CheckoutScreen#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          Alert.alert('Error', 'Checkout failed');
        }
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "CheckoutScreen.placeOrder",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.meta}>Total: ₹{total.toFixed(2)}</Text>
      <TextInput style={styles.input} placeholder="Shipping address" value={address} onChangeText={setAddress} />
      <TouchableOpacity style={styles.btn} onPress={placeOrder}>
        <Text style={styles.btnText}>Place order</Text>
      </TouchableOpacity>
    </View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#232F3E'
  },
  meta: {
    marginVertical: 12,
    color: '#6b7280'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 12
  },
  btn: {
    backgroundColor: '#FF9900',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnText: {
    fontWeight: '700'
  }
});
export default CheckoutScreen;