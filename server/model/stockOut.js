const { default: mongoose } = require("mongoose");

const stockOutSchema = new mongoose.Schema({
	issuedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Login",
		required: true,
	},
	issuedDate: {
		type: Date,
		required: true,
	},
	purpose: {
		type: String,
		required: true,
	},
	items: [
		{
			item: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Item",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
			total: {
				type: Number,
				required: true,
			},
		},
	],
	totalAmount: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("StockOut", stockOutSchema);
