import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Screen/Login";
import Signup from "./Screen/Signup";
import Cart from "./Bottom/Cart";
import Main from "./Bottom/Main";
import Profile from "./Bottom/Profile";
import Search from "./Bottom/Search";
import Wishlist from "./Bottom/Wishlist";
import Address from "./Screen/Address";
import Checkout from "./Screen/Checkout";
import PersonalInformation from "./Screen/PersonalInformation";
import OrderSuccess from "./Screen/OrderSuccess";
import MyOrders from "./Screen/MyOrders";
import RescheduleOrder from "./Screen/RescheduleOrder";
const Stack = createStackNavigator();
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import {
  addItemToCart,
  addItemToWishlist,
  addAddress,
  addPersonalInformation,
} from "./redux/actions/Actions";
import Details from "./Bottom/Details";
import { ImageBackground } from "react-native";

export default function AppNavigator() {
  const cartReduxData = useSelector((state) => state.cart);
  const wishlistReduxData = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();
  useEffect(() => {
    updateRedux();
  }, []);

  const updateRedux = async () => {
    try {
      const cartDataJson = await AsyncStorage.getItem("@cartData");
      const cartData = JSON.parse(cartDataJson) || [];
      cartData.forEach((item) => {
        const isItemInCart = cartReduxData.some(
          (cartItem) => cartItem.id === item.id
        );
        if (!isItemInCart) {
          dispatch(addItemToCart(item));
        }
      });

      const wishlistDataJson = await AsyncStorage.getItem("@wishlistData");
      const wishlistData = JSON.parse(wishlistDataJson) || [];
      wishlistData.forEach((item) => {
        const isItemInWishlist = wishlistReduxData.some(
          (wishlistItem) => wishlistItem.id === item.id
        );
        if (!isItemInWishlist) {
          dispatch(addItemToWishlist(item));
        }
      });

      const personalInfoJson = await AsyncStorage.getItem(
        "@personalInformation"
      );
      const personalInfo = JSON.parse(personalInfoJson);
      if (personalInfo) {
        dispatch(addPersonalInformation(personalInfo));
      }

      const addressDataJson = await AsyncStorage.getItem("@addressData");
      const addressData = JSON.parse(addressDataJson);
      if (addressData) {
        dispatch(addAddress(addressData));
      }
    } catch (error) {
      console.error("Error updating Redux state:", error);
    }
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackground: () => (
            <ImageBackground
              source={require("./images/rotated_logo.png")}
              style={{
                position: "absolute",
                top: 1,
                left: 0,
                width: 150,
                height: 100,
                zIndex: 1,
              }}
            />
          ),
          headerTintColor: "#000",
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="Main"
          component={Main}
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
          name="Details"
          component={Details}
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
          options={{ title: "Address" }}
          name="Address"
          component={Address}
        />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen
          options={{ title: "Personal Information" }}
          name="PersonalInformation"
          component={PersonalInformation}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="OrderSuccess"
          component={OrderSuccess}
        />
        <Stack.Screen
          options={{ title: "My Orders" }}
          name="MyOrders"
          component={MyOrders}
        />
        <Stack.Screen
          options={{ title: "Reschedule Orders" }}
          name="RescheduleOrder"
          component={RescheduleOrder}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
