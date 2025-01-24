import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { BaseUrl } from "../Config/Api";
import StarRating from "../Common/StarRating";
import { useNavigation } from "@react-navigation/native";

export default function StaffCard({ item }) {
  const navigation = useNavigation();
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Staff", {
            staff_id: item.id,
          });
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: BaseUrl + "staff-images/" + item.staff.image,
            }}
            defaultSource={require("../images/logo.png")}
            style={styles.staffImage}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.staffName}>{item.name}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled>
            <Text style={styles.subTitle}>{item.staff.sub_title}</Text>
          </ScrollView>
          
          {item.staff.location && (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled>
              <Text style={styles.subTitle}>{item.staff.location}</Text>
            </ScrollView>
          )}
          {item.staff.charges > 0 && (
            <Text style={styles.chargesText}>
              {item.staff.charges > 0 && "Charges: AED" + item.staff.charges}
            </Text>
          )}
          <View style={{marginTop:5}}>
            <StarRating rating={item.rating} size={12} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 155,
    height: 270,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#fdedee",
    margin: 5,
    padding:10,
    justifyContent: "center",
  },
  imageContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  staffImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  contentContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  staffName: {
    fontSize: 15,
    fontWeight: "700",
  },
  subTitle: {
    marginTop: 5
  },
  chargesText: {
    marginTop: 5,
  },
});
