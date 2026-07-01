const router = require("express").Router();

const Complaint = require("../model/complaint");

router.post("/", async (req, res) => {
	const complaint = new Complaint(req.body);
	try {
		const savedComplaint = await complaint.save();
		res.status(200).json({ savedComplaint });
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

router.get("/", async (req, res) => {
	try {
		const complaints = await Complaint.find();
		res.status(200).json(complaints);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const complaint = await Complaint.findById(req.params.id);
		res.status(200).json(complaint);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.status(200).json(updatedComplaint);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

router.get("/researcher/:id", async (req, res) => {
	try {
		const complaints = await Complaint.find({ raisedBy: req.params.id }).sort({ createdAt: -1 }).populate("category").populate("item");
		res.status(200).json(complaints);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

router.get("/status/pending", async (req, res) => {
	try {
		// sort by created date desc

		const complaints = await Complaint.find().sort({ createdAt: -1 }).populate("category").populate("item");
		res.status(200).json(complaints);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

module.exports = router;
