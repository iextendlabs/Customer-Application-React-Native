import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  Modal,
  Button
} from "react-native";
import axios from "axios";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { appIndex, BaseUrl, appOfferUrl } from "../Config/Api";
import OfferProductItem from "../Common/OfferProductItem";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Splash from "../Screen/Splash";
import { addItemToCart, addItemToWishlist, clearCart, clearWishlist, updateCategories, updateServices, updateZone } from "../redux/actions/Actions";
import CommonButton from "../Common/CommonButton";
import StaffCard from "../Common/StaffCard";
import VersionCheck from 'react-native-version-check';
import Constants from 'expo-constants';

export default function Main() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sliderImages, setSliderImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { height, width } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0); // Initialize with 0
  const [staffs, setStaffs] = useState(0); // Initialize with 0
  const flatListRef = useRef(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [offer, setOffer] = useState("");
  const [offerImage, setOfferImage] = useState("");
  const [offerType, setOfferType] = useState("");
  const [offerId, setOfferId] = useState("");
  const [offerStatus, setOfferStatus] = useState("");
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(true);

  useEffect(() => {
    getData();
    checkForUpdate();
    getOffer();
  }, []);

  useEffect(() => {
    const checkModalVisibility = async () => {
      try {
        const savedTime = await AsyncStorage.getItem("@offer");
        if (savedTime) {
          const currentTime = new Date().getTime();
          const timeDifferenceInMs = currentTime - parseInt(savedTime, 10);
          const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);

          if (timeDifferenceInHours > 24) {
            setOfferModalVisible(true);
          }
        } else {
          setOfferModalVisible(true);
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    if (isUpdate === false && offerStatus === "1") {
      checkModalVisibility();
    }
  }, [offer, isUpdate, offerStatus]);

  const checkForUpdate = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: 'playStore',
        packageName: 'com.lipslay.Customerapp',
      });

      const currentVersion = Constants.expoConfig.version;

      if (latestVersion !== currentVersion) {
        setUpdateModalVisible(true);
        setOfferModalVisible(false);
        setIsUpdate(true);
      } else {
        setIsUpdate(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateModal = ({ visible }) => (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 30, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Update Available</Text>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            A new version of the app is available. Please update to the latest version.
          </Text>
          <View style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}>
            <Button
              title="Update Now"
              onPress={() => {
                Linking.openURL('market://details?id=com.lipslay.Customerapp');
                setUpdateModalVisible(false);  // Fix: Use setUpdateModalVisible instead of "false"
                setIsUpdate(false);
              }}
            />
            <TouchableOpacity
              style={{
                width: 100,
                height: 35,
                justifyContent: "center",
                alignSelf: "center",
                borderWidth: 0.5,
                borderColor: "#8e8e8e",
              }}
              onPress={() => {
                setUpdateModalVisible(false);
                setIsUpdate(false);
              }}
            >
              <Text style={{ alignSelf: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderOfferModal = () => {
    if (offer) {
      const [status, type, id, filename] = offer.split('_');

      const closeModal = async () => {
        try {
          await AsyncStorage.setItem("@offer", new Date().getTime().toString());
        } catch (error) {
          console.error('Error setting data in AsyncStorage:', error);
        }

        setOfferModalVisible(false);
      };

      const navigateToDetails = () => {
        if (type === 'category') {
          navigation.navigate('Search', {
            category: parseInt(id, 10),
          });
        } else if (type === 'service') {
          const filteredService = services.find((service) => service.id === parseInt(id, 10));

          if (filteredService) {
            navigation.navigate('Details', {
              service: filteredService,
            });
          }
        }
        closeModal();
      };

      return (
        <Modal animationType="slide" transparent={true} visible={offerModalVisible}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}>
            <View style={{
              width: '100%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TouchableOpacity onPress={closeModal} style={{
                borderWidth: 0.5,
                borderColor: "#fff",
                borderRadius: 10,
                backgroundColor: "#fff",
                position: 'absolute',
                top: -30,
                right: 5,
                padding: 5,
                zIndex: 1,
              }}>
                <Image source={require('../images/close.png')} style={{ width: 10, height: 10 }} />
              </TouchableOpacity>
              <TouchableWithoutFeedback onPress={navigateToDetails}>
                <Image
                  source={{ uri: BaseUrl + 'uploads/' + filename }}
                  style={{
                    width: '90%',
                    height: 200,
                    borderRadius: 10,
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  };

  const getOffer = async () => {
    try {
      const offers = await axios.get(appOfferUrl);
      if (offers.status === 200) {
        const [status, type, id, filename] = offers.data.offer.split('_');
        setOffer(offers.data.offer);
        setOfferImage(filename);
        setOfferId(id);
        setOfferType(type);
        setOfferStatus(status);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (!isUpdate) {
      const intervalId = setInterval(moveToNextSlide, 3000);

      return () => clearInterval(intervalId);
    }
  }, [sliderImages, currentIndex, flatListRef, isUpdate]);

  const getData = async () => {
    setLoading(true);
    try {
      setError("");
      const response = await fetch(BaseUrl+'AppData.json');

      if (response.ok) {
        const data = await response.json();
        const selectedServices = data.services.filter((service) =>
          data.featured_services.includes(String(service.id))
        );
        setSliderImages(data.images);
        setCategories(data.categories);
        setServices(data.services);
        setSelectedServices(selectedServices);
        setStaffs(data.staffs);
        setLoading(false);
        dispatch(updateServices(data.services));
        dispatch(updateCategories(data.categories));
        dispatch(updateZone(data.staffZones));

        await AsyncStorage.setItem(
          "@whatsappNumber",
          String(data.whatsapp_number)
        );

        const wishlistData = await AsyncStorage.getItem("@wishlistData");
        const cartData = await AsyncStorage.getItem("@cartData");

        const updatedCartData = cartData
          ? JSON.parse(cartData).filter((cartItem) =>
            data.services.some((serviceItem) => serviceItem.id === cartItem.id)
          )
          : [];

        dispatch(clearCart());
        updatedCartData.forEach((item) => {
          dispatch(addItemToCart(item));
        });

        await AsyncStorage.removeItem("@cartData");
        await AsyncStorage.setItem("@cartData", JSON.stringify(updatedCartData));

        const updatedWishlistData = wishlistData
          ? JSON.parse(wishlistData).filter((wishlistItem) =>
            data.services.some((serviceItem) => serviceItem.id === wishlistItem.id)
          )
          : [];
        
        dispatch(clearWishlist());
        updatedWishlistData.forEach((item) => {
          dispatch(addItemToWishlist(item));
        });

        await AsyncStorage.removeItem("@wishlistData");
        await AsyncStorage.setItem("@wishlistData", JSON.stringify(updatedWishlistData));
      } else {
        setTimeout(() => {
          getData();
        }, 5000);
      }
    } catch (error) {
      setTimeout(() => {
        getData();
      }, 5000);
      setError("An error occurred while fetching data.");
    }
    setLoading(false);
  };
  

  const moveToNextSlide = () => {
    if (!isUpdate && flatListRef.current) {
      const nextIndex = (currentIndex + 1) % sliderImages.length;
  
      if (!isNaN(nextIndex)) {
        flatListRef.current.scrollToOffset({
          offset: nextIndex * width,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(moveToNextSlide, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  if (loading) {
    return Splash();
  }

  const CategoryItem = ({ item, onPress }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        margin: 8,
      }}
      onPress={() => {
        navigation.navigate("Search", {
          category: item.id,
        });
      }}
    >
      <Image
        source={{
          uri: BaseUrl + "service-category-icons/" + item.icon,
        }}
        defaultSource={require("../images/category/Makup.png")}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
        }}
      />
      <Text style={{ marginTop: 8, textAlign: "center" }}>{item.title}</Text>
    </TouchableOpacity>
  );
  const renderCategoryItem = ({ item }) => (
    <CategoryItem item={item} key={item.id} />
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"LipSlay Home Services"} />
      {error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Please check your internet connection and try again.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {sliderImages.length > 0 && (
              <FlatList
                ref={flatListRef}
                data={sliderImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                onScroll={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  setCurrentIndex(Math.round(x / width));
                }}
                renderItem={({ item }) => {
                  const [type, id, filename] = item.split('_');

                  return (
                    <View
                      style={{
                        width: width,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableWithoutFeedback onPress={() => {
                        console.log(type);
                        if (type === 'category') {
                          navigation.navigate("Search", {
                            category: parseInt(id,10),
                          });
                        } else if (type === 'service') {
                          const filteredService = services.find(service => service.id === parseInt(id, 10));

                          if (filteredService) {
                            navigation.navigate("Details", {
                              service: filteredService,
                            });
                          }
                        }
                      }}>
                        <Image
                          source={{
                            uri: BaseUrl + "slider-images/" + filename,
                          }}
                          style={{
                            width: "90%",
                            height: 200,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                  );
                }}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                width: width,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              {sliderImages.map((item, index) => (
                <View
                  key={index.toString()}
                  style={{
                    width: currentIndex === index ? 40 : 8,
                    height: 8,
                    borderRadius: currentIndex === index ? 5 : 4,
                    backgroundColor:
                      currentIndex === index ? "#ff9ca0" : "#fff",
                    marginLeft: 5,
                  }}
                ></View>
              ))}
            </View>
          </View>
          <CommonButton
            title={"Check Booking"}
            bgColor={"#fd245f"}
            textColor={"#fff"}
            onPress={() => {
              navigation.navigate("Booking");
            }}
          />

          <View style={{ flex: 1, padding: 16 }}>
            <FlatList
              data={categories}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategoryItem}
            />
          </View>
          <Text
            style={{
              marginTop: 14,
              color: "#000",
              fontSize: 25,
              fontWeight: "700",
              alignSelf: "center",
            }}
          >
            Offers
          </Text>
          <View>
            <FlatList
              data={selectedServices}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={({ item }) => <OfferProductItem item={item} />}
            />
          </View>
          <Text
            style={{
              marginTop: 14,
              color: "#000",
              fontSize: 25,
              fontWeight: "700",
              alignSelf: "center",
            }}
          >
            Our Team
          </Text>
          <View style={{ marginBottom: 70 }}>
            {staffs.length > 0 && (
              <FlatList
                data={staffs}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({ item }) => <StaffCard item={item} />}
              />
            )}
          </View>
        </ScrollView>
      )}

      <UpdateModal visible={updateModalVisible} />
      {renderOfferModal()}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
