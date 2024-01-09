import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  addPersonalInformation,
  deletePersonalInformation,
} from "../redux/actions/Actions";
import { UpdateCustomerInfoUrl } from "../Config/Api";
import axios from "axios";

export default function PersonalInformation() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [badPassword, setBadPassword] = useState(false);
  const [badConfirmPassword, setBadConfirmPassword] = useState(false);
  const [notValidPassword, setNotValidPassword] = useState(false);

  const personalInformationData = useSelector(
    (state) => state.personalInformation
  );

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (personalInformationData && personalInformationData.length > 0) {
      const info = personalInformationData[0];
      setName(info.name || "");
      setEmail(info.email || "");
      setNumber(info.number || "");
      setWhatsapp(info.whatsapp || "");
      setSelectedGender(info.gender || ""); // Set the selected gender from the saved data
    }
  }, [personalInformationData]);

  const getData = async () => {
    try {
      const storedName = await AsyncStorage.getItem("@user_name");
      const storedEmail = await AsyncStorage.getItem("@user_email");
      setUserId(await AsyncStorage.getItem("@user_id"));

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

  const handleSave = async () => {
    setError("");
    setBadPassword(false);
    setBadConfirmPassword(false);
    setNotValidPassword(false);
    if (
      name.trim() !== "" &&
      email.trim() !== "" &&
      number.trim() !== "" &&
      whatsapp.trim() !== "" &&
      selectedGender.trim() !== ""
    ) {
      if (selectedGender.trim() == "Male") {
        setError("Sorry, No Male Services Listed in Our App.");
        return;
      }
      if (!isValidEmail(email)) {
        setError("Enter a valid email address.");
        return;
      }

      if (password !== "" || confirmPassword !== "") {
        if (password === "") {
          setBadPassword(true);
          return;
        }

        if (confirmPassword === "") {
          setBadConfirmPassword(true);
          return;
        }

        if (password !== confirmPassword) {

          setNotValidPassword(true);
          return;
        }
      }

      const personalInfo = {
        name: name,
        email: email,
        number: number,
        whatsapp: whatsapp,
        gender: selectedGender,
      };

      await AsyncStorage.removeItem("@personalInformation");

      await AsyncStorage.setItem(
        "@personalInformation",
        JSON.stringify(personalInfo)
      );

      if (personalInformationData && personalInformationData.length > 0) {
        dispatch(deletePersonalInformation(0));
        dispatch(addPersonalInformation(personalInfo));
      } else {
        dispatch(addPersonalInformation(personalInfo));
      }

      try {
        const response = await axios.post(UpdateCustomerInfoUrl, {
          number: number,
          whatsapp: whatsapp,
          gender: selectedGender,
          user_id: userId,
          password: password,
        });
        if (response.status === 200) {
          console.log(response.data.msg);
        } else {
          setError("Please try again.");
        }
      } catch (error) { }

      navigation.goBack();
    } else {
      setError("Fill up all fields.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFCACC" }}>
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
          label={'Name'}
        />
        <CustomTextInput
          placeholder={"Enter Email"}
          icon={require("../images/mail.png")}
          value={email}
          onChangeText={(txt) => setEmail(txt)}
          keyboardType={"email-address"}
          label={'Email'}
        />
        <CustomTextInput
          placeholder={"Enter Phone Number"}
          icon={require("../images/phone.png")}
          value={number}
          onChangeText={(txt) => setNumber(txt)}
          keyboardType={"numeric"}
          label={'Phone Number'}
        />
        <CustomTextInput
          placeholder={"Enter Whatsapp Number"}
          icon={require("../images/whatsapp.png")}
          value={whatsapp}
          onChangeText={(txt) => setWhatsapp(txt)}
          keyboardType={"numeric"}
          label={'Whatsapp Number'}
        />

        {userId && (
          <>
            <CustomTextInput
              placeholder={"Enter Password"}
              icon={require("../images/lock.png")}
              type={"password"}
              value={password}
              onChangeText={(txt) => {
                setPassword(txt);
              }}
              label={'Change Password'}
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
          </>
        )}

        <View style={{ flexDirection: "row", marginLeft: 40, marginTop: 30 }}>
          <Text style={{ marginRight: 20, marginTop: 5 }}>Gender:</Text>
          <TouchableOpacity
            onPress={() => setSelectedGender("Male")}
            style={[
              styles.genderOption,
              selectedGender === "Male" && styles.selectedGender,
            ]}
          >
            <Image
              source={require("../images/male.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ marginLeft: 5 }}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedGender("Female")}
            style={[
              styles.genderOption,
              selectedGender === "Female" && styles.selectedGender,
            ]}
          >
            <Image
              source={require("../images/female.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ marginLeft: 5 }}>Female</Text>
          </TouchableOpacity>
        </View>
        <CommonButton
          title={"Save"}
          bgColor="#000"
          textColor="#fff"
          onPress={() => handleSave()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedGender: {
    backgroundColor: "#ff5d89",
    borderRadius: 5,
    padding: 5,
  },
});
