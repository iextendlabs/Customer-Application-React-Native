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
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  BaseUrl,
  availableTimeSlotUrl,
  AddOrderUrl,
  applyCouponAffiliateUrl,
} from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import CommonButton from "../Common/CommonButton";
import { clearCart } from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Splash from "../Screen/Splash";
import StarRating from "../Common/StarRating";
import CustomTextInput from "../Common/CustomTextInput";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartData = useSelector((state) => state.cart);
  const personalInformationData = useSelector(
    (state) => state.personalInformation
  );
  const bookingData = useSelector((state) => state.booking);
  const cartDataIds = cartData.map((item) => item.id);
  const addressData = useSelector((state) => state.address);
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
  const [selectedStaffCharges, setSelectedStaffCharges] = useState(null);
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
  const [modalVisible, setModalVisible] = useState(true);
  const [note, setNote] = useState(null);
  const [affiliate, setAffiliate] = useState("");
  const [coupon, setCoupon] = useState("");
  const [notValidCoupon, setNotValidCoupon] = useState(false);
  const [notValidAffiliate, setNotValidAffiliate] = useState(false);
  const [affiliateId, setAffiliateId] = useState(false);
  const [couponId, setCouponId] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(null);
  const [applyCouponAffiliate, setApplyCouponAffiliate] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  useEffect(() => {
    setServicesTotal(getServicesTotal());
  }, []);

  useEffect(() => {
    // If personalInformationData is available, set values from it
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
      setSelectedDate(booking.selectedDate || null);
      setSelectedStaff(booking.selectedStaff || null);
      setSelectedStaffId(booking.selectedStaffId || null);
      setSelectedSlotId(booking.selectedSlotId || null);
      setSelectedSlot(booking.selectedSlot || null);
      setSelectedStaffCharges(booking.selectedStaffCharge || null);
      setTransportCharges(booking.transportCharges || null);
      if (booking.selectedDate && booking.selectedArea) {
        fetchAvailableTimeSlots(
          booking.selectedDate,
          booking.selectedArea,
          booking.selectedStaffId,
          booking.selectedSlot
        );
      }

      setServicesTotal(getServicesTotal());
      console.log(
        getServicesTotal(),
        parseFloat(booking.selectedStaffCharge),
        parseFloat(booking.transportCharges),
        couponDiscount
      );
      setOrderTotal(
        getServicesTotal() +
          parseFloat(booking.selectedStaffCharge) +
          parseFloat(booking.transportCharges) -
          couponDiscount
      );
    }
  }, [bookingData]);

  const getServicesTotal = () => {
    return cartData.reduce((total, item) => {
      const itemTotal = item.discount
        ? parseFloat(item.discount)
        : parseFloat(item.price);
      return total + itemTotal;
    }, 0);
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
    setLatitude(item.latitude);
    setLongitude(item.longitude);

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
        setTransportCharges(parseFloat(response.data.transport_charges));
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
    setOrderTotal(
      servicesTotal +
        parseFloat(staff_charges) +
        parseFloat(transportCharges) -
        couponDiscount
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
        order_comment: note,
        affiliate_id: affiliateId,
        coupon_id: couponId,
        latitude: latitude,
        longitude: longitude,
      });
      console.log(response.data);
      if (response.status === 200) {
        await AsyncStorage.removeItem("@cartData");
        dispatch(clearCart());
        navigation.navigate("OrderSuccess", {
          date: response.data.date,
          staff: response.data.staff,
          slot: response.data.slot,
          total_amount: response.data.total_amount,
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

  const applyCode = async () => {
    if (coupon !== "" || affiliate !== "") {
      setLoading(true);
      try {
        const response = await axios.post(applyCouponAffiliateUrl, {
          coupon: coupon,
          affiliate: affiliate,
        });

        if (response.status === 200) {
          const couponData = response.data.coupon;
          if (response.data.affiliate_id) {
            setAffiliateId(response.data.affiliate_id);
          } else {
            setAffiliateId("");
          }
          if (couponData) {
            setCouponId(couponData.id);

            let discount = 0;

            if (couponData.type === "Percentage") {
              discount = (getServicesTotal() * couponData.discount) / 100;
            } else {
              discount = couponData.discount; // Fixed variable name from $discount to discount
            }
            setCouponDiscount(discount);

            setOrderTotal(
              servicesTotal +
                parseFloat(selectedStaffCharges) +
                parseFloat(transportCharges) -
                discount
            );
          } else {
            setCouponId("");
            setCouponDiscount("");
            setOrderTotal(
              servicesTotal +
                parseFloat(selectedStaffCharges) +
                parseFloat(transportCharges)
            );
          }
          setApplyCouponAffiliate("Your codes Apply Successfully.");

          setTimeout(() => {
            setApplyCouponAffiliate("");
          }, 2000);
        } else if (response.status === 201) {
          const errors = response.data.errors;

          if (errors.affiliate) {
            setAffiliateId("");
            setNotValidAffiliate(errors.affiliate[0]); // Assuming affiliate is an array
          }

          if (errors.coupon) {
            setCouponId("");
            setCouponDiscount("");
            setOrderTotal(
              servicesTotal +
                parseFloat(selectedStaffCharges) +
                parseFloat(transportCharges)
            );
            setNotValidCoupon(errors.coupon[0]); // Assuming coupon is an array
          }

          setTimeout(() => {
            setNotValidAffiliate("");
            setNotValidCoupon("");
          }, 2000);
        } else {
          setError("Order failed. Please try again.");
        }
      } catch (error) {
        setOrderTotal(
          servicesTotal +
            parseFloat(selectedStaffCharges) +
            parseFloat(transportCharges)
        );
      } finally {
        setLoading(false);
      }
    } else {
      setAffiliateId("");
      setCouponId("");
      setCouponDiscount("");
      setOrderTotal(
        servicesTotal +
          parseFloat(selectedStaffCharges) +
          parseFloat(transportCharges)
      );
      console.log(servicesTotal, selectedStaffCharges, transportCharges);
      setNotValidAffiliate("Please Enter Code!");
      setTimeout(() => {
        setNotValidAffiliate("");
      }, 2000);
    }
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
              defaultSource={require("../images/logo.png")}
              style={{ width: 70, height: 70, marginLeft: 10 }}
            />
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 15 }}>{item.name}</Text>
              <Text style={{ marginTop: 15 }}>
                AED{" "}
                {item.discount ? (
                  <>
                    <Text
                      style={{
                        textDecorationLine: "line-through",
                        color: "red",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Text style={{ marginRight: 5, color: "#333" }}>
                      {item.discount}
                    </Text>
                  </>
                ) : (
                  item.price
                )}
              </Text>
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
          marginTop: 10,
          borderTopWidth: 0.5,
          height: 40,
          borderColor: "#8e8e8e",
          borderBottomWidth: 0.5,
        }}
      >
        <Text style={{ fontWeight: "800" }}>Total :</Text>
        <Text>AED {getServicesTotal()}</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        {applyCouponAffiliate && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "green" }}>
            {applyCouponAffiliate}
          </Text>
        )}
        <CustomTextInput
          placeholder={"Enter Coupon Code"}
          icon={require("../images/voucher.png")}
          value={coupon}
          onChangeText={(txt) => {
            setCoupon(txt);
          }}
        />

        {notValidCoupon && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            {notValidCoupon}
          </Text>
        )}

        <CustomTextInput
          placeholder={"Enter Affiliate Code"}
          icon={require("../images/affiliate.png")}
          value={affiliate}
          onChangeText={(txt) => {
            setAffiliate(txt);
          }}
        />

        {notValidAffiliate && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            {notValidAffiliate}
          </Text>
        )}

        <CommonButton
          title={"Apply Coupon and Affiliate"}
          bgColor={"#FF000080"}
          textColor={"#fff"}
          onPress={() => {
            applyCode();
          }}
        />
      </View>
    </View>
  );

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

  const renderSummary = () => (
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
          Total Services Charges: AED {getServicesTotal()}
        </Text>
        <Text style={{ padding: 10 }}>
          Coupon Discount: AED -{couponDiscount ? couponDiscount : 0}
        </Text>
        <Text style={{ padding: 10 }}>
          Staff Charges: AED {selectedStaffCharges ? selectedStaffCharges : 0}
        </Text>
        <Text
          style={{
            padding: 10,
            borderBottomWidth: 0.5,
          }}
        >
          Transport Charges: AED {transportCharges ? transportCharges : 0}
        </Text>
        <Text style={{ padding: 10 }}>
          Total Order Charges: AED {orderTotal}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return Splash();
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1, marginBottom: 40 }}>
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
                                {selectedSlot && (
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
                                        <Text
                                          style={{
                                            margin: 10,
                                            color: "red",
                                          }}
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
