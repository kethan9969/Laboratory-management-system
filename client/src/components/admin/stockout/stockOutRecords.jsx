import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import OutStock from "./outStock";
import { toast } from "react-toastify";
import StockOutTable from "./stockOutTable";

export default function StockOutRecords() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [stockOutRecords, setStockOutRecords] = React.useState([]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/stockout")
			.then((response) => {
				setStockOutRecords(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<div>
			<Button size='small' variant='contained' onClick={() => setDialogOpen(true)}>
				Add Stock-Out Record
			</Button>
			<OutStock open={dialogOpen} onClose={() => setDialogOpen(false)} />
			<br />
			<br />
			<StockOutTable stockOutRecords={stockOutRecords} />
		</div>
	);
}
