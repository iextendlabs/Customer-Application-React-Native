import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddress } from "../redux/actions/Actions";

const MyAddress = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const addressData = useSelector((state) => state.address);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          margin: 20,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 0.2,
          padding: 7,
          borderRadius: 10,
        }}
        onPress={() => {
          navigation.navigate("AddAddress");
        }}
      >
        <Text>Add Address</Text>
      </TouchableOpacity>
      {addressData.length !== 0 ? (
        <FlatList
          data={addressData}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: "100%",
                  borderTopWidth: 0.5,
                  borderBottomWidth: 0.5,
                  borderColor: "#8e8e8e",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 2.5 }}>
                  <Text style={{ margin: 20 }}>
                    {`${item.building} ${item.villa} ${item.street} ${item.area} ${item.city}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderWidth: 0.2,
                    borderRadius: 4,
                    padding: 7,
                    marginRight: 20,
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    dispatch(deleteAddress(index));
                  }}
                >
                  <Text>Delete Address</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              alignItems: "center",
              fontWeight: 600,
              marginTop: 20,
              fontSize: 20,
              color: "#000",
            }}
          >
            No Addresses Save yet!
          </Text>
        </View>
      )}
    </View>
  );
};

export default MyAddress;
