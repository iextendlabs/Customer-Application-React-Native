import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Modal, TouchableOpacity } from "react-native";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
import { useNavigation } from "@react-navigation/native";
import { UpdateCustomerInfoUrl } from "../Config/Api";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, deleteAddress } from "../redux/actions/Actions";
import * as Location from "expo-location";

export default function Address() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [building, setBuilding] = useState("");
  const [villa, setVilla] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const address = useSelector((state) => state.address);
  const zones = useSelector((state) => state.zones);
  const [loading, setLoading] = useState(false);

  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (address && address.length > 0) {
      const addressData = address[0];
      setBuilding(addressData.building || "");
      setVilla(addressData.villa || "");
      setStreet(addressData.street || "");
      setDistrict(addressData.district || "");
      setArea(addressData.area || "");
      setLandmark(addressData.landmark || "");
      setCity(addressData.city || "");
      setLatitude(addressData.latitude || "");
      setLongitude(addressData.longitude || "");
    }
  }, [address]);

  const handleSaveAddress = async () => {
    setLoading(true);
    setError("");

    if (
      building.trim() !== "" &&
      villa.trim() !== "" &&
      street.trim() !== "" &&
      district.trim() !== "" &&
      area.trim() !== "" &&
      landmark.trim() !== "" &&
      city.trim() !== ""
    ) {
      const addressInfo = {
        building: building,
        villa: villa,
        street: street,
        area: area,
        district: district,
        landmark: landmark,
        city: city,
        latitude: latitude,
        longitude: longitude,
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
          district: district,
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
    setLoading(false);
  };

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLongitude(location.coords.longitude);
    setLatitude(location.coords.latitude);
  };

  const reverseGeocode = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBJ0A4bxdhZ4FWomyO-tSEa4Qn0KY1jpT8`
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const addressInfo = response.data.results[0];

        const building =
          addressInfo.address_components.find((component) =>
            component.types.includes("premise")
          )?.long_name || "";
        const villa =
          addressInfo.address_components.find((component) =>
            component.types.includes("subpremise")
          )?.long_name || "";
        const street =
          addressInfo.address_components.find((component) =>
            component.types.includes("route")
          )?.long_name || "";
        const area =
          addressInfo.address_components.find((component) =>
            component.types.includes("sublocality")
          )?.long_name || "";
        const landmark = "";
        const city =
          addressInfo.address_components.find((component) =>
            component.types.includes("locality")
          )?.long_name || "";

        setBuilding(building);
        setVilla(villa);
        setStreet(street);
        setArea(area);
        setDistrict(area);
        setLandmark(landmark);
        setCity(city);
      } else {
        setError("No address found. Please Fill up Form!");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setError("Error fetching address. Please Fill up Form!");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1 }}>
        <View>
          <CommonButton
            title={"Use Current Location"}
            bgColor={"#fd245f"}
            textColor={"#fff"}
            onPress={() => reverseGeocode()}
          />
        </View>
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
        <CustomTextInput
          placeholder={"Enter District Name"}
          icon={require("../images/building.png")}
          value={district}
          onChangeText={(txt) => setDistrict(txt)}
          label={"District"}
        />
        <Text style={{ width: "85%", alignSelf: "center", padding: 10 }}>
          Zone:
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
