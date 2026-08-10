import { createLogger } from "../utils/logger";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box, Chip } from '@mui/material';
import axios from 'axios';
import styled from 'styled-components';
const __ykLog = createLogger("OrdersPage");
const OrdersContainer = styled(Box)`
  padding: 40px 20px;
`;
function normalizeOrder(entry: any) {
  const __ykStart = Date.now();
  __ykLog.info("FLOW_ENTER", {
    op: "OrdersPage.normalizeOrder"
  });
  try {
    const __ykStart = Date.now();
    const __ykOp = "OrdersPage.normalizeOrder";
    __ykLog.info("METHOD_START", {
      op: __ykOp
    });
    let __ykOk = true;
    try {
      if (entry?.order) {
        const __ykBlockStart1 = Date.now();
        __ykLog.info("BLOCK_START", {
          op: "OrdersPage#if1"
        });
        try {
          return {
            ...entry.order,
            items: entry.items || []
          };
        } finally {
          __ykLog.info("BLOCK_END", {
            op: "OrdersPage#if1",
            durationMs: Date.now() - __ykBlockStart1
          });
        }
      }
      return {
        ...entry,
        items: entry.items || []
      };
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
      op: "OrdersPage.normalizeOrder",
      durationMs: Date.now() - __ykStart
    });
  }
}
function OrdersPage() {
  __ykLog.info("FLOW_ENTER", {
    op: "OrdersPage.OrdersPage"
  });
  const user = useSelector((state: any) => state.auth.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "OrdersPage.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "OrdersPage.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        fetchOrders();
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
        op: "OrdersPage.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, []);
  const fetchOrders = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "OrdersPage.fetchOrders"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "OrdersPage.fetchOrders";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "OrdersPage#try1"
          });
          const response = await axios.get(`http://localhost:8004/api/orders/user/${user.id}`);
          const normalized = (response.data || []).map(normalizeOrder);
          setOrders(normalized);
          __ykLog.info("BLOCK_END", {
            op: "OrdersPage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
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
        op: "OrdersPage.fetchOrders",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const getStatusColor = (status: string) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "OrdersPage.getStatusColor"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "OrdersPage.getStatusColor";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        switch (status) {
          case 'PENDING':
            return 'warning';
          case 'CONFIRMED':
            return 'info';
          case 'SHIPPED':
            return 'primary';
          case 'DELIVERED':
            return 'success';
          case 'CANCELLED':
            return 'error';
          default:
            return 'default';
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
        op: "OrdersPage.getStatusColor",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <Container maxWidth="lg">
      <OrdersContainer>
        <Typography variant="h4" sx={{
        mb: 3,
        fontWeight: 'bold',
        color: '#232f3e'
      }}>
          My Orders
        </Typography>

        {loading ? <Typography>Loading orders...</Typography> : orders.length === 0 ? <Typography>No orders found</Typography> : <Paper sx={{
        overflowX: 'auto'
      }}>
            <Table>
              <TableHead sx={{
            backgroundColor: '#f0f0f0'
          }}>
                <TableRow>
                  <TableCell sx={{
                fontWeight: 'bold'
              }}>Order Number</TableCell>
                  <TableCell align="right" sx={{
                fontWeight: 'bold'
              }}>Amount</TableCell>
                  <TableCell sx={{
                fontWeight: 'bold'
              }}>Items</TableCell>
                  <TableCell sx={{
                fontWeight: 'bold'
              }}>Status</TableCell>
                  <TableCell sx={{
                fontWeight: 'bold'
              }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell align="right" sx={{
                color: '#ff9900',
                fontWeight: 'bold'
              }}>
                      ₹{order.totalAmount}
                    </TableCell>
                    <TableCell>
                      {order.items?.length ? order.items.map((item: any) => `${item.productName}×${item.quantity}`).join(', ') : order.itemCount || '—'}
                    </TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </Paper>}
      </OrdersContainer>
    </Container>;
}
export default OrdersPage;