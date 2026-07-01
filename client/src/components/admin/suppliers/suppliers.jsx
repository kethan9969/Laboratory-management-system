import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddSupplierDialog from "./addSupplier";
import { toast } from "react-toastify";
import SuppliersTable from "./table";

export default function Suppliers() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [suppliers, setSuppliers] = useState([]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/supplier")
			.then((response) => {
				// toast.success("Suppliers fetched successfully");
				setSuppliers(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleDialogSubmit = (data) => {
		console.log("Submitted Data:", data);
		axios
			.post(process.env.REACT_APP_DEV_API_URL + "/supplier", data)
			.then((response) => {
				console.log(response.data);
				toast.success("Supplier added successfully");
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			})
			.catch((error) => {
				console.error(error);
			});
	};
	return (
		<div>
			<Button size='small' variant='contained' onClick={() => setDialogOpen(true)}>
				Add Supplier
			</Button>
			<AddSupplierDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleDialogSubmit} />
			<br />
			<br />
			<SuppliersTable suppliers={suppliers} />
		</div>
	);
}
