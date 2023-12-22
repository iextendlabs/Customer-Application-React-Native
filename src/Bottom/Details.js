import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Share,
} from "react-native";
import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { BaseUrl, getServiceUrl } from "../Config/Api";
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import HTML from "react-native-render-html";
import StarRating from "../Common/StarRating";
import { showMessage } from "react-native-flash-message";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // Adjust the background color as needed
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
  },

  price: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  discountedPrice: {
    marginRight: 5,
    color: "#333",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "red",
  },

  duration: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addToCartButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  wishButton: {
    backgroundColor: "#fd245f",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  faqHeader: {
    backgroundColor: "#fd245f",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  faqQuestion: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  faqBody: {
    padding: 10,
    backgroundColor: "#fdedee",
    borderRadius: 5,
    marginBottom: 5,
  },
});
export default function Details() {
  const dispatch = useDispatch();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [description, setDescription] = useState("Loading...");
  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const windowDimensions = useWindowDimensions();
  const handleShare = async () => {
    try {
      const discountedPrice = service.discount
        ? service.discount
        : service.price;

      const message = `
**Service:** ${service.name}
**Price:** AED ${discountedPrice} ${service.discount ? "(Discounted)" : ""}
**Duration:** ${service.duration}
**URL:** ${BaseUrl + "serviceDetail/" + service.id}
`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };
  const toastOptions = {
    type: "info",
    backgroundColor: "#fff",
    color: "#000",
    duration: 1500,
    margin: 20,
  };
  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  const onAddToCart = async (item) => {
    const isItemInCart = cartData.some((cartItem) => cartItem.id === item.id);

    if (!isItemInCart) {
      dispatch(addItemToCart(item));
      saveToAsyncStorage("@cartData", [...cartData, item]);
      showMessage({
        message: "Added to Cart.",
        ...toastOptions,
      });
    } else {
      showMessage({
        message: "Item is already in the cart.",
        ...toastOptions,
      });
    }
  };

  const onAddToWishList = async (item) => {
    const isItemInWishlist = wishlistData.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (!isItemInWishlist) {
      dispatch(addItemToWishlist(item));
      saveToAsyncStorage("@wishlistData", [...wishlistData, item]);
      showMessage({
        message: "Added to WisthList.",
        ...toastOptions,
      });
    } else {
      showMessage({
        message: "Item is already in the Wishlist.",
        ...toastOptions,
      });
    }
  };

  const getDetails = async (id) => {
    setLoading(true);
    const response = await axios.get(getServiceUrl + id);
    if (response.status === 200) {
      let data = response.data;
      setDescription(data.services.description);
      setFaqs(data.faqs);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (route.params && route.params.service) {
      setService(route.params.service);
      getDetails(route.params.service.id);
    }
  }, [route.params?.service]);

  const handleAddToCart = () => onAddToCart(service);
  const handleAddToWish = () => onAddToWishList(service);
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={service ? service.name : "Details"} />
      {service && (
        <>
          <Image
            source={{
              uri: BaseUrl + "service-images/" + service.image,
            }}
            defaultSource={require("../images/logo.png")}
            style={{
              width: "100%",
              height: 200,
              resizeMode: "cover",
            }}
          />
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.price}>
              AED{" "}
              {service.discount ? (
                <>
                  <Text style={styles.originalPrice}>{service.price}</Text>
                  <Text style={styles.discountedPrice}>
                    {" " + service.discount}
                  </Text>
                </>
              ) : (
                service.price
              )}
            </Text>
            <View>
              <Text style={styles.duration}>
                Duaration:{" "}
                <Image
                  source={require("../images/clock.png")}
                  style={{
                    width: 15,
                    height: 15,
                  }}
                />
                {service.duration}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartButtonText}>Book Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wishButton}
              onPress={handleAddToWish}
            >
              <Text style={styles.addToCartButtonText}>Save to Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleShare}
            >
              <Text style={styles.addToCartButtonText}>Share</Text>
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <StarRating rating={service.rating} size={17} />
            </View>

            <View>
              <HTML
                source={{ html: description }}
                contentWidth={windowDimensions.width}
              />
            </View>
            {faqs.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                    alignSelf: "center",
                  }}
                >
                  Frequently Asked Questions
                </Text>
                {faqs.map((faq) => (
                  <View key={faq.id}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() =>
                        setOpenFaq(openFaq === faq.id ? null : faq.id)
                      }
                    >
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                    </TouchableOpacity>
                    {openFaq === faq.id && (
                      <View key={`${faq.id}-answer`} style={styles.faqBody}>
                        <HTML
                          source={{ html: faq.answer }}
                          contentWidth={windowDimensions.width}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </>
      )}
      <Footer />
    </View>
  );
}
