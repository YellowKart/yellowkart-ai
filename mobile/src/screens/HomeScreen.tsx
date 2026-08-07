import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const HomeScreen = ({ navigation }: any) => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsResponse = await axios.get('http://localhost:8002/api/products');
      setFeaturedProducts(productsResponse.data.slice(0, 5));
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productsResponse.data.map((p: any) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>YellowKart</Text>
      </View>

      <TouchableOpacity
        style={styles.requirementsBanner}
        onPress={() => navigation.navigate('Requirements')}
      >
        <Text style={styles.requirementsTitle}>Requirements list</Text>
        <Text style={styles.requirementsText}>
          Order by category or upload a handwritten list (all Indian languages)
        </Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => navigation.navigate('ProductList', { category: item })}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <FlatList
          data={featuredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            >
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <Text style={styles.productRating}>★ {item.rating}</Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF9900',
    padding: 20,
    alignItems: 'center',
  },
  requirementsBanner: {
    margin: 15,
    padding: 16,
    backgroundColor: '#232F3E',
    borderRadius: 10,
  },
  requirementsTitle: {
    color: '#FF9900',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  requirementsText: {
    color: '#F5F5F5',
    fontSize: 13,
    lineHeight: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: 15,
    marginRight: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9900',
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9900',
    marginTop: 5,
  },
  productRating: {
    fontSize: 14,
    color: '#FF9900',
    marginTop: 5,
  },
});

export default HomeScreen;
