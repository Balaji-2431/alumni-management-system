const mongoose =require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },

    // description: { type: String, required: true },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      required: true,
    },

    location: { type: String, trim: true },
    qualification: { type: String, trim: true },
    image: {
  type: String,
  // default: ""
},
    experience: {
      type: String,
      enum: ["fresher", "1-3", "3+"],
    },

    skills: [String],

    salary: { type: String },
    applyLink: { type: String },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: { type: Boolean, default: false },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    }

  },
  { timestamps: true }
);


module.exports = mongoose.model("Job", jobSchema);
