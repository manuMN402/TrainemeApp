import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import StatCard from "../components/trainer/StatCard";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  getGridColumns,
} from "../utils/responsiveDesign";
import {
  trainerStatsData,
  todayScheduleData,
  weeklyEarningsData,
} from "../data/trainer/trainerStats";

const screenWidth = Dimensions.get("window").width;

export default function TrainerHomeScreen() {
  const [timeRange, setTimeRange] = useState("monthly");

  const earningsData = useMemo(() => {
    return timeRange === "monthly"
      ? [
          { label: "Week 1", value: 4500 },
          { label: "Week 2", value: 5200 },
          { label: "Week 3", value: 6100 },
          { label: "Week 4", value: 8700 },
        ]
      : weeklyEarningsData.map((d) => ({
          label: d.day,
          value: d.earnings,
        }));
  }, [timeRange]);

  const maxEarnings = Math.max(...earningsData.map((d) => d.value));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.XXL }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <Text style={styles.name}>Alex Williams</Text>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <Ionicons name="notifications" size={24} color={Colors.primary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* QUICK STATS */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Bookings"
            value={trainerStatsData.totalBookings}
            icon="calendar-outline"
            backgroundColor="#1a1a2e"
            iconColor="#6366f1"
          />
          <StatCard
            title="Upcoming Sessions"
            value={trainerStatsData.upcomingSessions}
            icon="time-outline"
            backgroundColor="#1a1a2e"
            iconColor="#f59e0b"
          />
          <StatCard
            title="Average Rating"
            value={trainerStatsData.averageRating}
            icon="star"
            backgroundColor="#1a1a2e"
            iconColor="#fbbf24"
          />
          <StatCard
            title="Monthly Earnings"
            value={`$${trainerStatsData.monthlyEarnings}`}
            icon="cash-outline"
            backgroundColor="#1a1a2e"
            iconColor="#10b981"
          />
        </View>

        {/* EARNINGS CHART */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Earnings Overview</Text>
            <View style={styles.timeRangeButtons}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  timeRange === "weekly" && styles.timeButtonActive,
                ]}
                onPress={() => setTimeRange("weekly")}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    timeRange === "weekly" && styles.timeButtonTextActive,
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  timeRange === "monthly" && styles.timeButtonActive,
                ]}
                onPress={() => setTimeRange("monthly")}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    timeRange === "monthly" && styles.timeButtonTextActive,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.yAxisLabels}>
              <Text style={styles.yAxisLabel}>
                ${Math.round(maxEarnings / 1000)}k
              </Text>
              <Text style={styles.yAxisLabel}>
                ${Math.round((maxEarnings * 2) / 3 / 1000)}k
              </Text>
              <Text style={styles.yAxisLabel}>
                ${Math.round((maxEarnings / 3) / 1000)}k
              </Text>
              <Text style={styles.yAxisLabel}>$0</Text>
            </View>

            <View style={styles.barsContainer}>
              {earningsData.map((data, index) => {
                const percentage = (data.value / maxEarnings) * 100;
                return (
                  <View key={index} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${percentage}%` },
                      ]}
                    />
                    <Text style={styles.barLabel}>{data.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="trending-up" size={20} color="#10b981" />
              <Text style={styles.statBoxLabel}>Weekly Avg</Text>
              <Text style={styles.statBoxValue}>
                ${trainerStatsData.weeklyEarnings}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Ionicons name="bar-chart" size={20} color="#f59e0b" />
              <Text style={styles.statBoxLabel}>Total Earned</Text>
              <Text style={styles.statBoxValue}>
                ${trainerStatsData.totalEarnings}
              </Text>
            </View>
          </View>
        </View>

        {/* TODAY'S SCHEDULE */}
        <View style={styles.scheduleSection}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Today's Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {todayScheduleData.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.scheduleCard}
            >
              <View style={styles.scheduleTime}>
                <View style={styles.timeIconBg}>
                  <Ionicons
                    name="time"
                    size={16}
                    color={Colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.scheduleCardTime}>{session.time}</Text>
                  <Text style={styles.sessionDuration}>1 hour session</Text>
                </View>
              </View>

              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleCardUser}>{session.userName}</Text>
                <Text style={styles.scheduleCardType}>{session.type}</Text>
              </View>

              <View
                style={[
                  styles.scheduleStatus,
                  session.status === "Confirmed" &&
                    { backgroundColor: "#10b981" },
                  session.status === "Pending" && { backgroundColor: "#f59e0b" },
                ]}
              >
                <Ionicons
                  name={
                    session.status === "Confirmed"
                      ? "checkmark-circle"
                      : "time-outline"
                  }
                  size={16}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ONLINE STATUS */}
        <View style={styles.onlineStatusSection}>
          <View style={styles.onlineStatusCard}>
            <View style={styles.onlineIndicator} />
            <View style={{ flex: 1 }}>
              <Text style={styles.onlineStatusTitle}>You're Online</Text>
              <Text style={styles.onlineStatusSubtitle}>
                Visible to clients • Last active: 2 mins ago
              </Text>
            </View>
            <TouchableOpacity style={styles.toggleButton}>
              <Ionicons name="power" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
  },
  greeting: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
  },
  name: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: "#fff",
    marginTop: SPACING.S,
  },
  notificationBell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_XS,
    fontWeight: "700",
  },
  statsContainer: {
    marginVertical: SPACING.M,
  },
  chartSection: {
    backgroundColor: "#1a1a2e",
    marginHorizontal: SPACING.M,
    marginVertical: SPACING.L,
    borderRadius: 16,
    padding: SPACING.L,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.L,
  },
  chartTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
  },
  timeRangeButtons: {
    flexDirection: "row",
    gap: SPACING.S,
  },
  timeButton: {
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.muted,
  },
  timeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeButtonText: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    fontWeight: "600",
  },
  timeButtonTextActive: {
    color: "#fff",
  },
  chartContainer: {
    flexDirection: "row",
    marginVertical: SPACING.L,
    alignItems: "flex-end",
    height: 200,
  },
  yAxisLabels: {
    width: 45,
    justifyContent: "space-between",
    paddingRight: SPACING.M,
  },
  yAxisLabel: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    textAlign: "right",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: "60%",
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: SPACING.M,
  },
  barLabel: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.L,
    paddingTop: SPACING.L,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statBoxLabel: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginVertical: SPACING.S,
  },
  statBoxValue: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: Colors.primary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  scheduleSection: {
    paddingHorizontal: SPACING.L,
    marginVertical: SPACING.L,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.M,
  },
  scheduleTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
  },
  viewAllText: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.primary,
    fontWeight: "600",
  },
  scheduleCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: SPACING.L,
    marginVertical: SPACING.M,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scheduleTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.M,
  },
  timeIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleCardTime: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    color: "#fff",
  },
  sessionDuration: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
  scheduleInfo: {
    flex: 1,
    marginHorizontal: SPACING.M,
  },
  scheduleCardUser: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    color: "#fff",
  },
  scheduleCardType: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
  scheduleStatus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineStatusSection: {
    paddingHorizontal: SPACING.L,
    marginTop: SPACING.L,
    marginBottom: SPACING.XXL,
  },
  onlineStatusCard: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: SPACING.L,
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    marginRight: SPACING.L,
  },
  onlineStatusTitle: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: "#fff",
  },
  onlineStatusSubtitle: {
    fontSize: FONT_SIZES.BODY_XS,
    color: "rgba(255,255,255,0.8)",
    marginTop: SPACING.S,
  },
  toggleButton: {
    marginLeft: SPACING.M,
    padding: SPACING.M,
  },
});
