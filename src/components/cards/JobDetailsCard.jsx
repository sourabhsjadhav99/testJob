import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsCardClicked } from "../../redux/jobDetailSlice";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";
import { useFirebase } from "../../FirebaseProvider";
import { GiElectric } from "react-icons/gi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DetailsCardSkeleton from "../skeletons/DetailsCardSkeleton";
const JobDetailsCard = () => {
  const selectedJob = useSelector((state) => state.jobDetails.selectedJob);
  const loading = useSelector((state) => state.jobDetails.loading);
  // const error = useSelector((state) => state.jobDetails.error);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const { updateSavedJobs, userData, isLoggedIn } = useFirebase();
  const { savedJobs = [], appliedJobs = [] } = userData || {};
  const {
    company,
    title,
    location,
    description,
    skills,
    type,
    workPlace,
    id,
  } = selectedJob || {};

  // Toggle full description visibility
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (!selectedJob) {
    return <DetailsCardSkeleton/>
  }

  // Check if the job is bookmarked
  const isJobBookmarked = () => {
    return savedJobs.some((job) => job.id === id);
  };

  // Check if the job is already applied
  const isJobApplied = () => {
    return appliedJobs.some((job) => job.id === id);
  };

  // Handle bookmark button click
  const handleBookmarkClick = async () => {
    if (isJobBookmarked(id)) {
      const updatedJobs = savedJobs.filter((job) => job.id !== id);
      await updateSavedJobs({ savedJobs: updatedJobs });
      toast.success("Job removed");
    } else {
      const newJob = selectedJob;
      const updatedJobs = [...savedJobs, newJob];
      await updateSavedJobs({ savedJobs: updatedJobs });
      toast.success("Job saved");
    }
  };

  let handleJobApplyClick = () => {
    navigate("/applyjob");
    toast.warning("Update Your Profile Data");
  };

  let handleCardClick = () => {
    dispatch(setIsCardClicked(false));
  };

  return (
    <>
    {! loading ? <div className="p-5 bg-white shadow-md rounded overflow-y-auto h-full scrollbar">
      <button
        onClick={handleCardClick}
        className="flex items-center bg-gray-100 px-2 rounded text-lg gap-2 hover:bg-gray-200 mb-2 md:hidden"
      >
        {" "}
        <span>
          <IoIosArrowBack />
        </span>{" "}
        <span>Back to job list</span>
      </button>
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-4">{location}</p>
          <p className="text-sm text-gray-600 mb-4">Workplace: {workPlace}</p>
          <p className="text-sm text-gray-600 mb-4">Type: {type}</p>
        </div>
        <div className="flex gap-5 items-center">
          <button
            className={`text-xl bg-gray-100 hover:bg-green-400 hover:rounded-full w-[35px] h-[35px] flex items-center justify-center ${
              isJobBookmarked(id) ? "bg-green-400 rounded-full text-white" : ""
            }`}
            onClick={
              isLoggedIn ? handleBookmarkClick : () => navigate("/signup")
            }
          >
            <FaRegBookmark />
          </button>

          {isJobApplied(id) ? (
            <button
              disabled
              className={` disabled:cursor-not-allowed bg-green-800 text-white font-semibold p-2 rounded  }`}
            >
              <span>Applied</span>
            </button>
          ) : (
            <button
              onClick={
                isLoggedIn ? handleJobApplyClick : () => navigate("/signup")
              }
              className={`flex gap-2 items-center text-black bg-green-500 font-semibold p-2 rounded hover:text-white hover:bg-green-800 }`}
            >
              <span className="text-lg">
                <GiElectric />
              </span>{" "}
              <span>Easy Apply</span>
            </button>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Description</h3>
        <p className="text-sm">
          {showFullDescription
            ? description
            : `${description.slice(0, 200)}...`}
        </p>
        {description.length > 200 && (
          <button
            onClick={toggleDescription}
            className="text-blue-500 hover:underline"
          >
            {showFullDescription ? "Show Less..." : "Show More..."}
          </button>
        )}
      </div>
      {skills && skills?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Skills</h3>
          <ul className="list-disc ml-5">
            {skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Company Details:</h2>
        <h3 className="text-lg text-gray-700 mb-1">{company.name}</h3>
        <p className="text-gray-700 mb-1">{company.description}</p>
        <p className="text-gray-700 font-semibold mb-1">
          Staff: {company?.staffCountRange.start} to{" "}
          {company?.staffCountRange.end}
        </p>
        {company?.specialities && company?.specialities?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Specialities</h3>
            <ul className="list-disc ml-5">
              {company?.specialities.map((speciality, idx) => (
                <li key={idx}>{speciality}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>

      </div>
    </div>: <DetailsCardSkeleton/> }
    </>
  );
};

export default JobDetailsCard;
