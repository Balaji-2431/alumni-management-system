// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
//     },

//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: 6,
//       select: false
//     },

//     role: {
//       type: String,
//       enum: ["admin", "alumni"],
//       required: true,
//     },

//     isApproved: {
//       type: Boolean,
//       default: false,
//     },

//     department: {
//       type: String,
//       lowercase: true,
//       trim: true,
//     },

//     batch: {
//       type: Number,
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },

//     company: {
//       type: String,
//       lowercase: true,
//       trim: true,
//     },

//     designation: {
//       type: String,
//       lowercase: true,
//       trim: true,
//     },

//     linkedin: {
//       type: String,
//       trim: true,
//     },
//     approvedBy: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User", // admin
//   default: null
// },
// approvedAt: {
//   type: Date,
//   default: null
// }

//   },
//   {
//     timestamps: true,
//   }
// );

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const calculateProfileCompletion = require("../utils/calculateProfileCompletion");

const userSchema = new mongoose.Schema(
  {
    // =========================
    // 1. CORE IDENTITY
    // =========================
    name: {
      type: String,
      required: true,
      trim: true
    },

    registerNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },

    department: {
      type: String,
      required: true
    },
        role: {
      type: String,
      enum: ["admin", "alumni"],
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
    degree: {
      type: String,
      enum: ["UG", "PG", "PhD"],
    },

batch: {
  type: String,
  required: true,
  match: [/^\d{4}-\d{4}$/, "Batch must be in YYYY-YYYY format"]
},

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },

    yearOfPassing: {
      type: Number,
      // required: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    dateOfBirth: {
      type: Date
    },

    // =========================
    // 2. PROFILE IMAGE
    // =========================
    profilePic: {
      type: String,
      default: "/uploads/profilePics/profilePic.jpg"
    },

    // =========================
    // 3. CONTACT DETAILS
    // =========================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      // required: true
    },

    address: {
      city: String,
      district: String,
      state: String,
    },

    // =========================
    // 4. CAREER DETAILS
    // =========================
    careerStatus: {
      type: String,
      enum: ["Employed", "Higher Study", "Unemployed"],
    },

    jobDetails: {
      jobTitle: String,
      companyName: String,
      industry: String,
      experienceYears: Number,
    },
    linkedinProfile: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
        "Please enter a valid LinkedIn profile URL"
      ],
      default: ""
    },

    // =========================
    // 5. HIGHER STUDIES
    // =========================
    higherStudies:[ {
      degreeName: String,
      institution: String,
      country: String,
      startYear: Number,
      endYear: Number
    }],

    // =========================
    // 6. ACHIEVEMENTS
    // =========================
    achievements: [
      {
        title: String,
        description: String,
        year: Number
      }
    ],

    // =========================
    // 7. ADMIN CONTROL (IMPORTANT)
    // =========================
    profileCompletion: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },
    profileUpdatedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    approvedAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true
  }
);



userSchema.pre("save", async function () {
  this.profileCompletion = calculateProfileCompletion(this);

  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});




userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User",userSchema);