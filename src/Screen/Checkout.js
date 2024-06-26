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
  Alert
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  BaseUrl,
  availableTimeSlotUrl,
  AddOrderUrl,
  applyCouponAffiliateUrl,
  orderTotalURL,
} from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import CommonButton from "../Common/CommonButton";
import { clearCart, clearCoupon } from "../redux/actions/Actions";
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
  const couponData = useSelector((state) => state.coupon);
  const affiliateData = useSelector((state) => state.affiliate);
  const addressData = useSelector((state) => state.address);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
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
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState(null);
  const [affiliate, setAffiliate] = useState("");
  const [coupon, setCoupon] = useState("");
  const [notValidCoupon, setNotValidCoupon] = useState(false);
  const [notValidAffiliate, setNotValidAffiliate] = useState(false);
  const [affiliateId, setAffiliateId] = useState('');
  const [couponId, setCouponId] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(null);
  const [applyCouponAffiliate, setApplyCouponAffiliate] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  useEffect(() => {
    orderTotalCall();
  }, []);

  useEffect(() => {
    if (selectedDate === null) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      setSelectedDate(formattedDate);
    }
    if (selectedArea && selectedDate) {
      fetchAvailableTimeSlots(selectedDate, selectedArea, selectedStaffId, selectedSlot);
    }
  }, [selectedArea]);

  useEffect(() => {
    if (couponData && couponData.length > 0 && affiliateData && affiliateData.length > 0) {
      const couponInfo = couponData[0];
      const affiliateInfo = affiliateData[0];
      setCoupon(couponInfo.code);
      setAffiliate(affiliateInfo);
      applyCode(couponInfo.code, affiliateInfo);
    } 
    else if (couponData && couponData.length > 0) {
      const couponInfo = couponData[0];
      setCoupon(couponInfo.code);
      applyCode(couponInfo.code);
    } 
    else if (affiliateData && affiliateData.length > 0) {
      const affiliateInfo = affiliateData[0];
      setAffiliate(affiliateInfo);
      applyCode(null, affiliateInfo);
    }
  }, [couponData, affiliateData]);
  

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
    if (addressData && addressData.length > 0) {
      setTransportCharges(null);
      selectAddress(addressData[0]);
    }
  }, [addressData]);

  useEffect(() => {
    if (bookingData && bookingData.length > 0) {
      const booking = bookingData[0];
      setSelectedDate(booking.selectedDate || null);
      setSelectedStaff(booking.selectedStaff || null);
      setSelectedStaffId(booking.selectedStaffId || null);
      setSelectedSlotId(booking.selectedSlotId || null);
      setSelectedSlotValue(booking.selectedSlotValue || null);
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
      orderTotalCall(booking.selectedStaffId,booking.selectedArea);
    }
  }, [bookingData, couponDiscount]);

  const selectAddress = (item) => {
    setSelectedAddress(
      `${item.building} ${item.villa} ${item.street} ${item.district} ${item.city}`
    );
    setSelectedDistrict(item.district);
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
    orderTotalCall();
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
          setSelectedStaffCharges(null);
          setSelectedStaffId(null);
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
            setSelectedSlotValue(null);
          }
        } else {
          setSelectedSlotId(null);
          setSelectedSlot(null);
          setSelectedSlotValue(null);
        }

        setLoading(false);
      } else if (response.status === 201) {
        setSelectedStaffCharges(null);
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

  const selectStaff = (item) => {
    setSelectedStaff(item.name);
    setSelectedStaffId(item.id);
    orderTotalCall(item.id);
  };

  const handleSave = async () => {
    setLoading(true);

    const requestData = {
      name: name,
      email: email,
      buildingName: selectedBuilding,
      district: selectedDistrict,
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
      orderTotal: orderTotal
    };

    try {
      const response = await axios.post(AddOrderUrl, requestData);

      if (response.status === 200) {
        await AsyncStorage.removeItem("@cartData");
        dispatch(clearCart());
        navigation.navigate("OrderSuccess", {
          date: response.data.date,
          staff: response.data.staff,
          slot: response.data.slot,
          total_amount: response.data.total_amount,
          order_id: response.data.order_id,
        });
      } else if (response.status === 201) {
        setOrderError(response.data.msg);
      } else if (response.status === 202) {
        Alert.alert(
          "Order Placement Failed",
          "Our support will contact you. Please try again once more.",
          [
            {
              text: "OK",
              onPress: async () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Main',
                      params: { refresh: "true" }, // Add your params here
                    },
                  ],
                });
                await AsyncStorage.removeItem("@cartData");
                dispatch(clearCart());
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        setError("Order failed. Please try again.");
      }
    } catch (error) { }
    setLoading(false);
  };

  const orderTotalCall = async (staff_id = null, zone = null, coupon_id = null) => {
    setLoading(true);
    const requestData = {
      service_ids: cartDataIds,
      staff_id: staff_id ?? selectedStaffId,
      zone: zone ?? selectedArea,
      coupon_id: coupon_id ?? couponId,
    };

    try {
      const response = await axios.get(orderTotalURL, { params: requestData });

      if (response.status === 200) {
        const data = response.data;
        setServicesTotal(data.services_total);
        setCouponDiscount(data.coupon_discount);
        setSelectedStaffCharges(parseFloat(data.staff_charges));
        setTransportCharges(parseFloat(data.transport_charges));
        setOrderTotal(data.total);
        setLoading(false);
      } else {
        setError("Code failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
    }

    setLoading(false);
  };

  const applyCode = async (coupon = null, affiliate = null) => {
    const userId = await AsyncStorage.getItem("@user_id");
    if (coupon !== "" || affiliate !== "") {
      setLoading(true);
      try {
        const response = await axios.post(applyCouponAffiliateUrl, {
          coupon: coupon,
          affiliate: affiliate,
          user_id: userId,
          service_ids: cartDataIds
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
            orderTotalCall(null,null,couponData.id)
          } else {
            setCouponId("");
            setCouponDiscount("");
            orderTotalCall(null,null,0)
          }
          setApplyCouponAffiliate("Your codes Apply Successfully.");

          setTimeout(() => {
            setApplyCouponAffiliate("");
          }, 7000);
        } else if (response.status === 201) {
          const errors = response.data.errors;

          if (errors.affiliate) {
            setAffiliate("");
            setAffiliateId("");
            setNotValidAffiliate(errors.affiliate[0]); // Assuming affiliate is an array
          }

          if (errors.coupon) {
            setCoupon("");
            setCouponId("");
            orderTotalCall(null,null,0)
            dispatch(clearCoupon());
            await AsyncStorage.removeItem("@couponData");
            setNotValidCoupon(errors.coupon[0]);
          }

          setTimeout(() => {
            setNotValidAffiliate("");
            setNotValidCoupon("");
          }, 10000);
        } else {
          setError("Code failed. Please try again.");
        }
      } catch (error) {
        orderTotalCall(null,null,0)
      } finally {
        setLoading(false);
      }
    } else {
      setAffiliateId("");
      setCouponId("");
      orderTotalCall(null,null,0)
      setNotValidCoupon("Please Enter Code!");
      setTimeout(() => {
        setNotValidCoupon("");
      }, 2000);
      setLoading(false);

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
                      {" " + item.discount}
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
      <View style={{ marginBottom: 10 }}>
        {applyCouponAffiliate && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "green" }}>
            {applyCouponAffiliate}
          </Text>
        )}
        {notValidCoupon && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            {notValidCoupon}
          </Text>
        )}
        <CustomTextInput
          placeholder={"Enter Coupon Code (optional)"}
          icon={require("../images/voucher.png")}
          value={coupon}
          onChangeText={(txt) => {
            setCoupon(txt);
          }}
        />

        {notValidAffiliate && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            {notValidAffiliate}
          </Text>
        )}

        <CustomTextInput
          placeholder={"Enter Affiliate Code (optional)"}
          icon={require("../images/affiliate.png")}
          value={affiliate}
          onChangeText={(txt) => {
            setAffiliate(txt);
          }}
        />

        <CommonButton
          title={"Apply"}
          bgColor={"#fd245f"}
          textColor={"#fff"}
          onPress={() => {
            applyCode(coupon, affiliate);
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
                color: "red",
              }}
            >
              To Proccess the Order, Need Contact Information!
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
                color: "red",
              }}
            >
              No Addresses Given Yet!
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

        </>
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
          Total Services Charges: AED {servicesTotal}
        </Text>
        <Text style={{ padding: 10 }}>
          Coupon Discount: AED {couponDiscount ? couponDiscount : 0}
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
        {renderServices()}
        {renderPersonalInformation()}
        <>
          {renderAddress()}
          <>
            {renderDate()}
            <>
              <>
                <>
                  {renderStaff()}
                  <>
                    {renderSlot()}
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
                        {name !== null && email !== null && selectedAddress && selectedStaff && selectedSlot ? (
                          <CommonButton
                            title={"Place Order"}
                            bgColor={"#000"}
                            textColor={"#fff"}
                            onPress={() => {
                              handleSave();
                            }}
                          />
                        ) : (
                          <View style={{ padding: 20 }}>
                            <Text style={styles.innerText}>To Process the Order, Check the Following:</Text>

                            {selectedStaff === null && (
                              <Text style={{ color: 'red' }}>Select Staff</Text>
                            )}

                            {selectedSlot === null && (
                              <Text style={{ color: 'red' }}>Select Slot</Text>
                            )}

                            {personalInformationData.length === 0 && (
                              <Text style={{ color: 'red' }}>Need Contact Information!</Text>
                            )}

                            {addressData.length === 0 && (
                              <Text style={{ color: 'red' }}>No Addresses Given Yet!</Text>
                            )}
                          </View>
                        )}
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#ec407a",
                            justifyContent: 'center',
                            flexDirection: "row",
                            alignItems: 'center',
                            height: 50,
                            width: '85%',
                            borderRadius: 10,
                            alignSelf: 'center',
                            marginTop: 20
                          }}
                          onPress={() => {
                            navigation.navigate("Chat");
                          }}
                        >
                          <Image
                            source={require("../images/chat.png")}
                            style={{ width: 50, height: 50 }}
                          />
                          <Text style={{ color: "#fff" }}>Customer Support</Text>
                        </TouchableOpacity>
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
              </>
            </>
          </>
        </>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  innerText: {
    fontWeight: '600',
    fontSize: 16,
    color: 'red',
  },
});