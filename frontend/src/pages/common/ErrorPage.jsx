import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

const ErrorPage = ({ error }) => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleBack = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "alumni") navigate("/alumni/dashboard");
    else navigate("/");
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-10 px-6 py-20 bg-[#f4f6fc] dark:bg-slate-900">
      
      {/* Illustration */}
      {/* <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src="https://i.ibb.co/2dQXcYt/error-illustration.png" // change if you want
          alt="Error Illustration"
          className="w-3/4 lg:w-full"
        />
      </div> */}

      {/* Text content */}
      <div className="w-full lg:w-1/3 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold text-[#f87171] dark:text-red-400 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error?.message || "An unexpected error occurred. Our devs are probably on it."}
        </p>
        <button
          onClick={handleBack}
          className="bg-[#566FA7] hover:bg-[#44598f] text-white py-3 px-6 rounded-full font-medium transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
