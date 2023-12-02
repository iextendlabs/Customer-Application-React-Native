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
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { editOrderUrl, BaseUrl } from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import CommonButton from "../Common/CommonButton";
import { clearCart } from "../redux/actions/Actions";
export default function RescheduleOrder() {
  const route = useRoute();
  console.log(route.params.order_id);

  const navigation = useNavigation();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [availableSlot, setAvailableSlot] = useState([]);
  const [transportCharges, setTransportCharges] = useState(null);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [selectedFlatVilla, setSelectedFlatVilla] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedStaffCharge, setSelectedStaffCharges] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotValue, setSelectedSlotValue] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [whatsapp, setWhatsapp] = useState(null);
  const [gender, setGender] = useState(null);
  const [servicesTotal, setServicesTotal] = useState(null);
  const [orderTotal, setOrderTotal] = useState(null);
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${editOrderUrl}id=${route.params.order_id}`
      );
      if (response.status === 200) {
        let data = response.data;
        setAvailableStaff(data.availableStaff);
        setAvailableSlot(data.slots);
        setTransportCharges(parseFloat(data.transport_charges));
        setOrder(data.order);
        setSelectedDate(data.order.date);
        setSelectedStaffId(data.order.service_staff_id);
        setSelectedStaff(data.order.staff_name);
        setSelectedSlotId(data.time_slot_id);
        setSelectedSlotValue(data.time_slot_value);
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };
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
                                <Text style={{ margin: 10, color: "red" }}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
