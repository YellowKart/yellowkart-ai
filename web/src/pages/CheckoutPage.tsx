import { createLogger } from "../utils/logger";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, TextField, Button, Box, Typography, Card, Grid, Alert } from '@mui/material';
import styled from 'styled-components';
const __ykLog = createLogger("CheckoutPage");
const CheckoutContainer = styled(Box)`
  padding: 40px 20px;
`;
const CheckoutCard = styled(Card)`
  padding: 30px;
  margin-bottom: 20px;
`;
function CheckoutPage() {
  __ykLog.info("FLOW_ENTER", {
    op: "CheckoutPage.CheckoutPage"
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const user = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const total = cartItems.reduce((sum: number, item: any) => sum + item.total, 0);
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "CheckoutPage.handleShippingChange"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "CheckoutPage.handleShippingChange";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        setShippingInfo({
          ...shippingInfo,
          [e.target.name]: e.target.value
        });
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
        op: "CheckoutPage.handleShippingChange",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const handleCheckout = async (e: React.FormEvent) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "CheckoutPage.handleCheckout"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "CheckoutPage.handleCheckout";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "CheckoutPage#try1"
          });
          // Create order
          const orderResponse = await fetch('http://localhost:8004/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: user.id,
              totalAmount: total,
              shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
              orderNumber: `ORD-${Date.now()}`
            })
          });
          const order = await orderResponse.json();

          // Clear cart
          dispatch({
            type: 'CLEAR_CART'
          });
          navigate(`/orders`);
          __ykLog.info("BLOCK_END", {
            op: "CheckoutPage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (err) {
          setError('Failed to process order. Please try again.');
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
        op: "CheckoutPage.handleCheckout",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  if (cartItems.length === 0) {
    const __ykBlockStart1 = Date.now();
    __ykLog.info("BLOCK_START", {
      op: "CheckoutPage#if1"
    });
    try {
      return <Container maxWidth="lg">
        <Alert severity="warning">Your cart is empty. Please add items before checkout.</Alert>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </Container>;
    } finally {
      __ykLog.info("BLOCK_END", {
        op: "CheckoutPage#if1",
        durationMs: Date.now() - __ykBlockStart1
      });
    }
  }
  return <Container maxWidth="lg">
      <CheckoutContainer>
        <Typography variant="h4" sx={{
        mb: 3,
        fontWeight: 'bold',
        color: '#232f3e'
      }}>
          Checkout
        </Typography>

        {error && <Alert severity="error" sx={{
        mb: 2
      }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutCard>
              <Typography variant="h6" sx={{
              mb: 2,
              fontWeight: 'bold'
            }}>
                Shipping Address
              </Typography>
              <form>
                <TextField fullWidth label="Address" name="address" value={shippingInfo.address} onChange={handleShippingChange} margin="normal" required />
                <TextField fullWidth label="City" name="city" value={shippingInfo.city} onChange={handleShippingChange} margin="normal" required />
                <TextField fullWidth label="State" name="state" value={shippingInfo.state} onChange={handleShippingChange} margin="normal" required />
                <TextField fullWidth label="Zip Code" name="zipCode" value={shippingInfo.zipCode} onChange={handleShippingChange} margin="normal" required />
                <TextField fullWidth label="Country" name="country" value={shippingInfo.country} onChange={handleShippingChange} margin="normal" required />
              </form>
            </CheckoutCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutCard>
              <Typography variant="h6" sx={{
              mb: 2,
              fontWeight: 'bold'
            }}>
                Order Summary
              </Typography>
              {cartItems.map((item: any) => <Box key={item.productId} sx={{
              mb: 2,
              pb: 2,
              borderBottom: '1px solid #eee'
            }}>
                  <Typography variant="body2">{item.productName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Qty: {item.quantity} × ${item.price} = ${item.total}
                  </Typography>
                </Box>)}
              <Box sx={{
              pt: 2,
              borderTop: '2px solid #eee'
            }}>
                <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2
              }}>
                  <Typography variant="body1" sx={{
                  fontWeight: 'bold'
                }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="body1">${total.toFixed(2)}</Typography>
                </Box>
                <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2
              }}>
                  <Typography variant="body1" sx={{
                  fontWeight: 'bold'
                }}>
                    Shipping:
                  </Typography>
                  <Typography variant="body1">$10.00</Typography>
                </Box>
                <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 3
              }}>
                  <Typography variant="h6" sx={{
                  fontWeight: 'bold'
                }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{
                  color: '#ff9900',
                  fontWeight: 'bold'
                }}>
                    ${(total + 10).toFixed(2)}
                  </Typography>
                </Box>
                <Button fullWidth variant="contained" size="large" sx={{
                backgroundColor: '#ff9900'
              }} onClick={handleCheckout} disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Box>
            </CheckoutCard>
          </Grid>
        </Grid>
      </CheckoutContainer>
    </Container>;
}
export default CheckoutPage;