import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { BaseUrl } from "../Config/Api";
import StarRating from "../Common/StarRating";

export default function StaffCard({ item }) {
  return (
    <View
      style={{
        width: 130,
        height: 225,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: "#fdedee",
        margin: 5,
      }}
    >
      <View
        style={{
          marginTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: BaseUrl + "staff-images/" + item.staff.image,
          }}
          defaultSource={require("../images/logo.png")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        />
      </View>
      <View
        style={{
          marginTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {item.name}
        </Text>
        <Text  style={{ height: 25, marginTop: 5 }}>{item.staff.sub_title}</Text>
        <Text style={{ height: 25, marginTop: 5 }}>
          {item.staff.charges > 0 && "Charges: AED" + item.staff.charges}
        </Text>
        <StarRating rating={item.rating} size={12} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
