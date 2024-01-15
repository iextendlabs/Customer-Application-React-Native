import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { BaseUrl } from "../Config/Api";

export default function PrivacyPolicy() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: BaseUrl+"privacyPolicy" }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
