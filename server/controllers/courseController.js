import Course from "../models/Course.js";

// get all courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    // Corrected the typo: 'sucess' to 'success'
    res.json({ success: true, courses });
  } catch (error) {
    // Corrected the typo: 'sucess' to 'success' and added logging
    console.error("Error fetching all courses:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// get Course by id
export const getCourseId = async (req, res) => {
  const { _id } = req.params;
  try {
    const courseData = await Course.findById(_id).populate({
      path: "educator",
    });

    // Added a check to see if the course was found
    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    // Remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
