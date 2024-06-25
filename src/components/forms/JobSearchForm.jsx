// import React, { useCallback, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { IoMdSearch } from "react-icons/io";
// import { fetchJobs } from "../../redux/jobsSlice";
// import { useFirebase } from "../../FirebaseProvider";
// import { useNavigate } from "react-router-dom";
// import { GrLocation } from "react-icons/gr";
// import useDebounce from "../../hooks/useDebounce";
// import { fetchLocations } from "../../redux/locationSearchSlice";

// const JobSearchForm = ({ onSearch }) => {
//   let navigate = useNavigate();
//   const { userData } = useFirebase();

//   const [keywords, setKeywords] = useState("");
//   const [location, setLocation] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const debouncedLocation = useDebounce(location, 2000);
//   const dispatch = useDispatch();
//   const locations = useSelector((state) => state.locationSearch.locations);
//   const locationStatus = useSelector((state) => state.locationSearch.status);
//   const locationError = useSelector((state) => state.locationSearch.error);

//   useEffect(() => {
//     if (debouncedLocation) {
//       dispatch(fetchLocations(debouncedLocation));
//     }
//   }, [debouncedLocation, dispatch]);

//   const handleLocationSelect = useCallback((location) => {
//     setSelectedLocation(location);
//     setLocation(location.name);
//   }, []);

//   const handleSubmit = useCallback(
//     (e) => {
//       e.preventDefault();
//       console.log(handleSubmit, selectedLocation?.name);
//       if (keywords) {
//         dispatch(
//           fetchJobs({
//             keywords,
//             locationId: selectedLocation?.id.replace(/^urn:li:geo:/, "") || "",
//             datePosted: "anyTime",
//             sort: "mostRelevant",
//           })
//         );
//         onSearch && onSearch("search");
//         navigate("/");
//       }
//     },
//     [dispatch, keywords, selectedLocation]
//   );

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="w-[100%]  flex gap-1 justify-center p-5 "
//     >
//       <div className="w-[70%] flex items-center justify-evenly bg-gray-100 rounded-l-full ">
//         <div className="px-2">
//           <IoMdSearch className="text-2xl text-gray-500" />
//         </div>
//         <input
//           type="text"
//           value={keywords}
//           onChange={(e) => setKeywords(e.target.value)}
//           className="w-[100%] md:w-[95%] p-2 bg-gray-100 text-sm md:text-md lg:text-lg outline-none"
//           placeholder="Find the perfect job"
//         />
//       </div>
//       <div className="w-[30%] flex items-center justify-evenly bg-gray-100 rounded-r-full">
//         <div className="px-2">
//           <GrLocation className="text-2xl text-gray-500" />
//         </div>
//         <input
//           type="text"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           className="w-[100%] md:w-[95%] p-2 bg-gray-100 text-sm md:text-md lg:text-lg outline-none rounded-r-full"
//           placeholder="Location"
//         />
//         {locationStatus === "loading" && <p>Loading locations...</p>}
//         {locationStatus === "failed" && <p>Error: {locationError}</p>}
//         {locationStatus === "succeeded" && (
//           <ul>
//             {locations.map((loc) => (
//               <li key={loc.id} onClick={() => handleLocationSelect(loc)}>
//                 {loc.name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       {/* <button
//         type="submit"
//         className="w-[20%] bg-green-400 rounded-r-full text-white font-semibold hover:bg-green-500 hover:font-bold"
//       >
//         Search
//       </button> */}
//       <button
//         type="submit"
//         className=" bg-green-400 rounded-r-full text-white font-semibold hover:bg-green-500 hover:font-bold"
//       ></button>
//     </form>
//   );
// };

// export default JobSearchForm;
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdSearch } from "react-icons/io";
import { fetchJobs } from "../../redux/jobsSlice";
import { useFirebase } from "../../FirebaseProvider";
import { useNavigate } from "react-router-dom";
import { GrLocation } from "react-icons/gr";
import useDebounce from "../../hooks/useDebounce";
import { fetchLocations } from "../../redux/locationSearchSlice";
import useClickOutside from "../../hooks/useClickOutside";

const JobSearchForm = ({ onSearch }) => {
  let navigate = useNavigate();
  const { userData } = useFirebase();

  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [isOpenLocation, setIsOpenLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationList, setShowLocationList] = useState(false);
  const debouncedLocation = useDebounce(location, 2000);
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locationSearch.locations);
  const locationStatus = useSelector((state) => state.locationSearch.status);
  const locationError = useSelector((state) => state.locationSearch.error);

  const locationRef = useRef(null);
  useClickOutside(locationRef, () => setIsOpenLocation(false));

  useEffect(() => {
    if (debouncedLocation) {
      dispatch(fetchLocations(debouncedLocation));
    }
  }, [debouncedLocation, dispatch]);


  const jobQueries = [
    "web developer",
    "mechanical engineer",
    "manager",
    "software engineer",
    "sales executive",
  ];

  const getRandomQuery = () => {
    const randomIndex = Math.floor(Math.random() * jobQueries.length);
    return jobQueries[randomIndex];
  };

  useEffect(() => {
    const initialQuery = userData?.role || getRandomQuery();
    dispatch(fetchJobs({ keywords: initialQuery }));
  }, []);

  const handleLocationSelect = useCallback((location) => {
    if (location) {
      setSelectedLocation(location);
      setLocation(location.name);
      setShowLocationList(false);
      dispatch(
        fetchJobs({
          keywords,
          locationId: selectedLocation?.id.replace(/^urn:li:geo:/, "") || "",
          datePosted: "anyTime",
          sort: "mostRelevant",
        })
      );
      onSearch && onSearch("search");
      navigate("/");
    }
  }, [keywords]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (keywords.trim()) {
        dispatch(
          fetchJobs({
            keywords,
            locationId: selectedLocation?.id.replace(/^urn:li:geo:/, "") || "",
            datePosted: "anyTime",
            sort: "mostRelevant",
          })
        );
        onSearch && onSearch("search");
        navigate("/");
      }
    },
    [dispatch, keywords, selectedLocation]
  );

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="w-[100%] flex gap-1 justify-center p-5"
      >
        <div className="w-[70%] flex items-center justify-evenly bg-gray-100 rounded-l-full">
          <div className="px-2">
            <IoMdSearch className="text-2xl text-gray-500" />
          </div>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-[100%] md:w-[95%] p-2 bg-gray-100 text-sm md:text-md lg:text-lg outline-none"
            placeholder="Find the perfect job"
          />
        </div>
        <div className="w-[30%] flex items-center justify-evenly bg-gray-100 rounded-r-full relative">
          <div className="px-2">
            <GrLocation className="text-2xl text-gray-500" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowLocationList(true);
            }}
            className="w-[100%] md:w-[95%] p-2 bg-gray-100 text-sm md:text-md lg:text-lg outline-none rounded-r-full"
            placeholder="Location"
          />
        </div>
        <button
          type="submit"
          className=" bg-green-400 rounded-r-full text-white font-semibold hover:bg-green-500 hover:font-bold"
        ></button>
      </form>
      <div ref={locationRef}>
        {showLocationList && locationStatus === "succeeded" && (
          <ul className="absolute top-full left-0 bg-white w-full z-10 shadow-md rounded mt-2">
            {locations.map((loc) => (
              <li
                key={loc.id}
                onClick={() => handleLocationSelect(loc)}
                className="cursor-pointer p-2 hover:bg-gray-200"
              >
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobSearchForm;
