const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, 
});

const owners = [
  { name: "Rahul Sharma", email: "rahul@demo.com", address: "Pune, IN", role: "OWNER" },
  { name: "Sneha Mehta", email: "sneha@demo.com", address: "Mumbai, IN", role: "OWNER" },
  { name: "Arjun Verma", email: "arjun@demo.com", address: "Delhi, IN", role: "OWNER" },
];

const users = [
  { name: "Aisha Kapoor", email: "aisha@demo.com", address: "Mumbai, IN", role: "USER" },
  { name: "Rohan Gupta", email: "rohan@demo.com", address: "Delhi, IN", role: "USER" },
  { name: "Maya Joshi", email: "maya@demo.com", address: "Pune, IN", role: "USER" },
  { name: "Ishaan Patil", email: "ishaan@demo.com", address: "Nagpur, IN", role: "USER" },
  { name: "Neha Rao", email: "neha@demo.com", address: "Hyderabad, IN", role: "USER" },
  { name: "Kabir Singh", email: "kabir@demo.com", address: "Bengaluru, IN", role: "USER" },
  { name: "Zoya Khan", email: "zoya@demo.com", address: "Kolkata, IN", role: "USER" },
  { name: "Dev Malhotra", email: "dev@demo.com", address: "Chennai, IN", role: "USER" },
];

const admins = [
  { name: "Admin User", email: "admin@demo.com", address: "Demo City, IN", role: "ADMIN" },
];

const storeNames = [
  ["Sunrise Grocery", "Grocery"],
  ["TechTown Electronics", "Electronics"],
  ["Cafe Amora", "Cafe"],
  ["Spice Route", "Restaurant"],
  ["Green Leaf Organics", "Grocery"],
  ["Pixel Planet", "Electronics"],
  ["Baker’s Dozen", "Bakery"],
  ["Book Nook", "Books"],
  ["Swift Laundry", "Services"],
  ["Urban Bite", "Restaurant"],
  ["Daily Needs Mart", "Grocery"],
  ["Bean & Brew", "Cafe"],
  ["Gadget Garage", "Electronics"],
  ["Fresh Fields", "Grocery"],
  ["Chai Chronicle", "Cafe"],
  ["City Pharmacy", "Pharmacy"],
  ["Shoe Sphere", "Footwear"],
  ["Style Street", "Apparel"],
  ["Home Haven", "Home & Living"],
  ["Toy Train", "Toys"],
  ["Pet Pals", "Pets"],
  ["Glow Cosmetics", "Beauty"]
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("TRUNCATE ratings, stores, users RESTART IDENTITY CASCADE");

    const passwordHash = await bcrypt.hash("password123", 10);
    const allUsers = [...owners, ...users, ...admins];

    const userIdMap = [];
    for (const u of allUsers) {
      const { rows } = await client.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id, role`,
        [u.name, u.email, passwordHash, u.address, u.role]
      );
      userIdMap.push({ id: rows[0].id, role: u.role, email: u.email });
    }

    const ownerIds = userIdMap.filter(u => u.role === "OWNER").map(u => u.id);

    const cityPool = ["Pune", "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"];

    const storeIdMap = [];
    for (let i = 0; i < storeNames.length; i++) {
      const [name, cat] = storeNames[i];
      const ownerId = ownerIds[i % ownerIds.length];
      const city = rand(cityPool);
      const email = `${name.toLowerCase().replace(/[^a-z]/g, "")}@example.com`;
      const address = `${randint(1, 250)} ${cat} Street, ${city}`;
      const { rows } = await client.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES ($1,$2,$3,$4)
         RETURNING id`,
        [name, email, address, ownerId]
      );
      storeIdMap.push(rows[0].id);
    }

    const nonOwnerUserIds = userIdMap.filter(u => u.role === "USER").map(u => u.id);
    const comments = [
      "Great experience!", "Average service.", "Loved it!", "Could be better.",
      "Highly recommend.", "Nice staff and clean place.", "Prices are fair.",
      "Not satisfied.", "Excellent quality.", "Would visit again."
    ];

    const ratingCount = 120;
    for (let i = 0; i < ratingCount; i++) {
      const storeId = rand(storeIdMap);
      const userId = rand(nonOwnerUserIds);
      const rating = randint(1, 5);
      await client.query(
        `INSERT INTO ratings (rating_value, user_id, store_id)
        VALUES ($1,$2,$3)
        ON CONFLICT (user_id, store_id) DO NOTHING`,
        [rating, userId, storeId]
      );
    }

    await client.query("COMMIT");
    console.log("✅ Seed complete: ",
      `${userIdMap.length} users, ${storeIdMap.length} stores, ${ratingCount} ratings`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed:", e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();