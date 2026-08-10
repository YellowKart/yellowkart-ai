import { createLogger } from "../utils/logger";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
const __ykLog = createLogger("RegisterScreen");
const RegisterScreen = ({
  navigation
}: any) => {
  __ykLog.info("FLOW_ENTER", {
    op: "RegisterScreen.RegisterScreen"
  });
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const register = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RegisterScreen.register"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RegisterScreen.register";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RegisterScreen#try1"
          });
          const response = await axios.post('http://localhost:8001/api/users', form);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data
          });
          __ykLog.info("BLOCK_END", {
            op: "RegisterScreen#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          Alert.alert('Register failed', 'Could not create account');
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
        op: "RegisterScreen.register",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  return <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {(['firstName', 'lastName', 'email', 'password'] as const).map(field => <TextInput key={field} style={styles.input} placeholder={field} secureTextEntry={field === 'password'} value={form[field]} onChangeText={value => setForm(prev => ({
      ...prev,
      [field]: value
    }))} />)}
      <TouchableOpacity style={styles.btn} onPress={register}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    padding: 16,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
    color: '#232F3E'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 10
  },
  btn: {
    backgroundColor: '#FF9900',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8
  },
  btnText: {
    fontWeight: '700'
  },
  link: {
    color: '#232F3E',
    textAlign: 'center',
    marginTop: 8
  }
});
export default RegisterScreen;