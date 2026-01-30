# Trainer Dashboard Navigation Structure

## Overview
The Trainer Dashboard implements a bottom tab navigation structure with 5 main screens, automatic profile completion checking, and badge indicators for incomplete profiles and pending booking requests.

## Navigation Stack

```
TrainerDashboard (Main Component)
├── TrainerDashboardTabs (Bottom Tab Navigator)
│   ├── Home (TrainerHomeScreen)
│   │   └── Icon: home
│   │   └── Label: Home
│   │   └── Shows: Dashboard stats, upcoming bookings, earnings
│   │
│   ├── Bookings (BookingsScreen)
│   │   └── Icon: calendar
│   │   └── Label: Bookings
│   │   └── Shows: List of confirmed/pending/completed bookings
│   │
│   ├── Booking Requests (BookingRequestsScreen)
│   │   └── Icon: checkmark-circle
│   │   └── Label: Requests
│   │   └── Badge: Red badge with count (e.g., "2")
│   │   └── Shows: Pending booking requests
│   │   └── Blocks acceptance if profile < 70% complete
│   │
│   ├── Messages (MessagesScreen)
│   │   └── Icon: chatbubble
│   │   └── Label: Messages
│   │   └── Shows: Chat conversations with clients
│   │
│   └── Profile (TrainerProfileScreen)
│       └── Icon: person
│       └── Label: Profile
│       └── Badge: Amber warning badge if profile < 70% complete
│       └── Shows: Profile completion form with weighted sections
```

## Tab Navigation Features

### 1. **Home Tab**
- **Icon:** `home`
- **Component:** TrainerHomeScreen (Home.jsx)
- **Features:**
  - Dashboard overview with stats
  - Total bookings, upcoming sessions, ratings, earnings
  - Earnings chart (weekly/monthly)
  - Today's schedule
  - Quick access to notifications

### 2. **Bookings Tab**
- **Icon:** `calendar`
- **Component:** BookingsScreen (Bookings.jsx)
- **Features:**
  - View all bookings with status filters
  - Filter by: All, Pending, Confirmed, Completed, Cancelled
  - Accept/reject booking requests
  - Mark bookings as complete
  - View booking details (date, time, client)

### 3. **Booking Requests Tab**
- **Icon:** `checkmark-circle`
- **Component:** BookingRequestsScreen (BookingRequests.jsx)
- **Badge:** Red badge shows pending requests count
- **Features:**
  - View pending booking requests
  - Accept/reject requests
  - **IMPORTANT:** Only allows acceptance if profile completion ≥ 70%
  - Shows warning banner with current completion % if profile incomplete
  - Quick "Complete Profile" button in warning banner

### 4. **Messages Tab**
- **Icon:** `chatbubble`
- **Component:** MessagesScreen (Messages.jsx)
- **Features:**
  - Real-time messaging with clients
  - Chat history
  - Online/offline status indicator
  - Message timestamps
  - Send/receive messages

### 5. **Profile Tab**
- **Icon:** `person`
- **Badge:** Amber warning badge (!) appears if profile < 70% complete
- **Component:** TrainerProfileScreen (TrainerProfile.jsx)
- **Features:**
  - Complete profile with 4 main sections:
    1. **Basic Info (30%):** Name, Bio, Location, Photo
    2. **Expertise (30%):** Skills, Years of Experience, Certifications
    3. **Availability (20%):** Days & Time Slots, Online/Offline
    4. **Pricing (20%):** Session rate, Monthly plans
  - Real-time completion percentage tracking
  - Visual progress bar (color changes at 70%)
  - Warning banner if incomplete
  - Success banner when complete (≥70%)

## Profile Completion Logic

### Weighted Calculation
```
Total Completion = BasicInfo(30%) + Expertise(30%) + Availability(20%) + Pricing(20%)

BasicInfo (30%):
  - Full Name: 7.5%
  - Bio: 7.5%
  - Location: 7.5%
  - Profile Photo: 7.5%

Expertise (30%):
  - Selected Skills: 15%
  - Years of Experience: 15%

Availability (20%):
  - Available Days: 10%
  - Time Slots: 10%

Pricing (20%):
  - Price Per Session: 20%
  - (Monthly plan is optional)
```

### Profile Status
- **< 70%:** Profile Incomplete
  - Warning banner (amber) displayed
  - Badge (!) on Profile tab
  - Cannot accept booking requests
  - Prompted to complete profile

- **≥ 70%:** Profile Complete
  - Success banner (green) displayed
  - No badge on Profile tab
  - Can accept booking requests
  - Ready for client interactions

### Auto-Redirect Logic
When a trainer first enters the dashboard with profile < 70%:
1. TrainerDashboard calculates profile completion
2. If < 70%, automatically navigates to Profile tab
3. Shows completion form with all sections
4. Allows trainer to complete profile before using other features

## Dark Theme Styling

