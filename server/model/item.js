const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	name: String,
	description: String,
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
	},
	price: Number,
	unit: String,
	minstock: Number,
	quantity: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("Item", itemSchema);
