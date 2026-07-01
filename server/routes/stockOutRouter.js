const express = require("express");
const StockOut = require("../model/stockOut");
const Item = require("../model/item");

const router = express.Router();

router.post("/", async (req, res) => {
	const newStockOut = new StockOut(req.body);
	try {
		let items = newStockOut.items;
		items.forEach(async (item) => {
			let stock = await Item.findById(item.item);
			stock.quantity -= item.quantity;
			await stock.save();
		});
		await newStockOut.save();
		res.json("Stock Out added!");
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});
router.get("/", async (req, res) => {
	try {
		const stockOut = await StockOut.find().populate("items.item").populate("issuedTo");
		res.json(stockOut);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});
router.get("/:id", async (req, res) => {
	try {
		const stockOut = await StockOut.findById(req.params.id);
		res.json(stockOut);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.get("/technician/:id", async (req, res) => {
	try {
		let items = [];
		const stockOut = await StockOut.find({ issuedTo: req.params.id }).populate("items.item").populate("issuedTo");
		// filter unique items from each stock and push to list
		stockOut.forEach((stock) => {
			stock.items.forEach((item) => {
				let found = items.find((i) => i.item._id == item.item._id);
				if (!found) {
					items.push(item);
				} else {
					found.quantity += item.quantity;
				}
			});
		});
		res.json({ items });
		// res.json(stockOut);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await StockOut.findByIdAndDelete(req.params.id);
		res.json("Stock Out deleted!");
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});
module.exports = router;
