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
  TouchableWithoutFeedback
} from "react-native";
import axios from "axios";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { appIndex, BaseUrl } from "../Config/Api";
import OfferProductItem from "../Common/OfferProductItem";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Splash from "../Screen/Splash";
import { updateServices, updateZone } from "../redux/actions/Actions";
import CommonButton from "../Common/CommonButton";
import StaffCard from "../Common/StaffCard";

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

  useEffect(() => {
    // Fetch data effect
    getData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(moveToNextSlide, 3000);

    return () => clearInterval(intervalId);
  }, [sliderImages, currentIndex, flatListRef]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(appIndex);
      if (response.status === 200) {
        let data = response.data;
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
        dispatch(updateZone(data.staffZones));
        await AsyncStorage.setItem(
          "@whatsappNumber",
          String(data.whatsapp_number)
        );
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
    setLoading(false);
  };
 
  const moveToNextSlide = () => {
    if (flatListRef.current) {
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
                            category: id,
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

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
