

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsCardClicked } from "../../redux/jobDetailSlice";
import { IoIosArrowBack } from "react-icons/io";

const SavedJobDetailsCard = () => {

   // Retrieve selected job details from Redux store
  const selectedJob = useSelector((state) => state.jobDetails.selectedJob);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const dispatch = useDispatch();
 
// Destructure relevant properties from selectedJob or default to an empty object
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
  
 // Toggle show/hide full description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Render message if no job is selected
  if (!selectedJob) {
    return <div className="p-5">Please select a job to see the details.</div>;
  }

 // Handle click on card to set isCardClicked in Redux store
  let handleCardClick = () => {
    dispatch(setIsCardClicked(false));
  };

  return (
    <div className="p-5 bg-white shadow-md rounded overflow-y-auto h-full scrollbar">
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
        <p className="text-sm text-gray-600 mb-4">Workplace: {workPlace}</p>
        <p className="text-sm text-gray-600 mb-4">Type: {type}</p>
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
    </div>
  );
};

export default SavedJobDetailsCard;
