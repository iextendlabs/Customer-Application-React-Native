import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Share,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { orderPDFDownloadUrl } from "../Config/Api";

export default function OrderSuccess() {
  const route = useRoute();
  const navigation = useNavigation();

  const handleDownloadPDF = async (order_id) => {
    const url = `${orderPDFDownloadUrl}${order_id}`;
    Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      const message = `
Order Id#${route.params.order_id}
Staff: ${route.params.staff}
Appointment Date: ${route.params.date}
Slot: ${route.params.slot}
Total Order Charges: AED ${route.params.total_amount}
`;

      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFCACC",
      }}
    >
      <Image
        source={require("../images/checked.png")}
        style={{ width: 50, height: 50, alignSelf: "center" }}
      />
      <Text style={{ fontSize: 15, alignSelf: "center", marginTop: 20 }}>
        Your Order Placed Successfully!
      </Text>
      <Text>Appointment: {route.params.date}</Text>
      <Text>Staff: {route.params.staff}</Text>
      <Text>Slot: {route.params.slot}</Text>
      <Text>Total Amount: AED {route.params.total_amount}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            navigation.navigate("RescheduleOrder", {
              order_id: route.params.order_id,
            });
          }}
        >
          <Text>Reschedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            handleDownloadPDF(route.params.order_id);
          }}
        >
          <Text>PDF Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            handleShare();
          }}
        >
          <Text>Share</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          width: 200,
          height: 50,
          marginTop: 50,
          justifyContent: "center",
          alignSelf: "center",
          borderWidth: 0.5,
          borderColor: "#8e8e8e",
        }}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        }}
      >
        <Text style={{ alignSelf: "center" }}>Go To Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    borderWidth: 0.2,
    borderRadius: 4,
    marginRight: 5,
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
  },
});
