import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import CommonButton from "../Common/CommonButton";
import { BaseUrl } from "../Config/Api";

const OrderServiceItem = ({ service }) => (
  <View style={styles.serviceItemContainer}>
    <Image
      source={{
        uri: `${BaseUrl}service-images/${service.image}`,
      }}
      defaultSource={require("../images/logo.png")}
      style={styles.serviceItemImage}
    />
    <View style={styles.serviceItemText}>
      <Text style={styles.serviceItemName}>{service.name}</Text>
      <Text style={styles.serviceItemPrice}>
        AED{" "}
        {service.discount ? (
          <>
            <Text style={styles.strikeThroughText}>{service.price}</Text>
            <Text style={styles.discountText}>{service.discount}</Text>
          </>
        ) : (
          service.price
        )}
      </Text>
    </View>
  </View>
);

export default function OrderDetailModel({ visible, order, onClose }) {
  const [services, setServices] = useState([]);
  const [orderTotal, setOrderTotal] = useState([]);

  const handleModalClose = () => {
    onClose();
  };

  useEffect(() => {
    if (order && order.order_services && order.order_total) {
      setServices(order.order_services);
      setOrderTotal(order.order_total);
    }
  }, [order]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Order Detail</Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Services:</Text>
            <FlatList
              data={services}
              renderItem={({ item }) => (
                <OrderServiceItem service={item.service} />
              )}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Address:</Text>
            <Text style={styles.addressText}>
              {order.buildingName} {order.flatVilla} {order.street} {order.area}{" "}
              {order.city}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Appointment:</Text>
            <View style={styles.appointmentInfo}>
              <Text>Staff: {order.staff_name}</Text>
              <Text>Appointment Date: {order.date}</Text>
              <Text>Slot: {order.time_slot_value}</Text>
              <Text>Order Status: {order.status}</Text>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Order Summary:</Text>
            <View style={styles.orderSummaryContainer}>
              <Text style={[styles.orderSummaryText, { marginTop: 10 }]}>
                Sub Total: AED {orderTotal.sub_total}
              </Text>
              <Text style={[styles.orderSummaryText]}>
                Coupon Discount: AED -{orderTotal.discount}
              </Text>
              <Text style={styles.orderSummaryText}>
                Staff Charges: AED {orderTotal.staff_charges}
              </Text>
              <Text style={{ borderBottomWidth: 0.5, paddingBottom: 10 }}>
                Transport Charges: AED {orderTotal.transport_charges}
              </Text>
              <View style={styles.borderTop}></View>
              <Text style={styles.orderSummaryTotal}>
                Total Order Charges: AED {order.total_amount}
              </Text>
            </View>
          </View>
          <CommonButton
            title={"Close"}
            bgColor={"#ff6566"}
            textColor={"#fff"}
            onPress={handleModalClose}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fdedee",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    // The following line ensures the modal content is centered vertically
    alignSelf: "center",
    flexDirection: "column",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderColor: "#8e8e8e",
  },
  sectionTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "700",
  },
  serviceItemContainer: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    marginTop: 10,
  },
  serviceItemImage: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  serviceItemText: {
    padding: 10,
  },
  serviceItemName: {
    fontSize: 15,
  },
  serviceItemPrice: {
    marginTop: 15,
  },
  strikeThroughText: {
    textDecorationLine: "line-through",
    color: "red",
  },
  discountText: {
    marginRight: 5,
    color: "#333",
  },
  addressText: {
    margin: 10,
  },
  appointmentInfo: {
    margin: 10,
  },
  orderSummaryContainer: {
    marginLeft: 30,
    fontSize: 16,
    width: "80%",
  },
  orderSummaryText: {
    marginBottom: 10,
  },
  borderTop: {
    borderTopWidth: 0.5,
    borderColor: "#8e8e8e",
  },
  orderSummaryTotal: {
    margin: 10,
    fontWeight: "800",
  },
});
