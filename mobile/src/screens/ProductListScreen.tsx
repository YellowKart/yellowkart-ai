import { createLogger } from "../utils/logger";
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API } from '../config';
const __ykLog = createLogger("ProductListScreen");
const ProductListScreen = ({
  navigation,
  route
}: any) => {
  __ykLog.info("FLOW_ENTER", {
    op: "ProductListScreen.ProductListScreen"
  });
  const category = route?.params?.category;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductListScreen.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductListScreen.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        axios.get(API.products).then(res => {
          const __ykStart = Date.now();
          __ykLog.info("FLOW_ENTER", {
            op: "ProductListScreen.fn"
          });
          try {
            const __ykStart = Date.now();
            const __ykOp = "ProductListScreen.arrow";
            __ykLog.info("METHOD_START", {
              op: __ykOp
            });
            let __ykOk = true;
            try {
              const data = res.data || [];
              setProducts(category ? data.filter((p: any) => p.category === category) : data);
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
              op: "ProductListScreen.fn",
              durationMs: Date.now() - __ykStart
            });
          }
        }).catch(() => setProducts([])).finally(() => setLoading(false));
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
        op: "ProductListScreen.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, [category]);
  if (loading) {
    const __ykBlockStart1 = Date.now();
    __ykLog.info("BLOCK_START", {
      op: "ProductListScreen#if1"
    });
    try {
      return <View style={styles.center}>
        <ActivityIndicator color="#FF9900" />
      </View>;
    } finally {
      __ykLog.info("BLOCK_END", {
        op: "ProductListScreen#if1",
        durationMs: Date.now() - __ykBlockStart1
      });
    }
  }
  return <View style={styles.container}>
      <Text style={styles.title}>{category || 'All Products'}</Text>
      <FlatList data={products} keyExtractor={item => String(item.id)} renderItem={({
      item
    }) => <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', {
      product: item
    })}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.brand || 'YellowKart'} · ₹{item.price}
            </Text>
          </TouchableOpacity>} />
    </View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    padding: 16
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#232F3E'
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  name: {
    fontWeight: '600',
    color: '#232F3E'
  },
  meta: {
    color: '#6b7280',
    marginTop: 4
  }
});
export default ProductListScreen;