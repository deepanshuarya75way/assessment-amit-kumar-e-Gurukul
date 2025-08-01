import Course from "../models/Course.js";

// get all courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    res.json({ sucess: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get Course by id

export const getCourseId = async (req, res) => {
  const { _id } = req.params;
  try {
    const courseData = await Course.findById(_id).populate({
      path: "educator",
    });

    //Remove lectureUrl if isPreviewFree is false

    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
