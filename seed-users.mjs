import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema.js";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seedDemoUsers() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Seeding demo users...");

  const demoUsers = [
    {
      username: "admin9197",
      password: "Admin9197",
      role: "admin",
      name: "AL AMIN",
      email: "admin@amintouch.com",
      loginMethod: "local",
    },
    {
      username: "ronytalukder",
      password: "@jead2016R",
      role: "user",
      name: "RONY TALUKDER",
      email: "rony@amintouch.com",
      loginMethod: "local",
    },
    {
      username: "mahir",
      password: "Mahir3",
      role: "user",
      name: "MAHIR",
      email: "mahir@amintouch.com",
      loginMethod: "local",
    },
    {
      username: "sakiladnan",
      password: "Sakiladnan",
      role: "user",
      name: "SAKIL ADNAN",
      email: "sakil@amintouch.com",
      loginMethod: "local",
    },
  ];

  for (const user of demoUsers) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await db.insert(users).values({
        username: user.username,
        password: hashedPassword,
        role: user.role,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
      });

      console.log(`✔ Inserted: ${user.username}`);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log(`⚠ User already exists: ${user.username}`);
      } else {
        console.error("❌ Error inserting user:", err);
      }
    }
  }

  console.log("🎉 Seeding complete.");
  process.exit(0);
}

seedDemoUsers();

