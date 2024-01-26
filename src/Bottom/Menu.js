import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList,ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Common/Header";
import Footer from "../Common/Footer";

export default function Menu() {
  const navigation = useNavigation();
  const categoriesData = useSelector((state) => state.categories);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(categoriesData[0] || []);
  }, [categoriesData]);

  const checkAuthentication = async (navigate) => {
    const user = await AsyncStorage.getItem("@user_id");
    if (user === "" || user === null) {
      navigation.navigate("Login", { Navigate: navigate });
    } else {
      navigation.navigate(navigate);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={"Menu"} isMenu={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => checkAuthentication("Profile")}
      >
        <Text>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => checkAuthentication("MyOrders")}
      >
        <Text>My Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("TermsCondition")}
      >
        <Text>Terms & Condition</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("AboutUs")}
      >
        <Text>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("PrivacyPolicy")}
      >
        <Text>Privacy Policy</Text>
      </TouchableOpacity>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Categories</Text>
        {categories && (
          <FlatList
            data={categories}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Search", {
                    category: item.id,
                  });
                }}
                style={styles.categoryItem}
              >
                <Text style={styles.categoryItemText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCACC",
  },
  menuItem: {
    width: "90%",
    alignSelf: "center",
    height: 50,
    borderBottomWidth: 0.3,
    borderBottomColor: "#8e8e8e",
    marginTop: 10,
    justifyContent: "center",
  },
  categoryContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Darker color for the title
  },
  categoryItem: {
    borderBottomWidth: 0.3,
    borderBottomColor: "#8e8e8e",
    padding: 15,
    marginBottom: 10,
  },
  categoryItemText: {
    fontSize: 16,
    color: "#555", // Slightly darker color for the text
  },
});
