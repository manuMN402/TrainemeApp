import { View, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { SPACING, responsiveSpacing } from "../utils/responsiveDesign";

export default function AppLogo({ size = "medium" }) {
  const sizes = {
    small: {
      width: 60,
      height: 60,
      radius: 30,
      logoSize: 36,
    },
    medium: {
      width: 80,
      height: 80,
      radius: 40,
      logoSize: 48,
    },
    large: {
      width: 120,
      height: 120,
      radius: 60,
      logoSize: 72,
    },
  };

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <View
      style={[
        styles.circle,
        {
          width: selectedSize.width,
          height: selectedSize.height,
          borderRadius: selectedSize.radius,
        },
      ]}
    >
      <Image
        source={require("../../assets/images/logo.png")}
        style={[
          styles.logo,
          {
            width: selectedSize.logoSize,
            height: selectedSize.logoSize,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...require("../utils/responsiveDesign").SHADOWS.MEDIUM,
  },
  logo: {
    /* resizeMode is applied via prop on Image component */
  },
});
