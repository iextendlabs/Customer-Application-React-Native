import { Alert, View, Image, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import MainContainer from "./src/MainContainer";
import store from "./src/redux/store/Store";
import NetInfo from "@react-native-community/netinfo";
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

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

  useEffect(() => {
    fcmMessaging();
  }, []);

  const fcmMessaging = async () => {
    try {
      if (requestUserPermission()) {
        messaging()
          .getToken()
          .then((token) => {
            console.log(token);
          });
      } else {
        console.log("Failed token status", authStatus);
      }
      messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
          if (remoteMessage) {
            console.log(
              "Notification caused app to open from quit state:",
              remoteMessage.notification
            );
          }
        });

      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage.notification
        );
      });

      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
      });

      messaging().onMessage(async (remoteMessage) => {
        const { body, title } = remoteMessage.notification;
        Alert.alert(`${title}`, `${body}`);
      });
    } catch (error) { }
  };

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <MainContainer />
      </View>
    </Provider>
  );
};

export default App;
