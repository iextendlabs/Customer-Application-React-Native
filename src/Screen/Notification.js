import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "../redux/actions/Actions";
import Splash from "./Splash";
import { NotificationUrl } from "../Config/Api";

export default function MyVoucher() {
  const route = useRoute();
  const dispatch = useDispatch();
  const couponData = useSelector((state) => state.coupon);
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationsData = useSelector((state) => state.Notifications);
    
  useEffect(() => {
    setTimeout(() => {
      getNotification();
    }, 5000);
  }, []);

  useEffect(() => {
    if (notificationsData && notificationsData.length > 0) {
      setNotifications(notificationsData[0]);
    }
  }, [notificationsData]);

  const getNotification = async () => {
    const user = await AsyncStorage.getItem("@user_id");
    try {
      const response = await axios.get(
        `${NotificationUrl}user_id=${user}&update=true`
      );
      if (response.status === 200) {
        let data = response.data.notifications;
        setNotifications(data);
        dispatch(
            updateNotification(data)
        );
        saveToAsyncStorage("@notifications", data);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
    }
  };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  if (loading) {
    return <Splash />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1, padding: 5 }}>
        {error && (
          <Text
            style={{
              marginLeft: 40,
              fontSize: 18,
              color: "red",
              margin:10
            }}
          >
            {error}
          </Text>
        )}
        {notifications.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                alignItems: "center",
                fontWeight: "600",
                fontSize: 20,
                color: "#000",
              }}
            >
              No Notification
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  borderWidth: 0.5,
                  width: "100%",
                  borderColor: item.type === "New" ? "#ffa2bb" : "#8e8e8e", 
                  padding: 10,
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: item.type === "New" ? "#ffa2bb" : "transparent", 
                }}
              >
                <View>
                  <Text style={styles.orderTitle}>{item.title}</Text>
                  <Text>{item.body}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },

  buttons: {
    borderWidth: 0.2,
    borderRadius: 4,
    marginRight: 5,
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
  },
});
