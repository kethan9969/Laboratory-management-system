const Item = require("../model/item");

const router = require("express").Router();

router.get("/", async (req, res) => {
	try {
		const items = await Item.find().populate("category");
		res.json(items);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.post("/", async (req, res) => {
	const newItem = new Item(req.body);
	try {
		await newItem.save();
		res.json("Item added!");
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const item = await Item.findByIdAndDelete(req.params.id);
		res.json("Item deleted.");
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.put("/:id", async (req, res) => {
	try {
		console.log(req.params.id);

		const item = await Item.findByIdAndUpdate(req.params.id, req.body);
		res.json("Item updated.");
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.get("/alert", async (req, res) => {
	try {
		// check quantity with minstock property

		const items = await Item.find({ $expr: { $lt: ["$quantity", "$minstock"] } }).populate("category");
		res.json(items);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

module.exports = router;
