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
  const [orderIds, setOrderIds] = useState([]);

  const handleDownloadPDF = async (order_id) => {
    const url = `${orderPDFDownloadUrl}${order_id}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    if (route.params && route.params.order_ids) {
      const orderIds = route.params.order_ids;
      const formattedOrderIds = orderIds.join(', ');
      setOrderIds(formattedOrderIds);
    }
  }, [route.params?.order_ids]);

  const handleShare = async () => {
    try {
      


      const message = `
Order Id#${orderIds}
Sub Total: AED ${route.params.sub_total}
Discount: AED ${route.params.discount}
Staff Charges: AED ${route.params.staff_charges}
Transport Charges: AED ${route.params.transport_charges}
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
      <Text>Order Id: {orderIds}</Text>
      <Text>Sub Total: AED {route.params.sub_total}</Text>
      <Text>Discount: AED {route.params.discount}</Text>
      <Text>Staff Charges: AED {route.params.staff_charges}</Text>
      <Text>Transport Charges: AED {route.params.transport_charges}</Text>
      <Text>Total Order Charges: AED {route.params.total_amount}</Text>
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
            handleShare();
          }}
        >
          <Text>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            navigation.navigate("MyOrders");
          }}
        >
          <Text>Check Booking</Text>
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
