import { View, Text, Image } from "react-native";
import React from "react";

const Splash = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../images/logo.png")}
        style={{
          width: 100,
          height: 100,
          resizeMode: "center",
        }}
      />
      <Text style={{ alignItems:"center", fontWeight:800, marginTop:20, fontSize:24, color:"#000"}}>LipsLay</Text>
    </View>
  );
};

export default Splash;
