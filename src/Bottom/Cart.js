import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../Common/CartItem";
import { removeFromCart, addItemToWishlist } from "../redux/actions/Actions";
import Header from "../Common/Header";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../Common/Footer";

export default function Cart() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);

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
    try {
      const user = await AsyncStorage.getItem("@user_id");
      if (!user) {
        navigation.navigate("Login", {
          target: 'Checkout'
        });
      } else {
        navigation.navigate("Checkout");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
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
