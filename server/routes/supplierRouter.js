const Supplier = require("../model/supplier");

const router = require("express").Router();

router.get("/", async (req, res) => {
	try {
		const suppliers = await Supplier.find();
		res.status(200).json(suppliers);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.post("/", async (req, res) => {
	const newSupplier = new Supplier(req.body);
	try {
		const savedSupplier = await newSupplier.save();
		res.status(200).json(savedSupplier);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
