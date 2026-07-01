import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Divider,
	Stack,
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	styled,
	TableCell,
	tableCellClasses,
	TableBody,
	TablePagination,
} from "@mui/material";

import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	// hide last border
}));

const stockSchema = yup.object().shape({
	supplier: yup.string().required("Select supplier"),
});

const AddComplaintDialog = ({ open, onClose, onSubmit }) => {
	const [errors, setErrors] = useState({});
	const [suppliers, setSuppliers] = useState([]);
	const [items, setItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [categories, setCategories] = useState([]);
	const [addedItems, setAddedItems] = useState([]);
	const [selected, setSelected] = useState({
		category: "",
		item: "",
		description: "",
	});

	const handleSelectedChange = (e) => {
		const { name, value } = e.target;
		setSelected((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "category") {
			let filter = items.filter((item) => item.category._id === value);
			setFilteredItems(filter);
		}
	};

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/item")
			.then((response) => {
				setItems(response.data);
			})
			.catch((error) => {
				console.error(error);
			});

		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/category")
			.then((response) => {
				setCategories(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleSubmit = () => {
		console.log(selected);
		selected.raisedBy = Cookies.get("id");

		axios
			.post(process.env.REACT_APP_DEV_API_URL + "/complaint", selected)
			.then((response) => {
				console.log(response.data);
				setAddedItems([]);
				toast.success("Complaint raised successfully");
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='xl'>
			<DialogTitle>Enter Complaint details</DialogTitle>
			<Divider />
			<DialogContent>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<InputLabel size='small' id='supplier'>
						Category
					</InputLabel>
					<Select
						label='Category'
						fullWidth
						size='small'
						name='category'
						variant='outlined'
						value={selected.category}
						error={!!errors.category}
						onChange={handleSelectedChange}
					>
						{categories.map((category, index) => (
							<MenuItem key={index} value={category._id}>
								{category.name}
							</MenuItem>
						))}
					</Select>
					{errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
				</FormControl>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel size='small' id='supplier'>
						Item
					</InputLabel>
					<Select
						label='Item'
						fullWidth
						size='small'
						name='item'
						variant='outlined'
						value={selected.item}
						error={!!errors.item}
						onChange={handleSelectedChange}
					>
						{filteredItems.map((item, index) => (
							<MenuItem key={index} value={item._id}>
								{item.name}
							</MenuItem>
						))}
					</Select>
					{errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
				</FormControl>
				{/* description textarea */}
				<TextField
					label='Description'
					multiline
					rows={4}
					fullWidth
					size='small'
					variant='outlined'
					name='description'
					value={selected.description}
					error={!!errors.description}
					helperText={errors.description}
					onChange={handleSelectedChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button size='small' onClick={onClose} color='secondary'>
					Cancel
				</Button>
				<Button size='small' onClick={handleSubmit} color='primary' variant='contained'>
					submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddComplaintDialog;
