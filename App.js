import { Alert, View, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import MainContainer from "./src/MainContainer";
import store from "./src/redux/store/Store";
import NetInfo from "@react-native-community/netinfo";
import { StripeProvider } from '@stripe/stripe-react-native';
import { stripe_publishable_key } from "./src/Config/Api";

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

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

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={stripe_publishable_key}>
        <View style={{ flex: 1 }}>
          <StatusBar hidden={false} />
          <MainContainer />
        </View>
      </StripeProvider>
    </Provider>
  );
};

export default App;
