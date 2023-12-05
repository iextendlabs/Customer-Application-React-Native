import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../Common/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";

export default function OrderSuccess() {
  const route = useRoute();
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFCACC" }}>
      <Image
        source={require("../images/checked.png")}
        style={{ width: 50, height: 50, alignSelf: "center" }}
      />
      <Text style={{ fontSize: 15, alignSelf: "center", marginTop: 20 }}>
        Your Order Placed Successfully!
      </Text>
      <Text>Appointment: {route.params.date}</Text>
      <Text>Staff {route.params.staff}</Text>
      <Text>Slot {route.params.slot}</Text>
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
            routes: [{ name: 'Main' }],
          });
        }}
      >
        <Text style={{ alignSelf: "center" }}>Go To Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
