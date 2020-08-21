const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const complaintSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    otp: {
      type: Number,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    lco: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    vc: String,
  },
  { timestamps: true }
);

module.exports = Complaint = mongoose.model("Complaint", complaintSchema);
