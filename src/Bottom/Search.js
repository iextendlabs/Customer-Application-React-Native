import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import ProductItem from "../Common/ProductItem";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../Common/CustomTextInput";
import Splash from "../Screen/Splash";
import { SubCategoriesUrl, BaseUrl } from "../Config/Api";
import axios from "axios";

export default function Search() {
  const navigation = useNavigation();
  const data = useSelector((state) => state);
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);

  useEffect(() => {
    if (route.params && route.params.category) {
      setCategory(route.params.category);
      getServicesByCategory(route.params.category);
      getSubCategories(route.params.category);
    }
  }, [route.params?.category]);
  useEffect(() => {
    filter();
  }, [search]);

  const getServicesByCategory = (category_id) => {
    const filtered = data.services[0].filter(
      (item) => item.category_id.includes(category_id)
    );
    setServices(filtered);
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

  const getSubCategories = async (id) => {
    try {
      const response = await axios.get(SubCategoriesUrl + id);
      if (response.status === 200) {
        let data = response.data;
        setSubCategory(data.sub_categories);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };

  const CategoryItem = ({ item, onPress }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        margin: 8,
        marginBottom:25
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
      <Text style={{ marginTop: 8, textAlign: "center", width: 100 }}>{item.title}</Text>
    </TouchableOpacity>
  );
  const renderCategoryItem = ({ item }) => (
    <CategoryItem item={item} key={item.id} />
  );

  if (loading) {
    return Splash();
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"Search"} />
      <ScrollView>
        <CustomTextInput
          placeholder={"Search Services"}
          icon={require("../images/search.png")}
          value={search}
          onChangeText={(txt) => {
            setSearch(txt);
          }}
          onClearPress={() => {
            setSearch('');
          }}
          isSearch={true}
        />
        {subCategory.length > 0 && (
          <View style={{ flex: 1, padding: 16 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 16,
              color: "#333",
            }}> Sub Category</Text>
            <FlatList
              data={subCategory}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategoryItem}
            />
          </View>
        )}
        {services.length > 0 ? (
          <View style={{ marginTop: 10, marginBottom: 70 }}>
            <FlatList
              data={services}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <ProductItem item={item} />}
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
            ......
          </Text>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
