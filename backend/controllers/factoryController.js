// const asyncHandler = require("../middleware/asyncHandler");
// const APIFeatures = require("../utils/apiFeatures");
// const sendResponse = require("../utils/sendResponse");

// const getDocById = async (Model, id, user, options = {}) => {
//   const { populateFields = { path: 'createdBy', select: 'name role' }, allowRoles = ["admin", "alumni"] } = options;

//   if (!id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid ID");

//   let query = Model.findById(id);
//   if (populateFields) query = query.populate(populateFields);
//   const doc = await query;

//   if (!doc) throw new Error("Resource not found");

//   if (user.role === "alumni" && !doc.isApproved && doc.createdBy._id.toString() !== user.id) {
//     throw new Error("Access denied");
//   }

//   if (!allowRoles.includes(user.role)) {
//     throw new Error("Role not allowed");
//   }

//   return doc;
// };

// // CREATE ONE
// exports.createOne = (Model, resourceName = "Resource") =>
//   asyncHandler(async (req, res) => {
//     const data = {
//       ...req.body,
//       createdBy: req.user.id,
//       isApproved: req.user.role === "admin",
//     };
// if (resourceName === "Event") {
//   data.registrationRequired = data.registrationRequired === "yes";

//   if (data.registrationRequired) {
//     if (!data.registrationLink) {
//       throw new Error("Registration link is required");
//     }

//     if (!data.lastRegistrationDate) {
//       throw new Error("Last registration date is required");
//     }
//   }
// }


//     if (data.experience === "") delete data.experience;
//     const doc = await Model.create(data);

//     sendResponse(res, 201, {
//       data: doc,
//       message:
//         req.user.role === "admin"
//           ? `${resourceName} created successfully`
//           : `${resourceName} submitted for approval`,
//     });
//   });

// // GET ALL
// exports.getAll = (Model, options = {}) =>
//   asyncHandler(async (req, res) => {
//     const { searchableFields = ["title"], populateFields = { path: 'createdBy', select: 'name role' } } = options;
//     const query = {};

//     if (req.user.role === "alumni") query.$or = [{ isApproved: true }, { createdBy: req.user.id }];
//     if (req.user.role === "admin") {
//       if (req.query.status === "approved") query.isApproved = true;
//       if (req.query.status === "pending") query.isApproved = false;
//     }
// //     if (req.user.role === "admin") {
// //   if (req.query.status === "approved") {
// //     query.isApproved = true;
// //   }

// //   if (req.query.status === "pending") {
// //     query.isApproved = false;
// //     query.createdByRole = "alumni"; // ✅ IMPORTANT
// //   }
// // }
//     const features = new APIFeatures(Model.find(query), req.query)
//       .search(searchableFields)
//       .filter()
//       .sort()
//       .paginate();

//     let docsQuery = features.query;
//     if (populateFields) docsQuery = docsQuery.populate(populateFields);

//     const docs = await docsQuery;

//     sendResponse(res, 200, { data: docs, count: docs.length });
//   });

// // GET ONE
// exports.getOne = (Model, options = {}) =>
//   asyncHandler(async (req, res) => {
//     const doc = await getDocById(Model, req.params.id, req.user, options);
//     sendResponse(res, 200, { data: doc });
//   });

// // APPROVE ONE
// exports.approveOne = (Model, options = {}) =>
//   asyncHandler(async (req, res) => {
//     if (req.user.role !== "admin") throw new Error("Only admin can approve");

//     const doc = await getDocById(Model, req.params.id, req.user, options);
// //     if (doc.createdByRole === "admin") {
// //   throw new Error("Admin jobs do not require approval");
// // }
//     if (doc.isApproved) throw new Error("Already approved");

//     doc.isApproved = true;
//     doc.approvedBy = req.user._id;
//     doc.approvedAt = new Date();
//     await doc.save();

