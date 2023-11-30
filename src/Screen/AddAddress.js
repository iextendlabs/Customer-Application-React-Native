import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomTextInput from "../Common/CustomTextInput";
import CommonButton from "../Common/CommonButton";
// import MapView, { Marker } from "react-native-maps";
import { useDispatch } from "react-redux";
import { addAddress } from "../redux/actions/Actions";
import { useNavigation } from "@react-navigation/native";

export default function AddAddress() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [building, setBuilding] = useState("Burj Khalifa");
  const [villa, setVilla] = useState("84");
  const [street, setStreet] = useState("Souk Al Bahar Bridge");
  const [area, setArea] = useState("Downtown Dubai ");
  const [landmark, setLandmark] = useState("Mazaya Center");
  const [city, setCity] = useState("Dubai");
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState("");

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
        placeholder={"Enter Area"}
        icon={require("../images/area.png")}
        value={area}
        onChangeText={(txt) => setArea(txt)}
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
