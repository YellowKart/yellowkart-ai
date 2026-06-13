import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, TextField, MenuItem } from '@mui/material'
import axios from 'axios'
import styled from 'styled-components'

const FilterBox = styled(Box)`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`

const ProductCard = styled(Card)`
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`

const ProductImage = styled(CardMedia)`
  height: 200px;
  background-color: #f0f0f0;
`

function ProductListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, sortBy])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/products')
      setProducts(response.data)
      
      const uniqueCategories = [...new Set(response.data.map((p: any) => p.category))]
      setCategories(uniqueCategories as string[])

      const category = searchParams.get('category')
      if (category) {
        setSelectedCategory(category)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (sortBy === 'price-low') {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered = filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered = filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(filtered)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#232f3e' }}>
        Products
      </Typography>

      <FilterBox>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FilterBox>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard>
              <ProductImage
                image={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'}
                title={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {product.description?.substring(0, 60)}...
                </Typography>
                <Typography variant="h6" sx={{ color: '#ff9900', fontWeight: 'bold', mb: 1 }}>
                  ${product.price}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ff9900', mb: 2 }}>
                  ★ {product.rating} ({product.reviews} reviews)
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: '#ff9900' }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </ProductCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ProductListPage
