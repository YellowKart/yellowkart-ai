import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box, Chip } from '@mui/material'
import axios from 'axios'
import styled from 'styled-components'

const OrdersContainer = styled(Box)`
  padding: 40px 20px;
`

function OrdersPage() {
  const user = useSelector((state: any) => state.auth.user)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8004/api/orders/user/${user.id}`)
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'CONFIRMED':
        return 'info'
      case 'SHIPPED':
        return 'primary'
      case 'DELIVERED':
        return 'success'
      case 'CANCELLED':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="lg">
      <OrdersContainer>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#232f3e' }}>
          My Orders
        </Typography>

        {loading ? (
          <Typography>Loading orders...</Typography>
        ) : orders.length === 0 ? (
          <Typography>No orders found</Typography>
        ) : (
          <Paper sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order Number</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell align="right" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
                      ${order.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </OrdersContainer>
    </Container>
  )
}

export default OrdersPage
