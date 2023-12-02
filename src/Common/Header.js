import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ImageBackground } from 'react-native';

export default function Header({ title, onPress, isProfile }) {
  return (
    <View
  style={{
    height: 70,
    backgroundColor: "#FFCACC",
    justifyContent: "center",
    paddingHorizontal: 20, // Optional: Add some horizontal padding for better readability
  }}
>
<ImageBackground
    source={require('../images/rotated_logo.png')} // Adjust the path accordingly
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: 150,
      height: 150,
      zIndex: 1, // Ensure the image is above other elements
    }}
  />
  <Text
    style={{
      fontWeight: "600",
      fontSize: 20,
      color: "#000",
      textAlign: "center",
    }}
  >
    {title}
  </Text>
  <Text
    style={{
      fontSize: 14, // Adjust the font size as needed
      color: "#333", // Adjust the color as needed
      textAlign: "center",
    }}
  >
    Best In the Town Services
  </Text>
</View>

  );
}

const styles = StyleSheet.create({});
