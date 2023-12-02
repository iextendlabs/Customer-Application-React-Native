import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CartItem from "../Common/CartItem";
import { removeFromWishlist, addItemToCart } from "../redux/actions/Actions";
import Header from "../Common/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Footer from "../Common/Footer";

export default function Wishlist() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.wishlist);

  const removeItemFromWishlist = async (item, index) => {
    try {
      const jsonString = await AsyncStorage.getItem("@wishlistData");
      const wishlistData = JSON.parse(jsonString) || [];

      const updatedWishlistData = wishlistData.filter(
        (wishlistItem) => wishlistItem.id !== item.id
      );

      await AsyncStorage.setItem(
        "@wishlistData",
        JSON.stringify(updatedWishlistData)
      );

      dispatch(removeFromWishlist(index));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const cartData = useSelector((state) => state.cart);

  const onAddToCart = async (item) => {
    const user = await AsyncStorage.getItem("@user_id");

    if (user === "" || user === null) {
      navigation.navigate("Login");
    } else {
      const isItemInCart = cartData.some((cartItem) => cartItem.id === item.id);

      if (!isItemInCart) {
        dispatch(addItemToCart(item));
        saveToAsyncStorage("@cartData", [...cartData, item]);
      } else {
        console.log("Item is already in the cart");
      }
    }
  };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={"Wishlist"} />
      {wishlistData.length !== 0 ? (
        <FlatList
        style={{marginBottom:80}}
          data={wishlistData}
          renderItem={({ item, index }) => (
            <CartItem
              item={item}
              isWishlist={true}
              onAddToCart={() => onAddToCart(item)}
              onRemoveFromWishlist={() => removeItemFromWishlist(item, index)}
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
            No Product in Your Wishlist!
          </Text>
        </View>
      )}
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({});
