import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
// import MapView, { Marker } from "react-native-maps";
import { useDispatch } from "react-redux";
import { addAddress } from "../redux/actions/Actions";
import { useNavigation } from "@react-navigation/native";
import { getStaffZoneUrl } from "../Config/Api";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function AddAddress() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [building, setBuilding] = useState("Burj Khalifa");
  const [villa, setVilla] = useState("84");
  const [street, setStreet] = useState("Souk Al Bahar Bridge");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("Mazaya Center");
  const [city, setCity] = useState("Dubai");
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState("");
  const [zones, setZones] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStaffZone();
  }, []);

  const getStaffZone = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getStaffZoneUrl}`);
      if (response.status === 200) {
        let data = response.data;
        setZones(data.staffZones);
        setLoading(false);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };
  const handleSaveAddress = () => {
    setError("");
    if (
      building !== "" &&
      villa !== "" &&
      street !== "" &&
      area !== "" &&
      landmark !== "" &&
      city !== ""
    ) {
      dispatch(
        addAddress({
          building: building,
          villa: villa,
          street: street,
          area: area,
          landmark: landmark,
          city: city,
        })
      );
      navigation.goBack();
    } else {
      setError("Fill up all filed.");
    }

    // Close the map modal
    // setMapModalVisible(false);
  };
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
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
          borderRadius:10
        }}
      >
        {zones && (
          <Picker
          selectedValue={area || ""}
          onValueChange={(itemValue, itemIndex) => {
            setArea(itemValue);
          }}
        >
          <Picker.Item label="Select Area" value="" />
          {zones.map((zone, index) => (
              <Picker.Item key={index.toString()} label={zone} value={zone}/>
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

      {/* <Modal
        visible={isMapModalVisible}
        animationType="slide"
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: selectedLocation ? selectedLocation.latitude : 37.78825,
              longitude: selectedLocation
                ? selectedLocation.longitude
                : -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation} title="Selected Location" />
            )}
          </MapView>

          <TouchableOpacity
            style={{ backgroundColor: "#fff", padding: 10 }}
            onPress={handleSaveAddress}
          >
            <Text>Save Address</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </View>
  );
}
