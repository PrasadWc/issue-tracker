const mongoose = require("mongoose");

const issueSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    status: {
      type: Number,
      required: [true, "Please add a status"],
      enum: [1, 2, 3], //1 - open, 2 - in-progress, 3 - closed
      default: 1,
    },
    priority: {
      type: Number,
      required: [true, "Please add a priority"],
      enum: [1, 2, 3], //1 - low, 2 - medium, 3 - high
      default: 1,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Update status to In Progress (2) when assignee is added
issueSchema.pre("save", function (next) {
  if (this.isModified("assignee") && this.assignee && this.status === 1) {
    this.status = 2;
  }
  next();
});

module.exports = mongoose.model("Issue", issueSchema);
