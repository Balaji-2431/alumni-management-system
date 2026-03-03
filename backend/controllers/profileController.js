const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const sendResponse = require("../utils/sendResponse"); // 🔥 use your centralized response
const fs = require("fs");
const path = require("path");

// GET my profile
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  sendResponse(res, 200, { data: user });
});

// UPDATE my profile
// const updateMyProfile = asyncHandler(async (req, res) => {
//   const userId = req.user.id;

//   const allowedFields = {
//     name: req.body.name,
//     phone: req.body.phone,
//     gender: req.body.gender,
//     dateOfBirth: req.body.dateOfBirth,
//     department: req.body.department,
//     batch: req.body.batch,
//     degree: req.body.degree,
//     yearOfPassing: req.body.yearOfPassing,

//     careerStatus: req.body.careerStatus,
//     jobDetails: req.body.jobDetails,
//     higherStudies: req.body.higherStudies,
//     achievements: req.body.achievements,

//     linkedinProfile: req.body.linkedinProfile,
//   };

//   // Parse JSON strings for nested objects/arrays
//   if (typeof allowedFields.address === "string") {
//     allowedFields.address = JSON.parse(allowedFields.address);
//   }
//   if (typeof allowedFields.jobDetails === "string") {
//     allowedFields.jobDetails = JSON.parse(allowedFields.jobDetails);
//   }
//   if (typeof allowedFields.higherStudies === "string") {
//     allowedFields.higherStudies = JSON.parse(allowedFields.higherStudies);
//   }
//   if (typeof allowedFields.achievements === "string") {
//     allowedFields.achievements = JSON.parse(allowedFields.achievements);
//   }

//   // Handle profile image if uploaded
//   if (req.file) {
//     allowedFields.profilePic = `/uploads/profilePics/${req.file.filename}`;
//   }

//   // If profilePic is explicitly empty (remove image)
//   if (allowedFields.profilePic === "") {
//     allowedFields.profilePic = "";
//   }

//   // Remove undefined keys
//   Object.keys(allowedFields).forEach(
//     (key) => allowedFields[key] === undefined && delete allowedFields[key]
//   );

//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     { $set: allowedFields },
//     { new: true, runValidators: true }
//   ).select("-password");

//   res.status(200).json({
//     success: true,
//     message: "Profile updated successfully",
//     data: updatedUser,
//   });
// });

const updateMyProfile = asyncHandler(async (req, res) => {
  
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const allowedFields = {
    name: req.body.name,
    phone: req.body.phone,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    department: req.body.department,
    batch: req.body.batch,
    degree: req.body.degree,
    yearOfPassing: req.body.yearOfPassing,

    address: req.body.address, // 🔥 IMPORTANT

    careerStatus: req.body.careerStatus,
    jobDetails: req.body.jobDetails,
    higherStudies: req.body.higherStudies,
    achievements: req.body.achievements,

    linkedinProfile: req.body.linkedinProfile,
  };

  // Parse JSON strings (multipart/form-data case)
try {
  if (typeof allowedFields.address === "string") {
    allowedFields.address = JSON.parse(allowedFields.address);
  }
} catch (e) {
  console.log("❌ ADDRESS JSON ERROR:", allowedFields.address);
}

try {
  if (typeof allowedFields.jobDetails === "string") {
    allowedFields.jobDetails = JSON.parse(allowedFields.jobDetails);
  }
} catch (e) {
  console.log("❌ JOB JSON ERROR:", allowedFields.jobDetails);
}

try {
  if (typeof allowedFields.higherStudies === "string") {
    allowedFields.higherStudies = JSON.parse(allowedFields.higherStudies);
  }
} catch (e) {
  console.log("❌ HS JSON ERROR:", allowedFields.higherStudies);
}

try {
  if (typeof allowedFields.achievements === "string") {
    allowedFields.achievements = JSON.parse(allowedFields.achievements);
  }
} catch (e) {
  console.log("❌ ACH JSON ERROR:", allowedFields.achievements);
}

  // Handle profile image
  if (req.file) {
    allowedFields.profilePic = `/uploads/profilePics/${req.file.filename}`;
  }

  // Remove undefined keys
  Object.keys(allowedFields).forEach(
    (key) => allowedFields[key] === undefined && delete allowedFields[key]
  );

  // Assign fields
  Object.assign(user, allowedFields);
  

  user.profileUpdatedAt = new Date();

  // 🔥 THIS is the key line
try {
  await user.save();
} catch (err) {
  console.log(err.message)
  res.status(500).json({
    success: false,
    error: err.message
  });
  return;
}  
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});
// DELETE profile picture

const removeProfilePic = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const DEFAULT_PIC = "/uploads/profilePics/profilePic.jpg";

  // delete only custom image
  if (user.profilePic && user.profilePic !== DEFAULT_PIC) {
    const filePath = path.join(__dirname, "..", user.profilePic);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  // reset to default
  user.profilePic = DEFAULT_PIC;
  await user.save();

  sendResponse(res, 200, {
    message: "Profile picture removed",
    data: user
  });
});


// CHANGE password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findById(req.user.id).select("+password");
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  if (newPassword === currentPassword) {
    res.status(401);
    throw new Error("New password must be different from current password");
  }

  user.password = newPassword; // pre-save hook hashes automatically
  await user.save();

  sendResponse(res, 200, { message: "Password updated successfully" });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  removeProfilePic,
  changePassword,
};
