import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { appIndex, BaseUrl } from "../Config/Api";
import ProductItem from "../Common/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Splash from "../Screen/Splash";
import { updateServices } from "../redux/actions/Actions";
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
        setLoading(false);
        dispatch(updateServices(data.services));
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };

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
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Offers
        </Text>
        <View style={{ marginTop: 10, marginBottom: 70 }}>
          <FlatList
            data={selectedServices}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ProductItem item={item} />}
          />
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
