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
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";
export default function Main() {
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
        setSelectedServices(data.services.slice(0, 10));
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      // Handle error
      setError("An error occurred while fetching data.");
    }
  };

  const filterServices = (selectedCategory) => {
    const filteredServices = services.filter(
      (service) => parseFloat(service.category_id) == selectedCategory.id
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

  const imagesarr = ['../images/category/Makup.png','../images/category/Manicure.png','../images/category/Massage.png','../images/category/Nails-icon.png','../images/category/Bleach.png','../images/category/Facial.png','../images/category/Hair.png','../images/category/Henna.png'];

  const CategoryItem = ({ item, onPress }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: 'center',
        margin: 8,
      }}
      onPress={() => onPress(item)}
    >
      <Image
        source= {require('../images/category/Makup.png')}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40, // Half of the width and height to make it a circle
        }}
      />
      <Text style={{ marginTop: 8, textAlign: 'center' }}>{item.title}</Text>
    </TouchableOpacity>
  );
  const renderCategoryItem = ({ item }) => <CategoryItem item={item} onPress={handleCategoryPress} />;
  const handleCategoryPress = (category) => {
    // Handle category press as needed
    console.log('Category pressed:', category.title);
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#FFCACC' }}>
       
      <Header title={"LipSlay Home Saloon"} />
      <ScrollView>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
