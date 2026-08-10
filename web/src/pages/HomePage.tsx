import { createLogger } from "../utils/logger";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import axios from 'axios';
import styled from 'styled-components';
const __ykLog = createLogger("HomePage");
const BannerContainer = styled(Box)`
  background: linear-gradient(135deg, #ff9900 0%, #ffb84d 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 40px;
  border-radius: 8px;
`;
const BannerTitle = styled(Typography)`
  font-size: 3rem !important;
  font-weight: bold !important;
  margin-bottom: 20px !important;
`;
const BannerSubtitle = styled(Typography)`
  font-size: 1.2rem !important;
  margin-bottom: 30px !important;
`;
const ProductCard = styled(Card)`
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;
const ProductImage = styled(CardMedia)`
  height: 200px;
  background-color: #f0f0f0;
`;
const SectionTitle = styled(Typography)`
  font-size: 2rem !important;
  font-weight: bold !important;
  margin-bottom: 30px !important;
  color: #232f3e !important;
`;
function HomePage() {
  __ykLog.info("FLOW_ENTER", {
    op: "HomePage.HomePage"
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "HomePage.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "HomePage.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        fetchData();
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
        op: "HomePage.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, []);
  const fetchData = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "HomePage.fetchData"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "HomePage.fetchData";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "HomePage#try1"
          });
          const response = await axios.get('http://localhost:8002/api/products');
          setFeaturedProducts(response.data.slice(0, 8));

          // Extract unique categories
          const uniqueCategories = [...new Set(response.data.map((p: any) => p.category))];
          setCategories(uniqueCategories as string[]);
          __ykLog.info("BLOCK_END", {
            op: "HomePage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          console.error('Error fetching data:', error);
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
        op: "HomePage.fetchData",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <>
      <BannerContainer>
        <BannerTitle>Welcome to YellowKart</BannerTitle>
        <BannerSubtitle>Your One-Stop Shop for Everything</BannerSubtitle>
        <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/products')} sx={{
        backgroundColor: '#232f3e',
        mr: 2
      }}>
          Shop Now
        </Button>
        <Button variant="outlined" size="large" onClick={() => navigate('/requirements')} sx={{
        borderColor: 'white',
        color: 'white'
      }}>
          Requirements list
        </Button>
      </BannerContainer>

      <Container maxWidth="lg" sx={{
      py: 4
    }}>
        <SectionTitle>Shop by Category</SectionTitle>
        <Grid container spacing={3} sx={{
        mb: 6
      }}>
          {categories.map(category => <Grid item xs={12} sm={6} md={3} key={category}>
              <ProductCard onClick={() => navigate(`/products?category=${category}`)} sx={{
            cursor: 'pointer'
          }}>
                <ProductImage image="https://via.placeholder.com/300x200?text=Category" title={category} />
                <CardContent sx={{
              textAlign: 'center'
            }}>
                  <Typography variant="h6" sx={{
                color: '#ff9900',
                fontWeight: 'bold'
              }}>
                    {category}
                  </Typography>
                </CardContent>
              </ProductCard>
            </Grid>)}
        </Grid>

        <SectionTitle>Featured Products</SectionTitle>
        <Grid container spacing={3}>
          {featuredProducts.map(product => <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard>
                <ProductImage image={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'} title={product.name} />
                <CardContent sx={{
              flexGrow: 1
            }}>
                  <Typography gutterBottom variant="h6" sx={{
                fontWeight: 'bold'
              }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{
                mb: 2
              }}>
                    {product.description?.substring(0, 80)}...
                  </Typography>
                  <Typography variant="h6" sx={{
                color: '#ff9900',
                fontWeight: 'bold',
                mb: 2
              }}>
                    ${product.price}
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
      </Container>
    </>;
}
export default HomePage;