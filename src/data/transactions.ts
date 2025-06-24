export const transactions = [
  // Lerato's transactions (organizer ID: 550e8400-e29b-41d4-a716-446655440002)
  
  // Cape Town Jazz Night ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440001",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440101",
    ticketId: "550e8400-e29b-41d4-a716-446655440301",
    type: "sale",
    description: "Ticket sale - Cape Town Jazz Night",
    grossAmount: 400, // 2 tickets × R200
    platformFee: 60, // 15% of gross
    netAmount: 340,
    status: "completed",
    timestamp: "2025-06-15T10:30:00",
    payoutDate: null // Will be set when payout is processed
  },
  
  // Sunset Yoga on the Beach ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440002",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440103",
    ticketId: "550e8400-e29b-41d4-a716-446655440304",
    type: "sale",
    description: "Ticket sale - Sunset Yoga on the Beach",
    grossAmount: 100, // 1 ticket × R100
    platformFee: 15, // 15% of gross
    netAmount: 85,
    status: "completed",
    timestamp: "2025-06-25T14:15:00",
    payoutDate: null
  },
  
  // Gqeberha Comedy Showcase ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440003",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440105",
    ticketId: null, // Multiple ticket sales aggregated
    type: "sale",
    description: "Ticket sales - Gqeberha Comedy Showcase",
    grossAmount: 14220, // 79 tickets × R180
    platformFee: 2133, // 15% of gross
    netAmount: 12087,
    status: "completed",
    timestamp: "2025-07-20T16:45:00",
    payoutDate: null
  },
  
  // Cape Town Board Game Bash ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440004",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440109",
    ticketId: null,
    type: "sale",
    description: "Ticket sales - Cape Town Board Game Bash",
    grossAmount: 14520, // 121 tickets × R120
    platformFee: 2178, // 15% of gross
    netAmount: 12342,
    status: "completed",
    timestamp: "2025-08-10T11:20:00",
    payoutDate: null
  },
  
  // Cape Town Acoustic Sessions ticket sales (past event)
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440005",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440111",
    ticketId: "550e8400-e29b-41d4-a716-446655440305",
    type: "sale",
    description: "Ticket sale - Cape Town Acoustic Sessions",
    grossAmount: 150, // 1 ticket × R150
    platformFee: 22.5, // 15% of gross
    netAmount: 127.5,
    status: "completed",
    timestamp: "2024-11-10T09:30:00",
    payoutDate: "2024-11-20T10:00:00"
  },
  
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440006",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440111",
    ticketId: "550e8400-e29b-41d4-a716-446655440306",
    type: "sale",
    description: "Ticket sale - Cape Town Acoustic Sessions",
    grossAmount: 300, // 2 tickets × R150
    platformFee: 45, // 15% of gross
    netAmount: 255,
    status: "completed",
    timestamp: "2024-11-12T15:45:00",
    payoutDate: "2024-11-20T10:00:00"
  },
  
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440007",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440111",
    ticketId: "550e8400-e29b-41d4-a716-446655440307",
    type: "sale",
    description: "Ticket sale - Cape Town Acoustic Sessions",
    grossAmount: 150, // 1 ticket × R150
    platformFee: 22.5, // 15% of gross
    netAmount: 127.5,
    status: "completed",
    timestamp: "2024-11-14T12:20:00",
    payoutDate: "2024-11-20T10:00:00"
  },
  
  // Payout for Cape Town Acoustic Sessions (past event)
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440008",
    organizerId: "550e8400-e29b-41d4-a716-446655440002",
    eventId: "550e8400-e29b-41d4-a716-446655440111",
    ticketId: null,
    type: "payout",
    description: "Payout - Cape Town Acoustic Sessions",
    grossAmount: 0,
    platformFee: 0,
    netAmount: -510, // Total payout: R127.5 + R255 + R127.5 = R510
    status: "completed",
    timestamp: "2024-11-20T10:00:00",
    payoutDate: "2024-11-20T10:00:00",
    payoutMethod: "Bank Transfer",
    payoutReference: "PAY-20241120-001"
  },
  
  // Zanele's transactions (organizer ID: 550e8400-e29b-41d4-a716-446655440005)
  
  // Jozi Food Truck Festival ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440009",
    organizerId: "550e8400-e29b-41d4-a716-446655440005",
    eventId: "550e8400-e29b-41d4-a716-446655440102",
    ticketId: "550e8400-e29b-41d4-a716-446655440303",
    type: "sale",
    description: "Ticket sale - Jozi Food Truck Festival",
    grossAmount: 450, // 3 tickets × R150
    platformFee: 67.5, // 15% of gross
    netAmount: 382.5,
    status: "completed",
    timestamp: "2025-06-20T13:30:00",
    payoutDate: null
  },
  
  // Pretoria Coding Hackathon (free event - no transactions)
  
  // Stellenbosch Wine & Cheese Fair ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440010",
    organizerId: "550e8400-e29b-41d4-a716-446655440005",
    eventId: "550e8400-e29b-41d4-a716-446655440106",
    ticketId: null,
    type: "sale",
    description: "Ticket sales - Stellenbosch Wine & Cheese Fair",
    grossAmount: 66500, // 190 tickets × R350
    platformFee: 9975, // 15% of gross
    netAmount: 56525,
    status: "completed",
    timestamp: "2025-07-25T09:15:00",
    payoutDate: null
  },
  
  // Drakensberg Hiking Weekend ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440011",
    organizerId: "550e8400-e29b-41d4-a716-446655440005",
    eventId: "550e8400-e29b-41d4-a716-446655440108",
    ticketId: null,
    type: "sale",
    description: "Ticket sales - Drakensberg Hiking Weekend",
    grossAmount: 21500, // 43 tickets × R500
    platformFee: 3225, // 15% of gross
    netAmount: 18275,
    status: "completed",
    timestamp: "2025-08-05T14:20:00",
    payoutDate: null
  },
  
  // Joburg Startup Mixer ticket sales
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440012",
    organizerId: "550e8400-e29b-41d4-a716-446655440005",
    eventId: "550e8400-e29b-41d4-a716-446655440110",
    ticketId: null,
    type: "sale",
    description: "Ticket sales - Joburg Startup Mixer",
    grossAmount: 16400, // 164 tickets × R100
    platformFee: 2460, // 15% of gross
    netAmount: 13940,
    status: "completed",
    timestamp: "2025-08-18T16:30:00",
    payoutDate: null
  },
  
  // Past Outdoor Movie Night ticket sales and payout
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440013",
    organizerId: "550e8400-e29b-41d4-a716-446655440005",
    eventId: "550e8400-e29b-41d4-a716-446655440100",
    ticketId: "550e8400-e29b-41d4-a716-446655440302",
    type: "sale",
    description: "Ticket sale - Past Outdoor Movie Night",
    grossAmount: 90, // 1 ticket × R90
    platformFee: 13.5, // 15% of gross
    netAmount: 76.5,
    status: "completed",
    timestamp: "2024-12-10T11:45:00",
    payoutDate: "2024-12-25T09:00:00"
  },
  
  // Additional sales for Past Outdoor Movie Night (to reach 96 sold)
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440014",
    organizerId: "550e8400-e29b-41d4-a716-446655440005",
    eventId: "550e8400-e29b-41d4-a716-446655440100",
    ticketId: null,
    type: "sale",
    description: "Ticket sales - Past Outdoor Movie Night (bulk)",
    grossAmount: 8550, // 95 tickets × R90
    platformFee: 1282.5, // 15% of gross
    netAmount: 7267.5,
    status: "completed",
    timestamp: "2024-12-15T14:20:00",
    payoutDate: "2024-12-25T09:00:00"
  },
  
  // Payout for Past Outdoor Movie Night
  {
    id: "txn-550e8400-e29b-41d4-a716-446655440015",
    organizerId: "550e8400-e29b-41d4-a716-446655440005",
    eventId: "550e8400-e29b-41d4-a716-446655440100",
    ticketId: null,
    type: "payout",
    description: "Payout - Past Outdoor Movie Night",
    grossAmount: 0,
    platformFee: 0,
    netAmount: -7344, // Total payout: R76.5 + R7267.5 = R7344
    status: "completed",
    timestamp: "2024-12-25T09:00:00",
    payoutDate: "2024-12-25T09:00:00",
    payoutMethod: "Bank Transfer",
    payoutReference: "PAY-20241225-001"
  }
];