import React from 'react'
import { Box, Container, Grid, Typography, Link } from '@mui/material'
import styled from 'styled-components'

const FooterContainer = styled(Box)`
  background-color: #232f3e;
  color: #ffffff;
  padding: 40px 0 20px;
  margin-top: 40px;
`

const FooterLink = styled(Link)`
  color: #ffffff !important;
  text-decoration: none !important;
  
  &:hover {
    color: #ff9900 !important;
  }
`

function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#ff9900', mb: 2 }}>
              About Us
            </Typography>
            <Typography variant="body2">
              YellowKart is a leading e-commerce platform offering a wide range of products with fast delivery and great customer service.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#ff9900', mb: 2 }}>
              Quick Links
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <FooterLink href="/">Home</FooterLink>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <FooterLink href="/products">Products</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Contact Us</FooterLink>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#ff9900', mb: 2 }}>
              Customer Service
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <FooterLink href="#">Help Center</FooterLink>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <FooterLink href="#">Track Order</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Returns</FooterLink>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#ff9900', mb: 2 }}>
              Legal
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <FooterLink href="#">Terms & Conditions</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Shipping Policy</FooterLink>
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid #444', pt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            &copy; 2024 YellowKart. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  )
}

export default Footer
