const { default: mongoose } = require("mongoose");

const stockInSchema = new mongoose.Schema({
	supplier: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Supplier",
		required: true,
	},
	purchaseDate: {
		type: Date,
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

module.exports = mongoose.model("StockIn", stockInSchema);
