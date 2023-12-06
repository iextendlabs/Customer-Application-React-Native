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
        height: 190,
        elevation: 5,
        marginLeft: 7,
        paddingBottom: 10,
      }}
      onPress={() => {
        navigation.navigate("Details", {
          service: item,
        });
      }}
    >
      <Text
        style={{
          backgroundColor: "#000",
          color: "#FFF",
          fontSize: 15,
          fontWeight: 600,
          height: 50,
          textAlign: "center",
          padding: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.name.substring(0, 40)}
      </Text>

      <Image
        source={{
          uri: BaseUrl + "service-images/" + item.image,
        }}
        defaultSource={require("../images/logo.png")}
        style={{
          width: "100%",
          height: "60%",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />

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
        <Text style={{ fontSize: 15, fontWeight: "600" }}>
          AED{" "}
          {item.discount ? (
            <>
              <Text
                style={{ textDecorationLine: "line-through", color: "#999" }}
              >
                {item.price}
              </Text>
              <Text style={{ marginRight: 5, color: "#333" }}>
                {item.discount}
              </Text>
            </>
          ) : (
            item.price
          )}
        </Text>
        <Text>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
