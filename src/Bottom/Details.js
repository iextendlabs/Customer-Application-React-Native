import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Share,
  FlatList
} from "react-native";
import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { BaseUrl, getServiceUrl } from "../Config/Api";
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import HTML from "react-native-render-html";
import StarRating from "../Common/StarRating";
import MessageModal from "../Screen/MessageModal";
import OfferProductItem from "../Common/OfferProductItem";
import { Picker } from "@react-native-picker/picker";

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
  const services = useSelector((state) => state.services);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [addONs, setAddONs] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState([]);
  const [packages, setPackages] = useState([]);
  const [description, setDescription] = useState("Loading...");
  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const windowDimensions = useWindowDimensions();
  const [msg, setMsg] = useState(null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const [serviceDuration, setServiceDuration] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);
  const [serviceDiscount, setServiceDiscount] = useState(null);
  const [serviceId, setServiceId] = useState(null);

  const handleMessage = (msg) => {
    setAlertMsg(msg);
    setMessageModalVisible(true);
  };

  const closeModal = () => {
    setMessageModalVisible(false);
  };

  const handleShare = async () => {
    try {
      const discountedPrice = service.discount
        ? service.discount
        : service.price;

      const message = `
**Service:** ${service.name}
**Price:** AED ${discountedPrice} ${service.discount ? "(Discounted)" : ""}
**Duration:** ${service.duration}
**Description:** ${service.short_description}
**URL:** ${BaseUrl + "serviceDetail/" + service.id}
`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
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
      handleMessage("Added to Cart.");

    } else {
      setMsg("Item is already in the cart.");
    }

    setTimeout(() => {
      setMsg("");
    }, 4000);
  };

  const onAddToWishList = async (item) => {
    const isItemInWishlist = wishlistData.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (!isItemInWishlist) {
      dispatch(addItemToWishlist(item));
      saveToAsyncStorage("@wishlistData", [...wishlistData, item]);
      setMsg("Added to WisthList.");
    } else {
      setMsg("Item is already in the Wishlist.");
    }

    setTimeout(() => {
      setMsg("");
    }, 4000);
  };

  const getDetails = async (id) => {
    setLoading(true);
    const response = await axios.get(getServiceUrl + id);
    if (response.status === 200) {
      let data = response.data;
      setDescription(data.services.description);
      setFaqs(data.faqs);
      const variantIds = data.variant.map(item => item.variant_id);
      const variant = services[0].filter(item => variantIds.includes(item.id.toString()));
      setVariants(variant);
      const packageIds = data.package.map(item => item.package_id);
      const packages = services[0].filter(item => packageIds.includes(item.id.toString()));
      setPackages(packages);
      const addOnIds = data.addONs.map(item => item.add_on_id);
      const addOn = services[0].filter(item => addOnIds.includes(item.id.toString()));
      setAddONs(addOn);
      console.log(variant);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (route.params && route.params.service) {
      setService(route.params.service);
      setServiceDuration(route.params.service.duration);
      setServicePrice(route.params.service.price);
      setServiceDiscount(route.params.service.discount);
      setServiceId(route.params.service.id);
      getDetails(route.params.service.id);
    }
  }, [route.params?.service]);

  const handleVariantChange = (variantId) => {
    const selectedVariant = variants.find((variant) => variant.id === parseFloat(variantId));
    if (selectedVariant) {
      setServicePrice(selectedVariant.price);
      setServiceDiscount(selectedVariant.discount);
      setServiceDuration(selectedVariant.duration);
      setServiceId(selectedVariant.id);
    } else {
      setServicePrice(service.price);
      setServiceDiscount(service.discount);
      setServiceDuration(service.duration);
      setServiceId(service.id);
    }
  };


  const handleAddToCart = () => {
    const selectedService = services[0].find((services) => services.id === serviceId);

    onAddToCart(selectedService);
  };
  const handleAddToWish = () => {
    const selectedService = services[0].find((services) => services.id === serviceId);

    onAddToWishList(selectedService);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={service ? service.name : "Details"} />
      {service && (
        <>
          <ScrollView style={styles.contentContainer}>
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
            <Text style={styles.price}>
              AED{" "}
              {serviceDiscount ? (
                <>
                  <Text style={styles.originalPrice}>{servicePrice}</Text>
                  <Text style={styles.discountedPrice}>
                    {" " + serviceDiscount}
                  </Text>
                </>
              ) : (
                servicePrice
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
                {serviceDuration}
              </Text>
            </View>
            {variants.length > 0 && (
              <>
                <Text style={{
                  width: "100%", alignSelf: "center", fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}>
                  Variants:
                </Text>
                <View
                  style={{
                    height: 50,
                    width: "100%",
                    alignSelf: "center",
                    borderWidth: 0.5,
                    borderColor: "#8e8e8e",
                    borderRadius: 10,
                    marginBottom: 10
                  }}
                >
                  <Picker
                    selectedValue={variant}
                    onValueChange={(itemValue, itemIndex) => {
                      setVariant(itemValue);
                      handleVariantChange(itemValue);
                    }}
                  >
                    <Picker.Item label="Select Variant" value="" />
                    {variants.map((variant, index) => (
                      <Picker.Item key={index.toString()} label={variant.name} value={variant.id} />
                    ))}
                  </Picker>
                </View>
              </>
            )}

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
            {msg && (
              <Text
                style={{
                  marginLeft: 20,
                  marginBottom: 20,
                  fontSize: 18,
                  color: "green",
                }}
              >
                {msg}
              </Text>
            )}
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleShare}
            >
              <Text style={styles.addToCartButtonText}>Share</Text>
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <StarRating rating={service.rating} size={17} />
            </View>

            <View style={{ marginBottom: 100 }}>
              <HTML
                source={{ html: description }}
                contentWidth={windowDimensions.width}
              />
              {faqs.length > 0 && (
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      margin: 10,
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
              {addONs.length > 0 && (

                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      margin: 10,
                      alignSelf: "center",
                    }}
                  >
                    Add ONs
                  </Text>
                  <FlatList
                    data={addONs}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item }) => <OfferProductItem item={item} />}
                  />
                </View>
              )}

              {packages.length > 0 && (

                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      margin: 10,
                      alignSelf: "center",
                    }}
                  >
                    Package Services
                  </Text>
                  <FlatList
                    data={packages}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item }) => <OfferProductItem item={item} isPackage={true} />}
                  />
                </View>
              )}
            </View>

          </ScrollView>
        </>
      )
      }
      <Footer />
      <MessageModal
        visible={messageModalVisible}
        message={alertMsg}
        onClose={closeModal}
      />
    </View >
  );
}
