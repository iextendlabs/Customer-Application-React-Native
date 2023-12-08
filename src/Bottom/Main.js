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
} from "react-native";
import axios from "axios";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { appIndex, BaseUrl } from "../Config/Api";
import ProductItem from "../Common/ProductItem";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Splash from "../Screen/Splash";
import { updateServices, updateZone } from "../redux/actions/Actions";
import CommonButton from "../Common/CommonButton";
import StaffCard from "../Common/StaffCard";
import FlashMessage, { showMessage } from "react-native-flash-message";

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
    getData();
  }, []);

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
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
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
    const intervalId = setInterval(moveToNextSlide, 1500);

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
          category: item,
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
  const renderCategoryItem = ({ item }) => <CategoryItem item={item} />;
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"LipSlay Home Saloon"} />
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
              renderItem={({ item }) => (
                <View
                  style={{
                    width: width,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: BaseUrl + "slider-images/" + item,
                    }}
                    style={{
                      width: "90%",
                      height: 200,
                      borderRadius: 10,
                    }}
                  />
                </View>
              )}
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
                  backgroundColor: currentIndex === index ? "#ff9ca0" : "#fff",
                  marginLeft: 5,
                }}
              ></View>
            ))}
          </View>
        </View>

        <CommonButton
          title={"Check Booking"}
          bgColor={"#FF000080"}
          textColor={"#fff"}
          onPress={() => {
            navigation.navigate("Booking");
          }}
        />

        <View style={{ flex: 1, padding: 16 }}>
          <FlatList
            data={categories}
            numColumns={3}
            keyExtractor={(item) => item.id}
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
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ProductItem item={item} />}
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
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <StaffCard item={item} />}
            />
          )}
        </View>
      </ScrollView>
      <FlashMessage
        position="bottom"
        style={{
          borderRadius: 8,
          padding: 30,
          marginHorizontal: 50,
          marginBottom: 50,
          alignItems: "center",
        }}
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
