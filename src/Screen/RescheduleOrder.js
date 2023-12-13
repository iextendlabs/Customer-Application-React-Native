import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import {
  editOrderUrl,
  availableTimeSlotUrl,
  UpdateOrderUrl,
  BaseUrl,
} from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import CommonButton from "../Common/CommonButton";
import Splash from "../Screen/Splash";

export default function RescheduleOrder() {
  const route = useRoute();

  const navigation = useNavigation();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [availableSlot, setAvailableSlot] = useState([]);
  const [transportCharges, setTransportCharges] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedStaffCharge, setSelectedStaffCharges] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotValue, setSelectedSlotValue] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [servicesTotal, setServicesTotal] = useState(null);
  const [orderTotal, setOrderTotal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(null);

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
        setSelectedSlotId(data.order.time_slot_id);
        setSelectedSlotValue(data.order.time_slot_value);
        setServicesTotal(data.orderTotal.sub_total);
        setOrderTotal(data.order.total_amount);
        setSelectedArea(data.order.area);
        setSelectedStaffCharges(data.orderTotal.staff_charges);
        setCouponDiscount(data.orderTotal.discount)
        setNote(data.order.order_comment);
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    fetchAvailableTimeSlots(date.dateString, selectedArea);
    setModalVisible(false);
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
      } else if (response.status === 201) {
        setError(response.data.msg);
      } else {
        setError("Something Wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error fetching Staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectStaff = (item) => {
    setSelectedStaff(item.name);
    setSelectedStaffId(item.id);
    let staff_charges = 0; // Initialize staff_charges outside of if-else block

    if (item.staff.charges) {
      staff_charges = parseFloat(item.staff.charges);
    }
    setSelectedStaffCharges(staff_charges);
    setOrderTotal(
      parseFloat(servicesTotal) +
        parseFloat(staff_charges) +
        parseFloat(transportCharges) - 
        couponDiscount
    );
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
            setSelectedStaffCharges(null);
            setSelectedSlot(null);
            setSelectedSlotValue(null);
            setSelectedSlotId(null);
            setOrderTotal(null);
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
              setOrderTotal(null);
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
              <TouchableOpacity onPress={() => selectStaff(item)}>
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
              Slot: {selectedSlotValue && selectedSlotValue}
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
          {selectedSlotValue === null && (
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
        <Text style={{ padding: 10 }}>Product Total: AED {servicesTotal}</Text>
        <Text style={{ padding: 10 }}>Coupon Discount: AED -{couponDiscount}</Text>
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(UpdateOrderUrl, {
        service_staff_id: selectedStaffId,
        date: selectedDate,
        id: route.params.order_id,
        time_slot_id: selectedSlotId,
        order_comment:note
      });

      if (response.status === 200) {
        navigation.navigate("MyOrders", { clearState: true });
      } else {
        setError("Order failed. Please try again.");
      }
    } catch (error) {
      // setError("These credentials do not match our records.");
    }
    setLoading(false);
  };

  if (loading) {
    return Splash();
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1, marginTop: 30 }}>
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
                            <View
                              style={{
                                borderTopWidth: 0.5,
                                marginTop: 10,
                                borderColor: "#8e8e8e",
                              }}
                            >
                              <Text
                                style={{
                                  margin: 10,
                                  fontWeight: "800",
                                }}
                              >
                                Note:
                              </Text>
                              <TextInput
                                style={{
                                  height: 100,
                                  width: "80%",
                                  alignSelf: "center",
                                  borderColor: "#8e8e8e",
                                  borderWidth: 0.5,
                                  borderRadius: 5,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                }}
                                value={note}
                                onChangeText={setNote}
                                placeholder="Enter your Note"
                                multiline
                              />
                            </View>
                            <View style={{ marginBottom: 30 }}>
                              {orderError && (
                                <Text style={{ margin: 10, color: "red" }}>
                                  {orderError}
                                </Text>
                              )}
                              <CommonButton
                                title={"Update Order"}
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
