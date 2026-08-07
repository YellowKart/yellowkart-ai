import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.meta}>{user?.email || 'Signed in'}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Requirements')}
      >
        <Text style={styles.btnText}>Requirements list</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.logout]}
        onPress={() => dispatch({ type: 'LOGOUT' })}
      >
        <Text style={styles.btnText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4EF', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#232F3E' },
  meta: { color: '#6b7280', marginVertical: 12 },
  btn: {
    backgroundColor: '#FF9900',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  logout: { backgroundColor: '#232F3E' },
  btnText: { color: '#fff', fontWeight: '700' },
});

export default ProfileScreen;
