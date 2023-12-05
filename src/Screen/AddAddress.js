import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation } from "@react-navigation/native";
import { getStaffZoneUrl } from "../Config/Api";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { addAddress } from "../redux/actions/Actions";
import Splash from "../Screen/Splash";

export default function AddAddress() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [building, setBuilding] = useState("");
  const [villa, setVilla] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaffZone();
  }, []);

  const getStaffZone = async () => {
    try {
      const response = await axios.get(getStaffZoneUrl);
      if (response.status === 200) {
        const data = response.data;
        setZones(data.staffZones || []);
        setLoading(false);
      } else {
        setError("Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    setError("");

    if (
      building.trim() !== "" &&
      villa.trim() !== "" &&
      street.trim() !== "" &&
      area.trim() !== "" &&
      landmark.trim() !== "" &&
      city.trim() !== ""
    ) {
      const addressInfo = {
        building: building,
        villa: villa,
        street: street,
        area: area,
        landmark: landmark,
        city: city,
      };

      const jsonString = await AsyncStorage.getItem("@addressData");
      const addressData = JSON.parse(jsonString) || [];

      await AsyncStorage.setItem(
        "@addressData",
        JSON.stringify([...addressData, addressInfo])
      );
      dispatch(addAddress(addressInfo));
      navigation.goBack();
    } else {
      setError("Fill up all fields.");
    }
  };

  if (loading) {
    return Splash();
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1}}>
        {error && (
          <Text style={{ marginTop: 10, marginLeft: 40, color: "red" }}>
            {error}
          </Text>
        )}
        <CustomTextInput
          placeholder={"Enter Building Name"}
          icon={require("../images/building.png")}
          value={building}
          onChangeText={(txt) => setBuilding(txt)}
        />
        <CustomTextInput
          placeholder={"Enter Villa"}
          icon={require("../images/villa.png")}
          value={villa}
          onChangeText={(txt) => setVilla(txt)}
        />
        <CustomTextInput
          placeholder={"Enter Street"}
          icon={require("../images/street.png")}
          value={street}
          onChangeText={(txt) => setStreet(txt)}
        />
        <CustomTextInput
          placeholder={"Enter Landmark"}
          icon={require("../images/landmark.png")}
          value={landmark}
          onChangeText={(txt) => setLandmark(txt)}
        />
        <CustomTextInput
          placeholder={"Enter City Name"}
          icon={require("../images/city.png")}
          value={city}
          onChangeText={(txt) => setCity(txt)}
        />
        <View
          style={{
            height: 50,
            width: "85%",
            alignSelf: "center",
            borderWidth: 0.5,
            margin: 20,
            borderColor: "#8e8e8e",
            borderRadius: 10,
          }}
        >
          {zones.length > 0 && (
            <Picker
              selectedValue={area}
              onValueChange={(itemValue, itemIndex) => setArea(itemValue)}
            >
              <Picker.Item label="Select Area" value="" />
              {zones.map((zone, index) => (
                <Picker.Item key={index.toString()} label={zone} value={zone} />
              ))}
            </Picker>
          )}
        </View>

        <CommonButton
          title={"Save"}
          bgColor={"#000"}
          textColor={"#fff"}
          onPress={() => handleSaveAddress()}
        />
      </View>
    </ScrollView>
  );
}
