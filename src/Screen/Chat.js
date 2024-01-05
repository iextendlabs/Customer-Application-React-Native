import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { ChatUrl, AddChatUrl } from "../Config/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Splash from "../Screen/Splash";

export default function Chat() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChat] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const setSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const setError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchChat();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchChat = async (visible) => {

    let userId = await AsyncStorage.getItem("@user_id");
    try {
      const response = await axios.get(
        `${ChatUrl}user_id=${userId}`
      );
      setChat(response.data.chats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSubmitChat = async () => {
    let userId = await AsyncStorage.getItem("@user_id");
    if (text.trim() === "") {
      setError("Please enter a Text.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(AddChatUrl, {
        text: text,
        user_id: userId,
      });

      if (response.status === 200) {
        setSuccess("Message Sent Successfully.");
        setChat(response.data.chats);
        setText("");
      } else {
        throw new Error("Failed to Send Message.");
      }
    } catch (error) {
      setError("Failed to Send Message. Please try again.");
    }

    setIsLoading(false);
  };

  const renderChat = ({ item }) => {
    const chatStyle =
      item.admin_id !== null
        ? styles.otherMessageContainer
        : styles.userMessageContainer;

    const bubble =
      item.admin_id !== null
        ? styles.messageBubble
        : styles.userMessageBubble;
    return (
      <View style={chatStyle}>
        <View style={bubble}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageRole}>{item.time}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return Splash();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCACC" }}>
      <View style={{ flex: 1, margin: 20 }}>
        <FlatList
          data={chats}
          renderItem={renderChat}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={{
              color: "red",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 20,
            }}>No Chat</Text>
          }
        />
        <View style={{bottom: 0}}>
          <TextInput
            style={{
              height: 100,
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 10,
            }}
            value={text}
            onChangeText={setText}
            placeholder="Enter your Message"
            multiline
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#fd245f",
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
            onPress={handleSubmitChat}
            disabled={isLoading}
          >
            <Text style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}>
              {isLoading ? "Sending..." : "Send"}
            </Text>
          </TouchableOpacity>
          {successMessage !== "" && (
            <Text style={{
              color: "green",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 10,
            }}>{successMessage}</Text>
          )}
          {errorMessage !== "" && (
            <Text style={{
              color: "red",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 10,
            }}>{errorMessage}</Text>
          )}
        </View>
      </View>

    </View>
  );

}

const styles = StyleSheet.create({
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  otherMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  userMessageBubble: {
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
  },
  messageBubble: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
  },
  messageRole: {
    fontSize: 12,
    color: '#8f9193',
  },
});
