import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  AddOrderUrl,
  applyCouponAffiliateUrl,
  orderTotalURL,
} from "../Config/Api";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import CommonButton from "../Common/CommonButton";
import { clearCart, clearCoupon } from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Splash from "../Screen/Splash";
import CustomTextInput from "../Common/CustomTextInput";
import CartItem from "../Common/CartItem";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartData = useSelector((state) => state.cart);
  const personalInformationData = useSelector((state) => state.personalInformation);
  const couponData = useSelector((state) => state.coupon);
  const affiliateData = useSelector((state) => state.affiliate);
  const addressData = useSelector((state) => state.address);
  const [address, setAddress] = useState(null);
  const [building, setBuilding] = useState(null);
  const [district, setDistrict] = useState(null);
  const [area, setArea] = useState(null);
  const [landmark, setLandmark] = useState(null);
  const [flatVilla, setFlatVilla] = useState(null);
  const [street, setStreet] = useState(null);
  const [city, setCity] = useState(null);
  const [transportCharges, setTransportCharges] = useState(null);
  const [staffCharges, setStaffCharges] = useState(null);
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
  const [note, setNote] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [notValidCoupon, setNotValidCoupon] = useState(false);
  const [notValidAffiliate, setNotValidAffiliate] = useState(false);
  const [affiliateId, setAffiliateId] = useState('');
  const [couponId, setCouponId] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(null);
  const [applyCouponAffiliate, setApplyCouponAffiliate] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [cartServiceIds, setCartServiceIds] = useState([]);
  const [cartStaffIds, setCartStaffIds] = useState([]);
  const [cartSlotIds, setCartSlotIds] = useState([]);
  const [groupCartData, setGroupCartData] = useState([]);
  const [excludedServices, setExcludedServices] = useState([]);
  const [isPersonalInfo, setIsPersonalInfo] = useState(false);
  const [isAddress, setIsAddress] = useState(false);

  useEffect(() => {
    if (cartData && cartData.length > 0) {
      const updatedGroupCartData = {};
      const serviceIds = [];
      const staffIds = [];
      const slotIds = [];

      cartData.forEach((item) => {
        const key = `${item.date}_${item.staff_id}_${item.slot_id}`;
        if (!updatedGroupCartData[key]) {
          updatedGroupCartData[key] = [];
        }
        updatedGroupCartData[key].push(item.service_id);
        serviceIds.push(item.service_id);
        staffIds.push(item.staff_id);
        slotIds.push(item.slot_id);
      });

      setGroupCartData(updatedGroupCartData);
      setCartServiceIds(serviceIds);
      setCartStaffIds(staffIds);
      setCartSlotIds(slotIds);
    }
  }, [cartData]);

  useEffect(() => {
    if (couponData && couponData.length > 0 && affiliateData && affiliateData.length > 0 && cartServiceIds.length > 0) {
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
  }, [couponData, affiliateData, cartServiceIds]);

  useEffect(() => {
    if (personalInformationData && personalInformationData.length > 0) {
      const info = personalInformationData[0];
      setName(info.name || null);
      setEmail(info.email || null);
      setNumber(info.number || null);
      setWhatsapp(info.whatsapp || null);
      setGender(info.gender || null);
      if(info.name != null && info.email != null && info.number != null && info.whatsapp != null && info.gender != null){
        setIsPersonalInfo(true)
      }
    }
  }, [personalInformationData]);

  useEffect(() => {
    if (addressData && addressData.length > 0) {
      setTransportCharges(null);
      selectAddress(addressData[0]);
    }
  }, [addressData]);

  useEffect(() => {
    if (cartServiceIds && groupCartData && area) {
      orderTotalCall();
    }
  }, [cartServiceIds, groupCartData, area]);

  const selectAddress = (item) => {
    setAddress(
      `${item.building} ${item.villa} ${item.street} ${item.district} ${item.area} ${item.city}`
    );
    setDistrict(item.district);
    setArea(item.area);
    setBuilding(item.building);
    setLandmark(item.landmark);
    setFlatVilla(item.villa);
    setStreet(item.street);
    setCity(item.city);
    setLatitude(item.latitude);
    setLongitude(item.longitude);

    if(item.district != null && item.area != null && item.building != null && item.landmark != null && item.villa != null && item.street != null && item.city != null ){
      setIsAddress(true)
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const requestData = {
      name: name,
      email: email,
      buildingName: building,
      district: district,
      area: area,
      landmark: landmark,
      flatVilla: flatVilla,
      street: street,
      city: city,
      number: number,
      whatsapp: whatsapp,
      gender: gender,
      service_ids: cartServiceIds,
      order_comment: note,
      cartData: cartData,
      affiliate_code: affiliate,
      coupon_code: coupon,
      latitude: latitude,
      longitude: longitude,
      orderTotal: orderTotal
    };

    try {
      const response = await axios.post(AddOrderUrl, requestData);

      if (response.status === 200) {
        await AsyncStorage.removeItem("@cart");
        dispatch(clearCart());
        navigation.reset({
          index: 1, // Set the index based on the position of the route you want to set
          routes: [
            { name: 'Main' },  // Replace with the route you want to set in the history
            { 
              name: 'OrderSuccess', 
              params: {
                sub_total: response.data.sub_total,
                discount: response.data.discount,
                staff_charges: response.data.staff_charges,
                transport_charges: response.data.transport_charges,
                total_amount: response.data.total_amount,
                order_ids: response.data.order_ids,
              } 
            },   // OrderSuccess screen with parameters
          ],
        });
      } else if (response.status === 201) {
        if (response.data.excludedServices) {
          console.log(response.data.excludedServices);
          setExcludedServices(response.data.excludedServices);
        }
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
                await AsyncStorage.removeItem("@cart");
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

  const orderTotalCall = async (coupon_id = null) => {
    setLoading(true);
    const requestData = {
      service_ids: cartServiceIds,
      group_data: groupCartData,
      zone: area,
      coupon_id: coupon_id ?? couponId,
    };

    try {
      const response = await axios.get(orderTotalURL, { params: requestData });

      if (response.status === 200) {
        const data = response.data;
        setServicesTotal(data.services_total);
        setCouponDiscount(data.coupon_discount);
        setStaffCharges(parseFloat(data.staff_charges));
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
    setAffiliateId("");
    setCouponId("");
    setCouponDiscount("");
    orderTotalCall(0);
    const userId = await AsyncStorage.getItem("@user_id");
    if (coupon !== null || affiliate !== null) {
      setLoading(true);
      try {
        const response = await axios.post(applyCouponAffiliateUrl, {
          coupon: coupon,
          affiliate: affiliate,
          user_id: userId,
          service_ids: cartServiceIds
        });

        if (response.status === 200) {
          const couponData = response.data.coupon;
          if (response.data.affiliate_id) {
            setAffiliateId(response.data.affiliate_id);
          }
          if (couponData) {
            setCouponId(couponData.id);
            orderTotalCall(couponData.id)
          }
          setApplyCouponAffiliate("Your codes Apply Successfully.");

          setTimeout(() => {
            setApplyCouponAffiliate("");
          }, 7000);
        } else if (response.status === 201) {
          const errors = response.data.errors;

          if (errors.affiliate) {
            setAffiliate(null);
            setNotValidAffiliate(errors.affiliate[0]); // Assuming affiliate is an array
          }

          if (errors.coupon) {
            setCoupon(null);
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
        orderTotalCall(0)
      } finally {
        setLoading(false);
      }
    } else {

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
        renderItem={({ item }) => {
          const isExcluded = excludedServices.includes(item.service_id);
          return (
            <CartItem
              item={item}
              isCheckout={true}
              onEditCart={() => navigation.navigate("AddToCart", {
                service: item.service,
                staff_name: item.staff,
                staff_id: item.staff_id,
                slot_id: item.slot_id,
                slot: item.slot,
                date: item.date
              })}
              onRemoveFromCart={() => console.log('Remove item:', item)}
              isExcluded={isExcluded}
            />
          );
        }}
        keyExtractor={item => item.service_id.toString()}
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
      {isPersonalInfo == true ? (
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
              No personal information saved properly. Please verify that.
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
      {isAddress == true ? (
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
              {address}
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
                color: "red",
              }}
            >
              No addresses saved properly. Please verify that.
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
          Total Services Charges: AED {servicesTotal ? servicesTotal : 0}
        </Text>
        <Text style={{ padding: 10 }}>
          Coupon Discount: AED {couponDiscount ? couponDiscount : 0}
        </Text>
        <Text style={{ padding: 10 }}>
          Staff Charges: AED {staffCharges ? staffCharges : 0}
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
          Total Order Charges: AED {orderTotal ? orderTotal : 0}
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
              {isPersonalInfo == true && isAddress == true ? (
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
                  {isPersonalInfo == false && (
                    <Text style={{ color: 'red' }}>To proceed with your order, we require your contact information. Please verify the details provided.</Text>
                  )}

                  {isAddress == false && (
                    <Text style={{ color: 'red' }}>To proceed with your order, please verify that you have provided your contact information accurately.</Text>
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