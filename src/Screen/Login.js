import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation } from "@react-navigation/native";
import { LoginUrl } from "../Config/Api";
import axios from "axios";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badEmail, setBadEmail] = useState(false);
  const [badPassword, setBadPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    if (email === "") {
      setBadEmail(true);
      setLoading(false);
      return;
    } else {
      setBadEmail(false);
      if (password === "") {
        setBadPassword(true);
        setLoading(false);
        return;
      } else {
        setBadPassword(false);
      }
    }
    console.log(email);
    console.log(password);
    try {
      const response = await axios.post(LoginUrl, {
        username: email,
        password: password,
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
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        navigation.navigate('Home');
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setError("These credentials do not match our records.");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../images/logo.png")}
        style={{
          width: 60,
          height: 60,
          alignSelf: "center",
          marginTop: 120,
        }}
      />
      <Text
        style={{
          marginTop: 20,
          alignSelf: "center",
          fontSize: 24,
          fontWeight: "600",
          color: "#000",
        }}
      >
        Login
      </Text>

      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {error && (
        <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
          {error}
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
      <CommonButton
        title={"Login"}
        bgColor={"#000"}
        textColor={"#fff"}
        onPress={() => {
          handleLogin();
        }}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          alignSelf: "center",
          marginTop: 20,
          textDecorationLine: "underline",
        }}
        onPress={() => {
          navigation.navigate("Signup");
        }}
      >
        Create New Account?
      </Text>
    </View>
  );
};

export default Login;
