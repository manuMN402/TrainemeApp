/**
 * Calculate profile completion percentage with weighted sections
 * Basic Info = 30%, Expertise = 30%, Availability = 20%, Pricing = 20%
 */
export const calculateProfileCompletion = (profileData) => {
  const {
    fullName = "",
    bio = "",
    location = "",
    profileImage = null,
    selectedExpertise = [],
    yearsExperience = "",
    selectedDays = [],
    selectedTimeSlots = [],
    pricePerSession = "",
  } = profileData;

  // Basic Info: 30% (Name, Bio, Location, Profile Image)
  const basicInfoComplete =
    (fullName.trim() ? 0.25 : 0) +
    (bio.trim() ? 0.25 : 0) +
    (location.trim() ? 0.25 : 0) +
    (profileImage ? 0.25 : 0);
  const basicInfoPercentage = basicInfoComplete * 30;

  // Expertise: 30% (Selected Expertise, Years of Experience)
  const expertiseComplete =
    (selectedExpertise.length > 0 ? 0.5 : 0) +
    (yearsExperience.trim() ? 0.5 : 0);
  const expertisePercentage = expertiseComplete * 30;

  // Availability: 20% (Selected Days, Time Slots)
  const availabilityComplete =
    (selectedDays.length > 0 ? 0.5 : 0) +
    (selectedTimeSlots.length > 0 ? 0.5 : 0);
  const availabilityPercentage = availabilityComplete * 20;

  // Pricing: 20% (Price per Session)
  const pricingComplete = pricePerSession.trim() ? 1 : 0;
  const pricingPercentage = pricingComplete * 20;

  const totalPercentage =
    basicInfoPercentage + expertisePercentage + availabilityPercentage + pricingPercentage;

  return Math.round(totalPercentage);
};

/**
 * Check if profile is ready to accept bookings (70% or above)
 */
export const isProfileReadyForBookings = (profileData) => {
  return calculateProfileCompletion(profileData) >= 70;
};

/**
 * Get missing sections for profile completion
 */
export const getMissingSections = (profileData) => {
  const {
    fullName = "",
    bio = "",
    location = "",
    profileImage = null,
    selectedExpertise = [],
    yearsExperience = "",
    selectedDays = [],
    selectedTimeSlots = [],
    pricePerSession = "",
  } = profileData;

  const missing = [];

  // Check Basic Info
  const basicInfoFields = [];
  if (!fullName.trim()) basicInfoFields.push("Full Name");
  if (!bio.trim()) basicInfoFields.push("Bio");
  if (!location.trim()) basicInfoFields.push("Location");
  if (!profileImage) basicInfoFields.push("Profile Photo");

  if (basicInfoFields.length > 0) {
    missing.push({
      section: "Basic Info",
      fields: basicInfoFields,
      percentage: 30,
    });
  }

  // Check Expertise
  const expertiseFields = [];
  if (selectedExpertise.length === 0) expertiseFields.push("Select Expertise");
  if (!yearsExperience.trim()) expertiseFields.push("Years of Experience");

  if (expertiseFields.length > 0) {
    missing.push({
      section: "Expertise",
      fields: expertiseFields,
      percentage: 30,
    });
  }

  // Check Availability
  const availabilityFields = [];
  if (selectedDays.length === 0) availabilityFields.push("Available Days");
  if (selectedTimeSlots.length === 0) availabilityFields.push("Time Slots");

  if (availabilityFields.length > 0) {
    missing.push({
      section: "Availability",
      fields: availabilityFields,
      percentage: 20,
    });
  }

  // Check Pricing
  if (!pricePerSession.trim()) {
    missing.push({
      section: "Pricing",
      fields: ["Price Per Session"],
      percentage: 20,
    });
  }

  return missing;
};
