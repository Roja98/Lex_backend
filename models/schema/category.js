module.exports = function (mongoose) {
    let categorySchema = new mongoose.Schema({
      categoryName: {
        type: String,
      required: true,
      unique: true,
      },
      tag: {
        type: String,
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
      updatedby: {
        type: String
      }
    });
    return mongoose.model("category", categorySchema);
  };
  