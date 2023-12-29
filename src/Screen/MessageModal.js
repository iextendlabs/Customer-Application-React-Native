import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MessageModal({
  visible,
  message,
  onClose,
}) {
  const navigation = useNavigation();

  const handleModalClose = () => {
    console.log('sd');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{message}</Text>
          <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleModalClose();
              }}
            >
              <Text style={styles.buttonText}>
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleModalClose();
                navigation.navigate("Cart")
              }}
            >
              <Text style={styles.buttonText}>
                Checkout
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fdedee",
    borderRadius: 10,
    padding: 20,
    width: "70%",
    alignSelf: "center",
    justifyContent: "center", // Center the content vertically
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center"
  },
  button: {
    backgroundColor: "#fd245f",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  }
});
