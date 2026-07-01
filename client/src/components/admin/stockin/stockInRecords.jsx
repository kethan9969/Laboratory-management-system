import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddStock from "./addStock";
import { toast } from "react-toastify";
import StockInTable from "./stockInTable";

export default function StockInRecords() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [stockInRecords, setStockInRecords] = React.useState([]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/stockin")
			.then((response) => {
				setStockInRecords(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<div>
			<Button size='small' variant='contained' onClick={() => setDialogOpen(true)}>
				Add Stock-In Record
			</Button>
			<AddStock open={dialogOpen} onClose={() => setDialogOpen(false)} />
			<br />
			<br />
			<StockInTable stockInRecords={stockInRecords} />
		</div>
	);
}
