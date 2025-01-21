import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import StaffCard from "../Common/StaffCard";
import Splash from "../Screen/Splash";
import { getStaffUrl, BaseUrl } from "../Config/Api";
import axios from "axios";

export default function OurTeam() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    getStaff();
  }, []);

  const getStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getStaffUrl);
      if (response.status === 200) {
        let data = response.data;
        setStaff(data.staff);
      }
    } catch (error) {}
    setLoading(false);
  };

  if (loading) {
    return Splash();
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"Our Team"} />
      <ScrollView style={{ marginBottom: 70 }}>
        <FlatList
          data={staff}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => <StaffCard item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No staff members found.</Text>
          }
        />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  listContent: {
    paddingVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
});
