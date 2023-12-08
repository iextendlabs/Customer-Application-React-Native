import React from "react";
import { View, Image } from "react-native";

const StarRating = ({ rating, size}) => {
  const fullStars = Math.floor(rating);
  const halfStars = Math.ceil(rating - fullStars);
  const emptyStars = Math.ceil(5 - (fullStars + halfStars));
  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={i}
          source={require("../images/full_star.png")} // Add the path to your full star image
          style={{ width: size, height: size }}
        />
      );
    }

    if (halfStars > 0) {
      stars.push(
        <Image
          key="half"
          source={require("../images/half_star.png")} // Add the path to your half star image
          style={{ width: size, height: size }}
        />
      );
    }

    if (emptyStars > 0) {
      for (let i = 0; i < emptyStars; i++) {
        stars.push(
          <Image
            key="empty"
            source={require("../images/star.png")} // Add the path to your half star image
            style={{ width: size, height: size }}
          />
        );
      }
    }

    return stars;
  };

  return <View style={{ flexDirection: "row" }}>{renderStars()}</View>;
};

export default StarRating;
