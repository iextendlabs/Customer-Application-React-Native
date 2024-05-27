import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";

export default function Footer() {
  const wishlistData = useSelector((state) => state.wishlist);
  const cartData = useSelector((state) => state.cart);

  const navigation = useNavigation();
  const route = useRoute();
  const checkAuthentication = async (navigate) => {
    const user = await AsyncStorage.getItem("@user_id");
    if (user === "" || user === null) {
      navigation.navigate("Login", { Navigate: navigate });
    } else {
      navigation.navigate(navigate);
    }
  };

  const openWhatsAppMessage = async () => {
    try {
      const whatsappNumber = await AsyncStorage.getItem("@whatsappNumber");
      Linking.openURL(`https://wa.me/${whatsappNumber}`);
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: 70,
          backgroundColor: "#FFCACC",
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "17%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("Main");
          }}
        >
          <Image
            source={require("../images/home.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: route.name == "Main" ? "#000" : "#8e8e8e",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "17%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          <Image
            source={require("../images/search.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: route.name == "Search" ? "#000" : "#8e8e8e",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: "17%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("Cart");
          }}
        >
          <Image
            source={require("../images/bag.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: route.name == "Cart" ? "#000" : "#8e8e8e",
            }}
          />
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: "red",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 15,
              right: 20,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {cartData.length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "17%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("Wishlist");
          }}
        >
          <Image
            source={require("../images/heart.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: route.name == "Wishlist" ? "#000" : "#8e8e8e",
            }}
          />
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: "red",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 15,
              right: 20,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {wishlistData.length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "17%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("Booking");
          }}
        >
          <Image
            source={require("../images/booking.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: route.name == "Booking" ? "#000" : "#8e8e8e",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "17%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("Menu")
          }}
        >
          <Image
            source={require("../images/menu.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: route.name == "Menu" ? "#000" : "#8e8e8e",
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={openWhatsAppMessage}
        style={{ position: "absolute", bottom: 65, right: 20 }}
      >
        <Image
          source={require("../images/whatsapp-chat.png")}
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          checkAuthentication("Chat");
        }}
        style={{ position: "absolute", bottom: 130, right: 20 }}
      >
        <Image
          source={require("../images/chat.png")}
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>
      <FlashMessage
        position="bottom"
        style={{
          borderRadius: 8,
          padding: 30,
          marginHorizontal: 50,
          marginBottom: 50,
          alignItems: "center",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
