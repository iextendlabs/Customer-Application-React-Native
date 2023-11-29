import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 1000);
  }, []);

  const getData = async () => {
     const user = await AsyncStorage.getItem("@user_id");
      if(user === '' || user === null){
        navigation.navigate('Login');
      }else{
        navigation.navigate('Home');
      }
  }
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
