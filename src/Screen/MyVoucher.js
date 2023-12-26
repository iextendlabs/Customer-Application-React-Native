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
import { updateCoupon } from "../redux/actions/Actions";
import Splash from "./Splash";
import { applyCouponAffiliateUrl, getCustomerCouponUrl } from "../Config/Api";

export default function MyVoucher() {
  const route = useRoute();
  const dispatch = useDispatch();
  const couponData = useSelector((state) => state.coupon);
  const navigation = useNavigation();
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCoupons();
  }, []);

  useEffect(() => {
    if (couponData && couponData.length > 0) {
      const couponInfo = couponData[0];
      setSelectedCouponId(couponInfo.id);
    }
  }, [couponData]);

  const getCoupons = async () => {
    const user = await AsyncStorage.getItem("@user_id");
    setLoading(true);
    try {
      const response = await axios.get(
        `${getCustomerCouponUrl}user_id=${user}`
      );
      if (response.status === 200) {
        let data = response.data;
        setCoupons(data.coupons);

        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
    setLoading(false);
  };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  const applyCoupon = async (code) => {
      setLoading(true);
      try {
        const response = await axios.post(applyCouponAffiliateUrl, {
          coupon: code,
        });

        if (response.status === 200) {
          const couponData = response.data.coupon;
          setMsg("Coupon Apply Successfully");
          const couponInfo = {
            id: couponData.id,
            code: couponData.code,
            type: couponData.type,
            discount: couponData.discount,
          };

          dispatch(
            updateCoupon(couponInfo)
          );
          saveToAsyncStorage("@couponData", couponInfo);
        } else if (response.status === 201) {
          const errors = response.data.errors;

          if (errors.coupon) {
            setError(errors.coupon[0]); 
          }
        } else {
          setError("Order failed. Please try again.");
        }
        setTimeout(() => {
          setError("");
          setMsg("");
        }, 2000);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
  };
  if (loading) {
    return <Splash />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1, padding: 5 }}>
        {msg && (
          <Text
            style={{
              marginLeft: 40,
              fontSize: 18,
              color: "green",
              margin:10
            }}
          >
            {msg}
          </Text>
        )}
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
        {coupons.length === 0 ? (
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
              No Coupon Assigned
            </Text>
          </View>
        ) : (
          <FlatList
            data={coupons}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  borderWidth: 0.5,
                  width: "100%",
                  borderColor: item.id === selectedCouponId ? "#ffa2bb" : "#8e8e8e", 
                  padding: 10,
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: item.id === selectedCouponId ? "#ffa2bb" : "transparent", 
                }}
              >
                <View>
                  <Text style={styles.orderTitle}>Name: {item.name}</Text>
                  <Text>Code: {item.code}</Text>
                  <Text>
                    Discount:{" "}
                    {item.type === "Percentage"
                      ? item.discount + "%"
                      : "AED " + item.discount}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                      applyCoupon(item.code);
                    }}
                  >
                    <Text>Apply Coupon</Text>
                  </TouchableOpacity>
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
