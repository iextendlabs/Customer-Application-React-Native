import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useDispatch, useSelector } from "react-redux";
import {
  addPersonalInformation,
  deletePersonalInformation,
} from "../redux/actions/Actions";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PersonalInformation() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");

  const personalInformationData = useSelector(
    (state) => state.personalInformation
  );

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    // If personalInformationData is available, set values from it
    if (personalInformationData && personalInformationData.length > 0) {
      const info = personalInformationData[0];
      setName(info.name || "");
      setEmail(info.email || "");
      setNumber(info.number || "");
      setWhatsapp(info.whatsapp || "");
    }
  }, [personalInformationData]);
  const getData = async () => {
    try {
      const storedName = await AsyncStorage.getItem("@user_name");
      const storedEmail = await AsyncStorage.getItem("@user_email");
      if (
        !personalInformationData ||
        (personalInformationData && personalInformationData.length === 0)
      ) {
        setName(storedName || "");
        setEmail(storedEmail || "");
      }
    } catch (error) {
      console.error("Error reading data from AsyncStorage:", error);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    setError("");
    if (
      name.trim() !== "" &&
      email.trim() !== "" &&
      number.trim() !== "" &&
      whatsapp.trim() !== ""
    ) {
      if (!isValidEmail(email)) {
        setError("Enter a valid email address.");
        return;
      }

      const personalInfo = {
        name: name,
        email: email,
        number: number,
        whatsapp: whatsapp,
      };

      if (personalInformationData && personalInformationData.length > 0) {
        dispatch(deletePersonalInformation(0));
        dispatch(addPersonalInformation(personalInfo));
      } else {
        dispatch(addPersonalInformation(personalInfo));
      }

      navigation.goBack();
    } else {
      setError("Fill up all fields.");
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {error !== "" && (
        <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
          {error}
        </Text>
      )}
      <CustomTextInput
        placeholder={"Enter Name"}
        icon={require("../images/name.png")}
        value={name}
        onChangeText={(txt) => setName(txt)}
      />
      <CustomTextInput
        placeholder={"Enter Email"}
        icon={require("../images/mail.png")}
        value={email}
        onChangeText={(txt) => setEmail(txt)}
        keyboardType="email-address"
      />
      <CustomTextInput
        placeholder={"Enter Phone Number"}
        icon={require("../images/phone.png")}
        value={number}
        onChangeText={(txt) => setNumber(txt)}
        keyboardType="numeric"
      />
      <CustomTextInput
        placeholder={"Enter Whatsapp Number"}
        icon={require("../images/whatsapp.png")}
        value={whatsapp}
        onChangeText={(txt) => setWhatsapp(txt)}
        keyboardType="numeric"
      />
      <CommonButton
        title={personalInformationData.length > 0 ? "Update" : "Save"}
        bgColor="#000"
        textColor="#fff"
        onPress={() => handleSave()}
      />
    </View>
  );
}
