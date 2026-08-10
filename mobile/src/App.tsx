import { createLogger } from "./utils/logger";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import RequirementsScreen from './screens/RequirementsScreen';
const __ykLog = createLogger("App");
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStackNavigator = () => {
  const __ykStart = Date.now();
  const __ykOp = "App.HomeStackNavigator";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    return <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Requirements" component={RequirementsScreen} options={{
        title: 'Requirements'
      }} />
    </Stack.Navigator>;
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
};
const CartStackNavigator = () => {
  const __ykStart = Date.now();
  const __ykOp = "App.CartStackNavigator";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    return <Stack.Navigator>
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>;
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
};
const AuthStackNavigator = () => {
  const __ykStart = Date.now();
  const __ykOp = "App.AuthStackNavigator";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    return <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>;
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
};
const RequirementsStackNavigator = () => {
  const __ykStart = Date.now();
  const __ykOp = "App.RequirementsStackNavigator";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    return <Stack.Navigator>
      <Stack.Screen name="RequirementsHome" component={RequirementsScreen} options={{
        title: 'Requirements'
      }} />
    </Stack.Navigator>;
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
};
const AppTabNavigator = () => {
  const __ykStart = Date.now();
  const __ykOp = "App.AppTabNavigator";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    return <Tab.Navigator screenOptions={{
      tabBarLabelPosition: 'below-icon',
      tabBarActiveTintColor: '#FF9900'
    }}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{
        title: 'Home',
        headerShown: false
      }} />
      <Tab.Screen name="RequirementsTab" component={RequirementsStackNavigator} options={{
        title: 'Requirements',
        headerShown: false
      }} />
      <Tab.Screen name="CartTab" component={CartStackNavigator} options={{
        title: 'Cart',
        headerShown: false
      }} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>;
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
};
const App = () => {
  __ykLog.info("FLOW_ENTER", {
    op: "App.App"
  });
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  return <NavigationContainer>
      {isLoggedIn ? <AppTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>;
};
export default App;