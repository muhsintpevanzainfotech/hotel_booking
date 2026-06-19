const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require("mongoose");
const ComboOffer = require("../models/ComboOffer");

const comboOffers = [
  {
    title: "Lakeside Romance",
    type: "Romantic Escapes",
    price: 9999,
    description:
      "Escape into a world of romance with lakeside views, candlelight dining, and unforgettable moments together.",
    includes: [
      "Harmony Suite Stay",
      "Complimentary Breakfast",
      "Welcome Drink",
      "Pool Access",
      "Sunset Lakeside Walk",
      "Candlelight Dinner",
      "Bonfire Evening",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Honeymoon Bliss",
    type: "Romantic Escapes",
    price: 14999,
    description:
      "Celebrate your love with luxurious accommodations, romantic experiences, and memorable surprises.",
    includes: [
      "Premium Suite Stay",
      "Breakfast & Dinner",
      "Room Decoration",
      "Complimentary Cake",
      "Couple Photoshoot",
      "Pool Experience",
      "Romantic Dining",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Moonlight Retreat",
    type: "Romantic Escapes",
    price: 18999,
    description:
      "A private luxury retreat featuring exclusive dining, wellness experiences, and premium accommodations.",
    includes: [
      "Luxury Villa Stay",
      "All Meals",
      "Spa Voucher",
      "Private Dining Setup",
      "Lakeside Dinner",
      "Couple Wellness Session",
      "Evening Entertainment",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Family Fun Getaway",
    type: "Family Adventures",
    price: 11999,
    description:
      "Create unforgettable family memories with fun activities and comfortable accommodations.",
    includes: [
      "Family Villa",
      "Breakfast",
      "Pool Access",
      "Kids Play Zone",
      "Indoor Games",
      "Family Movie Night",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Weekend Family Escape",
    type: "Family Adventures",
    price: 19999,
    description:
      "Enjoy a refreshing family getaway filled with entertainment, relaxation, and adventure.",
    includes: [
      "Family Suite",
      "Breakfast & Dinner",
      "Activity Pass",
      "Swimming",
      "Outdoor Games",
      "Campfire",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Grand Family Retreat",
    type: "Family Adventures",
    price: 27999,
    description:
      "Experience the ultimate family holiday with premium accommodations and resort activities.",
    includes: [
      "Premium Family Villa",
      "All Meals",
      "Resort Activity Access",
      "Adventure Games",
      "Family Competitions",
      "Evening Cultural Program",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Business Express",
    type: "Executive Retreats",
    price: 7999,
    description:
      "Designed for professionals seeking productivity, comfort, and premium business facilities.",
    includes: [
      "Club Room Stay",
      "Breakfast",
      "Board Room Access",
      "Team Meetings",
      "Networking Sessions",
      "Pool Access",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Team Recharge Package",
    type: "Executive Retreats",
    price: 14999,
    description:
      "Combine work and relaxation with team-building activities and premium hospitality.",
    includes: [
      "Accommodation",
      "All Meals",
      "Meeting Facilities",
      "Team Building Activities",
      "Group Games",
      "Bonfire Networking",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Leadership Retreat",
    type: "Executive Retreats",
    price: 24999,
    description:
      "A premium executive experience for strategic planning, networking, and wellness.",
    includes: [
      "Premium Accommodation",
      "Conference Facilities",
      "Business Lounge Access",
      "Strategy Workshops",
      "Executive Networking",
      "Wellness Sessions",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Dream Wedding Package",
    type: "Celebrations & Events",
    price: 149999,
    description:
      "Transform your special day into a luxurious wedding celebration with premium services.",
    includes: [
      "Banquet Hall",
      "Decoration Setup",
      "Bridal Suite",
      "Wedding Ceremony",
      "Reception",
      "Photography Locations",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Grand Celebration Package",
    type: "Celebrations & Events",
    price: 69999,
    description:
      "Perfect for birthdays, anniversaries, and family gatherings in an elegant setting.",
    includes: [
      "Event Venue",
      "Catering Support",
      "Sound System",
      "Birthday Party",
      "Anniversary Celebration",
      "Family Gathering",
    ],
    links: "",
    coverImage: "",
  },
  {
    title: "Signature Event Experience",
    type: "Celebrations & Events",
    price: 99999,
    description:
      "Host extraordinary events with premium venues, decor, and hospitality services.",
    includes: [
      "Outdoor Venue",
      "Premium Decoration",
      "Guest Accommodation",
      "Corporate Events",
      "Product Launches",
      "Award Functions",
    ],
    links: "",
    coverImage: "",
  },
];

async function seedComboOffers() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing!");
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    await ComboOffer.deleteMany();
    console.log("Existing combo offers removed.");

    await ComboOffer.insertMany(comboOffers);
    console.log("Combo offers seeded successfully.");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedComboOffers();
