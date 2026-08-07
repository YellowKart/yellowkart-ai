import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  flex-shrink: 0;
`

const SearchBox = styled(TextField)`
  width: min(300px, 40vw);
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
  margin: 0 6px !important;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(255, 153, 0, 0.1);
  }
`

const SecondaryBar = styled(Box)`
  background-color: #37475a;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`

const SecondaryLink = styled(Button)<{ $active?: boolean }>`
  color: ${(p) => (p.$active ? '#ff9900' : '#ffffff')} !important;
  text-transform: none !important;
  font-size: 14px !important;
  font-weight: ${(p) => (p.$active ? 700 : 500)} !important;
  min-width: auto !important;
  padding: 8px 14px !important;
  border-radius: 0 !important;
  border-bottom: 2px solid ${(p) => (p.$active ? '#ff9900' : 'transparent')} !important;

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    color: #ff9900 !important;
  }
`

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)

  const secondaryLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Requirements', path: '/requirements' },
    ...(isLoggedIn ? [{ label: 'Orders', path: '/orders' }] : []),
  ]

  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ flexWrap: 'wrap', gap: 1, py: 0.5 }}>
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

          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <NavButton onClick={() => navigate('/requirements')}>Requirements</NavButton>

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
                  <MenuItem onClick={() => {
                    navigate('/requirements')
                    handleMenuClose()
                  }}>Requirements</MenuItem>
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

      <SecondaryBar>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              overflowX: 'auto',
              py: 0.25,
            }}
          >
            {secondaryLinks.map((link) => (
              <SecondaryLink
                key={link.path}
                $active={isActive(link.path)}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </SecondaryLink>
            ))}
          </Box>
        </Container>
      </SecondaryBar>
    </StyledAppBar>
  )
}

export default Navbar
