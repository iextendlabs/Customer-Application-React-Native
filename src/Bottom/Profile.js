import { StyleSheet, Text, View, Image, TouchableOpacity,ScrollView } from "react-native";
import React from "react";
import Header from "../Common/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  clearAddress,
  clearAffiliate,
  clearCoupon,
  clearNotification,
  clearPersonalInformation,
} from "../redux/actions/Actions";
import { useDispatch } from "react-redux";
import Footer from "../Common/Footer";
import axios from "axios";
import { DeleteAccountUrl } from "../Config/Api";

export default function Profile() {
  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [message, setMessage] = useState();
  const navigation = useNavigation();

  const setSuccess = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };
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

      dispatch(clearAddress());
      dispatch(clearPersonalInformation());
      dispatch(clearCoupon());
      dispatch(clearAffiliate());
      dispatch(clearNotification());
      await AsyncStorage.removeItem("@personalInformation");
      await AsyncStorage.removeItem("@couponData");
      await AsyncStorage.removeItem("@affiliate");
      await AsyncStorage.removeItem("@addressData");
      await AsyncStorage.removeItem("@addressData");
      await AsyncStorage.removeItem("@notifications");
      await AsyncStorage.removeItem("@selectedCountryForNumber");
      await AsyncStorage.removeItem("@selectedCountryForWhatsapp");
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
            params: { back: "Home" }, // Add your params here
          },
        ],
      });
    } catch (error) {
      console.log("Error occurred during logout:", error);
    }
  };

  const deleteAccount = async () => {
    let userId = await AsyncStorage.getItem("@user_id");

    try {
      const response = await axios.get(
        `${DeleteAccountUrl}id=${userId}`
      );
      if (response.status === 200) {
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
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
              params: { back: "Home", msg: response.data.msg },
            },
          ],
        });
      } else if (response.status === 201) {
        setSuccess(response.data.msg);
      };
    } catch (error) {
      console.log("Error occurred during logout:", error);
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
        <Image
          source={require("../images/profile.png")}
          style={{ width: 80, height: 80, alignSelf: "center", marginTop: 10 }}
        />
        {message !== "" && (
          <Text style={{
            color: "red",
            fontSize: 16,
            fontWeight: "bold",
            margin: 10,
          }}>{message}</Text>
        )}
        <Text style={{ alignSelf: "center", marginTop: 2, fontSize: 18 }}>
          {name}
        </Text>
        <Text style={{ alignSelf: "center", marginTop: 2, fontSize: 18 }}>
          {email}
        </Text>
        <TouchableOpacity
          style={{
            width: "90%",
            alignSelf: "center",
            height: 50,
            borderBottomWidth: 0.3,
            borderBottomColor: "#8e8e8e",
            marginTop: 5,
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("PersonalInformation", { previousRouteName: 'Profile' });
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
            navigation.navigate("Address");
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
          <Text>My Bookings</Text>
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
            navigation.navigate("MyVoucher");
          }}
        >
          <Text>My Voucher</Text>
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
          onPress={() => navigation.navigate("JoinAffiliate")}
        >
          <Text>Join Affiliate</Text>
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
            navigation.navigate("Chat");
          }}
        >
          <Text>Customer Support</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            style={{
              width: 120,
              height: 40,
              marginTop: 10,
              justifyContent: "center",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "#8e8e8e",
            }}
            onPress={() => {
              deleteAccount();
            }}
          >
            <Text style={{ alignSelf: "center" }}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              height: 40,
              marginTop: 10,
              justifyContent: "center",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "#8e8e8e",
            }}
            onPress={() => {
              logout();
            }}
          >
            <Text style={{ alignSelf: "center" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
