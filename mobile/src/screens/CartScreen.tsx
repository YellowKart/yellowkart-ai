import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const CartScreen = ({ navigation }: any) => {
  const cartItems = useSelector((state: any) => state.cart.items);
  const cartTotal = useSelector((state: any) => state.cart.total);

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemDetails}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.productPrice}>${item.price}</Text>
                  <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.total}>${item.total}</Text>
              </View>
            )}
          />
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryAmount}>${cartTotal}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  cartItem: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9900',
  },
  summary: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9900',
  },
  checkoutButton: {
    backgroundColor: '#FF9900',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
