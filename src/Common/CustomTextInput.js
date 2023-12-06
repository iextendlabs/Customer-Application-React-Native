import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";

const CustomTextInput = ({
  value,
  onChangeText,
  placeholder,
  icon,
  type,
  keyboardType,
  onClearPress,
  isSearch,
  addressLabel,
}) => {
  return (
    <View style={addressLabel ? null : { marginTop: 30 }}>
      {addressLabel && (
        <Text
          style={{
            width: "85%",
            alignSelf: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          {addressLabel}:
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
        <Image source={icon} style={{ width: 24, height: 24 }} />
        <TextInput
          clearButtonMode={"always"}
          value={value}
          onChangeText={(txt) => {
            onChangeText(txt);
          }}
          placeholder={placeholder}
          secureTextEntry={type ? true : false}
          style={{ marginLeft: 10, width: 220 }}
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
