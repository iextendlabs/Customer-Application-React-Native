import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { BaseUrl, availableTimeSlotUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function Checkout() {
  const navigation = useNavigation();
  const cartData = useSelector((state) => state.cart);
  const addressData = useSelector((state) => state.address);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [availableSlot, setAvailableSlot] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotValue, setSelectedSlotValue] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTotal = () => {
    return cartData.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  const selectAddress = (item) => {
    setSelectedAddress(
      `${item.building} ${item.villa} ${item.street} ${item.area} ${item.city}`
    );
    setSelectedArea(item.area);
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate, item.area);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    fetchAvailableTimeSlots(date.dateString, selectedArea);
  };

  const fetchAvailableTimeSlots = async (date, area) => {
    setLoading(true);
    setError(null);
    setSelectedStaff(null);
    setSelectedStaffId(null);
    setAvailableStaff([]);
    setAvailableSlot([]);
    try {
      const response = await axios.get(
        `${availableTimeSlotUrl}area=${area}&date=${date}`
      );

      if (response.status === 200) {
        setAvailableStaff(response.data.availableStaff);
        setAvailableSlot(response.data.slots);
        setLoading(false);
      } else if (response.status === 201) {
        setError(response.data.msg);
        setLoading(false);
      } else {
        setError("Something Wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error fetching Staff:", error);
    }
    setLoading(false);
  };

  const selectStaff = (item) => {
    setSelectedStaff(item.name);
    setSelectedStaffId(item.id);
    setAvailableStaff([]);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            data={cartData}
            renderItem={({ item, index }) => (
              <View
                style={{
                  width: "100%",
                  height: 70,
                  flexDirection: "row",
                  marginTop: 10,
                }}
              >
                <Image
                  source={{ uri: `${BaseUrl}service-images/${item.image}` }}
                  style={{ width: 70, height: 70, marginLeft: 10 }}
                />
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ marginTop: 15 }}>{"AED " + item.price}</Text>
                </View>
              </View>
            )}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 30,
            marginTop: 30,
            borderTopWidth: 0.5,
            height: 50,
            borderColor: "#8e8e8e",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Total :</Text>
          <Text>AED {getTotal()}</Text>
        </View>
        {selectedAddress === null && (
          <View>
            <Text
              style={{
                fontWeight: "800",
                padding: 10,
                borderTopWidth: 0.5,
                borderColor: "#8e8e8e",
              }}
            >
              Address :
            </Text>

            {addressData.length !== 0 ? (
              <FlatList
                data={addressData}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: "100%",
                      borderWidth: 0.5,
                      borderColor: "#8e8e8e",
                      alignSelf: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <View style={{ flex: 8 }}>
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
                      onPress={() => selectAddress(item)}
                    >
                      <Text>Select</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    alignItems: "center",
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#000",
                  }}
                >
                  No Addresses Saved Yet!
                </Text>
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
              </View>
            )}
          </View>
        )}

        {addressData.length !== 0 && (
          <View>
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                height: 40,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "800" }}>
                Selected Address
              </Text>
              {selectedAddress && (
                <TouchableOpacity
                  style={{
                    borderWidth: 0.2,
                    borderRadius: 4,
                    padding: 7,
                    marginRight: 20,
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setSelectedAddress(null);
                    setAvailableStaff([]);
                    setAvailableSlot([]);
                    setSelectedStaff(null);
                    setSelectedStaffId(null);
                    setSelectedSlot(null);
                    setSelectedSlotValue(null);
                    setSelectedSlotId(null);
                  }}
                >
                  <Text>Change</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{
                marginLeft: 20,
                marginRight: 20,
                fontSize: 16,
                borderBottomWidth: 0.5,
                borderColor: "#8e8e8e",
              }}
            >
              {selectedAddress === null
                ? "Note: Please Select Address From the Above List!"
                : selectedAddress}
            </Text>
          </View>
        )}
        {selectedAddress && (
          <View>
            <View>
              <Text
                style={{ margin: 10, fontSize: 18, fontWeight: "800" }}
                onPress={() => {
                  setSelectedDate(null);
                  setAvailableStaff([]);
                  setAvailableSlot([]);
                  setSelectedStaff(null);
                  setSelectedStaffId(null);
                  setSelectedSlot(null);
                  setSelectedSlotValue(null);
                  setSelectedSlotId(null);
                }}
              >
                Date: {selectedDate && selectedDate}
              </Text>
              {selectedDate === null && (
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={
                    selectedDate ? { [selectedDate]: { selected: true } } : {}
                  }
                  minDate={new Date()}
                />
              )}
            </View>
            {selectedDate && (
              <View>
                {error ? (
                  <Text style={{ margin: 10, color: "red" }}>{error}</Text>
                ) : (
                  <View>
                    <Text
                      style={{ margin: 10, fontSize: 18, fontWeight: "800" }}
                      onPress={() => {
                        setAvailableStaff([]);
                        setAvailableSlot([]);
                        setSelectedStaff(null);
                        setSelectedStaffId(null);
                        fetchAvailableTimeSlots(selectedDate, selectedArea);
                        setSelectedSlot(null);
                        setSelectedSlotValue(null);
                        setSelectedSlotId(null);
                      }}
                    >
                      Staff: {selectedStaff && selectedStaff}
                    </Text>
                    {availableStaff && (
                      <View>
                        <FlatList
                          data={availableStaff}
                          renderItem={({ item, index }) => (
                            <View
                              style={{
                                width: "100%",
                                height: 70,
                                flexDirection: "row",
                                marginTop: 10,
                                justifyContent: "space-between",
                              }}
                            >
                              <View style={{ flexDirection: "row" }}>
                                <Image
                                  source={{
                                    uri: `${BaseUrl}staff-images/${item.staff.image}`,
                                  }}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    marginLeft: 10,
                                  }}
                                />
                                <View style={{ padding: 10 }}>
                                  <Text
                                    style={{ fontSize: 15, fontWeight: "700" }}
                                  >
                                    {item.name}
                                  </Text>
                                  {item.staff.charges && (
                                    <Text
                                      style={{ marginTop: 15, fontSize: 12 }}
                                    >
                                      Extra Charges: AED{item.staff.charges}
                                    </Text>
                                  )}
                                </View>
                              </View>
                              <TouchableOpacity
                                style={{
                                  borderWidth: 0.2,
                                  borderRadius: 4,
                                  padding: 7,
                                  marginRight: 20,
                                  alignSelf: "center",
                                  justifyContent: "center",
                                }}
                                onPress={() => selectStaff(item)}
                              >
                                <Text>Select</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                        {selectedStaff && (
                          <View>
                            {availableSlot.length === 0 ? (
                              <Text style={{ margin: 10, color: "red" }}>
                                No Staff Availalbe for the Selected Date / Zone
                              </Text>
                            ) : (
                              <View>
                                <Text
                                  style={{
                                    margin: 10,
                                    fontSize: 18,
                                    fontWeight: "800",
                                  }}
                                  onPress={() => {
                                    setSelectedSlot(null);
                                    setSelectedSlotValue(null);
                                    setSelectedSlotId(null);
                                  }}
                                >
                                  Slot: {selectedSlotValue && selectedSlotValue}
                                </Text>
                                {selectedSlot === null && (
                                  <View style={{
                                    height: 50,
                                    width: "80%",
                                    alignSelf: "center",
                                    borderWidth: 0.5,
                                    borderColor: "#8e8e8e",
                                  }}>
                                    <Picker
                                      selectedValue={
                                        selectedSlot
                                          ? selectedSlot[0] +
                                            "," +
                                            selectedSlot[1]
                                          : undefined
                                      }
                                      onValueChange={(itemValue, itemIndex) => {
                                        setSelectedSlot(itemValue);

                                        // Add a check to ensure itemValue is defined
                                        if (itemValue) {
                                          const [slotId, timeRange] =
                                            itemValue.split(",");
                                          setSelectedSlotId(slotId);
                                          setSelectedSlotValue(timeRange);
                                        }
                                      }}
                                      
                                    >
                                      <Picker.Item label="Select Time Slot"/>
                                      {Object.keys(availableSlot).map(
                                        (slotIndex) => {
                                          // Display slots only for the selected staff
                                          if (slotIndex == selectedStaffId) {
                                            return availableSlot[slotIndex].map(
                                              (slot) => (
                                                <Picker.Item
                                                  key={slot[0]}
                                                  label={slot[1]}
                                                  value={
                                                    slot[0] + "," + slot[1]
                                                  } // Keep the value as a string
                                                />
                                              )
                                            );
                                          }
                                          return null;
                                        }
                                      )}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
