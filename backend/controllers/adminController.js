const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const APIFeatures = require("../utils/apiFeatures");
const sendResponse = require("../utils/sendResponse");

const getAlumniByIdHelper = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }

  const user = await User.findById(id);
  if (!user || user.role !== "alumni") {
    throw new Error("Alumni not found");
  }

  return user;
};

// GET ALL ALUMNI
const getAllAlumni = asyncHandler(async (req, res) => {
  const baseQuery = { role: "alumni" };

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // 🔹 Apply search + filter (without pagination) for count
  const countFeatures = new APIFeatures(
    User.find(baseQuery),
    req.query
  )
    .search(["name", "email", "registerNo"])
    .filter();

  const total = await countFeatures.query.countDocuments();

  // 🔹 Apply full features including pagination
  const features = new APIFeatures(
    User.find(baseQuery),
    req.query
  )
    .search(["name", "email", "registerNumber"])
    .filter()
    .sort()
    .paginate(limit);

  const alumni = await features.query.select("-password");

  res.status(200).json({
    success: true,
    data: alumni,
    count: total,
    page,
    limit,
  });
});



// GET ALUMNI BY ID
const getAlumniById = asyncHandler(async (req, res) => {
  const user = await getAlumniByIdHelper(req.params.id);

  sendResponse(res, 200, { data: user });
});

// APPROVE ALUMNI
const approveAlumni = asyncHandler(async (req, res) => {
  let user = await getAlumniByIdHelper(req.params.id);

  // Populate approvedBy if needed
  user = await user.populate("approvedBy", "name email role");

  if (user.isApproved) {
    return sendResponse(res, 200, { message: "Alumni already approved" });
  }

  user.isApproved = true;
  user.status = "Approved"; // make sure this matches enum if any
  user.approvedBy = req.user._id;
  user.approvedAt = new Date();

  await user.save();

  sendResponse(res, 200, { message: "Alumni approved successfully" });
});


// DELETE ALUMNI
const deleteAlumni = asyncHandler(async (req, res) => {
  const user = await getAlumniByIdHelper(req.params.id);

  await user.deleteOne();

  sendResponse(res, 200, { message: "Alumni deleted successfully" });
});



module.exports = {
  getAllAlumni,
  getAlumniById,
  approveAlumni,
  deleteAlumni,
};
