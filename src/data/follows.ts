export const follows = [
  {
    id: 1,
    followerId: 1, // Thabo follows Lerato
    followingId: 2,
    timestamp: "2025-06-20T10:00:00"
  },
  {
    id: 2,
    followerId: 2, // Lerato follows Thabo back
    followingId: 1,
    timestamp: "2025-06-20T15:30:00"
  },
  {
    id: 3,
    followerId: 3, // Emily follows Lerato
    followingId: 2,
    timestamp: "2025-06-21T09:15:00"
  },
  {
    id: 4,
    followerId: 1, // Thabo follows Emily
    followingId: 3,
    timestamp: "2025-06-21T14:20:00"
  },
  {
    id: 5,
    followerId: 6, // Michael follows Zanele
    followingId: 5,
    timestamp: "2025-06-22T11:45:00"
  },
  {
    id: 6,
    followerId: 5, // Zanele follows Michael back
    followingId: 6,
    timestamp: "2025-06-22T16:30:00"
  },
  {
    id: 7,
    followerId: 4, // João follows Lerato
    followingId: 2,
    timestamp: "2025-06-23T08:00:00"
  }
];