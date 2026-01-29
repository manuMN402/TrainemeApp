import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReviewCard from "../components/trainer/ReviewCard";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";
import { reviewsData } from "../data/trainer/reviews";

export default function ReviewsScreen() {
  const calculateAverageRating = () => {
    if (reviewsData.length === 0) return 0;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviewsData.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= Math.floor(rating) ? "star" : "star-outline"}
            size={20}
            color={star <= Math.floor(rating) ? "#fbbf24" : Colors.muted}
          />
        ))}
      </View>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach((review) => {
      const roundedRating = Math.round(review.rating);
      distribution[roundedRating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
        </View>

        {/* RATING SUMMARY */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingLeft}>
            <Text style={styles.ratingValue}>{averageRating}</Text>
            {renderStars(parseFloat(averageRating))}
            <Text style={styles.ratingCount}>
              Based on {reviewsData.length} reviews
            </Text>
          </View>

          {/* RATING DISTRIBUTION */}
          <View style={styles.distributionContainer}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage =
                reviewsData.length > 0 ? (count / reviewsData.length) * 100 : 0;
              return (
                <View key={rating} style={styles.ratingDistribution}>
                  <View style={styles.ratingLabel}>
                    <Text style={styles.ratingLabelText}>{rating}</Text>
                    <Ionicons name="star-outline" size={12} color="#fbbf24" />
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.percentageText}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* RATING HIGHLIGHTS */}
        <View style={styles.highlightsContainer}>
          <View style={styles.highlightBox}>
            <Ionicons name="happy-outline" size={24} color="#10b981" />
            <View style={{ flex: 1, marginLeft: SPACING.M }}>
              <Text style={styles.highlightTitle}>Most Common</Text>
              <Text style={styles.highlightValue}>5 Stars</Text>
            </View>
          </View>
          <View style={styles.highlightBox}>
            <Ionicons name="people-outline" size={24} color="#6366f1" />
            <View style={{ flex: 1, marginLeft: SPACING.M }}>
              <Text style={styles.highlightTitle}>Total Ratings</Text>
              <Text style={styles.highlightValue}>{reviewsData.length}</Text>
            </View>
          </View>
        </View>

        {/* REVIEWS LIST */}
        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>All Reviews</Text>
        </View>

        {reviewsData.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={64} color={Colors.muted} />
            <Text style={styles.emptyStateTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyStateText}>
              Reviews from your clients will appear here
            </Text>
          </View>
        ) : (
          reviewsData.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1e",
  },
  header: {
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
  },
  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: "#fff",
  },
  ratingCard: {
    backgroundColor: "#1a1a2e",
    marginHorizontal: SPACING.L,
    marginVertical: SPACING.L,
    borderRadius: 16,
    padding: SPACING.L,
  },
  ratingLeft: {
    alignItems: "center",
    marginBottom: SPACING.L,
  },
  ratingValue: {
    fontSize: FONT_SIZES.HEADING_XXXL,
    fontWeight: "700",
    color: "#fbbf24",
    lineHeight: 80,
  },
  starsContainer: {
    flexDirection: "row",
    gap: SPACING.S,
    marginVertical: SPACING.M,
  },
  ratingCount: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
  distributionContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: SPACING.L,
    gap: SPACING.M,
  },
  ratingDistribution: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.M,
  },
  ratingLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: 40,
    gap: SPACING.S,
  },
  ratingLabelText: {
    fontSize: FONT_SIZES.BODY_S,
    fontWeight: "600",
    color: "#fff",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fbbf24",
    borderRadius: 3,
  },
  percentageText: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    width: 30,
    textAlign: "right",
  },
  highlightsContainer: {
    flexDirection: "row",
    gap: SPACING.M,
    paddingHorizontal: SPACING.L,
    marginVertical: SPACING.L,
  },
  highlightBox: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: SPACING.L,
    flexDirection: "row",
    alignItems: "center",
  },
  highlightTitle: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
  },
  highlightValue: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
    marginTop: SPACING.S,
  },
  reviewsHeader: {
    paddingHorizontal: SPACING.L,
    marginVertical: SPACING.L,
  },
  reviewsTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XXL,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
    marginTop: SPACING.L,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    textAlign: "center",
    marginVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
  },
});
