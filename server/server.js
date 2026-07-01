const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log("Error connecting to MongoDB", error);
	});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRouter"));
app.use("/category", require("./routes/categoryRouter"));
app.use("/supplier", require("./routes/supplierRouter"));
app.use("/item", require("./routes/itemRouter"));
app.use("/stockin", require("./routes/stockInRouter"));
app.use("/stockout", require("./routes/stockOutRouter"));
app.use("/complaint", require("./routes/complaintRouter"));

app.listen(process.env.PORT, () => {
	console.log("Server started on port", process.env.PORT);
});
