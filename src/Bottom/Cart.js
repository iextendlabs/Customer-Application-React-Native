import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../Common/CartItem";
import { removeFromCart, clearAddress, clearPersonalInformation, clearCoupon, clearNotification } from "../redux/actions/Actions";
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
  const [loading, setLoading] = useState(false);

  const removeItemFromCart = async (item, index) => {
    try {
      const jsonString = await AsyncStorage.getItem("@cart");
      const cart = JSON.parse(jsonString) || [];
      const updatedCart = cart.filter(cartItem => cartItem.service_id !== item.service_id);
      await AsyncStorage.setItem("@cart", JSON.stringify(updatedCart));
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
        const response = await axios.get(`${checkUser}${user}`);
        if (response.status === 200 && response.data.exists) {
          navigation.navigate("Checkout");
        } else {
          await AsyncStorage.removeItem("@user_id");
          dispatch(clearAddress());
          dispatch(clearPersonalInformation());
          dispatch(clearCoupon());
          dispatch(clearNotification());
          navigation.navigate("Login", { Navigate: "Checkout" });
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Splash />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Shopping Cart" />
      <ScrollView style={{marginBottom:80}}>
        <View style={styles.content}>
          {cartData.length > 0 ? (
            <FlatList
              data={cartData}
              renderItem={({ item, index }) => (
                <CartItem
                  item={item}
                  onRemoveFromCart={() => removeItemFromCart(item, index)}
                />
              )}
              keyExtractor={item => item.service_id.toString()}
            />
          ) : (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>
                No Product in Your Shopping Cart!
              </Text>
            </View>
          )}
        </View>
        {cartData.length > 0 && (
          <TouchableOpacity style={styles.checkoutButton} onPress={checkAuthentication}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCACC",
  },
  content: {
    paddingHorizontal: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontWeight: "600",
    fontSize: 20,
    color: "#000",
  },
  checkoutButton: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
