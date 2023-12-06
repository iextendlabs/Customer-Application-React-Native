import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import ProductItem from "../Common/ProductItem";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../Common/CustomTextInput";
import Splash from "../Screen/Splash";

export default function Search() {
  const data = useSelector((state) => state);
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

  const getServicesByCategory = (category_id) => {
    const filtered = data.services[0].filter(
      (item) => item.category_id === category_id.toString()
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
