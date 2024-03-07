import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Dimensions, } from "react-native";
import CountryPicker from 'react-native-country-picker-modal';

const CustomTextInput = ({
  value,
  onChangeText,
  placeholder,
  icon,
  type,
  keyboardType,
  onClearPress,
  isSearch,
  label,
  onSelectCountry,
  selectedCountry,
  isNumber,
}) => {
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const { height, width } = Dimensions.get("window");

  return (
    <View style={label ? null : { marginTop: 10 }}>
      {label && (
        <Text
          style={{
            width: "85%",
            alignSelf: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          {label}:
        </Text>
      )}

      <View
        style={{
          width: "85%",
          height: 50,
          borderWidth: 0.5,
          borderRadius: 10,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        {isNumber && (
          <TouchableOpacity
            onPress={() => setCountryModalVisible(true)}
          >
            <CountryPicker
              withFlag
              withFilter
              withCallingCode
              withFlagButton
              onSelect={(country) => {
                onSelectCountry(country);
                setCountryModalVisible(false);
              }}
              countryCode={selectedCountry}
              visible={countryModalVisible}
            />
          </TouchableOpacity>
        )}
        {icon && (
          <Image source={icon} style={{ width: 24, height: 24, marginLeft: 10 }} />
        )}
        <TextInput
          value={value}
          onChangeText={(txt) => {
            onChangeText(txt);
          }}
          placeholder={placeholder}
          secureTextEntry={type ? true : false}
          style={{ marginLeft: 10, width: width/1.6 }}
          keyboardType={keyboardType ? keyboardType : "default"}
        />
        {isSearch && (
          <TouchableOpacity
            onPress={() => {
              onClearPress();
            }}
          >
            <Image
              source={require("../images/close.png")}
              style={{ width: 15, height: 15 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTextInput;
