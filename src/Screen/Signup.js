import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SignupUrl } from "../Config/Api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Splash from "../Screen/Splash";
import messaging from "@react-native-firebase/messaging";

const Signup = () => {
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
    if (name === "") {
      setBadName(true);
      setLoading(false);
      return;
    } else {
      setBadName(false);
      if (email === "") {
        setBadEmail(true);
        setLoading(false);
        return;
      } else {
        if (!isValidEmail(email)) {
          setLoading(false);
          setError("Enter a valid email address.");
          return;
        }
        setBadEmail(false);
        if (password === "") {
          setBadPassword(true);
          setLoading(false);
          return;
        } else {
          setBadPassword(false);
          if (confirmPassword === "") {
            setBadConfirmPassword(true);
            setLoading(false);
            return;
          } else {
            setBadConfirmPassword(false);
            if (password !== confirmPassword) {
              setNotValidPassword(true);
              setLoading(false);
              return;
            } else {
              setNotValidPassword(false);
            }
          }
        }
      }
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
      });

      if (response.status === 200) {
        const userId = response.data.user.id;
        const userName = response.data.user.name;
        const userEmail = response.data.user.email;
        const accessToken = response.data.access_token;

        // Store access token in AsyncStorage
        await AsyncStorage.setItem("@access_token", accessToken);
        await AsyncStorage.setItem("@user_id", String(userId));
        await AsyncStorage.setItem("@user_name", String(userName));
        await AsyncStorage.setItem("@user_email", String(userEmail));
        await AsyncStorage.setItem("@affiliate", String(affiliate));
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
        setError(response.data.errors.email);
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
    </ScrollView>
  );
};

export default Signup;
