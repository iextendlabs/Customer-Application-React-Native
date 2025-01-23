import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CommonButton from "../Common/CommonButton";
import CustomTextInput from "../Common/CustomTextInput";
import { getUserUrl, joinFreelancerProgramURL } from "../Config/Api";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function JoinFreelancerProgram({ onClose }) {
  const navigation = useNavigation();
  const [subTitle, setSubTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCountryForNumber, setSelectedCountryForNumber] =
    useState(null);
  const [selectedCountryForWhatsapp, setSelectedCountryForWhatsapp] =
    useState(null);
  const [number, setNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedWhatsapp, setSelectedWhatsapp] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(null);

  const handleSelectCountryForNumber = (country) => {
    setSelectedCountryForNumber(country.cca2);
    setNumber("+" + country.callingCode["0"]);
  };

  const handleSelectCountryForWhatsapp = (country) => {
    setSelectedCountryForWhatsapp(country.cca2);
    setWhatsapp("+" + country.callingCode["0"]);
  };

  const personalInformationData = useSelector(
    (state) => state.personalInformation
  );

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const userId = await AsyncStorage.getItem("@user_id");

    const response = await axios.get(getUserUrl + userId);
    if (response.status === 200) {
      let data = response.data.user;
      setIsFreelancer(data.freelancer_program);
      if(data.freelancer_program == 0){
        setError("Your request to join the freelancer program has been submitted and sent to the administrator for review.");
      }else if(data.freelancer_program == 1){
        setSuccess("Your request to join the freelancer program has been approved. Please contact customer support for further assistance.");
      }
    }
  };

  useEffect(() => {
    if (personalInformationData && personalInformationData.length > 0) {
      const info = personalInformationData[0];
      setSelectedNumber(info.number || "");
      setSelectedWhatsapp(info.whatsapp || "");
      setNumber(info.number || "");
      setWhatsapp(info.whatsapp || "");
    }
  }, [personalInformationData]);

  const handleModalClose = () => {
    setError("");
    setSuccess("");
    navigation.goBack();
  };

  const handleApply = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (subTitle.trim() == "") {
      setError("Please enter your sub title / Designation!");
      setLoading(false);
      return;
    }

    if (
      (selectedNumber == "" && selectedCountryForNumber === null) ||
      (selectedWhatsapp == "" && selectedCountryForWhatsapp === null)
    ) {
      setError("Please select country for number!");
      setLoading(false);
      return;
    }

    if (
      number.trim() !== "" &&
      whatsapp.trim() !== "" &&
      subTitle.trim() !== ""
    ) {
      const userId = await AsyncStorage.getItem("@user_id");

      try {
        const formData = new FormData();
        formData.append("subTitle", subTitle);
        formData.append("number", number);
        formData.append("whatsapp", whatsapp);
        formData.append("userId", userId);
        const response = await axios.post(joinFreelancerProgramURL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          setLoading(false);

          getUser();
        } else if (response.status === 201) {
          setLoading(false);
          setError(response.data.error);
        }
        setLoading(false);
      } catch (error) {}
    } else {
      setLoading(false);
      setError("Fill up all fields.");
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Join Freelancer Program</Text>
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
        {isFreelancer == null && (
          <>
            <View style={styles.inputContainer}>
              <CustomTextInput
                placeholder={"Sub Title / Designation"}
                icon={require("../images/user.png")}
                value={subTitle}
                onChangeText={(txt) => setSubTitle(txt)}
              />
              {!selectedNumber && (
                <CustomTextInput
                  value={number}
                  onChangeText={(txt) => setNumber(txt)}
                  placeholder={"Enter Phone Number"}
                  keyboardType={"numeric"}
                  label={"Phone Number"}
                  onSelectCountry={handleSelectCountryForNumber}
                  selectedCountry={selectedCountryForNumber}
                  isNumber={true}
                />
              )}
              {!selectedWhatsapp && (
                <CustomTextInput
                  value={whatsapp}
                  onChangeText={(txt) => setWhatsapp(txt)}
                  placeholder={"Enter Whatsapp Number"}
                  keyboardType={"numeric"}
                  label={"Whatsapp Number"}
                  onSelectCountry={handleSelectCountryForWhatsapp}
                  selectedCountry={selectedCountryForWhatsapp}
                  isNumber={true}
                />
              )}
            </View>
            <CommonButton
              disabled={loading}
              title={loading ? "Applying..." : "Apply"}
              bgColor={"#24a0ed"}
              textColor={"#fff"}
              onPress={handleApply}
            />
          </>
        )}

        

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
    paddingTop: 20,
    paddingBottom: 20,
    width: "95%",
    alignSelf: "center",
    flexDirection: "column",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    margin: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
});
