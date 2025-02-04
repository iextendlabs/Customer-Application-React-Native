import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { BaseUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";

export default function WishlistItem({ item, onAddToCart, onRemoveFromWishlist }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: "95%",
        height: 175,
        borderRadius: 10,
        elevation: 5,
        marginLeft: 10,
        marginBottom: 10,
        backgroundColor: "#FFCACC"
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

              <Text
                style={{ textDecorationLine: "line-through", color: "red" }}
              >
                {item.price}
              </Text>
              <Text style={{ marginRight: 5, color: "#333" }}>
                {" " + item.discount}
              </Text>
            </>
          ) : (
            item.price
          )}
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 4,
          }}
          onPress={() => {
            if (item.options.length > 0) {
              navigation.navigate("Details", {
                service: item,
              });
            } else {
              onAddToCart(item);
            }
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
        onPress={() => {
          onRemoveFromWishlist();
        }}
      >
        <Image
          source={require("../images/heart_fill.png")}
          style={{ width: 18, height: 18, tintColor: 'red' }}
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({});
