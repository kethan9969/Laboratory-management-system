const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Login = require("../model/login");
const Category = require("../model/category");
const Supplier = require("../model/supplier");
const Item = require("../model/item");
const nodemailer = require("nodemailer");
const { generateToken } = require("../util/jwtUtil");
const login = require("../model/login");
const Complaint = require("../model/complaint");

function generateOtp() {
	return Math.floor(100000 + Math.random() * 900000);
}

function getHash(key) {
	return bcrypt.hashSync(key, 10);
}

async function sendEmail(email, otp) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "@gmail.com",
			pass: "xjtd iymw fkcz tjvx",
		},
	});

	const emailBody = `
      <p>Dear User,</p>
      <p>Please use below (OTP) to login:</p>
      <h3>${otp}</h3>
        `;

	const mailOptions = {
		from: "@gmail.com",
		to: email,
		subject: "OTP for Login",
		html: emailBody,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: " + info.response);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await Login.findOne({ email });
		if (!user) return res.status(401).json({ message: `user not found ` });
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) return res.status(401).json({ message: `Incorrect password for ${email}` });
		const otp = generateOtp().toString();
		user.otp = getHash(otp);
		await user.save();
		await sendEmail(email, otp);
		res.status(200).json({ message: "Login Successful", data: { otp } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error while login" });
	}
});

router.post("/verify-login", async (req, res) => {
	const { email, otp } = req.body;

	try {
		const user = await Login.findOne({ email });

		if (bcrypt.compareSync(otp.toString(), user.otp.toString())) {
			const token = generateToken({ userId: user._id, role: user.role, email: user.email });

			user.otp = null;
			await user.save();
			res.status(200).json({ message: "Login Successful", data: { email, role: user.role, token, id: user._id } });
		} else {
			res.status(401).json({ message: "Incorrect OTP" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error while login" });
	}
});

router.post("/register", async (req, res) => {
	try {
		const { username, email, mobile, password, role } = req.body;
		const existing = await Login.findOne({ email });
		if (existing) return res.status(409).json({ message: `${email} is already registered` });
		const hashedPassword = getHash(password);
		const login = new Login(req.body);
		login.password = hashedPassword;
		await login.save();
		res.status(200).json({ message: `${role} registered` });
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/technician", async (req, res) => {
	try {
		const logins = await Login.find().select("-password").where("role").equals("Technician");
		res.json(logins);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});
router.get("/researcher", async (req, res) => {
	try {
		const logins = await Login.find().select("-password").where("role").equals("Researcher");
		res.json(logins);
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

router.get("/count", async (req, res) => {
	try {
		const technicians = await Login.find().where("role").equals("Technician").countDocuments();
		const categories = await Category.find().countDocuments();
		const items = await Item.find().countDocuments();
		const suppliers = await Supplier.find().countDocuments();
		const alerts = await Item.find({ $expr: { $lt: ["$quantity", "$minstock"] } }).countDocuments();
		const pendingComplaints = await Complaint.find().where("status").equals("Pending").countDocuments();
		res.json({ technicians, categories, items, suppliers, alerts, pendingComplaints });
	} catch (error) {
		res.status(400).json("Error: " + error);
	}
});

module.exports = router;
