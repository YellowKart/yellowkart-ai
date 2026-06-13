import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppBar,
  Toolbar,
  TextField,
  Button,
  Box,
  Badge,
  Menu,
  MenuItem,
  Container,
} from '@mui/material'
import {
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import styled from 'styled-components'

const StyledAppBar = styled(AppBar)`
  background-color: #232f3e !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const LogoText = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff9900;
  margin-right: 20px;
  cursor: pointer;
`

const SearchBox = styled(TextField)`
  width: 300px;
  margin: 0 20px;
  
  .MuiOutlinedInput-root {
    background-color: white;
    border-radius: 4px;
  }
`

const NavButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
  font-size: 16px !important;
  margin: 0 10px !important;
  
  &:hover {
    background-color: rgba(255, 153, 0, 0.1);
  }
`

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)
  const user = useSelector((state: any) => state.auth.user)
  const cartItems = useSelector((state: any) => state.cart.items)
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(`/products?search=${searchQuery}`)
      setSearchQuery('')
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
    handleMenuClose()
  }

  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <LogoText onClick={() => navigate('/')}>YellowKart</LogoText>

          <SearchBox
            size="small"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon style={{ marginRight: 8, color: '#666' }} />,
            }}
          />

          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <NavButton onClick={() => navigate('/products')}>Products</NavButton>

            <NavButton
              onClick={() => navigate('/cart')}
              startIcon={
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              Cart
            </NavButton>

            {isLoggedIn ? (
              <>
                <NavButton
                  onClick={handleMenuOpen}
                  startIcon={<AccountCircleIcon />}
                >
                  {user?.firstName || 'Account'}
                </NavButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => {
                    navigate('/profile')
                    handleMenuClose()
                  }}>Profile</MenuItem>
                  <MenuItem onClick={() => {
                    navigate('/orders')
                    handleMenuClose()
                  }}>My Orders</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <NavButton onClick={() => navigate('/login')}>Sign In</NavButton>
                <NavButton
                  onClick={() => navigate('/register')}
                  style={{ backgroundColor: '#FF9900', color: 'white' }}
                >
                  Register
                </NavButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  )
}

export default Navbar