//     sendResponse(res, 200, { message: "Approved successfully", data: doc });
//   });

// // DELETE ONE
// exports.deleteOne = (Model, options = {}) =>
//   asyncHandler(async (req, res) => {
//     const doc = await getDocById(Model, req.params.id, req.user, options);

//     if (req.user.role !== "admin" && doc.createdBy._id.toString() !== req.user.id) {
//       throw new Error("Not authorized");
//     }

//     await doc.deleteOne();

//     sendResponse(res, 200, { message: "Deleted successfully" });
//   });

const asyncHandler = require("../middleware/asyncHandler");
const APIFeatures = require("../utils/apiFeatures");
const sendResponse = require("../utils/sendResponse");

/* =========================
   UTILS
========================= */
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const todayDateOnly = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/* =========================
   GET DOC BY ID
========================= */
const getDocById = async (Model, id, user, options = {}) => {
  const {
    populateFields = { path: "createdBy", select: "name role" },
    allowRoles = ["admin", "alumni"],
  } = options;

  if (!isValidObjectId(id)) throw new Error("Invalid ID");

  let query = Model.findById(id);
  if (populateFields) query = query.populate(populateFields);

  const doc = await query;
  if (!doc) throw new Error("Resource not found");

  if (
    user.role === "alumni" &&
    !doc.isApproved &&
    doc.createdBy._id.toString() !== user.id
  ) {
    throw new Error("Access denied");
  }

  if (!allowRoles.includes(user.role)) {
    throw new Error("Role not allowed");
  }

  return doc;
};

/* =========================
   CREATE ONE (JOB / EVENT)
========================= */
exports.createOne = (Model, resourceName = "Resource") =>
  asyncHandler(async (req, res) => {

    let data = {
      ...req.body,
      createdBy: req.user.id,
      isApproved: req.user.role === "admin",
    };

    delete data.approvedBy;
    delete data.approvedAt;

    /* ===== JOB VALIDATION ===== */
    if (resourceName === "Job") {
      if (req.file) {
        data.image = `/uploads/jobs/${req.file.filename}`;
      }else{
        data.image = `/uploads/default.webp`;
      }
      if (!data.title || data.title.trim().length < 3) {
        res.status(400);
        throw new Error("Job title must be at least 3 characters");
      }

      if (!data.company || data.company.trim().length < 3) {
        res.status(400);
        throw new Error("Company name must be at least 3 characters");
      }

      if (!data.jobType) {
        res.status(400);
        throw new Error("Job type is required");
      }

      // ✅ ENUM SAFE
      if (
        !data.experience ||
        !["fresher", "1-3", "3+"].includes(data.experience)
      ) {
        delete data.experience;
      }
      if (typeof data.skills === "string") {
        data.skills = data.skills.split(",").map(s => s.trim());
      }

// if (!Array.isArray(data.skills)) {
//   res.status(400);
//   throw new Error("Skills must be an array");
// }

    }

    /* ===== EVENT VALIDATION ===== */
    if (resourceName === "Event") {
      if (req.file) {
        data.image = `/uploads/events/${req.file.filename}`;
      }else{
        data.image = `/uploads/default.webp`;
      }

      data.registrationRequired = data.registrationRequired === "yes";

      if (data.registrationRequired) {
        if (!data.registrationLink || data.registrationLink.trim() === "") {
          res.status(400);
          throw new Error("Registration link is required");
        }
        if (!data.lastRegistrationDate) {
          res.status(400);
          throw new Error("Last registration date is required");
        }
      }
    }

    const doc = await Model.create(data);
    sendResponse(res, 201, {
      data: doc,
      message:
        req.user.role === "admin"
          ? `${resourceName} created successfully`
          : `${resourceName} submitted for approval`,
    });
  });



/* =========================
   GET ALL
========================= */
// exports.getAll = (Model, options = {}) =>
//   asyncHandler(async (req, res) => {
//     const {
//       searchableFields = ["title"],
//       populateFields = { path: "createdBy", select: "name role profilePic" },
//     } = options;

