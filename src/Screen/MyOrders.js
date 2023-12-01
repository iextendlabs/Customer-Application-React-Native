import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getOrdersUrl } from "../Config/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyOrders() {
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
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? (
        <Text>No orders available</Text>
      ) : (
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false} // Remove horizontal prop
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
              <Text>Total Amount: {item.total_amount}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Staff: {item.staff_name}</Text>
              <Text>Time Slot: {item.time_slot_value}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
