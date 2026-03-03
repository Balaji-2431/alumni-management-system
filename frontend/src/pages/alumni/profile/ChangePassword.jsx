import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    general: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {
    currentPassword: "",
    newPassword: "",
    general: "",
  };

  // 1️⃣ Current password required
  if (!form.currentPassword) {
    newErrors.currentPassword = "Current password is required";
  }

  // 2️⃣ New password required
  if (!form.newPassword) {
    newErrors.newPassword = "New password is required";
  } 
  // 3️⃣ New password length
  else if (form.newPassword.length < 6) {
    newErrors.newPassword = "Password must be at least 6 characters";
  }

  // If any validation error exists → stop
  if (newErrors.currentPassword || newErrors.newPassword) {
    setErrors(newErrors);
    return;
  }

  try {
    setLoading(true);

    const res = await api.put("/profile/change-password", form);

    setSuccess(res.data.message || "Password updated successfully");

    setTimeout(() => {
      navigate("/alumni/profile");
    }, 1500);
  } catch (err) {
    // Backend → current password wrong
    if (
      err.response?.status === 401 ||
      err.response?.data?.message
        ?.toLowerCase()
        .includes("current password")
    ) {
      setErrors({
        ...newErrors,
        currentPassword: "Current password is incorrect",
      });
    } else {
      setErrors({
        ...newErrors,
        general: "Password update failed",
      });
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">

        {/* Back */}
        <button
          onClick={() => navigate("/alumni/profile")}
          className="cursor-pointer absolute left-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-1">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Secure your account
        </p>

        {errors.general && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
            {errors.general}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded">
            {success} <br /> Redirecting…
          </div>
        )}

<form onSubmit={handleSubmit} className="space-y-5">

  {/* Current Password */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Current Password
    </label>

    <div className="relative">
      {/* Left Icon */}
      {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔒
      </span> */}

      <input
        type={showCurrent ? "text" : "password"}
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        disabled={loading}
        placeholder="Enter your current password"
        className={`w-full border rounded-xl pl-6 pr-10 py-2.5 bg-gray-50 
          focus:bg-white transition duration-200 outline-none focus:ring-2
          ${
            errors.currentPassword
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }
        `}
      />

      {/* Right Eye Icon */}
      <button
        type="button"
        onClick={() => setShowCurrent(!showCurrent)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>

    {errors.currentPassword && (
      <p className="mt-1 text-xs text-red-600">
        {errors.currentPassword}
      </p>
    )}
  </div>

  {/* New Password */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      New Password
    </label>

    <div className="relative">
      {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔐
      </span> */}

      <input
        type={showNew ? "text" : "password"}
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        disabled={loading}
        placeholder="Enter your new password"
        className={`w-full border rounded-xl pl-6 pr-10 py-2.5 bg-gray-50 
          focus:bg-white transition duration-200 outline-none focus:ring-2
          ${
            errors.newPassword
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }
        `}
      />

      <button
        type="button"
        onClick={() => setShowNew(!showNew)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>

    {errors.newPassword && (
      <p className="mt-1 text-xs text-red-600">
        {errors.newPassword}
      </p>
    )}
  </div>

  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-sm
      ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
      }
    `}
  >
    {loading ? "Updating..." : "Update Password"}
  </button>
</form>
      </div>
    </div>
  );
};

export default ChangePassword;