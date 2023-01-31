module.exports = function (mongoose) {
  let userSchema = new mongoose.Schema({
    userid: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    username: {
      type: String,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    rejected: {
      type: Boolean,
      default: false,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
    },
    site_code: [],
    availableSites: [],
    role: {
      type: String,
    },
    mobile: {
      type: String,
      unique: true,
    },
    transaction: {
      type: Number,
      default: 0,
    },
    passwordreset: {
      type: Boolean,
      default: true,
    },
    reporting_manager: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createddate: {
      type: Date,
      default: Date.now,
    },
    createdby: {
      type: String,
    },
    updateddate: {
      type: Date,
    },
    deleteddate: {
      type: Date,
    },
    updatedby: {
      email: {
        type: String,
      },
      role: {
        type: String,
      },
    },
    approvedby: {
      email: {
        type: String,
      },
      role: {
        type: String,
      },
    },
    deviceid: {
      type: String,
    },
  });

  return mongoose.model("users", userSchema);
};
