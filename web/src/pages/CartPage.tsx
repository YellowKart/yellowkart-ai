import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Typography, Paper } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import styled from 'styled-components'

const EmptyCartContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`

const CartSummaryBox = styled(Paper)`
  padding: 30px;
  margin-top: 30px;
  background-color: #f0f0f0;
`

function CartPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: any) => state.cart.items)
  const cartTotal = useSelector((state: any) => state.cart.total)

  const total = cartItems.reduce((sum: number, item: any) => sum + item.total, 0)

  const handleRemove = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <EmptyCartContainer>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          Start shopping to add items to your cart
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ backgroundColor: '#ff9900' }}
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </EmptyCartContainer>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#232f3e' }}>
        Shopping Cart
      </Typography>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item: any) => (
              <TableRow key={item.productId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell align="right">${item.price}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
                  ${item.total}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemove(item.productId)}
                    startIcon={<DeleteIcon />}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <CartSummaryBox>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
            Total:
          </Typography>
          <Typography variant="h6" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
            ${total.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: '#ff9900' }}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </CartSummaryBox>
    </Container>
  )
}

export default CartPage
