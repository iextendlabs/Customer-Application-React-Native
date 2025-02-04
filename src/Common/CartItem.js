import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { BaseUrl } from "../Config/Api";
import { useSelector } from "react-redux";

export default function CartItem({ item, onRemoveFromCart, isCheckout, onEditCart, isExcluded }) {
  const services = useSelector((state) => state.services);
  const service = item.service_id ? services[0].find(o => o.id === item.service_id) || null : null;
  const option = item.option_id && service.options ? service.options.find(o => o.id === item.option_id) || null : null;

  return (
    <View style={[styles.card, isExcluded ? styles.excluded : null]}>
      <View>
        <Image
          source={{ uri: `${BaseUrl}service-images/${service.image}` }}
          defaultSource={require('../images/logo.png')}
          style={styles.image}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.title}>Service Detail:</Text>
        <View style={styles.details}>
          <Text>{service.name}</Text>
          {option ? (
            <>
              <Text>AED {option.option_price}</Text>
              <Text>{option.option_name}</Text>
            </>
          ) : (
            <Text>
              AED{" "}
              {service.discount ? (
                <>
                  <Text style={styles.originalPrice}>{service.price}</Text>
                  <Text style={styles.discountPrice}> {service.discount}</Text>
                </>
              ) : (
                service.price
              )}
            </Text>
          )}
        </View>
        <Text style={styles.title}>Booking Detail:</Text>
        <View style={styles.details}>
          <Text>{item.date}</Text>
          <Text>{item.staff}</Text>
          <Text>{item.slot}</Text>
        </View>
      </View>
      {isCheckout ? (
        <TouchableOpacity style={styles.removeButton} onPress={onEditCart}>
          <Image source={require('../images/pen.png')} style={styles.removeIcon} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.removeButton} onPress={onRemoveFromCart}>
          <Image source={require('../images/close.png')} style={styles.removeIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFCACC",
    borderRadius: 10,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  excluded: {
    borderColor: "red",
    borderWidth: 2,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
  },
  details: {
    marginLeft: 10,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "red",
  },
  discountPrice: {
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#ffe8ea",
    padding: 4,
    position: "absolute",
    top: 7,
    right: 7,
  },
  removeIcon: {
    width: 20,
    height: 20,
  },
});
