import { createLogger } from "../utils/logger";
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '../config';
const __ykLog = createLogger("OrdersScreen");
const OrdersScreen = () => {
  __ykLog.info("FLOW_ENTER", {
    op: "OrdersScreen.OrdersScreen"
  });
  const user = useSelector((state: any) => state.auth.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "OrdersScreen.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "OrdersScreen.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        if (!user?.id) {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "OrdersScreen#if1"
          });
          try {
            setLoading(false);
            return;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "OrdersScreen#if1",
              durationMs: Date.now() - __ykBlockStart1
            });
          }
        }
        axios.get(`${API.orders}/user/${user.id}`).then(res => {
          const __ykStart = Date.now();
          __ykLog.info("FLOW_ENTER", {
            op: "OrdersScreen.fn"
          });
          try {
            const __ykStart = Date.now();
            const __ykOp = "OrdersScreen.arrow";
            __ykLog.info("METHOD_START", {
              op: __ykOp
            });
            let __ykOk = true;
            try {
              const data = (res.data || []).map((entry: any) => entry.order ? {
                ...entry.order,
                items: entry.items || []
              } : entry);
              setOrders(data);
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
              op: "OrdersScreen.fn",
              durationMs: Date.now() - __ykStart
            });
          }
        }).catch(() => setOrders([])).finally(() => setLoading(false));
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
        op: "OrdersScreen.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, [user?.id]);
  if (loading) {
    const __ykBlockStart2 = Date.now();
    __ykLog.info("BLOCK_START", {
      op: "OrdersScreen#if2"
    });
    try {
      return <View style={styles.center}>
        <ActivityIndicator color="#FF9900" />
      </View>;
    } finally {
      __ykLog.info("BLOCK_END", {
        op: "OrdersScreen#if2",
        durationMs: Date.now() - __ykBlockStart2
      });
    }
  }
  return <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? <Text style={styles.empty}>No orders yet</Text> : <FlatList data={orders} keyExtractor={item => String(item.id)} renderItem={({
      item
    }) => <View style={styles.card}>
              <Text style={styles.name}>{item.orderNumber}</Text>
              <Text style={styles.meta}>
                ₹{item.totalAmount} · {item.status}
              </Text>
              <Text style={styles.meta}>
                {item.items?.length ? item.items.map((line: any) => `${line.productName}×${line.quantity}`).join(', ') : `${item.itemCount || 0} items`}
              </Text>
            </View>} />}
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
  empty: {
    color: '#6b7280'
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8
  },
  name: {
    fontWeight: '700',
    color: '#232F3E'
  },
  meta: {
    color: '#6b7280',
    marginTop: 4
  }
});
export default OrdersScreen;