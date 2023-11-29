import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../Common/CartItem";
import { removeFromWishlist, addItemToCart } from "../redux/actions/Actions";
import Header from "../Common/Header";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.wishlist);

  const cartData = useSelector((state) => state.cart);

  const onAddToCart = (item) => {
    const isItemInCart = cartData.some((cartItem) => cartItem.id === item.id);

    if (!isItemInCart) {
      dispatch(addItemToCart(item));
    } else {
      console.log("Item is already in the cart");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={"Wishlist"} />
      {wishlistData.length !== 0 ? (
        <FlatList
          data={wishlistData}
          renderItem={({ item, index }) => {
            return (
              <CartItem
                item={item}
                isWishlist={true}
                onAddToCart={onAddToCart}
                onRemoveFromWishlist={() => {
                  dispatch(removeFromWishlist(index));
                }}
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
            No Product in Your Wishlist!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
