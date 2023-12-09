import { Alert, TouchableOpacity, View, Image, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import MainContainer from "./src/MainContainer";
import store from "./src/redux/store/Store";
import NetInfo from "@react-native-community/netinfo";
// import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log("Authorization status:", authStatus);
  //   }
  // };

  // const fcmMessaging = async () => {
  //   try {
  //     if (requestUserPermission()) {
  //       messaging()
  //         .getToken()
  //         .then((token) => {
  //           console.log(token);
  //         });
  //     } else {
  //       console.log("Failed token status", authStatus);
  //     }

  //     messaging()
  //       .getInitialNotification()
  //       .then(async (remoteMessage) => {
  //         if (remoteMessage) {
  //           console.log(
  //             "Notification caused app to open from quit state:",
  //             remoteMessage.notification
  //           );
  //         }
  //       });

  //     messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //       console.log(
  //         "Notification caused app to open from background state:",
  //         remoteMessage.notification
  //       );
  //     });

  //     // Register background handler
  //     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //       console.log("Message handled in the background!", remoteMessage);
  //     });

  //     messaging().onMessage(async (remoteMessage) => {
  //       const { body, title } = remoteMessage.notification;
  //       Alert.alert(`${title}`, `${body}`);
  //     });
  //   } catch (error) {}
  // };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // fcmMessaging();
    return () => {
      unsubscribe();
    };
  }, []);
  const showConnectionAlert = () => {
    Alert.alert(
      "No Internet Connection",
      "Please check your internet connection and try again.",
      [{ text: "OK" }],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (!isConnected) {
      showConnectionAlert();
    }
  }, [isConnected]);

  const openWhatsAppMessage = async () => {
    try {
      const whatsappNumber = await AsyncStorage.getItem("@whatsappNumber");
      const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}`;

      Linking.canOpenURL(whatsappUrl)
        .then((supported) => {
          if (!supported) {
            console.log("WhatsApp is not installed on the device");
          } else {
            return Linking.openURL(whatsappUrl);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } catch {}
  };

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <MainContainer />
        <TouchableOpacity
          onPress={openWhatsAppMessage}
          style={{ position: "absolute", bottom: 80, right: 20 }}
        >
          <Image
            source={require("./src/images/whatsapp-chat.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
      </View>
    </Provider>
  );
};

export default App;
