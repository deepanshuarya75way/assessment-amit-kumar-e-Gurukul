import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // FIX 1: Define the missing state for user data
  const [userData, setUserData] = useState(null);

  const fetchAllCourses = async () => {
    // ... (Your fetchAllCourses function is mostly fine, no changes needed here)
    // You can keep your existing detailed error handling.
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to fetch courses.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Network error. Could not fetch courses.");
    } finally {
      setIsLoading(false);
    }
  };

  // FIX 3: Improved rating calculation
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    const totalRating = course.courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    const averageRating = totalRating / course.courseRatings.length;
    return parseFloat(averageRating.toFixed(1));
  };

  // ... (Your other calculation functions like calculateChapterTime are fine)
  const calculateChapterTime = (chapter) => {
    if (!chapter.chapterContent) return "0 minutes";
    const totalTimeInMinutes = chapter.chapterContent.reduce(
      (sum, lecture) => sum + lecture.lectureDuration,
      0
    );
    return humanizeDuration(totalTimeInMinutes * 60 * 1000, {
      units: ["h", "m"],
    });
  };
  const calculateCourseDuration = (course) => {
    if (!course.courseContent) return "0 minutes";
    const totalTimeInMinutes = course.courseContent.reduce(
      (sum, chapter) =>
        sum +
        chapter.chapterContent.reduce(
          (chapterSum, lecture) => chapterSum + lecture.lectureDuration,
          0
        ),
      0
    );
    return humanizeDuration(totalTimeInMinutes * 60 * 1000, {
      units: ["h", "m"],
    });
  };
  const calculateNoOfLectures = (course) => {
    if (!course.courseContent) return 0;
    return course.courseContent.reduce(
      (sum, chapter) =>
        sum +
        (Array.isArray(chapter.chapterContent)
          ? chapter.chapterContent.length
          : 0),
      0
    );
  };

  // FIX 2: Corrected logic for fetching enrolled courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication session not found. Please log in.");
        return;
      }
      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
      toast.error("Could not fetch your enrolled courses.");
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllCourses();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    enrolledCourses,
    isLoading,
    isEducator,
    setIsEducator,
    navigate,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    fetchUserEnrolledCourses,
    fetchAllCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    enrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
