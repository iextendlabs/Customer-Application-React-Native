import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../Common/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
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
  return (
    <View style={{ flex: 1 }}>
      <Header title={"Profile"} />
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
          marginTop: 20,
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
      >
        <Text>My Order</Text>
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
      >
        <Text>My Offers</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
