import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const register = async () => {
    try {
      const response = await axios.post('http://localhost:8001/api/users', form);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
    } catch (error) {
      Alert.alert('Register failed', 'Could not create account');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {(['firstName', 'lastName', 'email', 'password'] as const).map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field}
          secureTextEntry={field === 'password'}
          value={form[field]}
          onChangeText={(value) => setForm((prev) => ({ ...prev, [field]: value }))}
        />
      ))}
      <TouchableOpacity style={styles.btn} onPress={register}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4EF', padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16, color: '#232F3E' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#FF9900',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  btnText: { fontWeight: '700' },
  link: { color: '#232F3E', textAlign: 'center', marginTop: 8 },
});

export default RegisterScreen;
