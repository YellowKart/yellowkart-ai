import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Container, TextField, Button, Box, Typography, Card, Alert } from '@mui/material'
import axios from 'axios'
import styled from 'styled-components'

const RegisterContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
`

const RegisterCard = styled(Card)`
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const FormField = styled(TextField)`
  margin-bottom: 20px !important;
`

function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8001/api/users', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data,
      })
      navigate('/')
    } catch (err) {
      setError('Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#232f3e', textAlign: 'center' }}>
          Create Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleRegister}>
          <FormField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <FormField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <FormField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FormField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ backgroundColor: '#ff9900', mb: 2 }}
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#666' }}>
          Already have an account?{' '}
          <Typography
            component="span"
            sx={{ color: '#ff9900', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Sign in here
          </Typography>
        </Typography>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default RegisterPage
