import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../Common/CartItem";
import { removeFromCart, addItemToWishlist, clearAddress, clearPersonalInformation, clearCoupon, clearNotification } from "../redux/actions/Actions";
import Header from "../Common/Header";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../Common/Footer";
import Splash from "../Screen/Splash";
import axios from "axios";
import { checkUser } from "../Config/Api";

export default function Cart() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);
  const [loading, setLoading] = useState(false);

  const removeItemFromCart = async (item, index) => {
    try {
      const jsonString = await AsyncStorage.getItem("@cartData");
      const cartData = JSON.parse(jsonString) || [];

      const updatedCartData = cartData.filter(
        (cartItem) => cartItem.id !== item.id
      );

      await AsyncStorage.setItem("@cartData", JSON.stringify(updatedCartData));

      dispatch(removeFromCart(index));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const checkAuthentication = async () => {
    setLoading(true);
    try {
      const user = await AsyncStorage.getItem("@user_id");
      if (!user) {
        navigation.navigate("Login", { Navigate: "Checkout" });
      } else {
        const response = await axios.get(checkUser + user);
        if (response.status === 200) {
          if (response.data.exists === true) {
            navigation.navigate("Checkout");
          } else {
            await AsyncStorage.removeItem("@user_id");
            await AsyncStorage.removeItem("@access_token");
            await AsyncStorage.removeItem("@user_name");
            await AsyncStorage.removeItem("@user_email");

            dispatch(clearAddress());
            dispatch(clearPersonalInformation());
            dispatch(clearCoupon());
            dispatch(clearNotification());
            await AsyncStorage.removeItem("@personalInformation");
            await AsyncStorage.removeItem("@couponData");
            await AsyncStorage.removeItem("@addressData");
            await AsyncStorage.removeItem("@addressData");
            await AsyncStorage.removeItem("@notifications");
            navigation.navigate("Login");
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  const onAddToWishList = async (item) => {
    const isItemInWishlist = wishlistData.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (!isItemInWishlist) {
      dispatch(addItemToWishlist(item));
      saveToAsyncStorage("@wishlistData", [...wishlistData, item]);
    } else {
      console.log("Item is already in the Wishlist");
    }
  };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  if (loading) {
    return Splash();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"Shopping Cart"} />
      <ScrollView>
        {cartData.length !== 0 ? (
          <FlatList
            data={cartData}
            renderItem={({ item, index }) => (
              <CartItem
                item={item}
                onRemoveFromCart={() => removeItemFromCart(item, index)}
                onAddToWishlist={() => onAddToWishList(item)}
              />
            )}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                alignItems: "center",
                fontWeight: "600",
                marginTop: 20,
                fontSize: 20,
                color: "#000",
              }}
            >
              No Product in Your Shopping Cart!
            </Text>
          </View>
        )}

        {cartData.length !== 0 && (
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                width: "85%",
                borderRadius: 10,
                alignSelf: "center",
                marginBottom: 80,
              }}
              onPress={() => {
                checkAuthentication();
              }}
            >
              <Text style={{ color: "#fff" }}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
