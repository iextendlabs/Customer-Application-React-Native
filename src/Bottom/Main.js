import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import Header from "../Common/Header";
import { appIndex, BaseUrl } from "../Config/Api";
import ProductItem from "../Common/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  addItemToWishlist,
} from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Main() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sliderImages, setSliderImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);

  const onAddToCart = async (item) => {
    const user = await AsyncStorage.getItem("@user_id");

    if (user === "" || user === null) {
      navigation.navigate("Login");
    } else {
      const isItemInCart = cartData.some((cartItem) => cartItem.id === item.id);

      if (!isItemInCart) {
        dispatch(addItemToCart(item));
        saveToAsyncStorage("@cartData", [...cartData, item]);
      } else {
        console.log("Item is already in the cart");
      }
    }
  };

  const onAddToWishList = async (item) => {
    const isItemInWishlist = wishlistData.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (!isItemInWishlist) {
      dispatch(addItemToWishlist(item));
      saveToAsyncStorage("@wishlistData", [...wishlistData, item]);
    } else {
      console.log("Item is already in the Wishlist");
    }
  };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(appIndex);
      if (response.status === 200) {
        let data = response.data;
        setSliderImages(data.images);
        setCategories(data.categories);
        setServices(data.services);
        setSelectedServices(data.services.slice(0, 10));
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };

  const filterServices = (selectedCategory) => {
    const filteredServices = services.filter(
      (service) => parseFloat(service.category_id) === selectedCategory.id
    );
    setSelectedServices(filteredServices);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title={"Lipslay"} />
      <ScrollView>
        <View>
          <FlatList
            data={sliderImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{
                  uri: BaseUrl + "slider-images/" + item,
                }}
                style={{
                  width: 340,
                  height: 200,
                  borderRadius: 10,
                  alignSelf: "center",
                  margin: 9,
                }}
              />
            )}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderWidth: 1,
                  marginLeft: 5,
                  borderRadius: 10,
                }}
                onPress={() => {
                  filterServices(item);
                }}
              >
                <Text style={{ color: "#000" }}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text
          style={{
            marginTop: 10,
            marginLeft: 20,
            color: "#000",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Products
        </Text>
        <View style={{ marginTop: 10, marginBottom: 70 }}>
          <FlatList
            data={selectedServices}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ProductItem
                item={item}
                onAddToCart={onAddToCart}
                onAddToWishList={onAddToWishList}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
