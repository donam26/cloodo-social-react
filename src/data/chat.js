export const chatMessages = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "/images/avatar.jpg",
    isOnline: true,
    unreadCount: 3,
    lastMessage: {
      content: "Hẹn gặp lại bạn nhé! 👋",
      time: "5 phút"
    },
    messages: [
      {
        content: "Chào bạn!",
        time: "10:00",
        isSender: false
      },
      {
        content: "Chào bạn, bạn khỏe không?",
        time: "10:01",
        isSender: true
      },
      {
        content: "Mình khỏe, cảm ơn bạn! Bạn đang làm gì vậy?",
        time: "10:02",
        isSender: false
      },
      {
        content: "Mình đang code dự án mới 😊",
        time: "10:03",
        isSender: true
      },
      {
        content: "Hẹn gặp lại bạn nhé! 👋",
        time: "10:04",
        isSender: false
      }
    ]
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "/images/avatar2.jpg",
    isOnline: false,
    unreadCount: 0,
    lastMessage: {
      content: "Ok bạn nhé!",
      time: "1 giờ"
    },
    messages: [
      {
        content: "Bạn ơi, cuối tuần này mình đi cafe không?",
        time: "9:00",
        isSender: false
      },
      {
        content: "Được chứ, mấy giờ vậy bạn?",
        time: "9:05",
        isSender: true
      },
      {
        content: "9h sáng được không?",
        time: "9:06",
        isSender: false
      },
      {
        content: "Ok bạn nhé!",
        time: "9:07",
        isSender: true
      }
    ]
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "/images/avatar3.jpg",
    isOnline: true,
    unreadCount: 1,
    lastMessage: {
      content: "Ngày mai họp lúc mấy giờ vậy?",
      time: "2 giờ"
    },
    messages: [
      {
        content: "Chào bạn, ngày mai mình có cuộc họp",
        time: "14:00",
        isSender: false
      },
      {
        content: "Ngày mai họp lúc mấy giờ vậy?",
        time: "14:01",
        isSender: true
      }
    ]
  }
]; 