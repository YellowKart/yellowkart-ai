import { createLogger } from "../utils/logger";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
const __ykLog = createLogger("ProductDetailsScreen");
const ProductDetailsScreen = ({
  route,
  navigation
}: any) => {
  __ykLog.info("FLOW_ENTER", {
    op: "ProductDetailsScreen.ProductDetailsScreen"
  });
  const dispatch = useDispatch();
  const product = route?.params?.product || {};
  return <View style={styles.container}>
      <Text style={styles.title}>{product.name || 'Product'}</Text>
      <Text style={styles.meta}>
        {product.brand || 'YellowKart'} · {product.category}
      </Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.desc}>{product.description || 'No description'}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => {
      const __ykStart = Date.now();
      const __ykOp = "ProductDetailsScreen.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        dispatch({
          type: 'ADD_TO_CART',
          payload: {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            total: product.price
          }
        });
        navigation.navigate('CartTab');
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
    }}>
        <Text style={styles.btnText}>Add to cart</Text>
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
    fontSize: 24,
    fontWeight: '800',
    color: '#232F3E'
  },
  meta: {
    color: '#6b7280',
    marginTop: 6
  },
  price: {
    color: '#FF9900',
    fontWeight: '700',
    fontSize: 20,
    marginVertical: 12
  },
  desc: {
    color: '#374151',
    lineHeight: 22
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#FF9900',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnText: {
    fontWeight: '700',
    color: '#111'
  }
});
export default ProductDetailsScreen;