module.exports = function (mongoose) {
    let faqSchema = new mongoose.Schema({
        faqs: [{
            tagId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "category",
            }
        }],
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

    return mongoose.model("faq", faqSchema);
};
