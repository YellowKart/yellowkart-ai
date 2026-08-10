import { createLogger } from "../utils/logger";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, TextField, Alert } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';
const __ykLog = createLogger("ProductDetailPage");
const ProductImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
`;
const PriceBox = styled(Box)`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;
const QuantityBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`;
function ProductDetailPage() {
  __ykLog.info("FLOW_ENTER", {
    op: "ProductDetailPage.ProductDetailPage"
  });
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductDetailPage.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductDetailPage.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        fetchProduct();
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
        op: "ProductDetailPage.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, [id]);
  const fetchProduct = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductDetailPage.fetchProduct"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductDetailPage.fetchProduct";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "ProductDetailPage#try1"
          });
          const response = await axios.get(`http://localhost:8002/api/products/${id}`);
          setProduct(response.data);
          __ykLog.info("BLOCK_END", {
            op: "ProductDetailPage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          console.error('Error fetching product:', error);
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
        op: "ProductDetailPage.fetchProduct",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const handleAddToCart = () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductDetailPage.handleAddToCart"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductDetailPage.handleAddToCart";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        if (product) {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "ProductDetailPage#if1"
          });
          try {
            dispatch({
              type: 'ADD_TO_CART',
              payload: {
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity,
                total: product.price * quantity
              }
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 3000);
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "ProductDetailPage#if1",
              durationMs: Date.now() - __ykBlockStart1
            });
          }
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
        op: "ProductDetailPage.handleAddToCart",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const handleBuyNow = () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "ProductDetailPage.handleBuyNow"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "ProductDetailPage.handleBuyNow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        handleAddToCart();
        navigate('/checkout');
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
        op: "ProductDetailPage.handleBuyNow",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  if (loading) {
    const __ykBlockStart2 = Date.now();
    __ykLog.info("BLOCK_START", {
      op: "ProductDetailPage#if2"
    });
    try {
      return <Typography>Loading...</Typography>;
    } finally {
      __ykLog.info("BLOCK_END", {
        op: "ProductDetailPage#if2",
        durationMs: Date.now() - __ykBlockStart2
      });
    }
  }
  if (!product) {
    const __ykBlockStart3 = Date.now();
    __ykLog.info("BLOCK_START", {
      op: "ProductDetailPage#if3"
    });
    try {
      return <Typography>Product not found</Typography>;
    } finally {
      __ykLog.info("BLOCK_END", {
        op: "ProductDetailPage#if3",
        durationMs: Date.now() - __ykBlockStart3
      });
    }
  }
  return <Container maxWidth="lg" sx={{
    py: 4
  }}>
      {added && <Alert severity="success">Product added to cart!</Alert>}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImage src={product.imageUrl || 'https://via.placeholder.com/400x400?text=Product'} alt={product.name} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{
          fontWeight: 'bold',
          mb: 2
        }}>
            {product.name}
          </Typography>
          
          <Typography variant="body1" sx={{
          mb: 2,
          color: '#666'
        }}>
            {product.description}
          </Typography>
          
          <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2
        }}>
            <Typography variant="body1">Rating:</Typography>
            <Typography sx={{
            color: '#ff9900',
            fontWeight: 'bold'
          }}>
              ★ {product.rating}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ({product.reviews} reviews)
            </Typography>
          </Box>

          <PriceBox>
            <Typography variant="h5" sx={{
            color: '#ff9900',
            fontWeight: 'bold',
            mb: 1
          }}>
              ${product.price}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Stock: {product.stock} available
            </Typography>
          </PriceBox>

          <QuantityBox>
            <Typography>Quantity:</Typography>
            <Button size="small" variant="outlined" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <RemoveIcon />
            </Button>
            <TextField size="small" type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} inputProps={{
            min: 1,
            max: product.stock
          }} sx={{
            width: 80
          }} />
            <Button size="small" variant="outlined" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
              <AddIcon />
            </Button>
          </QuantityBox>

          <Box sx={{
          display: 'flex',
          gap: 2
        }}>
            <Button fullWidth variant="contained" size="large" startIcon={<ShoppingCartIcon />} sx={{
            backgroundColor: '#ff9900'
          }} onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button fullWidth variant="contained" size="large" sx={{
            backgroundColor: '#232f3e'
          }} onClick={handleBuyNow}>
              Buy Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>;
}
export default ProductDetailPage;