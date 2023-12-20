import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getOrdersUrl, orderPDFDownloadUrl } from "../Config/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import Splash from "../Screen/Splash";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, clearCart } from "../redux/actions/Actions";
import OrderDetailModal from "./OrderDetailModel";
import WriteReviewModal from "./WriteReviewModal";

export default function MyOrders() {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [orderDetailModalVisible, setOrderDetailModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState([]);
  const [writeReviewModalVisible, setWriteReviewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const cartData = useSelector((state) => state.cart);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    // Clear state when navigating from RescheduleOrder
    if (route.params && route.params.clearState) {
      setMsg("Order Rescheduled Successfully.");
      getOrders();
      setTimeout(() => {
        setMsg("");
      }, 4000);
    }
  }, [route.params]);

  useEffect(() => {
    getOrders();
  }, []);

  const handleSaveReview = () => {
    setMsg("Review saved successfully."); 
    setTimeout(() => {
      setMsg("");
    }, 4000);
  };

  const getOrders = async () => {
    const user = await AsyncStorage.getItem("@user_id");
    setLoading(true);
    try {
      const response = await axios.get(`${getOrdersUrl}user_id=${user}`);
      if (response.status === 200) {
        let data = response.data;
        setOrders(data.orders);
        setDisplayedOrders(data.orders);
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
    setLoading(false);
  };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  const reOrder = async (item) => {
    await AsyncStorage.removeItem("@cartData");
    dispatch(clearCart());

    item.order_services.forEach((order_service, index) => {
      dispatch(addItemToCart(order_service.service));
      saveToAsyncStorage("@cartData", [...cartData, order_service.service]);
    });

    navigation.navigate("Cart");
  };

  const closeModal = () => {
    getOrders();
    setOrderDetailModalVisible(false);
    setWriteReviewModalVisible(false);
  };

  const handleOrderDetail = (order) => {
    setSelectedOrder(order);
    setOrderDetailModalVisible(true);
  };

  const handleWriteReview = (order_id) => {
    setSelectedOrderId(order_id);
    setWriteReviewModalVisible(true);
  };

  const handleDownloadPDF = async (order_id) => {
    const url = `${orderPDFDownloadUrl}${order_id}`;
    Linking.openURL(url);
  };

  const handleShare = async (order) => {
    try {
      const message = `
**Appointment:**
Staff: ${order.staff_name}
Appointment Date: ${order.date}
Slot: ${order.time_slot_value}
Order Status: ${order.status}

**Order Summary:**
Sub Total: AED ${order.order_total.sub_total}
Coupon Discount: AED ${order.order_total.discount}
Staff Charges: AED ${order.order_total.staff_charges}
Transport Charges: AED ${order.order_total.transport_charges}
Total Order Charges: AED ${order.total_amount}
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

  const handleTabPress = (tabIndex) => {
    if (tabIndex === 0) {
      // Show all orders
      setDisplayedOrders(orders);
    } else if (tabIndex === 1) {
      // Show top 10 recent orders
      const topRecentOrders = orders.slice(0, 10);
      setDisplayedOrders(topRecentOrders);
    }
    setSelectedTab(tabIndex);
  };

  if (loading) {
    return Splash();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View
        style={{
          flex: 1,
          padding: 5,
          marginTop: 70,
        }}
      >
        {msg && (
          <Text
            style={{
              marginLeft: 40,
              fontSize: 18,
              color: "green",
            }}
          >
            {msg}
          </Text>
        )}
        {displayedOrders.length === 0 ? (
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
            data={displayedOrders}
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
                  flexDirection: "column",
                }}
              >
                <View>
                  <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
                  <Text>Total Amount: {item.total_amount}</Text>
                  <Text>Status: {item.status}</Text>
                  <Text>Date: {item.date}</Text>
                  <Text>Staff: {item.staff_name}</Text>
                  <Text>Time Slot: {item.time_slot_value}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {item.status === "Pending" && (
                    <TouchableOpacity
                      style={styles.buttons}
                      onPress={() => {
                        navigation.navigate("RescheduleOrder", {
                          order_id: item.id,
                        });
                      }}
                    >
                      <Text>Reschedule</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "Complete" && (
                    <TouchableOpacity
                      style={styles.buttons}
                      onPress={() => {
                        reOrder(item);
                      }}
                    >
                      <Text>ReOrder</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                      handleOrderDetail(item);
                    }}
                  >
                    <Text>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                      handleDownloadPDF(item.id);
                    }}
                  >
                    <Text>PDF Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                      handleShare(item);
                    }}
                  >
                    <Text>Share</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {item.status === "Complete" && item.review === null && ( 
                    <TouchableOpacity
                      style={styles.buttons}
                      onPress={() => {
                        handleWriteReview(item.id);
                      }}
                    >
                      <Text>Write Review</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />
        )}
        <OrderDetailModal
          visible={orderDetailModalVisible}
          order={selectedOrder}
          onClose={closeModal}
        />
        <WriteReviewModal
          visible={writeReviewModalVisible}
          order_id={selectedOrderId}
          onClose={closeModal}
          onSaveReview={handleSaveReview}
        />
      </View>
      <View
        style={{
          width: "100%",
          height: 50,
          position: "absolute",
          top: 0,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 13,
        }}
      >
        <TouchableOpacity
          style={{
            width: "45%",
            height: "95%",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#8e8e8e",
            margin: 13,
            borderRadius: 10,
            backgroundColor: selectedTab == 0 ? "#fd245f" : "#ff5d89",
          }}
          onPress={() => {
            handleTabPress(0);
          }}
        >
          <Text style={{ color: "#fff" }}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "45%",
            height: "95%",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#8e8e8e",
            backgroundColor:  selectedTab == 1 ? "#fd245f" : "#ff5d89",
            borderRadius: 10,
          }}
          onPress={() => {
            handleTabPress(1);
          }}
        >
          <Text style={{ color: "#fff" }}>Recent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },

  buttons: {
    borderWidth: 0.2,
    borderRadius: 4,
    marginRight: 5,
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
  },
});
