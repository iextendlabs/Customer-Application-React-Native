import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl, servicesTimeSlotUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import CommonButton from "../Common/CommonButton";
import Splash from "../Screen/Splash";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { updateCustomerZone, updateOrAddToCart } from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../Common/CustomTextInput";

export default function Booking() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const zones = useSelector((state) => state.zones);
  const customerZone = useSelector((state) => state.customerZone);
  const servicesData = useSelector((state) => state.services);

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
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    filter();
    setSelectedService(null);
    setSelectedServiceId(null);
    setAvailableStaff([]);
    setAvailableSlot([]);
    setSelectedStaff(null);
    setSelectedStaffId(null);
    setSelectedSlot(null);
    setSelectedSlotValue(null);
    setSelectedSlotId(null);
  }, [search]);

  useEffect(() => {
    if (selectedDate === null) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      setSelectedDate(formattedDate);
    }
    if (selectedArea && selectedDate && selectedServiceId) {
      fetchAvailableTimeSlots(selectedDate, selectedArea, selectedServiceId);
    }
  }, [selectedArea]);

  useEffect(() => {
    if (customerZone && customerZone.length > 0) {
      setSelectedArea(customerZone[0] || "");
    }
  }, [customerZone]);

  const filter = () => {
    if (search) {
      setServices(
        servicesData[0].filter((item) =>
          item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      );
    }
  };

  const selectZone = (item) => {
    setSelectedArea(item);
  };

  const selectStaff = (item) => {
    setSelectedStaff(item.name);
    setSelectedStaffId(item.id);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedServiceId(service.id);
    if (selectedDate && selectedArea) {
      fetchAvailableTimeSlots(selectedDate, selectedArea, service.id);
    }
  };

  const handleDateSelect = (date) => {
    setModalVisible(false);
    setSelectedDate(date.dateString);
    fetchAvailableTimeSlots(date.dateString, selectedArea, selectedServiceId);
  };

  const fetchAvailableTimeSlots = async (
    date,
    area,
    serviceId
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${servicesTimeSlotUrl}area=${area}&date=${date}&service_id=${serviceId}`
      );

      if (response.status === 200) {
        setAvailableStaff(response.data.availableStaff);
        setAvailableSlot(response.data.slots);

        setLoading(false);
      } else if (response.status === 201) {
        setAvailableStaff([]);
        setAvailableSlot([]);
        setSelectedStaff(null);
        setSelectedSlotId(null);
        setSelectedSlot(null);
        setSelectedSlotValue(null);
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

  const handleBookNow = async () => {
    setLoading(true);
    const cartData = {
      'service': selectedService,
      'service_id': selectedServiceId,
      'staff_id': selectedStaffId,
      'staff': selectedStaff,
      'slot_id': selectedSlotId,
      'slot': selectedSlotValue,
      'date': selectedDate,
    };

    dispatch(updateCustomerZone(selectedArea));
    dispatch(updateOrAddToCart(cartData));
    try {
      await AsyncStorage.setItem('@customerZone', selectedArea);
      const existingCart = await AsyncStorage.getItem('@cart');
      let updatedCart = existingCart ? JSON.parse(existingCart) : [];
      updatedCart = updatedCart.filter(item => item.service_id !== selectedServiceId);
      updatedCart.push(cartData);
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));
      setSuccess("Booking added successfully.");
    } catch (error) {
      setError("Failed to add booking.");
    }

    setLoading(false);
  };

  const renderDate = () => (
    <View
      style={{
        width: "100%",
        justifyContent: "space-between",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#8e8e8e",
        borderTopWidth: 0.5,
        marginTop: 10,
      }}
    >
      <Text style={{ margin: 10, fontWeight: "800" }}>
        Date: {selectedDate && selectedDate}
      </Text>
      {selectedDate && (
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
            setSelectedDate(null);
            setAvailableStaff([]);
            setAvailableSlot([]);
            setSelectedStaff(null);
            setSelectedStaffId(null);
            setSelectedSlot(null);
            setSelectedSlotValue(null);
            setSelectedSlotId(null);
            setModalVisible(true);
          }}
        >
          <Text>Change</Text>
        </TouchableOpacity>
      )}
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                selectedDate ? { [selectedDate]: { selected: true } } : {}
              }
              minDate={new Date().toISOString().split('T')[0]}
            />
          </View>
        </View>
      </Modal>
    </View>
  );

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
          Staff: {selectedStaff && selectedStaff}
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
        data={availableStaff}
        key={(item, index) => index.toString()}
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
                      {item.staff.charges > 0 && (
                        <Text
                          style={{
                            marginTop: 15,
                            fontSize: 12,
                          }}
                        >
                          Extra Charges: AED {item.staff.charges}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              )
            ) : (
              <TouchableOpacity onPress={() => selectStaff(item)}>
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
                      {item.staff.charges > 0 && (
                        <Text
                          style={{
                            marginTop: 15,
                            fontSize: 12,
                          }}
                        >
                          Extra Charges: AED {item.staff.charges}
                        </Text>
                      )}
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

  const renderServices = () => (
    <View style={{ borderColor: "#8e8e8e", marginTop: 10 }}>
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
          Services: {selectedService && selectedService.name}
        </Text>
      </View>
      <FlatList
        key={(item, index) => index.toString()}
        data={services}
        renderItem={({ item, index }) => (
          <>
            {selectedService ? (
              item.id === selectedService.id && (
                <View
                  style={{
                    width: "100%",
                    height: 90,
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={{
                        uri: `${BaseUrl}service-images/${item.image}`,
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
                      <Text style={{ fontSize: 15, fontWeight: "600" }}>
                        AED{" "}
                        {item.discount ? (
                          <>
                            <Text
                              style={{ textDecorationLine: "line-through", color: "red" }}
                            >
                              {item.price}
                            </Text>
                            <Text style={{ marginRight: 5, color: "#333" }}>
                              {" " + item.discount}
                            </Text>
                          </>
                        ) : (
                          item.price
                        )}
                      </Text>
                      <Text style={{ fontSize: 15}}>
                        {item.duration}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            ) : (
              <TouchableOpacity onPress={() => handleServiceSelect(item)}>
                <View
                  style={{
                    width: "100%",
                    height: 90,
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={{
                        uri: `${BaseUrl}service-images/${item.image}`,
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
                      <Text style={{ fontSize: 15, fontWeight: "600" }}>
                        AED{" "}
                        {item.discount ? (
                          <>
                            <Text
                              style={{ textDecorationLine: "line-through", color: "red" }}
                            >
                              {item.price}
                            </Text>
                            <Text style={{ marginRight: 5, color: "#333" }}>
                              {" " + item.discount}
                            </Text>
                          </>
                        ) : (
                          item.price
                        )}
                      </Text>
                      <Text style={{ fontSize: 15}}>
                        {item.duration}
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
      {availableSlot.length === 0 ? (
        <Text style={{ margin: 10, color: "red" }}>
          No Staff Availalbe for the Selected Date / Zone
        </Text>
      ) : (
        <>
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
            {selectedSlot ? (
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
                data={availableSlot[selectedStaffId] || []}
                key={(item) => item[0]}
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

        </>
      )}

    </View>
  );

  if (loading) {
    return Splash();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"Booking"} />
      <ScrollView>
        {success == null ? (
          <View style={{ flex: 1, marginBottom: 80 }}>
            <CustomTextInput
              placeholder={"Search Services"}
              icon={require("../images/search.png")}
              value={search}
              onChangeText={(txt) => {
                setSearch(txt);
              }}
              onClearPress={() => {
                setSearch('');
              }}
              isSearch={true}
            />
            <>
              {services.length > 0 && (
                <>
                  {renderServices()}
                </>
              )}
            </>
            {selectedService && (
              <>
                <Text style={{ width: "85%", alignSelf: "center", padding: 10 }}>
                  Zone:
                </Text>
                <View
                  style={{
                    width: "70%",
                    alignSelf: "center",
                    borderWidth: 0.5,
                    borderColor: "#8e8e8e",
                    borderRadius: 10,
                  }}
                >
                  {zones[0].length > 0 && (
                    <Picker
                      selectedValue={selectedArea}
                      onValueChange={(itemValue, itemIndex) => selectZone(itemValue)}
                    >
                      <Picker.Item label="Select Area" value="" />
                      {zones[0].map((zone, index) => (
                        <Picker.Item key={index.toString()} label={zone} value={zone} />
                      ))}
                    </Picker>
                  )}
                </View>
                <>
                  {renderDate()}
                  {renderStaff()}
                  <>
                    {renderSlot()}
                    <View style={{ marginBottom: 30 }}>
                      {selectedDate && selectedStaff && selectedArea && selectedSlotValue ? (
                        <CommonButton
                          title={loading ? "Booking..." : "Book Now"}
                          bgColor={"#000"}
                          textColor={"#fff"}
                          onPress={handleBookNow}
                        />
                      ) : (
                        <>
                          {selectedStaff === null && (
                            <Text style={{ margin: 10, color: "red" }}>To Proccess the Order, Select Staff</Text>
                          )}
                          {selectedSlot === null && (
                            <Text style={{ margin: 10, color: "red" }}>To Proccess the Order, Select Slot</Text>
                          )}
                        </>
                      )}

                      <TouchableOpacity
                        style={{
                          width: 200,
                          height: 50,
                          marginTop: 20,
                          justifyContent: "center",
                          alignSelf: "center",
                          borderWidth: 0.5,
                          borderColor: "#8e8e8e",
                        }}
                        onPress={() => {
                          navigation.navigate('Main');
                        }}
                      >
                        <Text style={{ alignSelf: "center" }}>Go To Home</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                </>
              </>
            )}
          </View>
        ) : (
          <View style={{
            marginTop: 30,
            marginBottom: 30,
            backgroundColor: "#fdedee",
            borderRadius: 10,
            padding: 10,
            width: "90%",
            alignSelf: "center",
            flexDirection: "column",
          }}>
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
                style={{
                  backgroundColor: "#fd245f",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                onPress={() => {
                  navigation.navigate("Main")
                }}
              >
                <Text style={{
                  color: "#fff",
                  textAlign: "center",
                }}>
                  Continue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fd245f",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                onPress={() => {
                  navigation.navigate("Cart")
                }}
              >
                <Text style={{
                  color: "#fff",
                  textAlign: "center",
                }}>
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});