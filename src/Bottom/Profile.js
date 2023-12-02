import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../Common/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  clearCart,
  clearAddress,
  clearPersonalInformation,
  clearWishlist,
} from "../redux/actions/Actions";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../Common/Footer";

export default function Profile() {
  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setName(await AsyncStorage.getItem("@user_name"));
    setEmail(await AsyncStorage.getItem("@user_email"));
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user_id");
      await AsyncStorage.removeItem("@access_token");
      await AsyncStorage.removeItem("@user_name");
      await AsyncStorage.removeItem("@user_email");
      // dispatch(clearCart());
      // dispatch(clearWishlist());
      // dispatch(clearAddress());
      // dispatch(clearPersonalInformation());
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log("Error occurred during logout:", error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Header
        title={"Profile"}
        onPress={() => {
          logout();
        }}
        isProfile={true}
      />
      <Image
        source={require("../images/profile.png")}
        style={{ width: 80, height: 80, alignSelf: "center", marginTop: 30 }}
      />
      <Text style={{ alignSelf: "center", marginTop: 10, fontSize: 18 }}>
        {name}
      </Text>
      <Text style={{ alignSelf: "center", marginTop: 10, fontSize: 18 }}>
        {email}
      </Text>
      <TouchableOpacity
        style={{
          width: "90%",
          alignSelf: "center",
          height: 50,
          borderBottomWidth: 0.3,
          borderBottomColor: "#8e8e8e",
          marginTop: 20,
          justifyContent: "center",
        }}
        onPress={() => {
          navigation.navigate("PersonalInformation");
        }}
      >
        <Text>Personal Information</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "90%",
          alignSelf: "center",
          height: 50,
          borderBottomWidth: 0.3,
          borderBottomColor: "#8e8e8e",
          justifyContent: "center",
        }}
        onPress={() => {
          navigation.navigate("MyAddress");
        }}
      >
        <Text>My Address</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "90%",
          alignSelf: "center",
          height: 50,
          borderBottomWidth: 0.3,
          borderBottomColor: "#8e8e8e",
          justifyContent: "center",
        }}
        onPress={() => {
          navigation.navigate("MyOrders");
        }}
      >
        <Text>My Order</Text>
      </TouchableOpacity>
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({});
