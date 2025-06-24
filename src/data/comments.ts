export const comments = [
  // Cape Town Jazz Night comments
  {
    id: 1,
    eventId: 101,
    userId: 1,
    userName: "Thabo Mokoena",
    userRole: "attendee",
    comment: "Really excited for this! Love jazz music and the venue looks amazing.",
    timestamp: "2025-06-20T14:30:00",
    parentId: null
  },
  {
    id: 2,
    eventId: 101,
    userId: 2,
    userName: "Lerato Events",
    userRole: "organizer",
    comment: "Thanks Thabo! We've got some incredible artists lined up. You're going to love it!",
    timestamp: "2025-06-20T15:15:00",
    parentId: 1
  },
  {
    id: 3,
    eventId: 101,
    userId: 3,
    userName: "Emily Clark",
    userRole: "attendee",
    comment: "Is there parking available at the venue?",
    timestamp: "2025-06-21T09:00:00",
    parentId: null
  },
  {
    id: 4,
    eventId: 101,
    userId: 2,
    userName: "Lerato Events",
    userRole: "organizer",
    comment: "Yes Emily! There's plenty of secure parking available. We also have valet service for an additional R50.",
    timestamp: "2025-06-21T09:30:00",
    parentId: 3
  },
  {
    id: 5,
    eventId: 101,
    userId: 6,
    userName: "Michael Lee",
    userRole: "attendee",
    comment: "Can't wait! Been following the local jazz scene for years. This lineup is incredible.",
    timestamp: "2025-06-22T16:45:00",
    parentId: null
  },

  // Jozi Food Truck Festival comments
  {
    id: 6,
    eventId: 102,
    userId: 4,
    userName: "João Pereira",
    userRole: "attendee",
    comment: "Will there be vegetarian options available?",
    timestamp: "2025-06-18T11:20:00",
    parentId: null
  },
  {
    id: 7,
    eventId: 102,
    userId: 5,
    userName: "Zanele Events Co.",
    userRole: "organizer",
    comment: "Absolutely! We have 8 food trucks dedicated to vegetarian and vegan options, including some amazing plant-based burgers and fresh salads.",
    timestamp: "2025-06-18T12:00:00",
    parentId: 6
  },
  {
    id: 8,
    eventId: 102,
    userId: 1,
    userName: "Thabo Mokoena",
    userRole: "attendee",
    comment: "This sounds amazing! Perfect weekend activity with the family.",
    timestamp: "2025-06-19T10:15:00",
    parentId: null
  },
  {
    id: 9,
    eventId: 102,
    userId: 3,
    userName: "Emily Clark",
    userRole: "attendee",
    comment: "Are pets allowed? Would love to bring my dog!",
    timestamp: "2025-06-20T08:30:00",
    parentId: null
  },
  {
    id: 10,
    eventId: 102,
    userId: 5,
    userName: "Zanele Events Co.",
    userRole: "organizer",
    comment: "Yes, well-behaved pets on leashes are welcome! We'll even have a water station for our furry friends.",
    timestamp: "2025-06-20T09:00:00",
    parentId: 9
  },
  {
    id: 11,
    eventId: 102,
    userId: 6,
    userName: "Michael Lee",
    userRole: "attendee",
    comment: "Love the variety of cuisines! From Korean BBQ to authentic Mexican tacos. This is going to be epic!",
    timestamp: "2025-06-21T14:20:00",
    parentId: null
  }
];