//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const query = {};

//     // 🔐 Alumni visibility
//     if (req.user.role === "alumni") {
//       query.$or = [{ isApproved: true }, { createdBy: req.user.id }];
//     }

//     // 🧑‍💼 Admin status filter
//     if (req.user.role === "admin") {
//       if (req.query.status === "approved") query.isApproved = true;
//       if (req.query.status === "pending") query.isApproved = false;
//     }

//     // ✅ TOTAL COUNT (NO PAGINATION)
//     const total = await Model.countDocuments(query);

//     // ✅ DATA QUERY (WITH PAGINATION)
//     const features = new APIFeatures(Model.find(query), req.query)
//       .sort()
//       .paginate(limit);

//     let docsQuery = features.query;
//     if (populateFields) docsQuery = docsQuery.populate(populateFields);

//     const docs = await docsQuery;

//     res.status(200).json({
//       success: true,
//       data: docs,
//       count: total,   // ✅ REAL TOTAL
//       page,
//       limit,
//     });
//   });

exports.getAll = (Model, options = {}) =>
  asyncHandler(async (req, res) => {
    const {
      searchableFields = ["title", "company"],
      populateFields = { path: "createdBy", select: "name role profilePic" },
    } = options;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const baseQuery = {};

    // 🔐 Alumni visibility
    if (req.user.role === "alumni") {
      if (req.query.mine === "true") {
        baseQuery.createdBy = req.user.id;
      } else {
        baseQuery.$or = [{ isApproved: true }, { createdBy: req.user.id }];
      }
    }

    // 🧑‍💼 Admin filters
    if (req.user.role === "admin") {
      if (req.query.status === "approved") baseQuery.isApproved = true;
      if (req.query.status === "pending") baseQuery.isApproved = false;
    }

    // ✅ COUNT (WITH SEARCH + FILTER, NO PAGINATION)
    const countFeatures = new APIFeatures(
      Model.find(baseQuery),
      req.query
    )
      .search(searchableFields)
      .filter();

    const total = await countFeatures.query.countDocuments();

    // ✅ DATA (FULL FEATURES)
    const features = new APIFeatures(
      Model.find(baseQuery),
      req.query
    )
      .search(searchableFields)
      .filter()
      .sort()
      .paginate(limit);

    let docsQuery = features.query;
    if (populateFields) docsQuery = docsQuery.populate(populateFields);

    const docs = await docsQuery;

    res.status(200).json({
      success: true,
      data: docs,
      count: total,
      page,
      limit,
    });
  });

/* =========================
   GET ONE
========================= */
exports.getOne = (Model, options = {}) =>
  asyncHandler(async (req, res) => {
    const doc = await getDocById(Model, req.params.id, req.user, options);
    sendResponse(res, 200, { data: doc });
  });

/* =========================
   APPROVE
========================= */
exports.approveOne = (Model, options = {}) =>
  asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
      throw new Error("Only admin can approve");
    }

    const doc = await getDocById(Model, req.params.id, req.user, options);

    if (doc.isApproved) {
      throw new Error("Already approved");
    }

    doc.isApproved = true;
    doc.approvedBy = req.user._id;
    doc.approvedAt = new Date();
    await doc.save();

    sendResponse(res, 200, {
      message: "Approved successfully",
      data: doc,
    });
  });

/* =========================
   DELETE
========================= */
exports.deleteOne = (Model, options = {}) =>
  asyncHandler(async (req, res) => {
    const doc = await getDocById(Model, req.params.id, req.user, options);

    if (
      req.user.role !== "admin" &&
      doc.createdBy._id.toString() !== req.user.id
    ) {
      throw new Error("Not authorized");
    }

    await doc.deleteOne();

    sendResponse(res, 200, { message: "Deleted successfully" });
  });
