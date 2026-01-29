import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import componentStyles from "../styles/componentStyles";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";

export default function TrainerCard({ trainer, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={componentStyles.trainerCard}
    >
      {/* Trainer Image */}
      {trainer.image ? (
        <Image
          source={{ uri: trainer.image }}
          style={componentStyles.trainerCardImage}
        />
      ) : (
        <View
          style={[
            componentStyles.trainerCardImage,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.primary,
            },
          ]}
        >
          <Ionicons name="person" size={60} color="#fff" />
        </View>
      )}

      {/* Trainer Info */}
      <Text style={componentStyles.trainerCardName}>{trainer.name}</Text>
      
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.M }}>
        <Ionicons name="star" size={16} color="#f59e0b" />
        <Text style={{ fontSize: FONT_SIZES.BODY_S, color: Colors.text, marginLeft: SPACING.S, fontWeight: "600" }}>
          {trainer.rating || "4.5"} ({trainer.reviews || "120"} reviews)
        </Text>
      </View>

      <Text style={componentStyles.trainerCardSpecialty}>{trainer.specialty}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: SPACING.M,
        }}
      >
        <Text style={componentStyles.trainerCardPrice}>₹{trainer.fee}/hr</Text>
        {trainer.experience && (
          <Text style={{ fontSize: FONT_SIZES.BODY_XS, color: Colors.muted }}>
            {trainer.experience} yrs exp
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={componentStyles.trainerCardButton}
      >
        <Text style={componentStyles.trainerCardButtonText}>Book Session</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
