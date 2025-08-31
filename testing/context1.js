import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the context for the application state
export const AppContext = createContext();

// AppContext Provider Component
export const AppContextProvider = (props) => {
  // Use environment variables for backend URL and currency
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  // Clerk hooks for authentication and user data
  const { getToken } = useAuth();
  const { user } = useUser();

  // State for storing courses and user information
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false); // Changed default to false
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Function to fetch all courses from the backend
  const fetchAllCourses = async () => {
    try {
      setIsLoading(true);
      // Get the authentication token from Clerk
      const token = await getToken();
      if (!token) {
        console.error(
          "Authentication Error: No token found. User might not be logged in."
        );
        toast.error("Authentication failed. Please log in.");
        return; // Stop execution if no token is found
      }

      const { data } = await axios.get(`${backendUrl}/api/course/all`, {
        // IMPORTANT: Add the authorization header to the request
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setAllCourses(data.courses);
        toast.success("Courses fetched successfully!");
      } else {
        toast.error(data.message || "Failed to fetch courses.");
      }
    } catch (error) {
      // Log more detailed error information to the console
      console.error("Error fetching courses:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Server responded with a status code:",
          error.response.status
        );
        console.error("Server response data:", error.response.data);
        if (error.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (error.response.status === 404) {
          toast.error("API endpoint not found. Please check the backend URL.");
        } else {
          toast.error(
            error.response.data.message ||
              `Server error: ${error.response.status}`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error(
          "Network error. Please check your connection and backend server."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
        toast.error(`Request failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false); // Set loading to false after the request finishes
    }
  };

  // Function to calculate average rating of a course
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    const totalRating = course.courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    return totalRating / course.courseRatings.length;
  };

  // Function to calculate total duration of a chapter
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

  // Function to calculate total duration of a course
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

  // Function to calculate the number of lectures in a course
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

  // Asynchronous function to fetch enrolled courses
  const fetchUserEnrolledCourses = async () => {
    // This is where you would implement the logic to fetch enrolled courses from the backend
    // Similar to the fetchAllCourses function, you would use axios with a token
    // For now, we'll keep the dummy data
    setEnrolledCourses([]); // Set to empty array initially
  };

  // useEffect to run fetch operations once on component mount
  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (user) {
      fetchAllCourses();
      fetchUserEnrolledCourses();
    }
  }, [user]); // Re-run if the user object changes (e.g., after login)

  // Context value to be shared with all child components
  const value = {
    currency,
    allCourses,
    enrolledCourses,
    isLoading, // Expose loading state
    isEducator,
    setIsEducator,
    navigate,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    fetchUserEnrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

// --- EXAMPLE COMPONENT TO RENDER THE COURSES ---
// This is a separate component that would be used in your application
// (e.g., in a CoursesPage.jsx file)
// This shows how to access the data from the context and render it.

const CourseList = () => {
  // Access the context to get the courses and loading state
  const { allCourses, isLoading } = useContext(AppContext);

  // Use a loading state to show a message while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-500">
          Loading courses...
        </p>
      </div>
    );
  }

  // If there are no courses after loading, show a message
  if (!allCourses || allCourses.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-500">No courses found.</p>
      </div>
    );
  }

  // Render the courses once they are available
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCourses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {course.courseName}
            </h2>
            <p className="text-gray-600">
              Price: {course.price} {course.currency}
            </p>
            {/* You can add more course details here */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default CourseList; // Export the example component
