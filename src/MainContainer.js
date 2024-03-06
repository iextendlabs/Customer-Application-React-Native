import { StyleSheet, Alert, Linking } from 'react-native';
import React, { useEffect } from 'react';
import AppNavigator from './AppNavigator';
// import messaging from '@react-native-firebase/messaging';
import { NotificationUrl } from "./Config/Api";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { updateNotification } from './redux/actions/Actions';
// import * as Notifications from 'expo-notifications';

export default function MainContainer() {
  const dispatch = useDispatch();
  useEffect(() => {
    // checkNotificationPermission();
    // fcmMessaging();
    getNotification();
  }, []);

  // const checkNotificationPermission = async () => {
  //   try {
  //     const { status } = await Notifications.getPermissionsAsync();

  //     if (status !== 'granted') {
  //       const { status: newStatus } = await Notifications.requestPermissionsAsync();

  //       if (newStatus !== 'granted') {
  //         console.log('Notification permission denied');
  //         Alert.alert(
  //           'Notification Permission Required',
  //           'To receive notifications, please enable notification permissions in your device settings.',
  //           [
  //             {
  //               text: 'OK',
  //               onPress: () => {
  //                 // Open device settings
  //                 openSettings();
  //               },
  //             },
  //           ]
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error checking notification permission:', error);
  //   }
  // };

  // const openSettings = () => {
  //   Linking.openSettings();
  // };

  const saveToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  const getNotification = async () => {
    const user = await AsyncStorage.getItem("@user_id");
    try {
      const response = await axios.get(
        `${NotificationUrl}user_id=${user}`
      );
      if (response.status === 200) {
        let data = response.data.notifications;
        dispatch(
          updateNotification(data)
        );
        saveToAsyncStorage("@notifications", data);
      } else {
        setError("Please try again.");
      }
    } catch (error) {
    }
  };

  // const fcmMessaging = async () => {
  //   try {
  //     const authStatus = await requestUserPermission();

  //     if (authStatus) {
  //       messaging()
  //         .getToken()
  //         .then((token) => {
  //           console.log(token);
  //         });

  //       messaging().subscribeToTopic('lipslay');
  //       messaging()
  //         .getInitialNotification()
  //         .then(async (remoteMessage) => {
  //           if (remoteMessage) {
  //             console.log(
  //               'Notification caused app to open from quit state:',
  //               remoteMessage.notification
  //             );
  //           }
  //         });

  //       messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //         console.log(
  //           'Notification caused app to open from background state:',
  //           remoteMessage.notification
  //         );
  //         getNotification();
  //       });

  //       messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //         console.log('Message handled in the background!', remoteMessage);
  //         getNotification();
  //       });

  //       messaging().onMessage(async (remoteMessage) => {
  //         const { body, title } = remoteMessage.notification;
  //         Alert.alert(`${title}`, `${body}`);
  //         getNotification();

  //       });
  //     } else {
  //       console.log('Failed token status', authStatus);
  //     }
  //   } catch (error) {
  //     console.error('Error in FCM setup:', error);
  //   }
  // };

  // const requestUserPermission = async () => {
  //   try {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Error in requesting user permission:', error);
  //     return false;
  //   }
  // };

  return <AppNavigator />;
}

const styles = StyleSheet.create({});
