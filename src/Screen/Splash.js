import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }, 1000);
  }, []);

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
