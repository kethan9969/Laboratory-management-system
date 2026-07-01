const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		mobile: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
		},
		otp: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Login", loginSchema);
