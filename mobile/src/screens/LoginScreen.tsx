import { createLogger } from "../utils/logger";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const __ykLog = createLogger("LoginScreen");
const LoginScreen = ({
  navigation
}: any) => {
  __ykLog.info("FLOW_ENTER", {
    op: "LoginScreen.LoginScreen"
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleLogin = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "LoginScreen.handleLogin"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "LoginScreen.handleLogin";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        if (!email || !password) {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "LoginScreen#if1"
          });
          try {
            Alert.alert('Error', 'Please fill in all fields');
            return;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "LoginScreen#if1",
              durationMs: Date.now() - __ykBlockStart1
            });
          }
        }
        setLoading(true);
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "LoginScreen#try1"
          });
          // In a real app, this would call your authentication endpoint
          const response = await axios.post('http://localhost:8001/api/users/login', {
            email,
            password
          });
          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data.user
          });
          __ykLog.info("BLOCK_END", {
            op: "LoginScreen#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          Alert.alert('Login Failed', 'Invalid email or password');
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
        op: "LoginScreen.handleLogin",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>YellowKart</Text>
        <Text style={styles.subtitle}>Sign In</Text>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>
            Don't have an account? <Text style={styles.registerLinkBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    backgroundColor: '#FF9900',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white'
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 10
  },
  form: {
    padding: 20,
    marginTop: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  loginButton: {
    backgroundColor: '#FF9900',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 14
  },
  registerLinkBold: {
    fontWeight: 'bold',
    color: '#FF9900'
  }
});
export default LoginScreen;