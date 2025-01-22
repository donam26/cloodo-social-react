export const userGroups = [
  {
    id: 1,
    name: "Cộng đồng React Việt Nam",
    avatar: "/images/groups/react.jpg",
    members: 25000,
    newPosts: 12,
  },
  {
    id: 2, 
    name: "Next.js Developers",
    avatar: "/images/groups/nextjs.jpg",
    members: 15000,
    newPosts: 8,
  },
  {
    id: 3,
    name: "TypeScript Việt Nam",
    avatar: "/images/groups/typescript.jpg", 
    members: 10000,
    newPosts: 5,
  },
];

export const groupSuggestions = [
  {
    id: 4,
    name: "JavaScript Việt Nam",
    avatar: "/images/groups/javascript.jpg",
    members: 35000,
    postsPerDay: 25,
  },
  {
    id: 5,
    name: "Vue.js Developers",
    avatar: "/images/groups/vuejs.jpg",
    members: 20000,
    postsPerDay: 15,
  },
  {
    id: 6,
    name: "Angular Việt Nam",
    avatar: "/images/groups/angular.jpg",
    members: 18000,
    postsPerDay: 12,
  },
];

export const groupPosts = [
  {
    id: 1,
    group: {
      id: 1,
      name: "Cộng đồng React Việt Nam",
      avatar: "/images/groups/react.jpg",
    },
    author: {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/images/avatar.jpg",
    },
    content: "Chia sẻ một số tips hay khi làm việc với React Hooks",
    image: "/images/posts/react-hooks.jpg",
    createdAt: "2 giờ trước",
    stats: {
      likes: 256,
      comments: 45,
      shares: 12,
    },
  },
  {
    id: 2,
    group: {
      id: 2,
      name: "Next.js Developers",
      avatar: "/images/groups/nextjs.jpg",
    },
    author: {
      id: 2,
      name: "Trần Thị B",
      avatar: "/images/avatar.jpg",
    },
    content: "Next.js 13 có những tính năng mới nào?",
    image: "/images/posts/nextjs-13.jpg",
    createdAt: "5 giờ trước",
    stats: {
      likes: 189,
      comments: 32,
      shares: 8,
    },
  },
]; 