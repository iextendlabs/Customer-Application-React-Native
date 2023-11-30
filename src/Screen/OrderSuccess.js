import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../Common/Header";
import { useNavigation } from "@react-navigation/native";

export default function OrderSuccess() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../images/checked.png")}
        style={{ width: 50, height: 50, alignSelf: "center" }}
      />
      <Text style={{ fontSize: 15, alignSelf: "center", marginTop: 20 }}>
        Your Order Places Successfully!
      </Text>
      <TouchableOpacity
        style={{
          width: 200,
          height: 50,
          marginTop: 50,
          justifyContent: "center",
          alignSelf: "center",
          borderWidth: 0.5,
          borderColor: "#8e8e8e",
        }}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }}
      >
        <Text style={{ alignSelf: "center" }}>Go To Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
