import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { BaseUrl } from "../Config/Api";
import { useRoute } from "@react-navigation/native";

export default function Staff() {
  const route = useRoute();
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: BaseUrl+"staffProfile/"+route.params.staff_id+"?app_flag=1" }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
