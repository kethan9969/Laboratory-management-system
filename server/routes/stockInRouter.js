const router = require("express").Router();
const StockIn = require("../model/stockIn");
const Item = require("../model/item");

router.post("/", async (req, res) => {
	const newStockIn = new StockIn(req.body);
	try {
		await newStockIn.save();
		let items = newStockIn.items;
		items.forEach(async (item) => {
			let stock = await Item.findById(item.item);
			stock.quantity += item.quantity;
			await stock.save();
		});
		res.json("Stock In added!");
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.get("/", async (req, res) => {
	try {
		const stockIn = await StockIn.find().populate("supplier").populate("items.item");
		res.json(stockIn);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});
router.get("/:id", async (req, res) => {
	try {
		const stockIn = await StockIn.findById(req.params.id);
		res.json(stockIn);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await StockIn.findByIdAndDelete(req.params.id);
		res.json("Stock In deleted!");
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

module.exports = router;
