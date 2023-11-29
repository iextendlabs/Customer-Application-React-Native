import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../Common/CartItem";
import { removeFromCart, addItemToWishlist } from "../redux/actions/Actions";
import Header from "../Common/Header";
import CommonButton from "../Common/CommonButton";
import { useNavigation } from "@react-navigation/native";

export default function Cart() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);

  const onAddToWishlist = (item) => {
    const isItemInWishlist = wishlistData.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (!isItemInWishlist) {
      dispatch(addItemToWishlist(item));
    } else {
      console.log("Item is already in the Wishlist");
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Header title={"Shopping Cart"} />
      {cartData.length !== 0 ? (
        <FlatList
          data={cartData}
          renderItem={({ item, index }) => {
            return (
              <CartItem
                item={item}
                onRemoveFromCart={() => {
                  dispatch(removeFromCart(index));
                }}
                onAddToWishlist={onAddToWishlist}
              />
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              alignItems: "center",
              fontWeight: 600,
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
        <View style={{ marginBottom: 80 }}>
          <CommonButton
            title={"Checkout"}
            bgColor={"green"}
            textColor={"#fff"}
            onPress={() => {
              navigation.navigate("Checkout");
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
