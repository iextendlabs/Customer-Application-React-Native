import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { BaseUrl } from "../Config/Api";

export default function CartItem({ item, onRemoveFromCart, onAddToCart , onAddToWishlist, onRemoveFromWishlist, isWishlist }) {
  return (
    <View
      style={{
        width: "95%",
        height: 175,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: "#fff",
        marginLeft: 10,
        marginBottom: 10,
      }}
    >
      <Image
        source={{
          uri: BaseUrl + "service-images/" + item.image,
        }}
        defaultSource={require('../images/logo.png')}
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
        {item.name}
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
        <Text style={{ fontSize: 15, fontWeight: "600" }}>
          AED{" "}
          {item.discount ? (
            <>
              <Text style={{ marginRight: 5, color: "#333" }}>
                {item.discount}
              </Text>
              <Text
                style={{ textDecorationLine: "line-through", color: "#999" }}
              >
                {item.price}
              </Text>
            </>
          ) : (
            item.price
          )}
        </Text>
        {isWishlist ? (
          <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 4,
          }}
          onPress={() => {
            onAddToCart(item);
          }}
        >
          <Text>Add to Cart</Text>
        </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 4,
            }}
            onPress={() => {
              onRemoveFromCart();
            }}
          >
            <Text>Remove From Cart</Text>
          </TouchableOpacity>
        )}
      </View>
      {isWishlist ? (
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
        onPress={() => {
          onRemoveFromWishlist();
        }}
      >
        <Image
          source={require("../images/heart_fill.png")}
          style={{ width: 18, height: 18, tintColor:'red' }}
        />
      </TouchableOpacity>
      ):(
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
        onPress={() => {
          onAddToWishlist(item);
        }}
      >
        <Image
          source={require("../images/heart.png")}
          style={{ width: 18, height: 18 }}
        />
      </TouchableOpacity>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({});