### Colors Applied
```javascript
Background: Colors.bg = "#070B1A"
Primary: Colors.primary = "#6D5DF6"
Text: Colors.text = "#FFFFFF"
Muted: Colors.muted = "#9CA3AF"
Card: Colors.card = "#1a1a2e"
Border: Colors.border = "rgba(255,255,255,0.1)"

// Warning Colors
Incomplete: #f59e0b (Amber)
Complete: #10b981 (Green)
Error: #ef4444 (Red)
```

### Tab Bar Styling
- Background: Dark (#070B1A)
- Border: Subtle top border (rgba(255,255,255,0.1))
- Height: 70px (with padding for safe area)
- Active Color: Primary (#6D5DF6)
- Inactive Color: Muted with 50% opacity

### Badge Styling
- **Profile Badge:** Amber (#f59e0b) background, white exclamation mark
- **Requests Badge:** Red (#ef4444) background, white request count
- Position: Absolute, top-right of tab icon
- Size: 20x20px (standard badge size)

## File Locations

```
frontend/src/
├── trainer/
│   ├── TrainerDashboard.jsx (Main navigation component)
│   ├── Home.jsx (TrainerHomeScreen)
│   ├── Bookings.jsx (BookingsScreen)
│   ├── BookingRequests.jsx (BookingRequestsScreen)
│   ├── Messages.jsx (MessagesScreen)
│   ├── TrainerProfile.jsx (TrainerProfileScreen)
│   └── TrainerHome.jsx (Legacy - not used)
│
├── utils/
│   └── profileCompletion.js (Completion calculation helpers)
│       ├── calculateProfileCompletion()
│       ├── isProfileReadyForBookings()
│       └── getMissingSections()
│
├── constants/
│   └── colors.js (Dark theme colors)
│
└── navigation/
    └── AppNavigator.jsx (Routes trainer to TrainerDashboard)
```

## Usage Example

### Accessing Trainer Dashboard
```jsx
// From registration flow
navigation.navigate("TrainerDashboard", {
  userData: {
    userId: "trainer123",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    // Additional profile data...
  },
});
```

### Checking Profile Completion
```jsx
import { calculateProfileCompletion, isProfileReadyForBookings } from "../utils/profileCompletion";

const profileData = { /* trainer profile */ };
const completion = calculateProfileCompletion(profileData); // Returns 0-100
const canAcceptBookings = isProfileReadyForBookings(profileData); // Returns boolean
```

## Integration Points

### 1. **Registration Flow → Dashboard**
- TrainerRegisterScreen → TrainerDashboard with userData
- Automatically redirects to Profile if incomplete

### 2. **Booking Request Blocking**
- BookingRequests.jsx checks profile completion
- Disables "Accept" button if < 70%
- Shows warning with completion % and quick action button

### 3. **Profile Completion Indicator**
- Available in Profile tab badge
- Visible in all screens via progress bar on Profile tab
- Updated in real-time as fields change

### 4. **API Integration Points**
- Profile completion data stored in backend
- Booking requests blocked server-side if profile incomplete
- Messages fetched from real-time messaging service
- Bookings synced with backend calendar system

## Best Practices

1. **Profile Completion First**
   - Always ensure profile ≥ 70% before allowing bookings
   - Use warning banners to prompt completion
   - Make the Profile tab easily accessible

2. **Visual Feedback**
   - Use badges for actionable items (notifications, warnings)
   - Color-code status: Amber (warning), Green (complete), Red (error)
   - Show progress indicators for multi-step forms

3. **Navigation Patterns**
   - Use bottom tabs for primary screens (frequent access)
   - Keep tab structure consistent across app
   - Auto-redirect only for critical completions

4. **Error Prevention**
   - Disable actions (like booking acceptance) when not allowed
   - Show clear error messages with solutions
   - Provide quick navigation to resolution screens

## Testing Checklist

- [ ] Tab navigation switches between all 5 screens
- [ ] Profile badge shows only when completion < 70%
- [ ] Requests badge shows accurate pending count
- [ ] Auto-redirect to Profile on first load if incomplete
- [ ] Warning banner appears when profile < 70%
- [ ] Success banner appears when profile ≥ 70%
- [ ] Accept button disabled in Requests if profile < 70%
- [ ] Progress bar updates in real-time while filling profile
- [ ] Dark theme colors apply consistently
- [ ] All icons render correctly in tab bar
- [ ] Completion calculation matches weighted percentages
- [ ] Navigation persists state when switching tabs
- [ ] Badges update when counts change
- [ ] Mobile responsive on all device sizes

## Future Enhancements

1. **Notifications Tab** - Add dedicated notifications screen
2. **Analytics** - Dashboard analytics and performance metrics
3. **Schedule Management** - Interactive calendar for availability
4. **Client Management** - View/manage registered clients
5. **Payment History** - Detailed earnings and transaction history
6. **Settings** - Profile preferences and notification settings
