const mongoose = require("mongoose");

const taskTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    todoChecklist: [{
        text: String,
        completed: { type: Boolean, default: false }
    }],
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
});

module.exports = mongoose.model("TaskTemplate", taskTemplateSchema);