import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import CommonButton from "../Common/CommonButton";
import { writeReviewUrl } from "../Config/Api";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as VideoPicker from "expo-image-picker";
import { Video } from "expo-av";

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

export default function WriteReviewModal({
  visible,
  order_id,
  onClose,
  onSaveReview,
}) {
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isVideoPickerOpen, setIsVideoPickerOpen] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleModalClose = () => {
    setRating(0);
    setUserName("");
    setReviewContent("");
    setImages([]);
    onClose();
  };

  const selectImage = async () => {
    setIsImagePickerOpen(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true,
    });
    setIsImagePickerOpen(false);
    if (!result.canceled) {
      const selectedImages = result.assets.filter(
        (asset) =>
          typeof asset.uri === "string" &&
          (asset.uri.endsWith("jpeg") ||
            asset.uri.endsWith("png") ||
            asset.uri.endsWith("jpg"))
      );

      if (selectedImages.length > 0) {
        setImages([...images, ...selectedImages]);
        setError("");
      } else {
        setError("Please select valid image files.");
      }
    }
  };

  const selectVideo = async () => {
    setIsVideoPickerOpen(true);
    let result = await VideoPicker.launchImageLibraryAsync({
      mediaTypes: VideoPicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setIsVideoPickerOpen(false);
    if (!result.canceled) {
      if (
        typeof result.assets[0].uri === "string" &&
        result.assets[0].uri.endsWith("mp4")
      ) {
        setVideo(result);
        setError("");
      } else {
        setError("Please select a valid video file.");
      }
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const removeVideo = () => {
    setVideo(null);
  };
  const handleSaveReview = async () => {
    setLoading(true);
    setError("");

    if (
      userName.trim() !== "" &&
      reviewContent.trim() !== "" &&
      rating !== 0 &&
      order_id !== ""
    ) {
      try {
        const formData = new FormData();
        formData.append("user_name", userName);
        formData.append("rating", rating);
        formData.append("content", reviewContent);
        formData.append("order_id", order_id);

        images.forEach((image, index) => {
          formData.append(`image[]`, {
            uri: image.uri,
            type: "image/jpeg",
            name: `image_${index + 1}.jpg`,
          });
        });

        if (video) {
          formData.append("review_video", {
            uri: video.assets[0].uri,
            type: "video/mp4",
            name: "video.mp4",
          });
        }

        const response = await axios.post(writeReviewUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          setLoading(false);
          onSaveReview();
          handleModalClose();
        } else {
          setError("Please try again.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Please try again.");
        setLoading(false);
      }
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
          {images.length > 0 ? (
            <>
              {images.map((img, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: img.uri }}
                    style={styles.selectedImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.button}
                onPress={selectImage}
                disabled={isImagePickerOpen}
              >
                <Text style={styles.buttonText}>Add More Images</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={selectImage}
              disabled={isImagePickerOpen}
            >
              <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>
          )}

          {video && (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: video.assets["0"].uri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={false}
                isLooping
                style={styles.selectedVideo}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeVideo()}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={selectVideo}
            disabled={isVideoPickerOpen}
          >
            <Text style={styles.buttonText}>Choose Video</Text>
          </TouchableOpacity>

          <View style={styles.ratingContainer}>
            <CustomStarRating rating={rating} onStarPress={handleStarPress} />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSaveReview();
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>

          <CommonButton
            title={"Close"}
            bgColor={"#fd245f"}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginTop: 50,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#fd245f",
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
    color: "#fd245f",
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    margin: 10,
  },
  selectedVideo: {
    width: "95%",
    height: 200,
    borderRadius: 7,
    margin: 10,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#fd245f",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
  },
  videoContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 10,
  },
});
