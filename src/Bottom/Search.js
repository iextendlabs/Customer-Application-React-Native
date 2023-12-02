import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { filterServicesUrl, BaseUrl } from "../Config/Api";
import { useEffect, useState } from "react";
import ProductItem from "../Common/ProductItem";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";

export default function Search() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (route.params && route.params.category) {
      let category = route.params.category;
      setSearchedText(category.title);
      getServicesByCategory(category.id);
    }
  }, [route.params?.category]);

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

  const getServicesByCategory = async (category_id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${filterServicesUrl}category_id=${category_id}`
      );
      if (response.status === 200) {
        let data = response.data;
        setServices(data.services);
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };

  const filter = async () => {
    setSearchedText(search);
    setLoading(true);
    try {
      const response = await axios.get(`${filterServicesUrl}filter=${search}`);
      if (response.status === 200) {
        let data = response.data;
        setServices(data.services);
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
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
      <Header title={"Search"} />
      <ScrollView>
        <CustomTextInput
          placeholder={"Search Services"}
          icon={require("../images/search.png")}
          value={search}
          onChangeText={(txt) => {
            setSearch(txt);
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#0d6efd",
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: "30%",
            borderRadius: 10,
            alignSelf: "flex-end",
            marginTop: 10,
            marginRight: 30,
          }}
          onPress={() => {
            filter();
          }}
        >
          <Text style={{ color: "#fff" }}>Search</Text>
        </TouchableOpacity>
        {services.length > 0 ? (
          <View style={{ marginTop: 10, marginBottom: 70 }}>
            {searchedText && (
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 20,
                  color: "#000",
                  fontSize: 18,
                  fontWeight: "600",
                  alignSelf: "center",
                  fontWeight: "700",
                }}
              >
                Services related {searchedText}
              </Text>
            )}

            <FlatList
              data={services}
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
        ) : (
          <Text
            style={{
              marginTop: 10,
              marginLeft: 20,
              color: "#000",
              fontSize: 16,
              fontWeight: "600",
              alignSelf: "center",
            }}
          >
            Their is No Services related {searchedText}.
          </Text>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
