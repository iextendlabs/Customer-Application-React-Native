import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Share,
  FlatList,
  Modal
} from "react-native";
import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BaseUrl, getServiceUrl } from "../Config/Api";
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import HTML from "react-native-render-html";
import StarRating from "../Common/StarRating";
import MessageModal from "../Screen/MessageModal";
import OfferProductItem from "../Common/OfferProductItem";
import { Checkbox } from 'react-native-paper';

const styles = StyleSheet.create({
  additionalImagesContainer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  additionalImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  removeIcon: {
    width: 15,
    height: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the selected image
    setModalVisible(true);   // Show the modal
  };

  const closeModal = () => {
    setMessageModalVisible(false);
    setSelectedImage(null);
    setModalVisible(false);
  };

  const handleShare = async () => {
    try {
      const discountedPrice = service.discount
        ? service.discount
        : service.price;

      const message = `
**Service:** ${service.name}
**Price:** AED ${discountedPrice} ${service.discount ? "(Discounted)" : ""}
${service.duration ? `**Duration:** ${service.duration}` : ""}
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

  const onAddToCart = async (item, option_ids = []) => {
    const isItemInCart = cartData.some((cartItem) => cartItem.service_id === item.id);

    if (!isItemInCart) {
      navigation.navigate("AddToCart", { service_id: item.id, option_ids: option_ids });
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
      if(data.lowestPriceOption){
        setSelectedOptions([data.lowestPriceOption.id]);
        setTotalPrice(data.lowestPriceOption.option_price);
        setTotalDuration(data.lowestPriceOption.option_duration);
      }
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
      setAdditionalImages(data.additional_images);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (route.params && route.params.service) {
      setService(route.params.service);
      setServiceOptions(route.params.service.options);
      setServiceDuration(route.params.service.duration);
      setServicePrice(route.params.service.price);
      setServiceDiscount(route.params.service.discount);
      setServiceId(route.params.service.id);
      getDetails(route.params.service.id);
    }
  }, [route.params?.service]);

  const handleAddToCart = () => {
    const selectedService = services[0].find((services) => services.id === serviceId);
    if (serviceOptions) {
      if (selectedOptions.length > 0) {
        onAddToCart(selectedService, selectedOptions);
      } else {
        setErrorMsg("Please select an option");
        return;
      }
    } else {
      onAddToCart(selectedService);
    }
  };

  const handleAddToWish = () => {
    const selectedService = services[0].find((services) => services.id === serviceId);
    onAddToWishList(selectedService);
  };

  const handleOptionSelect = (option) => {
    let updatedOptions = [...selectedOptions];
  
    if (updatedOptions.includes(option.id)) {
      updatedOptions = updatedOptions.filter((id) => id !== option.id);
    } else {
      updatedOptions.push(option.id);
    }
  
    setSelectedOptions(updatedOptions);

    const newTotalPrice = updatedOptions.reduce((total, optionId) => {
      const selectedOption = serviceOptions.find((opt) => opt.id === optionId);
      return total + (selectedOption ? parseFloat(selectedOption.option_price) : 0);
    }, 0);

    const newTotalDuration = updatedOptions.reduce((total, optionId) => {
      const selectedOption = serviceOptions.find((opt) => opt.id === optionId);
      if (selectedOption?.option_duration) {
        return total + parseDurationToMinutes(selectedOption.option_duration);
      }
      return total;
    }, 0);
  
    setTotalPrice(newTotalPrice);
    setTotalDuration(formatDuration(newTotalDuration));
  };

  const parseDurationToMinutes = (duration) => {
    const lowerCaseDuration = duration.toLowerCase();
    const value = parseFloat(duration.match(/\d+/)?.[0] || 0);
  
    if (lowerCaseDuration.includes("hour")) {
      return value * 60;
    } else if (lowerCaseDuration.includes("min") || lowerCaseDuration.includes("mint")) {
      return value;
    } else {
      return 0;
    }
  };

  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    let formattedDuration = "";
    if (hours > 0) {
      formattedDuration += `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }
    if (minutes > 0) {
      formattedDuration += `${hours > 0 ? " " : ""}${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }
    return formattedDuration || 0;
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
              style={styles.image}
            />
            {additionalImages && additionalImages.length > 0 && (
              <FlatList
                data={additionalImages}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.additionalImagesContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleImageClick(item)}>
                    <Image
                      source={{ uri: BaseUrl + "service-images/additional/" + item }}
                      style={styles.additionalImage}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
            <Text style={styles.price}>
              AED{" "}
              {totalPrice > 0 ? (
                totalPrice
              ) : serviceDiscount ? (
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
            {(totalDuration || serviceDuration) && (
              <View>
                <Text style={styles.duration}>
                  Duration:{" "}
                  <Image
                    source={require("../images/clock.png")}
                    style={{ width: 15, height: 15 }}
                  />
                  {totalDuration ? totalDuration  : serviceDuration}
                </Text>
              </View>
            )}
            {serviceOptions.length > 0 && (
              <>
                <Text
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Options:
                </Text>
                {serviceOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={{ flexDirection: "row", alignItems: "center", marginLeft: 5, marginRight: 50, marginBottom: 10 }}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Checkbox
                      status={selectedOptions.includes(option.id) ? "checked" : "unchecked"}
                    />
                    <Text>{option.option_name} (AED {option.option_price}) {option.option_duration ?? ''}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {errorMsg && (
              <Text style={{ color: "red", marginBottom: 10 }}>{errorMsg}</Text>
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
      )}
      <Footer />
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Image source={require('../images/close.png')} style={styles.removeIcon} />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: BaseUrl + "service-images/additional/" + selectedImage }}
              style={styles.fullScreenImage}
            />
          )}
        </View>
      </Modal>
      <MessageModal
        visible={messageModalVisible}
        message={alertMsg}
        onClose={closeModal}
      />
    </View>
  );
}
