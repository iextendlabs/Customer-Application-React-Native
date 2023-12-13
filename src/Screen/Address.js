import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Modal, TouchableOpacity } from "react-native";
// import MapModal from "./MapModal"; // Create a MapModal component
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation } from "@react-navigation/native";
import { UpdateCustomerInfoUrl } from "../Config/Api";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, deleteAddress } from "../redux/actions/Actions";
// import * as Location from 'expo-location';

export default function Address() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [building, setBuilding] = useState("");
  const [villa, setVilla] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const address = useSelector((state) => state.address);
  const zones = useSelector((state) => state.zones);
  const [loading, setLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // useEffect(() => {
  //   getPermissions();
  // }, []);

  useEffect(() => {
    if (address && address.length > 0) {
      const addressData = address[0];
      setBuilding(addressData.building || "");
      setVilla(addressData.villa || "");
      setStreet(addressData.street || "");
      setArea(addressData.area || "");
      setLandmark(addressData.landmark || "");
      setCity(addressData.city || "");
    }
  }, [address]);

  const handleSaveAddress = async () => {
    setLoading(true);
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
      await AsyncStorage.removeItem("@addressData");

      await AsyncStorage.setItem("@addressData", JSON.stringify(addressInfo));

      if (address && address.length > 0) {
        dispatch(deleteAddress(0));
        dispatch(addAddress(addressInfo));
      } else {
        dispatch(addAddress(addressInfo));
      }

      const user_id = await AsyncStorage.getItem("@user_id");

      try {
        const response = await axios.post(UpdateCustomerInfoUrl, {
          buildingName: building,
          flatVilla: villa,
          street: street,
          area: area,
          landmark: landmark,
          city: city,
          user_id: user_id,
        });
        if (response.status === 200) {
          console.log(response.data.msg);
        } else {
          setError("Please try again.");
        }
      } catch (error) {}

      navigation.goBack();
      setLoading(false);
    } else {
      setLoading(false);
      setError("Fill up all fields.");
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapModalVisible(false);
  };

  // const getPermissions = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     setErrorMsg("Permission to access location was denied");
  //     return;
  //   }

  //   let location = await Location.getCurrentPositionAsync({});
  //   console.log("Location:");
  //   console.log(location);
  //   setLocation(location);
  // };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1 }}>
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
          label={"Building"}
        />
        <CustomTextInput
          placeholder={"Enter Villa"}
          icon={require("../images/villa.png")}
          value={villa}
          onChangeText={(txt) => setVilla(txt)}
          label={"Villa"}
        />
        <CustomTextInput
          placeholder={"Enter Street"}
          icon={require("../images/street.png")}
          value={street}
          onChangeText={(txt) => setStreet(txt)}
          label={"Street"}
        />
        <CustomTextInput
          placeholder={"Enter Landmark"}
          icon={require("../images/landmark.png")}
          value={landmark}
          onChangeText={(txt) => setLandmark(txt)}
          label={"Landmark"}
        />
        <CustomTextInput
          placeholder={"Enter City Name"}
          icon={require("../images/city.png")}
          value={city}
          onChangeText={(txt) => setCity(txt)}
          label={"City"}
        />
        <Text style={{ width: "85%", alignSelf: "center", padding: 10 }}>
          Area:
        </Text>
        <View
          style={{
            height: 50,
            width: "85%",
            alignSelf: "center",
            borderWidth: 0.5,
            borderColor: "#8e8e8e",
            borderRadius: 10,
          }}
        >
          {zones[0].length > 0 && (
            <Picker
              selectedValue={area}
              onValueChange={(itemValue, itemIndex) => setArea(itemValue)}
            >
              <Picker.Item label="Select Area" value="" />
              {zones[0].map((zone, index) => (
                <Picker.Item key={index.toString()} label={zone} value={zone} />
              ))}
            </Picker>
          )}
        </View>
        {/* <View style={{ marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setMapModalVisible(true)}>
            <Text style={{ color: "#000", fontSize: 18, alignSelf: "center" }}>
              Select Location on Map
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={mapModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setMapModalVisible(false)}
        >
          <MapModal onSelectLocation={handleLocationSelect} />
        </Modal> */}
        <View style={{ marginBottom: 40 }}>
          <CommonButton
            title={"Save"}
            bgColor={"#000"}
            textColor={"#fff"}
            onPress={() => handleSaveAddress()}
          />
        </View>
      </View>
    </ScrollView>
  );
}
