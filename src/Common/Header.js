import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function Header({ title, onPress, isProfile }) {

  const navigation = useNavigation();
  const notificationsData = useSelector((state) => state.Notifications);
  const [countNotification, setCountNotification] = useState(0);
  useEffect(() => {
    if (notificationsData && notificationsData.length > 0) {
      setCountNotification(notificationsData[0].filter(notification => notification.type === "New").length);
    }
  }, [notificationsData]);
  return (
    <View
      style={{
        height: 100,
        backgroundColor: "#FFCACC",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center", // Center items vertically
      }}
    >
      <ImageBackground
        source={require("../images/rotated_logo.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 150,
          height: 150,
          zIndex: 1,
        }}
      />
      <View style={{flex:3}}>
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
        {!isProfile && (
          <Text
            style={{
              fontSize: 14,
              color: "#333",
              textAlign: "center",
            }}
          >
            Live your best life
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          flex:0.5
        }}
        onPress={() => {
          navigation.navigate("Notification");
        }}
      >
        <Image
          source={require("../images/bell.png")}
          style={{
            width: 24,
            height: 24,
            tintColor: "#000",
          }}
        />
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: "red",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -5, // Adjust this value to position the badge correctly
            right: 0,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {countNotification}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
