import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddCategoryDialog from "./addCategory";
import axios from "axios";
import CategoriesTable from "./categoriesTable";
import { toast } from "react-toastify";

export default function Categories() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/category")
			.then((response) => {
				setCategories(response.data);
				// toast.success("Categories loaded successfully");
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleDialogSubmit = (data) => {
		console.log("Submitted Data:", data);
		axios
			.post(process.env.REACT_APP_DEV_API_URL + "/category", data)
			.then((response) => {
				console.log(response.data);
				toast.success("Category added successfully");
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
				Add Category
			</Button>
			<br />
			<br />
			<AddCategoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleDialogSubmit} />
			<CategoriesTable categories={categories} />
		</div>
	);
}
