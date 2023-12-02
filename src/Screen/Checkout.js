import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl, availableTimeSlotUrl, AddOrderUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import CommonButton from "../Common/CommonButton";
import { clearCart } from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [cartData, setCartData] = useState([]);
  const [personalInformationData, setPersonalInformation] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const cartDataIds = cartData.map((item) => item.id);
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
  const [orderError, setOrderError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [whatsapp, setWhatsapp] = useState(null);
  const [gender, setGender] = useState(null);
  const [servicesTotal, setServicesTotal] = useState(null);
  const [orderTotal, setOrderTotal] = useState(null);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const cartJsonString = await AsyncStorage.getItem("@cartData");
      const parsedCartData = JSON.parse(cartJsonString) || [];
      setCartData(parsedCartData);

      const infoJsonString = await AsyncStorage.getItem("@personalInformation");
      const parsedInfoData = JSON.parse(infoJsonString) || [];
      setPersonalInformation(parsedInfoData);
      setName(parsedInfoData.name || null);
      setEmail(parsedInfoData.email || null);
      setNumber(parsedInfoData.number || null);
      setWhatsapp(parsedInfoData.whatsapp || null);
      setGender(parsedInfoData.gender || null);

      const addressJsonString = await AsyncStorage.getItem("@addressData");
      const parsedAddressData = JSON.parse(addressJsonString) || [];
      setAddressData(parsedAddressData);

    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  const getServicesTotal = () => {
    return cartData.reduce((total, item) => total + parseFloat(item.price), 0);
  };

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
    setSelectedDate(date.dateString);
    fetchAvailableTimeSlots(date.dateString, selectedArea);
  };

  const fetchAvailableTimeSlots = async (date, area) => {
    setLoading(true);
    setError(null);
    setSelectedStaff(null);
    setSelectedStaffId(null);
    setSelectedStaffCharges(null);
    setTransportCharges(null);
    setAvailableStaff([]);
    setAvailableSlot([]);
    try {
      const response = await axios.get(
        `${availableTimeSlotUrl}area=${area}&date=${date}`
      );

      if (response.status === 200) {
        setAvailableStaff(response.data.availableStaff);
        setAvailableSlot(response.data.slots);
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
    // setAvailableStaff([]);
    setServicesTotal(getServicesTotal());
    setOrderTotal(
      getServicesTotal() +
        parseFloat(staff_charges) +
        parseFloat(transportCharges)
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(AddOrderUrl, {
        name: name,
        email: email,
        buildingName: selectedBuilding,
        area: selectedArea,
        landmark: selectedLandmark,
        flatVilla: selectedFlatVilla,
        street: selectedStreet,
        city: selectedCity,
        number: number,
        whatsapp: whatsapp,
        service_staff_id: selectedStaffId,
        date: selectedDate,
        time_slot_id: selectedSlotId,
        gender: gender,
        service_ids: cartDataIds,
      });

      if (response.status === 200) {
        dispatch(clearCart());
        navigation.reset({
          index: 0,
          routes: [{ name: "OrderSuccess" }],
        });
      } else if (response.status === 201) {
        setOrderError(response.data.msg);
      } else {
        setError("Order failed. Please try again.");
      }
    } catch (error) {
      // setError("These credentials do not match our records.");
    }
    setLoading(false);
  };

  const renderServices = () => (
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
          borderBottomWidth: 0.5,
        }}
      >
        <Text style={{ fontWeight: "800" }}>Total :</Text>
        <Text>AED {getServicesTotal()}</Text>
      </View>
    </View>
  );

  const renderPersonalInformation = () => (
    <View>
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
            <Text>Name:{name}</Text>
            <Text>Email:{email}</Text>
            <Text>Gender:{gender}</Text>
            <Text>Phone Number:{number}</Text>
            <Text>Whatsapp Number:{whatsapp}</Text>
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
    <View>
      {selectedAddress === null && (
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
            {addressData.length !== 0 && (
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
                  navigation.navigate("AddAddress");
                }}
              >
                <Text>Add</Text>
              </TouchableOpacity>
            )}
          </View>

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
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
            <Text
              style={{
                marginLeft: 10,

                fontWeight: "800",
              }}
            >
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
                  setSelectedStaffCharges(null);
                  setSelectedSlot(null);
                  setSelectedSlotValue(null);
                  setSelectedSlotId(null);
                  setOrderTotal(null);
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
            }}
          >
            {selectedAddress === null
              ? "Note: Please Select Address From the Above List!"
              : selectedAddress}
          </Text>
        </View>
      )}
    </View>
  );

  const renderDate = () => (
    <View>
      <Text
        style={{ margin: 10, fontWeight: "800" }}
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
          setOrderTotal(null);
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
  );

  const renderStaff = () => (
    <View>
      <Text
        style={{
          margin: 10,

          fontWeight: "800",
        }}
        onPress={() => {
          setAvailableStaff([]);
          setAvailableSlot([]);
          setSelectedStaff(null);
          setSelectedStaffId(null);
          setSelectedStaffCharges(null);
          fetchAvailableTimeSlots(selectedDate, selectedArea);
          setSelectedSlot(null);
          setSelectedSlotValue(null);
          setSelectedSlotId(null);
          setOrderTotal(null);
        }}
      >
        Staff: {selectedStaff && selectedStaff}
      </Text>
      <FlatList
        data={availableStaff}
        renderItem={({ item, index }) => (
          <>
            {selectedStaff ? (
              item.id === selectedStaffId && (
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
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                        }}
                      >
                        {item.name}
                      </Text>
                      {item.staff.charges && (
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
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      {item.name}
                    </Text>
                    {item.staff.charges && (
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
          </>
        )}
      />
    </View>
  );
  const renderSlot = () => (
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
                selectedValue={
                  selectedSlot
                    ? selectedSlot[0] + "," + selectedSlot[1]
                    : undefined
                }
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
          )}
        </View>
      )}
    </View>
  );

  const renderSummary = () => (
    <View
      style={{
        borderTopWidth: 0.5,
        borderColor: "#8e8e8e",
      }}
    >
      <Text
        style={{
          margin: 10,
          fontWeight: "800",
        }}
      >
        Order Summary:
      </Text>
      <View
        style={{
          marginLeft: 30,
          fontSize: 16,
          width: "80%",
        }}
      >
        <Text style={{ padding: 10 }}>
          Product Total: AED {getServicesTotal()}
        </Text>
        <Text style={{ padding: 10 }}>
          Staff Charges: AED {selectedStaffCharge ? selectedStaffCharge : 0}
        </Text>
        <Text
          style={{
            padding: 10,
            borderBottomWidth: 0.5,
          }}
        >
          Transport Charges: AED {transportCharges ? transportCharges : 0}
        </Text>
        <Text style={{ padding: 10 }}>Order Total: AED {orderTotal}</Text>
      </View>
    </View>
  );
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
        {renderServices()}
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
                      <Text style={{ margin: 10, color: "red" }}>{error}</Text>
                    ) : (
                      <>
                        {availableStaff && (
                          <>
                            {renderStaff()}
                            {selectedStaff && (
                              <>
                                {renderSlot()}
                                {selectedSlotValue && (
                                  <>
                                    {renderSummary()}
                                    <View style={{ marginBottom: 30 }}>
                                      {orderError && (
                                        <Text
                                          style={{ margin: 10, color: "red" }}
                                        >
                                          {orderError}
                                        </Text>
                                      )}
                                      <CommonButton
                                        title={"Place Order"}
                                        bgColor={"#000"}
                                        textColor={"#fff"}
                                        onPress={() => {
                                          handleSave();
                                        }}
                                      />
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
  );
}

const styles = StyleSheet.create({});
