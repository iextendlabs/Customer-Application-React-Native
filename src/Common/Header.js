import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Header({title}) {
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
    </View>
  );
}

const styles = StyleSheet.create({});
