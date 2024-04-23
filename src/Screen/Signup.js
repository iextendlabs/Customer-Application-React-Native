import { View, Text, Image, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SignupUrl, UpdateCustomerInfoUrl, signInWithFBUrl } from "../Config/Api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Splash from "../Screen/Splash";
import messaging from "@react-native-firebase/messaging";
import { getAuth, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { auth } from '../../config';
import { useDispatch } from "react-redux";
import { addPersonalInformation, addAddress, updateNotification, clearAddress, clearPersonalInformation, updateAffiliate } from "../redux/actions/Actions";

const Signup = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [affiliate, setAffiliate] = useState("");
  const [badEmail, setBadEmail] = useState(false);
  const [badName, setBadName] = useState(false);
  const [badPassword, setBadPassword] = useState(false);
  const [badConfirmPassword, setBadConfirmPassword] = useState(false);
  const [notValidPassword, setNotValidPassword] = useState(false);
  const [notValidAffiliate, setNotValidAffiliate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [number, setNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountryForNumber, setSelectedCountryForNumber] = useState(null);
  const [selectedCountryForWhatsapp, setSelectedCountryForWhatsapp] = useState(null);
  const [modalError, setModalError] = useState("");

  const handleSelectCountryForNumber = (country) => {
    setSelectedCountryForNumber(country.cca2);
    setNumber('+' + country.callingCode['0']);
  };

  const handleSelectCountryForWhatsapp = (country) => {
    setSelectedCountryForWhatsapp(country.cca2);
    setWhatsapp('+' + country.callingCode['0']);
  };
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const signInWithFB = async () => {
    setLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        setLoading(false);
        console.log('Login canceled');
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        setLoading(false);
        return;
      }
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      const response = await signInWithCredential(auth, facebookCredential);

      if (response) {
        setModalError("");
        setNumber("");
        setWhatsapp("");
        setLoading(false);
        saveLoginWithFB(response['_tokenResponse']['fullName'], response['_tokenResponse']['email']);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const saveLoginWithFB = async (fbName, fbEmail) => {

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(signInWithFBUrl, {
        name: fbName,
        email: fbEmail,
        fcmToken: fcmToken,
      });
      const data = response.data;

      if (response.status === 200) {
        if (data.user_info !== null) {
          dispatch(clearAddress());
          dispatch(clearPersonalInformation());
          const addressInfo = {
            building: data.user_info.buildingName || "",
            villa: data.user_info.flatVilla || "",
            street: data.user_info.street || "",
            area: data.user_info.area || "",
            landmark: data.user_info.landmark || "",
            city: data.user_info.city || "",
            district: data.user_info.district || "",
          };

          const personalInfo = {
            name: data.user.name,
            email: data.user.email,
            number: data.user_info.number || "",
            whatsapp: data.user_info.whatsapp || "",
            gender: data.user_info.gender || "",
          };

          await AsyncStorage.setItem(
            "@addressData",
            JSON.stringify(addressInfo)
          );
          await AsyncStorage.setItem(
            "@personalInformation",
            JSON.stringify(personalInfo)
          );
          dispatch(addPersonalInformation(personalInfo));
          dispatch(addAddress(addressInfo));
        }

        const accessToken = data.access_token;

        await AsyncStorage.setItem("@access_token", accessToken);
        await AsyncStorage.setItem("@user_id", String(data.user.id));
        await AsyncStorage.setItem("@user_name", String(data.user.name));
        await AsyncStorage.setItem("@user_email", String(data.user.email));

        dispatch(
          updateNotification(data.notifications)
        );
        await AsyncStorage.setItem("@notifications", JSON.stringify(data.notifications));
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        if (route.params && route.params.Navigate) {
          navigation.reset({
            index: 1,
            routes: [
              { name: 'Main' },
              { name: route.params.Navigate },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        }
      } else if (response.status === 203) {
        const accessToken = data.access_token;

        await AsyncStorage.setItem("@access_token", accessToken);
        await AsyncStorage.setItem("@user_id", String(data.user.id));
        await AsyncStorage.setItem("@user_name", String(data.user.name));
        await AsyncStorage.setItem("@user_email", String(data.user.email));

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        setUserId(data.user.id);

        openModal();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setError("There is something wrong. Please try again");
    }
    setLoading(false);
  };

  const updateCustomer = async () => {

    if (selectedCountryForNumber === null || selectedCountryForWhatsapp === null) {
      setModalError("Please select country for number and Whatsapp.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(UpdateCustomerInfoUrl, {
        number: number,
        whatsapp: whatsapp,
        user_id: userId,
      });

      if (response.status === 200) {
        if (route.params && route.params.Navigate) {
          navigation.reset({
            index: 1,
            routes: [
              { name: 'Main' },
              { name: route.params.Navigate },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setError("There is something wrong. Please try again");
    }
    closeModal();
    setLoading(false);
  };

  try {

    const unsubscribeOnTokenRefreshed = messaging().onTokenRefresh((fcmToken) => {
      // Save the FCM token to your server or user's device storage
      console.log('FCM Token:', fcmToken);
    });

    messaging()
      .getToken()
      .then(fcmToken => {
        setFcmToken(fcmToken);
      });
  } catch (error) {

  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    setError("");
    setNotValidAffiliate("");
    setLoading(true);
    if (!name) {
      setBadName(true);
      setLoading(false);
      return;
    }
    setBadName(false);

    if (!email) {
      setBadEmail(true);
      setLoading(false);
      return;
    } else if (!isValidEmail(email)) {
      setBadEmail(false);
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }
    setBadEmail(false);

    if (!password) {
      setBadPassword(true);
      setLoading(false);
      return;
    }
    setBadPassword(false);

    if (!confirmPassword) {
      setBadConfirmPassword(true);
      setLoading(false);
      return;
    }
    setBadConfirmPassword(false);

    if (password !== confirmPassword) {
      setNotValidPassword(true);
      setLoading(false);
      return;
    } else {
      setNotValidPassword(false);
    }

    if (selectedCountryForNumber === null || selectedCountryForWhatsapp === null) {
      setError("Please select country for number and Whatsapp.");
      setLoading(false);
      return;
    }

    if (!termsChecked) {
      setError("Please agree to the Terms & Conditions.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(SignupUrl, {
        name: name,
        email: email,
        password: password,
        affiliate: affiliate,
        fcmToken: fcmToken,
        number: number,
        whatsapp: whatsapp,
      });

      if (response.status === 200) {
        const userId = response.data.user.id;
        const userName = response.data.user.name;
        const userEmail = response.data.user.email;
        const accessToken = response.data.access_token;
        const affiliate_code = response.data.affiliate_code;

        // Store access token in AsyncStorage
        await AsyncStorage.setItem("@access_token", accessToken);
        await AsyncStorage.setItem("@user_id", String(userId));
        await AsyncStorage.setItem("@user_name", String(userName));
        await AsyncStorage.setItem("@user_email", String(userEmail));
        await AsyncStorage.setItem("@affiliate", String(affiliate_code));
        dispatch(
          updateAffiliate(response.data.affiliate_code)
        );
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        navigation.reset({
          index: 0,
          routes: [
            {
              name:
                route.params && route.params.Navigate
                  ? route.params.Navigate
                  : "Main",
            },
          ],
        });
      } else if (response.status === 201) {
        if (response.data.msg) {
          console.log(response.data.msg);

          setError(response.data.msg);
        } else if (response.data.errors.email) {
          setError(response.data.errors.email);
        }
        setNotValidAffiliate(response.data.errors.affiliate);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      //   setError(error);
    }
    setLoading(false);
  };

  if (loading) {
    return Splash();
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1 }}>
        <Image
          source={require("../images/logo.png")}
          style={{
            width: 60,
            height: 60,
            alignSelf: "center",
            marginTop: 40,
          }}
        />
        <Text
          style={{
            marginTop: 20,
            alignSelf: "center",
            fontSize: 24,
            fontWeight: 600,
            color: "#000",
          }}
        >
          Create New Account
        </Text>
        {error && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            {error}
          </Text>
        )}
        <CustomTextInput
          placeholder={"Enter Name"}
          icon={require("../images/user.png")}
          value={name}
          onChangeText={(txt) => {
            setName(txt);
          }}
        />
        {badName === true && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            Please Enter Name
          </Text>
        )}
        <CustomTextInput
          placeholder={"Enter Email"}
          icon={require("../images/mail.png")}
          value={email}
          onChangeText={(txt) => {
            setEmail(txt);
          }}
        />
        {badEmail === true && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            Please Enter Email
          </Text>
        )}
        <CustomTextInput
          placeholder={"Enter Password"}
          icon={require("../images/lock.png")}
          type={"password"}
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
          }}
        />
        {badPassword === true && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            Please Enter Password
          </Text>
        )}
        <CustomTextInput
          placeholder={"Enter Confirm Password"}
          icon={require("../images/lock.png")}
          type={"password"}
          value={confirmPassword}
          onChangeText={(txt) => {
            setConfirmPassword(txt);
          }}
        />
        {badConfirmPassword === true && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            Please Enter Confirm Password
          </Text>
        )}

        {notValidPassword === true && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            The password and confirm-password must match.
          </Text>
        )}
        <CustomTextInput
          value={number}
          onChangeText={(txt) => setNumber(txt)}
          placeholder={"Enter Phone Number"}
          keyboardType={"numeric"}
          onSelectCountry={handleSelectCountryForNumber} // Make sure to pass the correct function
          selectedCountry={selectedCountryForNumber}
          isNumber={true}
        />
        <CustomTextInput
          value={whatsapp}
          onChangeText={(txt) => setWhatsapp(txt)}
          placeholder={"Enter Whatsapp Number"}
          keyboardType={"numeric"}
          onSelectCountry={handleSelectCountryForWhatsapp} // Make sure to pass the correct function
          selectedCountry={selectedCountryForWhatsapp}
          isNumber={true}
        />
        <CustomTextInput
          placeholder={"Enter Affiliate Code (Optional)"}
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

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginLeft: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => setTermsChecked(!termsChecked)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#000",
              marginRight: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {termsChecked && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#000",
                  borderRadius: 3,
                }}
              />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: "#000" }}>
            I agree to the{" "}
            <Text
              style={{
                fontSize: 14,
                alignSelf: "center",
                marginTop: 5,
                color: "#00a1fc",
                textDecorationLine: "underline",
              }}
              onPress={() => {
                navigation.navigate("TermsCondition");
              }}
            >
              Terms and Conditions
            </Text>
            {" and "}
            <Text
              style={{
                fontSize: 14,
                alignSelf: "center",
                marginTop: 5,
                color: "#00a1fc",
                textDecorationLine: "underline",
              }}
              onPress={() => {
                navigation.navigate("PrivacyPolicy");
              }}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
        <CommonButton
          title={"Signup"}
          bgColor={"#000"}
          textColor={"#fff"}
          onPress={() => {
            handleSignup();
          }}
        />
        <CommonButton
          title={"Continue With Facebook"}
          bgColor={"#0064e0"}
          textColor={"#fff"}
          onPress={() => {
            signInWithFB();
          }}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            alignSelf: "center",
            marginTop: 20,
            marginBottom: 40,
            textDecorationLine: "underline",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          Already Have Account?
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={{ backgroundColor: "#FFF", padding: 20, borderRadius: 10, width: '100%' }}>
            {modalError && (
              <Text style={{ color: "red" }}>
                {modalError}
              </Text>
            )}
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Enter Additional Information</Text>
            <CustomTextInput
              value={number}
              onChangeText={(txt) => setNumber(txt)}
              placeholder={"Enter Phone Number"}
              keyboardType={"numeric"}
              onSelectCountry={handleSelectCountryForNumber} // Make sure to pass the correct function
              selectedCountry={selectedCountryForNumber}
              isNumber={true}
            />
            <CustomTextInput
              value={whatsapp}
              onChangeText={(txt) => setWhatsapp(txt)}
              placeholder={"Enter Whatsapp Number"}
              keyboardType={"numeric"}
              onSelectCountry={handleSelectCountryForWhatsapp} // Make sure to pass the correct function
              selectedCountry={selectedCountryForWhatsapp}
              isNumber={true}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  if (route.params && route.params.Navigate) {
                    navigation.reset({
                      index: 1,
                      routes: [
                        { name: 'Main' },
                        { name: route.params.Navigate },
                      ],
                    });
                  } else {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Main" }],
                    });
                  }
                }}
                style={{ padding: 10, backgroundColor: "#DDD", borderRadius: 5 }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={updateCustomer} style={{ padding: 10, backgroundColor: "#000", borderRadius: 5 }}>
                <Text style={{ color: "#FFF" }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Signup;
