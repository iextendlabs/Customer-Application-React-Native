import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Header from "../Common/Header";
import { appIndex, BaseUrl } from "../Config/Api";
import ProductItem from "../Common/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";

export default function Main() {
  const dispatch = useDispatch();
  const [sliderImages, setSliderImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const cartData = useSelector((state) => state.cart);

  const onAddToCart = (item) => {
    const isItemInCart = cartData.some((cartItem) => cartItem.id === item.id);

    if (!isItemInCart) {
      dispatch(addItemToCart(item));
    } else {
      console.log("Item is already in the cart");
    }
  };

  const wishlistData = useSelector((state) => state.wishlist);

  const onAddToWishList = (item) => {
    const isItemInWishlist = wishlistData.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    if (!isItemInWishlist) {
      dispatch(addItemToWishlist(item));
    } else {
      console.log("Item is already in the Wishlist");
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
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      // Handle error
      setError("An error occurred while fetching data.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={"Lipslay"} />
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <View>
        <FlatList
          data={sliderImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()} // Added keyExtractor
          renderItem={({ item }) => (
            <Image
              source={{
                uri: BaseUrl + "slider-images/" + item,
              }}
              style={{
                width: 400,
                height: 200,
                borderRadius: 10,
                alignSelf: "center",
                margin: 9,
              }}
            />
          )}
          numColumns={1}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()} // Added keyExtractor
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderWidth: 1,
                  marginRight: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "#000" }}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
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
          data={services}
          showsVerticalScrollIndicator={false} // Remove horizontal prop
          numColumns={2}
          keyExtractor={(item, index) => index.toString()} // Added keyExtractor
          renderItem={({ item }) => {
            return (
              <ProductItem
                item={item}
                onAddToCart={onAddToCart}
                onAddToWishList={onAddToWishList}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
