import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, TextField, Button, Box, Typography, Card, Grid, Alert } from '@mui/material'
import styled from 'styled-components'

const CheckoutContainer = styled(Box)`
  padding: 40px 20px;
`

const CheckoutCard = styled(Card)`
  padding: 30px;
  margin-bottom: 20px;
`

function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: any) => state.cart.items)
  const user = useSelector((state: any) => state.auth.user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const total = cartItems.reduce((sum: number, item: any) => sum + item.total, 0)

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create order
      const orderResponse = await fetch('http://localhost:8004/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          totalAmount: total,
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
          orderNumber: `ORD-${Date.now()}`,
        }),
      })

      const order = await orderResponse.json()

      // Clear cart
      dispatch({ type: 'CLEAR_CART' })
      navigate(`/orders`)
    } catch (err) {
      setError('Failed to process order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">Your cart is empty. Please add items before checkout.</Alert>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <CheckoutContainer>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#232f3e' }}>
          Checkout
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutCard>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Shipping Address
              </Typography>
              <form>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Zip Code"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                  margin="normal"
                  required
                />
              </form>
            </CheckoutCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutCard>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Order Summary
              </Typography>
              {cartItems.map((item: any) => (
                <Box key={item.productId} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2">{item.productName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Qty: {item.quantity} × ${item.price} = ${item.total}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ pt: 2, borderTop: '2px solid #eee' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="body1">${total.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Shipping:
                  </Typography>
                  <Typography variant="body1">$10.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
                    ${(total + 10).toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ backgroundColor: '#ff9900' }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Box>
            </CheckoutCard>
          </Grid>
        </Grid>
      </CheckoutContainer>
    </Container>
  )
}

export default CheckoutPage
