export const messagesData = [
  {
    chat_id: "C001",
    trainer_id: "T001",
    trainer_name: "John Fitness",
    trainer_specialty: "Fitness",
    avatar: "👨‍🏫",
    lastMessage: "Great workout session yesterday! Keep it up 💪",
    timestamp: "2h ago",
    unread: false,
    messages: [
      { id: "1", sender: "trainer", text: "Hi! How are you doing?", timestamp: "10:30 AM" },
      { id: "2", sender: "user", text: "Good! Ready for the session", timestamp: "10:31 AM" },
      { id: "3", sender: "trainer", text: "Great workout session yesterday! Keep it up 💪", timestamp: "2h ago" },
    ]
  },
  {
    chat_id: "C002",
    trainer_id: "T002",
    trainer_name: "Sarah Yoga",
    trainer_specialty: "Yoga",
    avatar: "👩‍🏫",
    lastMessage: "See you tomorrow at 6 PM for the class",
    timestamp: "1d ago",
    unread: true,
    messages: [
      { id: "1", sender: "trainer", text: "Remember to bring your yoga mat", timestamp: "Yesterday" },
      { id: "2", sender: "user", text: "Will do!", timestamp: "Yesterday" },
      { id: "3", sender: "trainer", text: "See you tomorrow at 6 PM for the class", timestamp: "1d ago" },
    ]
  },
  {
    chat_id: "C003",
    trainer_id: "T003",
    trainer_name: "Mike Coding",
    trainer_specialty: "Coding",
    avatar: "👨‍💻",
    lastMessage: "Your code is looking good. Keep practicing!",
    timestamp: "2d ago",
    unread: false,
    messages: [
      { id: "1", sender: "trainer", text: "Did you complete the assignment?", timestamp: "2d ago" },
      { id: "2", sender: "user", text: "Yes, submitted it", timestamp: "2d ago" },
      { id: "3", sender: "trainer", text: "Your code is looking good. Keep practicing!", timestamp: "2d ago" },
    ]
  },
];
