import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { FONT_SIZES, SPACING } from "../../utils/responsiveDesign";

export default function ReviewCard({ review }) {
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= Math.floor(rating) ? "star" : "star-outline"}
            size={14}
            color={star <= Math.floor(rating) ? "#fbbf24" : Colors.muted}
          />
        ))}
        {rating % 1 !== 0 && (
          <Ionicons
            name="star-half"
            size={14}
            color="#fbbf24"
            style={{ marginLeft: -8 }}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: review.userProfilePicture }}
            style={styles.profilePic}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.date}>{review.date}</Text>
          </View>
        </View>
      </View>

      {/* RATING */}
      <View style={styles.ratingSection}>
        {renderStars(review.rating)}
        <Text style={styles.ratingText}>{review.rating.toFixed(1)}</Text>
      </View>

      {/* COMMENT */}
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: SPACING.L,
    marginVertical: SPACING.M,
    marginHorizontal: SPACING.M,
    borderTopWidth: 2,
    borderTopColor: "#fbbf24",
  },
  header: {
    marginBottom: SPACING.M,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.M,
  },
  userName: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
    color: "#fff",
  },
  date: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginTop: 4,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.M,
    gap: SPACING.M,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    color: "#fbbf24",
  },
  comment: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
    lineHeight: 20,
    marginTop: SPACING.M,
  },
});
