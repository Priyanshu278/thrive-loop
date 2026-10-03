import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Checkin } from "../models/checkin.model.js";
import { Exam } from "../models/exam.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const seedDemoCohort = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    // 1. Create or ensure 12 demo students
    const passwordHash = await bcrypt.hash("demo1234", 10);
    const demoNames = [
      "Aarav Sharma", "Diya Patel", "Rohan Mehta", "Ananya Singh",
      "Ishaan Verma", "Kavya Iyer", "Aditya Nair", "Sneha Rao",
      "Arjun Gupta", "Pooja Joshi", "Manish Kulkarni", "Tanvi Bhat"
    ];

    let createdUsers = 0;
    let createdCheckins = 0;

    for (let i = 0; i < demoNames.length; i++) {
      const email = `student${i + 1}@freebuff.demo`;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: demoNames[i],
          email,
          passwordHash,
          onboardingCompleted: true,
        });
        createdUsers++;
      }

      // Check if user already has checkins
      const existing = await Checkin.countDocuments({ user: user._id });
      if (existing === 0) {
        // Create 5-7 days of realistic checkin telemetry
        const today = new Date();
        for (let d = 0; d < 5; d++) {
          const checkinDate = new Date(today);
          checkinDate.setDate(today.getDate() - d);
          const dateStr = checkinDate.toISOString().slice(0, 10);

          // Varying sleep & stress
          const sleepHours = Number((5.5 + (i % 4) * 0.7 - (d === 0 ? 0.5 : 0)).toFixed(1));
          const stress = Math.min(5, Math.max(1, 2 + ((i + d) % 4)));
          const mood = Math.min(5, Math.max(1, 4 - ((i + d) % 3)));
          const deadlines = (i + d) % 3;

          await Checkin.create({
            user: user._id,
            date: dateStr,
            sleepHours,
            stress,
            mood,
            deadlines,
          });
          createdCheckins++;
        }

        // Add 1 upcoming exam for every other student
        if (i % 2 === 0) {
          const examDate = new Date();
          examDate.setDate(examDate.getDate() + 3 + (i % 5));
          await Exam.create({
            user: user._id,
            title: i % 4 === 0 ? "Data Structures & Algorithms Midterm" : "Operating Systems Final",
            date: examDate,
            type: "exam",
          });
        }
      }
    }

    res.json({
      ok: true,
      message: `Demo student cohort seeded successfully! 12 active students with check-in records.`,
      studentsAvailable: demoNames.length,
      sampleLogin: "student1@freebuff.demo (password: demo1234)"
    });
  }
);

export const resetDemoCohort = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    // Remove all demo users
    const demoUsers = await User.find({ email: { $regex: /@freebuff\.demo$/ } });
    const userIds = demoUsers.map((u) => u._id);

    await Checkin.deleteMany({ user: { $in: userIds } });
    await Exam.deleteMany({ user: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });

    res.json({
      ok: true,
      message: "Demo student cohort cleared. Clean state restored."
    });
  }
);
