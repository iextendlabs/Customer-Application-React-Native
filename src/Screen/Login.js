import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LoginUrl, signInWithFBUrl } from "../Config/Api";
import axios from "axios";
import { useEffect } from "react";
import Splash from "../Screen/Splash";
import { useDispatch } from "react-redux";
import { addPersonalInformation, addAddress, updateNotification, clearAddress, clearPersonalInformation } from "../redux/actions/Actions";
import { BackHandler } from "react-native";
// import messaging from "@react-native-firebase/messaging";
// import { getAuth, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
// import { onAuthStateChanged } from 'firebase/auth';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import { auth } from '../../config';

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badEmail, setBadEmail] = useState(false);
  const [badPassword, setBadPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

  // const signInWithFB = async () => {
  //   setLoading(true);
  //   try {
  //     let result;
  //     try {
  //       LoginManager.setLoginBehavior('NATIVE_ONLY');
  //       result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  //     } catch (error) {
  //       LoginManager.setLoginBehavior('WEB_ONLY');
  //       result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  //     }

  //     if (result.isCancelled) {
  //       setLoading(false);
  //       console.log('Login canceled');
  //       return;
  //     }

  //     const data = await AccessToken.getCurrentAccessToken();

  //     if (!data) {
  //       setLoading(false);
  //       return;
  //     }
  //     const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

  //     const response = await signInWithCredential(auth, facebookCredential);

  //     if (response) {
  //       saveLoginWithFB(response['_tokenResponse']['fullName'], response['_tokenResponse']['email']);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //   }
  // };

  // const saveLoginWithFB = async (name, email) => {
  //   setError("");
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(signInWithFBUrl, {
  //       name: name,
  //       email: email,
  //       fcmToken: fcmToken,
  //     });
  //     const data = response.data;
  //     console.log(data);
  //     if (response.status === 200) {
  //       if (data.user_info !== null) {
  //         dispatch(clearAddress());
  //         dispatch(clearPersonalInformation());
  //         const addressInfo = {
  //           building: data.user_info.buildingName || "",
  //           villa: data.user_info.flatVilla || "",
  //           street: data.user_info.street || "",
  //           area: data.user_info.area || "",
  //           landmark: data.user_info.landmark || "",
  //           city: data.user_info.city || "",
  //           district: data.user_info.district || "",
  //         };

  //         const personalInfo = {
  //           name: data.user.name,
  //           email: data.user.email,
  //           number: data.user_info.number || "",
  //           whatsapp: data.user_info.whatsapp || "",
  //           gender: data.user_info.gender || "",
  //         };

  //         await AsyncStorage.setItem(
  //           "@addressData",
  //           JSON.stringify(addressInfo)
  //         );
  //         await AsyncStorage.setItem(
  //           "@personalInformation",
  //           JSON.stringify(personalInfo)
  //         );
  //         dispatch(addPersonalInformation(personalInfo));
  //         dispatch(addAddress(addressInfo));
  //       }

  //       const accessToken = data.access_token;

  //       await AsyncStorage.setItem("@access_token", accessToken);
  //       await AsyncStorage.setItem("@user_id", String(data.user.id));
  //       await AsyncStorage.setItem("@user_name", String(data.user.name));
  //       await AsyncStorage.setItem("@user_email", String(data.user.email));

  //       dispatch(
  //         updateNotification(data.notifications)
  //       );
  //       await AsyncStorage.setItem("@notifications", JSON.stringify(data.notifications));
  //       const headers = {
  //         Authorization: `Bearer ${accessToken}`,
  //       };

  //       if (route.params && route.params.Navigate) {
  //         navigation.reset({
  //           index: 1,
  //           routes: [
  //             { name: 'Main' },
  //             { name: route.params.Navigate },
  //           ],
  //         });
  //       } else {
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: "Main" }],
  //         });
  //       }
  //     } else if (response.status === 203) {
  //       const accessToken = data.access_token;

  //       await AsyncStorage.setItem("@access_token", accessToken);
  //       await AsyncStorage.setItem("@user_id", String(data.user.id));
  //       await AsyncStorage.setItem("@user_name", String(data.user.name));
  //       await AsyncStorage.setItem("@user_email", String(data.user.email));

  //       const headers = {
  //         Authorization: `Bearer ${accessToken}`,
  //       };

  //       if (route.params && route.params.Navigate) {
  //         navigation.reset({
  //           index: 1,
  //           routes: [
  //             { name: 'Main' },
  //             { name: route.params.Navigate },
  //           ],
  //         });
  //       } else {
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: "Main" }],
  //         });
  //       }
  //     } else {
  //       setError("Login failed. Please try again.");
  //     }
  //   } catch (error) {
  //     setError("There is something wrong. Please try again");
  //   }
  //   setLoading(false);
  // };
  useEffect(() => {
    if (route.params && route.params.back) {
      const handleBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }

    return () => { };
  }, [navigation]);

  useEffect(() => {
    if (route.params && route.params.msg) {
      console.log(route.params.msg);
      setMessage(route.params.msg);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [navigation]);

  // try {

  //   const unsubscribeOnTokenRefreshed = messaging().onTokenRefresh((fcmToken) => {
  //     // Save the FCM token to your server or user's device storage
  //     console.log('FCM Token:', fcmToken);
  //   });

  //   messaging()
  //     .getToken()
  //     .then(fcmToken => {
  //       setFcmToken(fcmToken);
  //     });
  // } catch (error) {

  // }

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

    try {
      const response = await axios.post(LoginUrl, {
        username: email,
        password: password,
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

        const userId = data.user.id;
        const userName = data.user.name;
        const userEmail = data.user.email;
        const accessToken = data.access_token;

        await AsyncStorage.setItem("@access_token", accessToken);
        await AsyncStorage.setItem("@user_id", String(userId));
        await AsyncStorage.setItem("@user_name", String(userName));
        await AsyncStorage.setItem("@user_email", String(userEmail));

        dispatch(
          updateNotification(data.notifications)
        );
        await AsyncStorage.setItem("@notifications", JSON.stringify(data.notifications));
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        if (route.params && route.params.Navigate) {
          navigation.reset({
            index: 1, // Set the index based on the position of the route you want to set
            routes: [
              { name: 'Main' },  // Replace with the route you want to set in the history
              { name: route.params.Navigate },   // Home screen or any other screen you want to navigate to
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
      setError("These credentials do not match our records.");
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

        {error && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            {error}
          </Text>
        )}

        {message && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "green" }}>
            {message}
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

        {/* <CommonButton
          title={"Login With Facebook"}
          bgColor={"#0064e0"}
          textColor={"#fff"}
          onPress={() => {
            signInWithFB();
          }}
        /> */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            alignSelf: "center",
            marginTop: 20,
            textDecorationLine: "underline",
          }}
          onPress={() => {
            navigation.navigate("Signup", {
              Navigate:
                route.params && route.params.Navigate
                  ? route.params.Navigate
                  : "Main",
            });
          }}
        >
          Create New Account?
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            alignSelf: "center",
            marginTop: 20,
            textDecorationLine: "underline",
          }}
          onPress={() => {
            navigation.navigate("ForgotPassword");
          }}
        >
          Forgot Your Password?
        </Text>
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
    </ScrollView>
  );
};

export default Login;
