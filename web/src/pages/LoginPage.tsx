import { createLogger } from "../utils/logger";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, TextField, Button, Box, Typography, Card, Alert } from '@mui/material';
import axios from 'axios';
import styled from 'styled-components';
const __ykLog = createLogger("LoginPage");
const LoginContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 20px;
`;
const LoginCard = styled(Card)`
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
const FormField = styled(TextField)`
  margin-bottom: 20px !important;
`;
function LoginPage() {
  __ykLog.info("FLOW_ENTER", {
    op: "LoginPage.LoginPage"
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "LoginPage.handleLogin"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "LoginPage.handleLogin";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "LoginPage#try1"
          });
          // In a real app, this would call your authentication endpoint
          const response = await axios.post('http://localhost:8001/api/users/login', {
            email,
            password
          });
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data.user
          });
          navigate('/');
          __ykLog.info("BLOCK_END", {
            op: "LoginPage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (err) {
          setError('Invalid email or password');
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
        op: "LoginPage.handleLogin",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <LoginContainer>
      <LoginCard>
        <Typography variant="h4" sx={{
        mb: 3,
        fontWeight: 'bold',
        color: '#232f3e',
        textAlign: 'center'
      }}>
          Sign In
        </Typography>

        {error && <Alert severity="error" sx={{
        mb: 2
      }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <FormField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <FormField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button fullWidth variant="contained" size="large" sx={{
          backgroundColor: '#ff9900',
          mb: 2
        }} disabled={loading} type="submit">
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Typography variant="body2" sx={{
        textAlign: 'center',
        color: '#666'
      }}>
          Don't have an account?{' '}
          <Typography component="span" sx={{
          color: '#ff9900',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => navigate('/register')}>
            Register here
          </Typography>
        </Typography>
      </LoginCard>
    </LoginContainer>;
}
export default LoginPage;