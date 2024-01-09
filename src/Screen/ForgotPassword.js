import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation } from "@react-navigation/native";
import { PasswordResetUrl } from "../Config/Api";
import axios from "axios";
import Splash from "./Splash";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [badEmail, setBadEmail] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    if (email === "") {
      setBadEmail(true);
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setLoading(false);
      setError("Enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(PasswordResetUrl, {
        email: email,
      });
      if (response.status === 200) {
        setMsg(response.data.msg);
      } else if(response.status === 201) {
        setError(response.data.msg);
      } else {
        setError("Password Reset failed. Please try again.");
      }
    } catch (error) {
    }
    setLoading(false);
    setTimeout(() => {
      setMsg("");
      setError("");
    }, 3000);
  };

  if (loading) {
    return Splash();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC", alignContent: "center", justifyContent: "center" }}>
      <Text
        style={{
          marginTop: 20,
          alignSelf: "center",
          fontSize: 24,
          fontWeight: "600",
          color: "#000",
        }}
      >
        Reset Password
      </Text>

      {error && (
        <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
          {error}
        </Text>
      )}
      {msg && (
        <Text style={{ marginTop: 10, marginLeft: 40, color: "green" }}>
          {msg}
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

      <CommonButton
        title={"Send Password Reset"}
        bgColor={"#000"}
        textColor={"#fff"}
        onPress={() => {
          handleLogin();
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
          navigation.navigate('Login');
        }}
      >
        <Text style={{ alignSelf: "center" }}>Login</Text>
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
  );
};

export default ForgotPassword;
