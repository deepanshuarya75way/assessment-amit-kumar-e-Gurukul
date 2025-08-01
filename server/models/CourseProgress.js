import mongoose from "mongoose";

const CourseProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completeId: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  { minimize: false }
);

export const CourseProgress = mongoose.model(
  "CourseProgress",
  CourseProgressSchema
);
