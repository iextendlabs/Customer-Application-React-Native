import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { BaseUrl } from "../Config/Api";
import { useSelector } from "react-redux";

export default function CartItem({ item, onRemoveFromCart, isCheckout, onEditCart, isExcluded }) {
  const services = useSelector((state) => state.services);
  const service = item.service_id ? services[0].find(o => o.id === item.service_id) || null : null;

  const options = item.option_ids && service.options
  ? service.options.filter(option => item.option_ids.includes(option.id))
  : [];

  const calculateTotals = (options) => {
    let totalPrice = 0;
    let totalMinutes = 0;
    let optionNames = [];
  
    options.forEach(option => {
      // Add the price
      if (option.option_price) {
        totalPrice += parseFloat(option.option_price);
      }
  
      // Collect option names
      if (option.option_name) {
        optionNames.push(option.option_name);
      }
  
      // Add the duration
      if (option.option_duration) {
        const duration = option.option_duration.toUpperCase();
        const hoursMatch = duration.match(/(\d+)\s*HOURS?/);
        const minutesMatch = duration.match(/(\d+)\s*MINS?/);
  
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  
        totalMinutes += hours * 60 + minutes;
      }
    });
  
    // Convert totalMinutes to readable format
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
  
    const durationString =
      totalMinutes === 0
        ? 0
        : totalHours > 0
        ? `${totalHours} hours${remainingMinutes > 0 ? ` ${remainingMinutes} minutes` : ""}`
        : `${remainingMinutes} minutes`;

    return { totalPrice, durationString, optionNames };
  };
  
  const { totalPrice, durationString, optionNames } = calculateTotals(options);

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
          {options && options.length > 0 && (
            optionNames.map((name, index) => (
              <Text key={index}>{name}</Text>
            ))
          )}

            <Text>
              {durationString ? (
                <Text>{durationString}</Text>
              ) : (
                <Text>{service.duration}</Text>
              )}
            </Text>
            <Text>
              AED{" "}
              {totalPrice ? (
                <Text>{totalPrice}</Text>
              ) : service.discount ? (
                <>
                  <Text style={styles.originalPrice}>{service.price}</Text>{" "}
                  <Text style={styles.discountPrice}>{service.discount}</Text>
                </>
              ) : (
                <Text>{service.price}</Text>
              )}
            </Text>
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
