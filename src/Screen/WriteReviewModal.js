import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CommonButton from "../Common/CommonButton";
import { writeReviewUrl } from "../Config/Api";
import axios from "axios";

const CustomStarRating = ({ rating, onStarPress }) => {
  const renderStar = (position) => {
    const filled = position <= rating;

    return (
      <TouchableOpacity key={position} onPress={() => onStarPress(position)}>
        <Text style={[styles.star, filled && styles.filledStar]}>★</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((position) => renderStar(position))}
    </View>
  );
};

export default function WriteReviewModal({ visible, order_id, onClose }) {
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleModalClose = () => {
    setRating(0);
    setUserName("");
    setReviewContent("");
    onClose();
  };

  const handleSaveReview = async () => {
    setLoading(true);
    setError("");

    if (userName.trim() !== "" && reviewContent.trim() !== "" && rating !== 0) {
      try {
        const response = await axios.post(writeReviewUrl, {
          user_name: userName,
          rating: rating,
          content: reviewContent,
          order_id: order_id,
        });
        if (response.status === 200) {
          console.log(response.data.msg);
          setLoading(false);
          handleModalClose();
        } else {
          setError("Please try again.");
          setLoading(false);
        }
      } catch (error) {}
    } else {
      setError("Fill up all fields.");
    }
    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Write a Review</Text>
          {error && <Text style={{ margin: 10, color: "red" }}>{error}</Text>}
          <TextInput
            placeholder="Your Name"
            style={styles.input}
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />

          <TextInput
            placeholder="Review"
            style={styles.textInput}
            value={reviewContent}
            onChangeText={(text) => setReviewContent(text)}
            multiline
          />

          <View style={styles.ratingContainer}>
            <CustomStarRating rating={rating} onStarPress={handleStarPress} />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSaveReview();
            }}
          >
            <Text style={styles.buttonText}>{loading ? "Submitting..." : "Submit"}</Text>
          </TouchableOpacity>

          <CommonButton
            title={"Close"}
            bgColor={"#ff6566"}
            textColor={"#fff"}
            onPress={handleModalClose}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fdedee",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center", // Center the content vertically
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    height: 110,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#ff6566",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the stars horizontally
    marginBottom: 20,
  },
  star: {
    fontSize: 30,
    color: "#ddd",
    marginRight: 5,
  },
  filledStar: {
    color: "#ff6566",
  },
});
