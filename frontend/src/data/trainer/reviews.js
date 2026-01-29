export const reviewsData = [
  {
    id: "review_001",
    userName: "John Doe",
    userProfilePicture: "https://via.placeholder.com/50",
    rating: 5,
    comment: "Excellent trainer! Very professional and motivating. Would highly recommend!",
    date: "2026-01-25",
  },
  {
    id: "review_002",
    userName: "Sarah Smith",
    userProfilePicture: "https://via.placeholder.com/50",
    rating: 4.5,
    comment: "Great coaching style. Easy to understand instructions. Very flexible with timing.",
    date: "2026-01-24",
  },
  {
    id: "review_003",
    userName: "Mike Johnson",
    userProfilePicture: "https://via.placeholder.com/50",
    rating: 5,
    comment: "Best trainer I've ever worked with. Personalized training plan is amazing!",
    date: "2026-01-23",
  },
  {
    id: "review_004",
    userName: "Emily Brown",
    userProfilePicture: "https://via.placeholder.com/50",
    rating: 4,
    comment: "Good sessions and results are showing. Highly experienced trainer.",
    date: "2026-01-20",
  },
  {
    id: "review_005",
    userName: "David Lee",
    userProfilePicture: "https://via.placeholder.com/50",
    rating: 5,
    comment: "Outstanding! The best $50/hour investment I've made. Highly recommend!",
    date: "2026-01-18",
  },
  {
    id: "review_006",
    userName: "Jessica Garcia",
    userProfilePicture: "https://via.placeholder.com/50",
    rating: 4.5,
    comment: "Very attentive and encouraging. Helped me reach my fitness goals.",
    date: "2026-01-15",
  },
];

export const messagesData = {
  chats: [
    {
      id: "chat_001",
      userId: "user_001",
      userName: "John Doe",
      userProfilePicture: "https://via.placeholder.com/50",
      lastMessage: "Thanks for the session today!",
      timestamp: "2026-01-29 14:30",
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: "chat_002",
      userId: "user_002",
      userName: "Sarah Smith",
      userProfilePicture: "https://via.placeholder.com/50",
      lastMessage: "See you tomorrow at 10:30 AM",
      timestamp: "2026-01-29 12:15",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "chat_003",
      userId: "user_003",
      userName: "Mike Johnson",
      userProfilePicture: "https://via.placeholder.com/50",
      lastMessage: "Can we reschedule to next week?",
      timestamp: "2026-01-28 18:45",
      unreadCount: 2,
      isOnline: false,
    },
    {
      id: "chat_004",
      userId: "user_004",
      userName: "Emily Brown",
      userProfilePicture: "https://via.placeholder.com/50",
      lastMessage: "The workout routine is amazing!",
      timestamp: "2026-01-27 16:20",
      unreadCount: 0,
      isOnline: true,
    },
  ],
  messageHistory: {
    "chat_001": [
      {
        id: "msg_001",
        sender: "trainer",
        content: "Hi John! Ready for your session?",
        timestamp: "2026-01-29 08:45",
      },
      {
        id: "msg_002",
        sender: "user",
        content: "Yes! I'm on my way.",
        timestamp: "2026-01-29 08:50",
      },
      {
        id: "msg_003",
        sender: "trainer",
        content: "Great! See you soon.",
        timestamp: "2026-01-29 08:52",
      },
      {
        id: "msg_004",
        sender: "user",
        content: "Thanks for the session today!",
        timestamp: "2026-01-29 14:30",
      },
    ],
  },
};

export const availabilityStatusData = {
  isOnline: true,
  lastActive: "2026-01-29 15:45",
};
