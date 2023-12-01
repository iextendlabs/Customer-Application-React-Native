import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import Cart from "../Bottom/Cart";
import Main from "../Bottom/Main";
import Profile from "../Bottom/Profile";
import Search from "../Bottom/Search";
import Wishlist from "../Bottom/Wishlist";
import { useSelector } from "react-redux";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  const data = useSelector((state) => state);
 
  return (
    <View style={{ flex: 1 }}>
      {selectedTab == 0 ? (
        <Main />
      ) : selectedTab == 1 ? (
        <Search />
      ) : selectedTab == 2 ? (
        <Cart />
      ) : selectedTab == 3 ? (
        <Wishlist />
      ) : (
        <Profile />
      )}
      <View
        style={{
          width: "100%",
          height: 70,
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setSelectedTab(0);
          }}
        >
          <Image
            source={require("../images/home.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: selectedTab == 0 ? "#000" : "#8e8e8e",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setSelectedTab(1);
          }}
        >
          <Image
            source={require("../images/search.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: selectedTab == 1 ? "#000" : "#8e8e8e",
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: selectedTab == 2 ? "green" : "#000",
              borderRadius: 22,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setSelectedTab(2);
            }}
          >
            <Image
              source={require("../images/bag.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: "#fff",
              }}
            />
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "red",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 5,
                right: 5,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>{data.cart.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setSelectedTab(3);
          }}
        >
          <Image
            source={require("../images/heart.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: selectedTab == 3 ? "#000" : "#8e8e8e",
            }}
          />
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: "red",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 15,
              right: 20,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{data.wishlist.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setSelectedTab(4);
          }}
        >
          <Image
            source={require("../images/user.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: selectedTab == 4 ? "#000" : "#8e8e8e",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
