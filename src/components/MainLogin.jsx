import React, { useState } from "react";
import SignUpForm from "./forms/SignUpForm";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import SignUpWithGoogle from "./forms/SignUpWithGoogle";
import SignInForm from "./forms/SignInForm";

function MainLogin({ onClose }) {
  // State to toggle between sign-up and sign-in forms
  const [isSignUp, setIsSignUp] = useState(false);

  // Function to toggle between sign-up and sign-in forms
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="p-2 flex flex-col w-full justify-between items-center gap-5 ">
      <div>
        <small className="text-xs">
          Create an account or sign in. By continuing, you agree to our{" "}
          <a href="#" className="text-green-600 underline">
            Terms of Use
          </a>{" "}
          and acknowledge our{" "}
          <a href="#" className="text-green-600 underline">
            Privacy Policy
          </a>
          .
        </small>
      </div>
      <div className="w-full">
        <SignUpWithGoogle onClose={onClose} />
      </div>
      <div className="text-xs flex items-center gap-5">
        <div>
          <TfiLayoutLineSolid />
        </div>
        or{" "}
        <div>
          <TfiLayoutLineSolid />
        </div>
      </div>

      {/* Conditional rendering of sign-up/sign-in forms */}
      <div className="w-full">
        {isSignUp ? (
          <SignUpForm onClose={onClose} />
        ) : (
          <SignInForm onClose={onClose} />
        )}
        <button
          onClick={toggleForm}
          className="w-[100%] text-sm mt-4 text-blue-500 hover:underline "
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default MainLogin;
