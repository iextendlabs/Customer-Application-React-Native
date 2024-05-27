import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image
} from "react-native";
import CommonButton from "../Common/CommonButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { BaseUrl, servicesTimeSlotUrl } from "../Config/Api";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import StarRating from "../Common/StarRating";
import Splash from "../Screen/Splash";
import { updateCustomerZone, updateOrAddToCart } from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddToCart() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const zones = useSelector((state) => state.zones || []);
  const [area, setArea] = useState(null);
  const [date, setDate] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotValue, setSelectedSlotValue] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [service, setService] = useState(null);
  const customerZone = useSelector((state) => state.customerZone);

  useEffect(() => {
    if (route.params && route.params.service) {
      const { service } = route.params;
      setService(service);
      setServiceId(service.id);
    }

    if (route.params && route.params.staff_name && route.params.staff_id && route.params.slot_id && route.params.slot && route.params.date) {
      const { staff_name, staff_id, slot_id, slot, date } = route.params;
      setSelectedSlotValue(slot);
      setSelectedSlotId(slot_id);
      setSelectedStaff(staff_name);
      setSelectedStaffId(staff_id);
      setDate(date);
    }
  }, [route.params?.service]);

  useEffect(() => {
    if (date === null && route.params.date === undefined) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      setDate(formattedDate);
    }

    if (area && date && serviceId) {
      fetchAvailableTimeSlots(date, area, serviceId);
    }
  }, [area, serviceId]);

  useEffect(() => {
    if (customerZone && customerZone.length > 0) {
      setArea(customerZone[0] || "");
    }
  }, [customerZone]);

  const handleDateSelect = (date) => {
    setDate(date.dateString);
    fetchAvailableTimeSlots(date.dateString, area, serviceId);

  };

  const fetchAvailableTimeSlots = async (date, area, serviceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${servicesTimeSlotUrl}area=${area}&date=${date}&service_id=${serviceId}`
      );
      if (response.status === 200) {
        setStaffs(response.data.availableStaff);
        setSlots(response.data.slots);
      } else if (response.status === 201) {
        setStaffs([]);
        setSlots([]);
        setSelectedStaff(null);
        setSelectedStaffId(null);
        setSelectedSlotId(null);
        setSelectedSlot(null);
        setSelectedSlotValue(null);
        setError(response.data.msg);
      } else {
        setError("Something Wrong! Please try again.");
      }
    } catch (error) {
      setError("Error fetching Staff. Please try again.");
    }
    setLoading(false);
  };

  const handleModalClose = () => {
    setError("");
    setSuccess(null);
    navigation.goBack();
  };

  const handleApply = async () => {
    setLoading(true);
    const cartData = {
      'service': service,
      'service_id': serviceId,
      'staff_id': selectedStaffId,
      'staff': selectedStaff,
      'slot_id': selectedSlotId,
      'slot': selectedSlotValue,
      'date': date,
    };
  
    dispatch(updateCustomerZone(area));
    dispatch(updateOrAddToCart(cartData));
    try {
      await AsyncStorage.setItem('@customerZone', area);
      const existingCart = await AsyncStorage.getItem('@cart');
      let updatedCart = existingCart ? JSON.parse(existingCart) : [];
      updatedCart = updatedCart.filter(item => item.service_id !== serviceId); 
      updatedCart.push(cartData);
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));
      setSuccess("Booking added successfully.");
    } catch (error) {
      setError("Failed to add booking.");
    }
  
    setLoading(false);
  };
  

  const renderStaff = () => (
    <View style={{ borderColor: "#8e8e8e", borderTopWidth: 0.5 }}>
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          height: 40,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            margin: 10,

            fontWeight: "800",
          }}
        >
          Staff:
        </Text>
        {selectedStaff && (
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
      <FlatList
        data={staffs}
        renderItem={({ item, index }) => (
          <>
            {selectedStaff ? (
              item.id === selectedStaffId && (
                <View
                  style={{
                    width: "100%",
                    height: 80,
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
                      defaultSource={require("../images/logo.png")}
                      style={{
                        width: 70,
                        height: 70,
                        marginLeft: 10,
                      }}
                    />
                    <View style={{ padding: 10 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                        }}
                      >
                        {item.name}
                      </Text>
                      <View style={{ marginTop: 7, marginBottom: 7 }}>
                        <StarRating rating={item.rating} size={12} />
                      </View>
                      <Text>
                        {item.staff.charges > 0 &&
                          "Extra Charges: AED " + item.staff.charges}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            ) : (
              <TouchableOpacity onPress={() => {
                setSelectedStaff(item.name);
                setSelectedStaffId(item.id);
              }}>
                <View
                  style={{
                    width: "100%",
                    height: 80,
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
                      defaultSource={require("../images/logo.png")}
                      style={{
                        width: 70,
                        height: 70,
                        marginLeft: 10,
                      }}
                    />
                    <View style={{ padding: 10 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                        }}
                      >
                        {item.name}
                      </Text>
                      <View style={{ marginTop: 7, marginBottom: 7 }}>
                        <StarRating rating={item.rating} size={12} />
                      </View>
                      <Text>
                        {item.staff.charges > 0 &&
                          "Extra Charges: AED " + item.staff.charges}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
      />
    </View>
  );
  const renderSlot = () => (
    <View style={{ borderColor: "#8e8e8e", borderTopWidth: 0.5, marginTop: 10 }}>
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          height: 40,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            margin: 10,

            fontWeight: "800",
          }}
        >
          Slot:
        </Text>
        {selectedSlotValue && (
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
              setSelectedSlot(null);
              setSelectedSlotValue(null);
              setSelectedSlotId(null);
            }}
          >
            <Text>Change</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          width: "80%",
          alignSelf: "center",
          borderWidth: 0.5,
          borderColor: "#8e8e8e",
          padding: 10,
        }}
      >
        {selectedSlotValue ? (
          <TouchableOpacity
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
            onPress={() => {
              setSelectedSlot(null);
              setSelectedSlotValue(null);
              setSelectedSlotId(null);
            }}
          >
            <Text>{selectedSlotValue}</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={slots[selectedStaffId] || []}
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
                onPress={() => {
                  setSelectedSlot(item[0] + "," + item[1]);
                  if (item) {
                    const [slotId, timeRange] = item;
                    setSelectedSlotId(slotId);
                    setSelectedSlotValue(timeRange);
                  }
                }}
              >
                <Text>{item[1]}</Text>
              </TouchableOpacity>
            )}
            ListHeaderComponent={() => (
              <Text
                style={{
                  fontWeight: 'bold',
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: selectedStaff ? "#000" : "red"
                  }}
                >
                  {selectedStaff ? "Select Time Slot" : "First Select Staff"}
                </Text>
              </Text>
            )}
          />
        )}
      </View>
    </View>
  );
  if (loading) {
    return Splash();
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView>
          <Text style={styles.modalTitle}>Book Now</Text>
          {success == null ? (
            <>
              <Text style={{ margin: 10, fontWeight: "800" }}>
                Zone:
              </Text>
                <View
                  style={{
                    width: "85%",
                    alignSelf: "center",
                    borderWidth: 0.5,
                    borderColor: "#8e8e8e",
                    borderRadius: 10,
                  }}
                >
                  {zones[0].length > 0 && (
                    <Picker
                      selectedValue={area}
                      onValueChange={(itemValue, itemIndex) => setArea(itemValue)}
                    >
                      <Picker.Item label="Select Area" value="" />
                      {zones[0].map((zone, index) => (
                        <Picker.Item key={index.toString()} label={zone} value={zone} />
                      ))}
                    </Picker>
                  )}
                </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ margin: 10, fontWeight: "800" }}>
                  Date: {date && date}
                </Text>
                {date && (
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
                      setDate(null);
                      setStaffs([]);
                      setSlots([]);
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
              {date === null && (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      padding: 20,
                      width: "90%",
                    }}
                  >
                    <Calendar
                      onDayPress={handleDateSelect}
                      markedDates={
                        date ? { [date]: { selected: true } } : {}
                      }
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                  </View>
                </View>
              )}

              {area == null ? (
                <Text
                  style={{
                    margin: 10,
                    color: "red",
                  }}
                >
                  Please Select Zone first!
                </Text>
              ) : (
                <>
                  {date == null ? (
                    <Text
                      style={{
                        margin: 10,
                        color: "red",
                      }}
                    >
                      Please Select Date for appointment!
                    </Text>
                  ) : (
                    <>
                      {error ? (
                        <Text
                          style={{
                            margin: 10,
                            color: "red",
                          }}
                        >
                          {error}
                        </Text>
                      ) : (
                        <>
                          {renderStaff()}
                          {renderSlot()}
                        </>
                      )}

                    </>
                  )}
                </>
              )}
              {area && date && selectedSlotValue && selectedStaff && (
                <CommonButton
                  disabled={loading}
                  title={loading ? "Booking..." : "Book Now"}
                  bgColor={"#24a0ed"}
                  textColor={"#fff"}
                  onPress={handleApply}
                />
              )}
              <CommonButton
                disabled={loading}
                title={"Close"}
                bgColor={"#fd245f"}
                textColor={"#fff"}
                onPress={handleModalClose}
              />
            </>
          ) : (
            <>
              <Text
                style={{
                  margin: 10,
                  color: "green",
                }}
              >
                {success}
              </Text>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleModalClose();
                  }}
                >
                  <Text style={styles.buttonText}>
                    Continue
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleModalClose();
                    navigation.navigate("Cart")
                  }}
                >
                  <Text style={styles.buttonText}>
                    Checkout
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#fdedee",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#fd245f",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  }
});
