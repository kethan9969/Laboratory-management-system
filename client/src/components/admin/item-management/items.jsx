import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddItemDialog from "./addItem";
import axios from "axios";
import ItemsTable from "./itemsTable";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Items() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [items, setItems] = useState([]);

	const [role, setRole] = useState("");

	useEffect(() => {
		let role = Cookies.get("role");
		setRole(role);
		console.log(role);

		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/item")
			.then((response) => {
				setItems(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleDialogSubmit = (data) => {
		axios
			.post(process.env.REACT_APP_DEV_API_URL + "/item", data)
			.then((response) => {
				console.log(response.data);
				toast.success("Item added successfully");
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
			{role === "Administrator" && (
				<>
					<Button sx={{ mb: 2 }} size='small' variant='contained' onClick={() => setDialogOpen(true)}>
						Add Item
					</Button>
				</>
			)}
			<AddItemDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleDialogSubmit} />
			<ItemsTable items={items} />
		</div>
	);
}
