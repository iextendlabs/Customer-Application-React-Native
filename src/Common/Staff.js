import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Linking
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { BaseUrl, StaffUrl } from "../Config/Api";
import axios from "axios";
import HTML from "react-native-render-html";
import StarRating from "../Common/StarRating";
import Splash from "../Screen/Splash";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import OfferProductItem from "./OfferProductItem";

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    marginBottom: 10,
  },
});
export default function Staff() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [staff, setStaff] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [socialLinks, setSocialLinks] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [deliveredOrder, setDeliveredOrder] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const windowDimensions = useWindowDimensions();

  const getDetails = async (id) => {
    setLoading(true);
    const response = await axios.get(StaffUrl + route.params.staff_id);
    if (response.status === 200) {
      let data = response.data;
      setUser(data.user);
      setStaff(data.user.staff);
      setCategories(data.service_categories);
      setServices(data.services);
      setReviews(data.reviews);
      setSocialLinks(data.socialLinks);
      setAverageRating(data.averageRating);
      setDeliveredOrder(data.orders);
      setImages(data.images);
      setVideos(data.videos);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (route.params && route.params.staff_id) {
      getDetails(route.params.staff_id);
    }
  }, [route.params?.staff_id]);

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
      {user && (
        <>
          <FlatList
            style={styles.contentContainer}
            data={[user]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.title}>{user.name}</Text>
                  {staff.sub_title && (
                    <Text style={styles.title}>{staff.sub_title}</Text>
                  )}
                  {staff.location && (
                    <Text style={styles.location}>{staff.location}</Text>
                  )}
                  <Image
                    source={{
                      uri: BaseUrl + "staff-images/" + staff.image,
                    }}
                    defaultSource={require("../images/logo.png")}
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: 90,
                    }}
                  />

                  <Text style={styles.title}>Delivered Order: {deliveredOrder}</Text>

                </View>

                {socialLinks === "1" && (
                  <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(staff.facebook);
                      }}
                    >
                      <Image
                        source={require("../images/facebook.png")}
                        style={{
                          width: 35,
                          height: 35,
                          margin: 8,
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(staff.instagram);
                      }}
                    >
                      <Image
                        source={require("../images/instagram.png")}
                        style={{
                          width: 35,
                          height: 35,
                          margin: 8,
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(staff.tiktok);
                      }}
                    >
                      <Image
                        source={require("../images/tiktok.png")}
                        style={{
                          width: 35,
                          height: 35,
                          margin: 8,
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(staff.snapchat);
                      }}
                    >
                      <Image
                        source={require("../images/snapchat.png")}
                        style={{
                          width: 35,
                          height: 35,
                          margin: 8,
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(staff.youtube);
                      }}
                    >
                      <Image
                        source={require("../images/youtube.png")}
                        style={{
                          width: 35,
                          height: 35,
                          margin: 8,
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}


                <View style={{ alignItems: "center" }}>
                  <StarRating rating={averageRating} size={17} />
                </View>

                <View style={{ marginBottom: 30 }}>
                  {videos.length > 0 && (
                    <View style={{ marginTop: 20 }}>
                      <FlatList
                        data={videos}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                          return (
                            <View
                              style={{
                                width: windowDimensions.width - 40,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <WebView
                                source={{ uri: `https://www.youtube.com/embed/${item.youtube_video}` }}
                                style={{  width: windowDimensions.width - 40, height: 200 }}
                              />
                            </View>
                          );
                        }}
                      />
                    </View>
                  )}
                  {images.length > 0 && (
                    <View style={{ marginTop: 20 }}>
                      <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                          return (
                            <View
                              style={{
                                width: windowDimensions.width - 40,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{
                                  uri: BaseUrl + "staff-images/" + item.image,
                                }}
                                style={{
                                  width: "100%",
                                  height: 200,
                                  borderRadius: 10,
                                }}
                              />
                            </View>
                          );
                        }}
                      />
                    </View>
                  )}
                  <HTML
                    source={{ html: staff.about }}
                    contentWidth={windowDimensions.width}
                  />
                  {(categories.length > 0 || services.length > 0) && (
                    <View>
                      <Text style={[styles.title, { alignSelf: "center" }]}>My Services</Text>
                      {categories.length > 0 && (
                        <FlatList
                          data={categories}
                          numColumns={3}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={renderCategoryItem}
                        />
                      )}
                      {services.length > 0 && (
                        <FlatList
                          data={services}
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          keyExtractor={(item, index) => item.id.toString()}
                          renderItem={({ item }) => <OfferProductItem item={item} />}
                        />
                      )}
                    </View>
                  )}
                  {reviews.length > 0 && (
                    <View>
                      <Text style={[styles.title, { alignSelf: "center" }]}>Reviews</Text>
                      <FlatList
                        data={reviews}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item }) => (
                          <View
                            style={{
                              width: 250,
                              height: 160,
                              elevation: 5,
                              margin: 5,
                              paddingBottom: 10,
                              backgroundColor: "#fdedee",
                              borderRadius: 10,
                            }}
                          >
                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 8,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "700",
                                  fontFamily: "Times New Roman",
                                }}
                              >
                                {item.user_name}
                              </Text>
                              <Text numberOfLines={5} style={{ height: 95, margin: 10 }}>{item.content}</Text>
                              <View>
                                <StarRating rating={item.rating} size={12} />
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
          />
        </>
      )
      }
    </View >
  );
}
