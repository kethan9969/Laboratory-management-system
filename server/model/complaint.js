const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
	{
		raisedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Login",
			required: true,
		},
		raisedOn: {
			type: Date,
			default: Date.now,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		item: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item",
		},
		status: {
			type: String,
			default: "Pending",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
