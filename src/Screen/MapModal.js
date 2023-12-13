import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapModal({ onSelectLocation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSaveLocation = () => {
    onSelectLocation(selectedLocation);
  };

  return (
    <Modal
      visible={true} // Set this to 'true' when the modal should be visible
      animationType="slide"
      transparent={true}
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "#fdedee",
            borderRadius: 10,
            padding: 20,
            width: "90%",
            // The following line ensures the modal content is centered vertically
            alignSelf: "center",
          }}
        >
          <MapView
            style={{ height: 400, borderRadius: 10 }}
            initialRegion={{
              latitude: 25.276987,
              longitude: 55.296249,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(event) =>
              setSelectedLocation(event.nativeEvent.coordinate)
            }
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Selected Location"
                description="This is the selected location"
              />
            )}
          </MapView>
          <TouchableOpacity
            onPress={handleSaveLocation}
            style={{
              marginTop: 10,
              backgroundColor: "#000",
              padding: 10,
              borderRadius: 5,
              alignSelf: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Save Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
