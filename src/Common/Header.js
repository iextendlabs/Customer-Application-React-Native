import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function Header({ title, onPress, isProfile }) {
  return (
    <View
      style={{
        width: "100%",
        height: 70,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#8e8e8e",
        borderBottomWidth: 0.2,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontWeight: "600",
          fontSize: 20,
          color: "#000",
          marginLeft: 20,
        }}
      >
        {title}
      </Text>
      {isProfile && (
        <TouchableOpacity
          onPress={() => {
            onPress();
          }}
        >
          <Image
            source={require("../images/logout.png")}
            style={{ width: 24, height: 24, marginRight: 20 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
