import mongoose from "mongoose";
import { User } from "./models/User.model.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

const seedAdmin = async () => {
  try {
    await connectDb();
    console.log("Connected to MongoDB for seeding...");

    const email = "admin@erp.local";
    const existing = await User.findOne({ email });

    if (existing) {
      if (!existing.isProtected) {
        existing.isProtected = true;
        await existing.save({ validateModifiedOnly: true });
      }
      console.log("Admin user already exists (now marked as protected). Seeding skipped.");
      console.log(`Email: ${email}`);
    } else {
      await User.create({
        fullName: "Default Admin",
        email,
        password: "Admin@123",
        role: "admin",
        isActive: true,
        isProtected: true
      });
      console.log("Admin user seeded successfully!");
      console.log(`Email: ${email}`);
      console.log("Password: Admin@123");
    }
  } catch (error) {
    console.error("Error seeding administrator:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedAdmin();
