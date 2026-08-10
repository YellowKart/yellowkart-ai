import { createLogger } from "../utils/logger";
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import styled from 'styled-components';
const __ykLog = createLogger("ProductListPage");
const FilterBox = styled(Box)`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;
const ProductCard = styled(Card)`
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;
const ProductImage = styled(CardMedia)`
  height: 200px;
  background-color: #f0f0f0;
`;
function ProductListPage() {
  __ykLog.info("FLOW_ENTER", {
    op: "ProductListPage.ProductListPage"
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductListPage.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductListPage.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        fetchProducts();
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
        op: "ProductListPage.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, []);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductListPage.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductListPage.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        filterProducts();
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
        op: "ProductListPage.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, [products, selectedCategory, sortBy]);
  const fetchProducts = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductListPage.fetchProducts"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductListPage.fetchProducts";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "ProductListPage#try1"
          });
          const response = await axios.get('http://localhost:8002/api/products');
          setProducts(response.data);
          const uniqueCategories = [...new Set(response.data.map((p: any) => p.category))];
          setCategories(uniqueCategories as string[]);
          const category = searchParams.get('category');
          if (category) {
            const __ykBlockStart1 = Date.now();
            __ykLog.info("BLOCK_START", {
              op: "ProductListPage#if1"
            });
            try {
              setSelectedCategory(category);
            } finally {
              __ykLog.info("BLOCK_END", {
                op: "ProductListPage#if1",
                durationMs: Date.now() - __ykBlockStart1
              });
            }
          }
          __ykLog.info("BLOCK_END", {
            op: "ProductListPage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          console.error('Error fetching products:', error);
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
        op: "ProductListPage.fetchProducts",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const filterProducts = () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductListPage.filterProducts"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductListPage.filterProducts";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        let filtered = products;
        if (selectedCategory) {
          const __ykBlockStart2 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "ProductListPage#if2"
          });
          try {
            filtered = filtered.filter(p => p.category === selectedCategory);
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "ProductListPage#if2",
              durationMs: Date.now() - __ykBlockStart2
            });
          }
        }
        if (sortBy === 'price-low') {
          const __ykBlockStart3 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "ProductListPage#if3"
          });
          try {
            filtered = filtered.sort((a, b) => a.price - b.price);
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "ProductListPage#if3",
              durationMs: Date.now() - __ykBlockStart3
            });
          }
        } else if (sortBy === 'price-high') {
          const __ykBlockStart4 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "ProductListPage#if4"
          });
          try {
            filtered = filtered.sort((a, b) => b.price - a.price);
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "ProductListPage#if4",
              durationMs: Date.now() - __ykBlockStart4
            });
          }
        } else if (sortBy === 'rating') {
          const __ykBlockStart5 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "ProductListPage#if5"
          });
          try {
            filtered = filtered.sort((a, b) => b.rating - a.rating);
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "ProductListPage#if5",
              durationMs: Date.now() - __ykBlockStart5
            });
          }
        }
        setFilteredProducts(filtered);
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
        op: "ProductListPage.filterProducts",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <Container maxWidth="lg" sx={{
    py: 4
  }}>
      <Typography variant="h4" sx={{
      mb: 3,
      fontWeight: 'bold',
      color: '#232f3e'
    }}>
        Products
      </Typography>

      <FilterBox>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField select fullWidth label="Category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField select fullWidth label="Sort By" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FilterBox>

      <Grid container spacing={3}>
        {filteredProducts.map(product => <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard>
              <ProductImage image={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'} title={product.name} />
              <CardContent>
                <Typography gutterBottom variant="h6" sx={{
              fontWeight: 'bold'
            }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{
              mb: 1
            }}>
                  {product.description?.substring(0, 60)}...
                </Typography>
                <Typography variant="h6" sx={{
              color: '#ff9900',
              fontWeight: 'bold',
              mb: 1
            }}>
                  ${product.price}
                </Typography>
                <Typography variant="body2" sx={{
              color: '#ff9900',
              mb: 2
            }}>
                  ★ {product.rating} ({product.reviews} reviews)
                </Typography>
                <Button fullWidth variant="contained" sx={{
              backgroundColor: '#ff9900'
            }} onClick={() => navigate(`/products/${product.id}`)}>
                  View Details
                </Button>
              </CardContent>
            </ProductCard>
          </Grid>)}
      </Grid>
    </Container>;
}
export default ProductListPage;