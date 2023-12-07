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
        margin: 5,
        paddingBottom: 10,
        backgroundColor: "#fdedee",
        borderRadius: 10,
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
        defaultSource={require("../images/logo.png")}
        style={{
          width: "95%",
          height: "60%",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: 5,
          borderRadius: 10,
        }}
      />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            textAlign: "center",
            padding: 5,
          }}
        >
          {item.name.substring(0, 40)}
        </Text>
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
