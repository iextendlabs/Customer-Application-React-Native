import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { BaseUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";

export default function ProductItem({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        width: "47%",
        height: 170,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: "#fff",
        marginLeft: 7,
        marginBottom: 10,
      }}
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
        style={{
          width: "100%",
          height: "50%",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <Text
        style={{ marginLeft: 10, marginTop: 10, fontSize: 15, fontWeight: 600 }}
      >
        {item.name.substring(0, 20)}...
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 10,
          paddingRight: 10,
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600" }}>AED{item.price}</Text>
        <Text>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
