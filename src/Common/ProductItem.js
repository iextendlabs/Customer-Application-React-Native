import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { BaseUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import StarRating from "./StarRating";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { showMessage } from "react-native-flash-message";
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";
import MessageModal from "../Screen/MessageModal";

export default function ProductItem({ item }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [msg, setMsg] = useState(false);

  const handleMessage = (msg) => {
    setMsg(msg);
    setMessageModalVisible(true);
  };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  const onAddToCart = async (item) => {
    const isItemInCart = cartData.some((cartItem) => cartItem.service_id === item.id);

    if (!isItemInCart) {
      navigation.navigate("AddToCart",{ service: item });
    } else {
      handleMessage("Item is already in the cart.");
    }
  };

  const onAddToWishList = async (item) => {
    const isItemInWishlist = wishlistData.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (!isItemInWishlist) {
      dispatch(addItemToWishlist(item));
      saveToAsyncStorage("@wishlistData", [...wishlistData, item]);
      // showMessage({
      //   message: "Added to WisthList.",
      //   ...toastOptions,
      // });
    } else {
      // showMessage({
      //   message: "Item is already in the Wishlist.",
      //   ...toastOptions,
      // });
    }
  };

  const closeModal = () => {
    setMessageModalVisible(false);
  };

  return (
    <View
      style={{
        width: "47%",
        height: 285,
        elevation: 5,
        margin: 5,
        paddingBottom: 10,
        backgroundColor: "#fdedee",
        borderRadius: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Details", {
            service: item,
          });
        }}
      >
        <Image
          source={{
            uri: BaseUrl + "service-images/" + item.image,
          }}
          defaultSource={require("../images/logo.png")}
          style={{
            width: "95%",
            height: 155,
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 5,
            borderRadius: 10,
          }}
        />
      </TouchableOpacity>

      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
          height: 50,
        }}
      >
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              fontFamily: "Times New Roman",
            }}
          >
            {item.name}
          </Text>
        </ScrollView>
        <View>
          <StarRating rating={item.rating} size={12} />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600" }}>
          AED{" "}
          {item.discount ? (
            <>
              <Text
                style={{ textDecorationLine: "line-through", color: "red" }}
              >
                {item.price}
              </Text>
              <Text style={{ marginRight: 5, color: "#333" }}>
                {" " + item.discount}
              </Text>
            </>
          ) : (
            item.price
          )}
        </Text>
        <Text>{item.duration}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 10,
          paddingRight: 10,
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 7,
            borderRadius: 4,
            backgroundColor: "#fd245f",
          }}
          onPress={() => {
            onAddToCart(item);
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            backgroundColor: "#fff",
            borderRadius: 20,
            elevation: 5,
            position: "absolute",
            right: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            onAddToWishList(item);
          }}
        >
          <Image
            source={require("../images/wish.png")}
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>
      </View>
      <MessageModal
        visible={messageModalVisible}
        message={msg}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
