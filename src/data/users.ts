export const users = [
  { 
    id: "550e8400-e29b-41d4-a716-446655440001", 
    username: "thabo", 
    password: "pass123", 
    name: "Thabo Mokoena", 
    role: "attendee",
    email: "thabo@example.com",
    credits: 0,
    fee: 0, // Attendees don't pay fees
    verified: false,
    image: "https://randomuser.me/api/portraits/men/1.jpg" // Updated image for Thabo
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440002", 
    username: "lerato", 
    password: "organize1", 
    name: "Lerato Events", 
    role: "organizer", 
    bio: "Curating unforgettable moments.",
    email: "lerato@leratomusic.co.za",
    phone: "+27 82 123 4567",
    fee: 15, // 15% platform fee
    verified: true, // Has 6 events, so verified
    image: "https://randomuser.me/api/portraits/women/2.jpg" // Updated image for Lerato
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440003", 
    username: "emily", 
    password: "securepw", 
    name: "Emily Clark", 
    role: "attendee",
    email: "emily@example.com",
    credits: 120,
    fee: 0, // Attendees don't pay fees
    verified: false,
    image: "https://randomuser.me/api/portraits/women/3.jpg" // Updated image for Emily
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440004", 
    username: "joao", 
    password: "letmein", 
    name: "João Pereira", 
    role: "attendee",
    email: "joao@example.com",
    credits: 0,
    fee: 0, // Attendees don't pay fees
    verified: false,
    image: "https://randomuser.me/api/portraits/men/4.jpg" // Updated image for João
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440005", 
    username: "zanele", 
    password: "zanele123", 
    name: "Zanele Events Co.", 
    role: "organizer", 
    bio: "We bring energy to every experience.",
    email: "zanele@zaneleevents.co.za",
    phone: "+27 83 987 6543",
    fee: 15, // 15% platform fee
    verified: true, // Has 6 events, so verified
    image: "https://randomuser.me/api/portraits/women/5.jpg" // Updated image for Zanele
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440006", 
    username: "michael", 
    password: "mikepass", 
    name: "Michael Lee", 
    role: "attendee",
    email: "michael@example.com",
    credits: 200,
    fee: 0, // Attendees don't pay fees
    verified: false,
    image: "https://randomuser.me/api/portraits/men/6.jpg" // Updated image for Michael
  },
  { 
    id: "550e8400-e29b-41d4-a716-446655440007", 
    username: "admin", 
    password: "admin123", 
    name: "Admin User", 
    role: "admin",
    email: "admin@events.platform",
    fee: 0, // Admins don't pay fees
    verified: true, // Admins are always verified
    image: "https://randomuser.me/api/portraits/men/7.jpg" // Updated image for Admin
  }
];