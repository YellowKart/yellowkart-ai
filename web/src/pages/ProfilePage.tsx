import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, TextField, Button, Box, Typography, Card, Alert } from '@mui/material'
import axios from 'axios'
import styled from 'styled-components'

const ProfileContainer = styled(Box)`
  padding: 40px 20px;
`

const ProfileCard = styled(Card)`
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
`

const FormField = styled(TextField)`
  margin-bottom: 20px !important;
`

function ProfilePage() {
  const user = useSelector((state: any) => state.auth.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await axios.put(`http://localhost:8001/api/users/${user.id}`, formData)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data,
      })
      setSuccess('Profile updated successfully')
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg">
      <ProfileContainer>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#232f3e', textAlign: 'center' }}>
          My Profile
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <ProfileCard>
          <form onSubmit={handleSubmit}>
            <FormField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <FormField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <FormField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <FormField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <FormField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <FormField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <FormField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
            <FormField
              fullWidth
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
            />
            <FormField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ backgroundColor: '#ff9900' }}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </ProfileCard>
      </ProfileContainer>
    </Container>
  )
}

export default ProfilePage
