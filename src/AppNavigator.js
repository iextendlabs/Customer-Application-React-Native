import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Splash from "./Screen/Splash";
import Login from "./Screen/Login";
import Signup from "./Screen/Signup";
import Home from "./Screen/Home";
import Cart from "./Bottom/Cart";
import Main from "./Bottom/Main";
import Profile from "./Bottom/Profile";
import Search from "./Bottom/Search";
import Wishlist from "./Bottom/Wishlist";
import MyAddress from "./Screen/MyAddress";
import AddAddress from "./Screen/AddAddress";
import Checkout from "./Screen/Checkout";
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Splash"
          component={Splash}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Main"
          component={Main}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Search"
          component={Search}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Cart"
          component={Cart}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Wishlist"
          component={Wishlist}
        />
        <Stack.Screen
          options={{ title: 'My Address' }}
          name="MyAddress"
          component={MyAddress}
        />
        <Stack.Screen
          options={{ title: 'Add Address' }}
          name="AddAddress"
          component={AddAddress}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
