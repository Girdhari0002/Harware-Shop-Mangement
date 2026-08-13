import { asyncHandler } from "../utils/asyncHandler.js";
import { attendanceService } from "../services/attendance.service.js";

// Public — the gate-side scanner on the landing page isn't a logged-in session.
export const scanAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.scan(req.body.code);
  res.json({ success: true, ...result });
});

export const listAttendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.list(req.query);
  res.json({ success: true, data });
});

export const todayAttendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.today();
  res.json({ success: true, data });
});
