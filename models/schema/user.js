module.exports = function (mongoose) {
  let userSchema = new mongoose.Schema({
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
    active: {
      type: Boolean,
      default: false,
    },
    role: {
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
      type: String
    }
  });

  return mongoose.model("user", userSchema);
};
