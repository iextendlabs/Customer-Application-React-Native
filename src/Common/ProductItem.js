import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { BaseUrl } from "../Config/Api";

export default function ProductItem({ item, onAddToCart, onAddToWishList }) {
  return (
    <View
      style={{
        width: "47%",
        height: 170,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: "#fff",
        marginLeft: 7,
        marginBottom: 10,
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
          alignItem: "center",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600" }}>AED{item.price}</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 4,
          }}
          onPress={()=>{
            onAddToCart(item);
          }}
        >
          <Text>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          backgroundColor: "#fff",
          borderRadius: 20,
          elevation: 5,
          position: "absolute",
          top: 10,
          right: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={()=>{
          onAddToWishList(item);
        }}
      >
        <Image
          source={require("../images/heart.png")}
          style={{ width: 18, height: 18 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
