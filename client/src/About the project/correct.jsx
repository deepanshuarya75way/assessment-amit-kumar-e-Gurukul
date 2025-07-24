import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const CourseDetails = () => {
  const { id } = useParams();
  // useparams use for fetecha actual id like that 605c72efb3f1c2b1f8e4e1a1 show of the webpage localhost1523

  const [courseData, setCourseData] = useState(null);
  const { allCourses } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };
  useEffect(() => {
    fetchCourseData();
  }, []);

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>
        {/* left column  */}

        <div>
          <h1>{courseData.courseTitle}</h1>
          <p>{courseData.courseDescription}</p>
        </div>

        {/* right column */}
        <div></div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;

<div>
  <h1>{courseData.courseTitle}</h1>
  <p>{courseData.courseDescription}</p>
</div>;

{
  /*
  import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState();
  const { allCourses } = useContext(AppContext);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const findCourse = allCourses.find((course) => course._id === id);
      console.log("Matched course:", findCourse);
      setCourseData(findCourse);
    }
  }, [allCourses, id]);

  if (allCourses.length > 0 && !courseData) {
    return <p className="text-center pt-10 text-red-600">Course not found</p>;
  }

  return courseData ? (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
           {" "}
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>
           {" "}
      <div>
                <h1>{courseData.courseTitle}</h1>       {" "}
        <div
          className="mt-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
        ></div>
             {" "}
      </div>
            <div></div>   {" "}
    </div>
  ) : (
    <Loading />
  );
};

export default CourseDetails; */
}
