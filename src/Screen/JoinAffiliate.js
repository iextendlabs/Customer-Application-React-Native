import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import CommonButton from "../Common/CommonButton";
import CustomTextInput from "../Common/CustomTextInput";
import { joinAffiliateURL } from "../Config/Api";
import { updateAffiliate } from "../redux/actions/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function JoinAffiliateModal({ onClose }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [affiliateCode, setAffiliateCode] = useState(""); // State for input value
  const [selectedAffiliateCode, setSelectedAffiliateCode] = useState(""); // State for selected affiliate code
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const affiliateData = useSelector((state) => state.affiliate);

  useEffect(() => {
    if (affiliateData.length > 0) {
      setSelectedAffiliateCode(affiliateData[0]);
    }
  }, [affiliateData]);

  const handleModalClose = () => {
    setError("");
    setSuccess("");
    navigation.goBack();
  };

  const handleApply = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setAffiliateCode("");

    const userId = await AsyncStorage.getItem("@user_id");
    if (affiliateCode.trim() !== "") {
      try {
        const formData = new FormData();
        formData.append("affiliate_code", affiliateCode);
        formData.append("userId", userId);

        const response = await axios.post(joinAffiliateURL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          setLoading(false);
          dispatch(
            updateAffiliate(response.data.affiliate_code)
          );
        await AsyncStorage.setItem("@affiliate", String(response.data.affiliate_code));
          setSuccess("Affiliate applied successfully.");
          setAffiliateCode("");
          
          setTimeout(() => {
            handleModalClose();
          }, 2000);

        } else if (response.status === 201) {
          setLoading(false);
          setError(response.data.error);
        }
      } catch (error) {
        setLoading(false);
        setError("Please try again.");
      }
    } else {
      setError("Please Enter Affiliate Code.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{selectedAffiliateCode ? `Your Affiliate(${selectedAffiliateCode})` : ""}</Text>
        <Text style={styles.modalTitle}>{selectedAffiliateCode ? `Join New` : "Join Affiliate"}</Text>

        <View style={styles.inputContainer}>
          <CustomTextInput
            placeholder={"Enter Affiliate Code"}
            icon={require("../images/affiliate.png")}
            value={affiliateCode}
            onChangeText={(txt) => setAffiliateCode(txt)}
          />
        </View>

        {error && (
          <Text
            style={{
              margin: 10,
              color: "red",
            }}
          >
            {error}
          </Text>
        )}
        {success && (
          <Text
            style={{
              margin: 10,
              color: "green",
            }}
          >
            {success}
          </Text>
        )}
        <CommonButton
          disabled={loading}
          title={loading ? "Applying..." : "Apply"}
          bgColor={"#24a0ed"}
          textColor={"#fff"}
          onPress={handleApply}
        />

        <CommonButton
          disabled={loading}
          title={"Close"}
          bgColor={"#fd245f"}
          textColor={"#fff"}
          onPress={handleModalClose}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: "column",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
});
