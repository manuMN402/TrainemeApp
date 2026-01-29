import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";
import { trainerProfileData } from "../data/trainer/trainerStats";

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState(trainerProfileData);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: trainerProfileData.name,
    bio: trainerProfileData.bio,
    pricePerSession: trainerProfileData.pricePerSession.toString(),
    phone: trainerProfileData.phone,
  });

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProfileData({
        ...profileData,
        name: editForm.name,
        bio: editForm.bio,
        pricePerSession: parseInt(editForm.pricePerSession),
        phone: editForm.phone,
      });
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => {
            Alert.alert("Success", "You have been logged out");
            // Navigate to login
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            onPress={() => {
              setEditForm({
                name: profileData.name,
                bio: profileData.bio,
                pricePerSession: profileData.pricePerSession.toString(),
                phone: profileData.phone,
              });
              setEditModalVisible(true);
            }}
            style={styles.editButton}
          >
            <Ionicons name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeaderContainer}>
            <Image
              source={{ uri: profileData.profilePicture }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.changePictureButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>{profileData.name}</Text>
          <Text style={styles.specializationText}>
            {profileData.specialization}
          </Text>

          {/* STATS */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.experience}</Text>
              <Text style={styles.statLabel}>Yrs Experience</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${profileData.pricePerSession}</Text>
              <Text style={styles.statLabel}>Per Session</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* BIO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{profileData.bio}</Text>
        </View>

        {/* LOCATION */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.infoText}>{profileData.location}</Text>
        </View>

        {/* CONTACT */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="call-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Contact</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={16} color={Colors.muted} />
            <Text style={styles.contactText}>{profileData.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="phone-portrait-outline" size={16} color={Colors.muted} />
            <Text style={styles.contactText}>{profileData.phone}</Text>
          </View>
        </View>

        {/* CERTIFICATIONS */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="medal-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Certifications</Text>
          </View>
          <View style={styles.certificationsContainer}>
            {profileData.certifications.map((cert, idx) => (
              <View key={idx} style={styles.certificationBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.certificationText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* LANGUAGES */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="language-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Languages</Text>
          </View>
          <View style={styles.languagesContainer}>
            {profileData.languages.map((lang, idx) => (
              <View key={idx} style={styles.languageBadge}>
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* MEMBER SINCE */}
        <View style={styles.section}>
          <View style={styles.memberCard}>
            <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
            <View style={{ marginLeft: SPACING.M }}>
              <Text style={styles.memberLabel}>Member Since</Text>
              <Text style={styles.memberDate}>{profileData.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              {/* NAME */}
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.input}>
                <TextInput
                  style={styles.inputText}
                  value={editForm.name}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, name: text })
                  }
                  placeholderTextColor={Colors.muted}
                />
              </View>

              {/* PHONE */}
              <Text style={[styles.label, { marginTop: SPACING.L }]}>Phone</Text>
              <View style={styles.input}>
                <TextInput
                  style={styles.inputText}
                  value={editForm.phone}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, phone: text })
                  }
                  placeholderTextColor={Colors.muted}
                />
              </View>

              {/* PRICE */}
              <Text style={[styles.label, { marginTop: SPACING.L }]}>
                Price Per Session ($)
              </Text>
              <View style={styles.input}>
                <TextInput
                  style={styles.inputText}
                  value={editForm.pricePerSession}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, pricePerSession: text })
                  }
                  placeholderTextColor={Colors.muted}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* BIO */}
              <Text style={[styles.label, { marginTop: SPACING.L }]}>Bio</Text>
              <View style={[styles.input, { minHeight: 120 }]}>
                <TextInput
                  style={[styles.inputText, { textAlignVertical: "top" }]}
                  value={editForm.bio}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, bio: text })
                  }
                  placeholderTextColor={Colors.muted}
                  multiline
                  maxLength={500}
                />
              </View>

              {/* SAVE BUTTON */}
              <TouchableOpacity
                style={[styles.saveButton, loading && { opacity: 0.6 }]}
                onPress={handleEditProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: "#fff",
  },
  editButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  profileHeaderContainer: {
    position: "relative",
    marginBottom: SPACING.L,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  changePictureButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: "#fff",
    marginTop: SPACING.M,
  },
  specializationText: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.primary,
    marginTop: SPACING.S,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.L,
    width: "100%",
    paddingHorizontal: SPACING.L,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  section: {
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.M,
    marginBottom: SPACING.M,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
  },
  bioText: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    lineHeight: 22,
  },
  infoText: {
    fontSize: FONT_SIZES.BODY_M,
    color: "#fff",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.M,
    marginVertical: SPACING.S,
  },
  contactText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
  },
  certificationsContainer: {
    gap: SPACING.M,
  },
  certificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderRadius: 8,
    gap: SPACING.M,
  },
  certificationText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#10b981",
    fontWeight: "600",
  },
  languagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.M,
  },
  languageBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.S,
    borderRadius: 20,
  },
  languageText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
    fontWeight: "600",
  },
  memberCard: {
    backgroundColor: "#1a1a2e",
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.L,
    borderRadius: 12,
  },
  memberLabel: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
  },
  memberDate: {
    fontSize: FONT_SIZES.BODY_L,
    color: "#fff",
    fontWeight: "600",
    marginTop: SPACING.S,
  },
  logoutButton: {
    marginHorizontal: SPACING.L,
    marginVertical: SPACING.L,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: SPACING.L,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.M,
  },
  logoutButtonText: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
  },
  modalForm: {
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
  },
  label: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    color: "#fff",
    marginBottom: SPACING.S,
  },
  input: {
    backgroundColor: "#0f0f1e",
    borderRadius: 12,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputText: {
    fontSize: FONT_SIZES.BODY_M,
    color: "#fff",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: SPACING.L,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.M,
    marginVertical: SPACING.L,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: "#fff",
  },
});
