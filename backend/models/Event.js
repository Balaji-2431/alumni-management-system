const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO ===== */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["technical", "career", "networking", "cultural"],
    },

    /* ===== DATE & MODE ===== */
    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String, // "10:30 AM"
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      required: true,
      enum: ["online", "offline", "hybrid"],
    },

    location: {
      type: String,
  required: function () {
    return this.mode !== "online";
  },    },

    /* ===== ORGANIZER ===== */
    organizerName: {
      type: String,
      required: true,
    },
    image: {
  type: String,
  // default: ""
},
eventLink: {
  type: String,
  required: function () {
    return (
      (this.mode === "online" || this.mode === "hybrid") &&
      this.registrationRequired === false
    );
  },
},
    description: {
      type: String,
      required: true,
      // minlength: 50,
    },

    /* ===== REGISTRATION ===== */
    registrationRequired: {
      type: Boolean,
      default: false,
    },

    registrationLink: {
      type: String,
    },

    lastRegistrationDate: {
      type: Date,
    },


    /* ===== ADMIN FIELDS ===== */
    isApproved: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Event", eventSchema);
