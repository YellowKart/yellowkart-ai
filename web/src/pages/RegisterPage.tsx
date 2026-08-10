import { createLogger } from "../utils/logger";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, TextField, Button, Box, Typography, Card, Alert } from '@mui/material';
import axios from 'axios';
import styled from 'styled-components';
const __ykLog = createLogger("RegisterPage");
const RegisterContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
`;
const RegisterCard = styled(Card)`
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
const FormField = styled(TextField)`
  margin-bottom: 20px !important;
`;
function RegisterPage() {
  __ykLog.info("FLOW_ENTER", {
    op: "RegisterPage.RegisterPage"
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RegisterPage.handleChange"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RegisterPage.handleChange";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
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
        op: "RegisterPage.handleChange",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RegisterPage.handleRegister"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RegisterPage.handleRegister";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RegisterPage#if1"
          });
          try {
            setError('Passwords do not match');
            return;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "RegisterPage#if1",
              durationMs: Date.now() - __ykBlockStart1
            });
          }
        }
        setLoading(true);
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RegisterPage#try1"
          });
          const response = await axios.post('http://localhost:8001/api/users', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          });
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data
          });
          navigate('/');
          __ykLog.info("BLOCK_END", {
            op: "RegisterPage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (err) {
          setError('Failed to register. Please try again.');
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
        op: "RegisterPage.handleRegister",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <RegisterContainer>
      <RegisterCard>
        <Typography variant="h4" sx={{
        mb: 3,
        fontWeight: 'bold',
        color: '#232f3e',
        textAlign: 'center'
      }}>
          Create Account
        </Typography>

        {error && <Alert severity="error" sx={{
        mb: 2
      }}>{error}</Alert>}

        <form onSubmit={handleRegister}>
          <FormField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <FormField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <FormField fullWidth label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <FormField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <FormField fullWidth label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          <FormField fullWidth label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          <Button fullWidth variant="contained" size="large" sx={{
          backgroundColor: '#ff9900',
          mb: 2
        }} disabled={loading} type="submit">
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <Typography variant="body2" sx={{
        textAlign: 'center',
        color: '#666'
      }}>
          Already have an account?{' '}
          <Typography component="span" sx={{
          color: '#ff9900',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => navigate('/login')}>
            Sign in here
          </Typography>
        </Typography>
      </RegisterCard>
    </RegisterContainer>;
}
export default RegisterPage;