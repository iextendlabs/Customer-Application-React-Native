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
import { BaseUrl, availableTimeSlotUrl, AddOrderUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import CommonButton from "../Common/CommonButton";
import Splash from "../Screen/Splash";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { updateBooking } from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Booking() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const personalInformationData = useSelector(
    (state) => state.personalInformation
  );
  const addressData = useSelector((state) => state.address);
  const bookingData = useSelector((state) => state.booking);
  const cartData = useSelector((state) => state.cart);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [selectedFlatVilla, setSelectedFlatVilla] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [transportCharges, setTransportCharges] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedStaffCharge, setSelectedStaffCharges] = useState(null);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [availableSlot, setAvailableSlot] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotValue, setSelectedSlotValue] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [whatsapp, setWhatsapp] = useState(null);
  const [gender, setGender] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (personalInformationData && personalInformationData.length > 0) {
      const info = personalInformationData[0];
      setName(info.name || null);
      setEmail(info.email || null);
      setNumber(info.number || null);
      setWhatsapp(info.whatsapp || null);
      setGender(info.gender || null);
    }
  }, [personalInformationData]);

  useEffect(() => {
    // If personalInformationData is available, set values from it
    if (addressData && addressData.length > 0) {
      selectAddress(addressData[0]);
    }
  }, [addressData]);

  useEffect(() => {
    if (bookingData && bookingData.length > 0) {
      setModalVisible(false);
      const booking = bookingData[0];
      console.log(booking);
      setSelectedDate(booking.selectedDate || null);
      setSelectedStaff(booking.selectedStaff || null);
      setSelectedStaffId(booking.selectedStaffId || null);
      setSelectedSlot(booking.selectedSlot || null);
      setSelectedSlotId(booking.selectedSlotId || null);
      setSelectedStaffCharges(booking.selectedStaffCharge);
      setTransportCharges(booking.transportCharges || null);
      if (booking.selectedDate && booking.selectedArea) {
        fetchAvailableTimeSlots(
          booking.selectedDate,
          booking.selectedArea,
          booking.selectedStaffId,
          booking.selectedSlot
        );
      }
    }
  }, [bookingData[0]]);

  const selectAddress = (item) => {
    setSelectedAddress(
      `${item.building} ${item.villa} ${item.street} ${item.area} ${item.city}`
    );
    setSelectedArea(item.area);
    setSelectedBuilding(item.building);
    setSelectedLandmark(item.landmark);
    setSelectedFlatVilla(item.villa);
    setSelectedStreet(item.street);
    setSelectedCity(item.city);

    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate, item.area);
    }
  };

  const handleDateSelect = (date) => {
    setModalVisible(false);
    setSelectedDate(date.dateString);
    fetchAvailableTimeSlots(date.dateString, selectedArea);
  };

  const fetchAvailableTimeSlots = async (
    date,
    area,
    selectedStaffId = null,
    selectedSlot = null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${availableTimeSlotUrl}area=${area}&date=${date}`
      );

      if (response.status === 200) {
        setAvailableStaff(response.data.availableStaff);
        setAvailableSlot(response.data.slots);
        const isStaffIdInAvailableStaff = response.data.availableStaff.some(
          (availableStaff) => availableStaff.id === selectedStaffId
        );

        if (!isStaffIdInAvailableStaff) {
          setSelectedStaff(null);
        }

        if (response.data.slots[selectedStaffId]) {
          const selectedSlotArray = selectedSlot.split(",");

          const isSlotInAvailableStaff = response.data.slots[
            selectedStaffId
          ].some(
            (slot) =>
              slot[0] === parseInt(selectedSlotArray[0]) &&
              slot[1] === selectedSlotArray[1]
          );

          if (!isSlotInAvailableStaff) {
            setSelectedSlotId(null);
            setSelectedSlot(null);
          }
        } else {
          setSelectedSlotId(null);
          setSelectedSlot(null);
        }

        setTransportCharges(parseFloat(response.data.transport_charges));
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
    let staff_charges = 0; // Initialize staff_charges outside of if-else block

    if (item.staff.charges) {
      staff_charges = parseFloat(item.staff.charges);
    }
    setSelectedStaffCharges(staff_charges);
  };

  const renderPersonalInformation = () => (
    <View style={{ borderColor: "#8e8e8e", borderTopWidth: 0.5 }}>
      {personalInformationData.length !== 0 ? (
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
            <Text style={{ marginLeft: 10, fontWeight: "800" }}>Personal</Text>
            {name !== null && email !== null && (
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
                  navigation.navigate("PersonalInformation");
                }}
              >
                <Text>Change</Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              marginLeft: 20,
              marginRight: 20,
              fontSize: 16,
            }}
          >
            <Text>Name: {name}</Text>
            <Text>Email: {email}</Text>
            <Text>Gender: {gender}</Text>
            <Text>Phone Number: {number}</Text>
            <Text>Whatsapp Number: {whatsapp}</Text>
          </View>
        </View>
      ) : (
        <View>
          <Text
            style={{
              fontWeight: "800",
              padding: 10,
              borderTopWidth: 0.5,
              borderColor: "#8e8e8e",
            }}
          >
            Personal Information :
          </Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                alignItems: "center",
                fontWeight: 600,
                fontSize: 16,
                color: "#000",
              }}
            >
              No Personal Information Saved Yet!
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
                navigation.navigate("PersonalInformation");
              }}
            >
              <Text>Add Information</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderAddress = () => (
    <View
      style={{ borderColor: "#8e8e8e", borderTopWidth: 0.5, marginTop: 15 }}
    >
      {addressData.length !== 0 ? (
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
            <Text style={{ marginLeft: 10, fontWeight: "800" }}>Address</Text>
            {selectedAddress !== null && (
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
                  navigation.navigate("Address");
                }}
              >
                <Text>Change</Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              marginLeft: 20,
              marginRight: 20,
              fontSize: 16,
            }}
          >
            <Text
              style={{
                marginLeft: 20,
                marginRight: 20,
                fontSize: 16,
              }}
            >
              {selectedAddress}
            </Text>
          </View>
          {selectedAddress && (
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

                <Text style={{ marginLeft: 10, fontWeight: "800" }}>Selected Zone</Text>
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
                    navigation.navigate("Address");
                  }}
                >
                  <Text>Change</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  fontSize: 16,
                }}
              >
                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    fontSize: 16,
                  }}
                >
                  {selectedArea}
                </Text>
              </View>
            </>
          )}
        </View>
      ) : (
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
                navigation.navigate("Address");
              }}
            >
              <Text>Add Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

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
            setSelectedStaffCharges(null);
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
              minDate={new Date()}
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
              setSelectedStaffCharges(null);
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

  const renderSlot = () => (
    <View
      style={{ borderColor: "#8e8e8e", borderTopWidth: 0.5, marginTop: 10 }}
    >
      {availableSlot.length === 0 ? (
        <Text style={{ margin: 10, color: "red" }}>
          No Staff Availalbe for the Selected Date / Zone
        </Text>
      ) : (
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
            <Text
              style={{
                margin: 10,
                fontWeight: "800",
              }}
            >
              Slot:
            </Text>
          </View>
          <View
            style={{
              height: 50,
              width: "80%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "#8e8e8e",
            }}
          >
            <Picker
              selectedValue={selectedSlot}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedSlot(itemValue);

                // Add a check to ensure itemValue is defined
                if (itemValue) {
                  const [slotId, timeRange] = itemValue.split(",");
                  setSelectedSlotId(slotId);
                  setSelectedSlotValue(timeRange);
                }
              }}
            >
              <Picker.Item label="Select Time Slot" />
              {Object.keys(availableSlot).map((slotIndex) => {
                // Display slots only for the selected staff
                if (slotIndex == selectedStaffId) {
                  return availableSlot[slotIndex].map((slot) => (
                    <Picker.Item
                      key={slot[0]}
                      label={slot[1]}
                      value={slot[0] + "," + slot[1]} // Keep the value as a string
                    />
                  ));
                }
                return null;
              })}
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
  
  const checkAuthentication = async (navigate) => {
    const user = await AsyncStorage.getItem("@user_id");
    if (user === "" || user === null) {
      navigation.navigate("Login", { Navigate: navigate });
    } else {
      navigation.navigate(navigate);
    }
  };
  
  if (loading) {
    return Splash();
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <Header title={"Booking"} />
      <ScrollView>
        <View style={{ flex: 1, marginBottom: 80 }}>
          {renderPersonalInformation()}
          {name !== null && email !== null && (
            <>
              {renderAddress()}
              {selectedAddress && (
                <>
                  {renderDate()}
                  {selectedDate && (
                    <>
                      {error ? (
                        <Text style={{ margin: 10, color: "red" }}>
                          {error}
                        </Text>
                      ) : (
                        <>
                          {availableStaff && (
                            <>
                              {renderStaff()}
                              {selectedStaff && (
                                <>
                                  {renderSlot()}
                                  {selectedSlot && (
                                    <>
                                      <View style={{ marginBottom: 30 }}>
                                        <CommonButton
                                          title={
                                            cartData.length > 0
                                              ? "Checkout"
                                              : "Select Services"
                                          }
                                          bgColor={"#000"}
                                          textColor={"#fff"}
                                          onPress={() => {
                                            setLoading(true);
                                            const bookingInfo = {
                                              selectedDate: selectedDate,
                                              selectedStaff: selectedStaff,
                                              selectedStaffId: selectedStaffId,
                                              selectedArea: selectedArea,
                                              selectedSlot: selectedSlot,
                                              selectedSlotId: selectedSlotId,
                                              selectedStaffCharge: selectedStaffCharge,
                                              transportCharges: transportCharges
                                            };

                                            dispatch(
                                              updateBooking(bookingInfo)
                                            );
                                            if (cartData.length > 0) {
                                              checkAuthentication("Checkout");
                                            } else {
                                              navigation.navigate("Main");
                                            }

                                            setLoading(false);
                                          }}
                                        />
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
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({});
