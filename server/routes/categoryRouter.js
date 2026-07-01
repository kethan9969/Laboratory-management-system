const Category = require("../model/category");

const router = require("express").Router();

router.get("/", async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.post("/", async (req, res) => {
	const newCategory = new Category(req.body);
	try {
		const savedCategory = await newCategory.save();
		res.status(200).json(savedCategory);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);
		res.status(200).json("Category deleted.");
	} catch (error) {
		res.status(500).json(error);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).json(updatedCategory);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
