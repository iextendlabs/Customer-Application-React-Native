import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { createPaymentIntent } from '../Config/Api';
import CommonButton from '../Common/CommonButton';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/actions/Actions';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [cardDetails, setCardDetails] = useState(null);
  const [subTotal, setSubTotal] = useState('');
  const [discount, setDiscount] = useState('');
  const [staffCharges, setStaffCharges] = useState('');
  const [transportCharges, setTransportCharges] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [orderIds, setOrderIds] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageStyle, setMessageStyle] = useState(styles.successMessage);
  const { confirmPayment } = useStripe();

  useEffect(() => {
    if (route.params) {
      if (route.params.order_ids && route.params.customer_type) {
        setSubTotal(route.params.sub_total);
        setDiscount(route.params.discount);
        setStaffCharges(route.params.staff_charges);
        setTransportCharges(route.params.transport_charges);
        setTotalAmount(route.params.total_amount);
        setOrderIds(route.params.order_ids);
        setCustomerType(route.params.customer_type);
      }

    }
  }, [route.params?.order_ids]);

  const handlePayPress = async () => {
    setLoading(true);
    try {
      const response = await axios.post(createPaymentIntent, {
        customer_type: customerType,
        order_ids: orderIds.join(", "),
        app: 1,
      });
      setMessage(response.error);
        setMessageStyle(styles.errorMessage);
      if (response.status === 200) {
        const { client_secret, email, name } = response.data;

        const { error, paymentIntent } = await confirmPayment(client_secret, {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              email: email,
              name: name,
            },
          },
        });

        if (error) {
          setMessage(error.message);
          setMessageStyle(styles.errorMessage);
        } else if (paymentIntent) {
          await AsyncStorage.removeItem("@cart");
          dispatch(clearCart());

          navigation.reset({
            index: 1,
            routes: [
              { name: 'Main' },
              {
                name: 'OrderSuccess',
                params: {
                  sub_total: subTotal,
                  discount: discount,
                  staff_charges: staffCharges,
                  transport_charges: transportCharges,
                  total_amount: totalAmount,
                  order_ids: orderIds,
                }
              },
            ],
          });
        }
      } else {
        setMessage("Payment initialization failed. Please try again.");
        setMessageStyle(styles.errorMessage);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setMessageStyle(styles.errorMessage);
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };


  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Credit Or Debit Card</Text>
        <CardField
          postalCodeEnabled={false}
          placeholders={{ number: '4242 4242 4242 4242' }}
          cardStyle={styles.cardStyle}
          style={styles.cardField}
          onCardChange={(cardDetails) => setCardDetails(cardDetails)}
        />
        <CommonButton
          disabled={!cardDetails?.complete || loading}
          title={loading ? 'Paying...' : 'Pay Now'}
          bgColor={!cardDetails?.complete || loading ? '#f2b3c4' : '#fd245f'}
          textColor={!cardDetails?.complete || loading ? '#000' : '#fff'}
          onPress={handlePayPress}
        />
        <CommonButton
          title={"Cancel"}
          bgColor={'#fd245f'}
          textColor={'#fff'}
          onPress={() => navigation.goBack()}
        />
        {message ? <Text style={messageStyle}>{message}</Text> : null}
      </View>
    </View>
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
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardStyle: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: 8,
  },
  successMessage: {
    color: 'white',
    backgroundColor: 'green',
    padding: 10,
    marginTop: 20,
    textAlign: 'center',
    borderRadius: 5,
  },
  errorMessage: {
    color: 'white',
    backgroundColor: 'red',
    padding: 10,
    marginTop: 20,
    textAlign: 'center',
    borderRadius: 5,
  },
});

export default PaymentScreen;
