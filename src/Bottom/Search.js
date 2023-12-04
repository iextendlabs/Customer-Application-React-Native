import { StyleSheet, Text, View, ScrollView, FlatList,TouchableOpacity } from "react-native";
import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import ProductItem from "../Common/ProductItem";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { addItemToCart, addItemToWishlist } from "../redux/actions/Actions";
import CustomTextInput from "../Common/CustomTextInput";
import Splash from "../Screen/Splash";

export default function Search() {
  const data = useSelector((state) => state);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (route.params && route.params.category) {
      setCategory(route.params.category.id);
      getServicesByCategory(route.params.category.id);
    }
  }, [route.params?.category]);
  useEffect(() => {
    filter();
  }, [search]);

  const cartData = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state.wishlist);

  const onAddToCart = async (item) => {
    const isItemInCart = cartData.some((cartItem) => cartItem.id === item.id);

    if (!isItemInCart) {
      dispatch(addItemToCart(item));
      saveToAsyncStorage("@cartData", [...cartData, item]);
    } else {
      console.log("Item is already in the cart");
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

  const getServicesByCategory = (category_id) => {
    const filtered = data.services[0].filter(
      (item) => item.category_id === category_id.toString()
    );
    setServices(filtered);
    console.log("seting up serv" + filtered.length + "for category" + category);
  };

  const filter = () => {
    if (search) {
      setServices(
        data.services[0].filter((item) =>
          item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      );
    } else if (category) {
      getServicesByCategory(category);
    }
  };
  if (loading) {
    return Splash();
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"Search"} />
      <ScrollView style={{ backgroundColor: "" }}>
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
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: "20%",
            borderRadius: 10,
            alignSelf: "flex-end",
            margin: 20,
            borderWidth:0.5,
            borderColor:"#8e8e8e",
          }}
          onPress={() => {
            setSearch(null);
            setServices([]);
            setCategory(null);
          }}
        >
          <Text style={{ color: "#000" }}>Clear</Text>
        </TouchableOpacity>
        {services.length > 0 ? (
          <View style={{ marginTop: 10, marginBottom: 70 }}>
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
            Their is No Services related {search}.
          </Text>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
