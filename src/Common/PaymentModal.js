import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomTextInput from './CustomTextInput';

const PaymentModal = ({ visible, onClose, navigation }) => {
  const handleModalClose = () => {
    onClose();
  };

  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handlePayment = () => {
    // Implement payment handling logic here
    // You can use the values of amount, transactionId, and customerEmail
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Payment Modal</Text>
          <CustomTextInput
            placeholder={"Amount"}
            keyboardType="numeric"
            value={amount}
            onChangeText={(txt) => {
              setAmount(txt);
            }}
          />
          <CustomTextInput
            placeholder={"Transaction ID"}
            value={transactionId}
            onChangeText={(txt) => {
              setTransactionId(txt);
            }}
          />
          <CustomTextInput
            placeholder={"Customer Email"}
            keyboardType="email-address"
            value={customerEmail}
            onChangeText={(txt) => {
              setCustomerEmail(txt);
            }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePayment}
            >
              <Text style={styles.buttonText}>
                Pay Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ccc' }]}
              onPress={handleModalClose}
            >
              <Text style={styles.buttonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fdedee',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#fd245f',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default PaymentModal;
