import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getOrdersUrl } from "../Config/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function MyOrders() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const user = await AsyncStorage.getItem("@user_id");
    setLoading(true);
    try {
      const response = await axios.get(`${getOrdersUrl}user_id=${user}`);
      if (response.status === 200) {
        let data = response.data;
        setOrders(data.orders);
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 5 }}>
      {orders.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              alignItems: "center",
              fontWeight: 600,
              marginTop: 20,
              fontSize: 20,
              color: "#000",
            }}
          >
            No Orders Available
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false} // Remove horizontal prop
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 0.5,
                width: "100%",
                borderColor: "#8e8e8e",
                padding: 10,
                marginBottom: 10,
                alignSelf: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 3 }}>
                <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
                <Text>Total Amount: {item.total_amount}</Text>
                <Text>Status: {item.status}</Text>
                <Text>Date: {item.date}</Text>
                <Text>Staff: {item.staff_name}</Text>
                <Text>Time Slot: {item.time_slot_value}</Text>
              </View>
              {/* <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 0.2,
                  borderRadius: 4,
                  padding: 7,
                  marginRight: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  navigation.navigate("RescheduleOrder", {
                    order_id: item.id,
                  });
                }}
              >
                <Text>Reschedule</Text>
              </TouchableOpacity> */}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
