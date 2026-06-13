// server/scripts/migrateAttendance.js (example)
import mongoose from "mongoose";
import { Registration } from "../models/registration.js";
import { connectDB } from "../config/db.js";

await connectDB();

await Registration.updateMany(
  { attendanceStatus: { $exists: false } },
  { $set: { attendanceStatus: "not_marked" } }
);

await Registration.updateMany(
  { status: "attended" },
  { $set: { status: "approved", attendanceStatus: "attended" } }
);

await Registration.updateMany(
  { status: { $in: ["absent", "no_show"] } },
  { $set: { status: "approved", attendanceStatus: "absent" } }
);

console.log("done");
process.exit(0);