import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Grid, Box, Typography, Button, TextField, Alert } from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'

const ProductImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
`

const PriceBox = styled(Box)`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`

const QuantityBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8002/api/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          total: product.price * quantity,
        },
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (!product) {
    return <Typography>Product not found</Typography>
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {added && <Alert severity="success">Product added to cart!</Alert>}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImage
            src={product.imageUrl || 'https://via.placeholder.com/400x400?text=Product'}
            alt={product.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            {product.name}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
            {product.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body1">Rating:</Typography>
            <Typography sx={{ color: '#ff9900', fontWeight: 'bold' }}>
              ★ {product.rating}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ({product.reviews} reviews)
            </Typography>
          </Box>

          <PriceBox>
            <Typography variant="h5" sx={{ color: '#ff9900', fontWeight: 'bold', mb: 1 }}>
              ${product.price}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Stock: {product.stock} available
            </Typography>
          </PriceBox>

          <QuantityBox>
            <Typography>Quantity:</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <RemoveIcon />
            </Button>
            <TextField
              size="small"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: product.stock }}
              sx={{ width: 80 }}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              <AddIcon />
            </Button>
          </QuantityBox>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              sx={{ backgroundColor: '#ff9900' }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ backgroundColor: '#232f3e' }}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductDetailPage
