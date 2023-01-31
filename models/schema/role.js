module.exports = function (mongoose) {
    let roleSchema = new mongoose.Schema({
      role: {
        type: String,
      required: true,
      unique: true,
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
      updatedby: {
        type: String
      }
    });
    return mongoose.model("role", roleSchema);
  };
  