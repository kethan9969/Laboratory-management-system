import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const itemSchema = yup.object().shape({
	name: yup.string().required("Enter category name"),
	description: yup.string().required("Enter category description"),
	price: yup.number().required("Enter price").min(0),
	unit: yup.string().required("Enter unit"),
	category: yup.string().required("Enter category"),
	minstock: yup.number().required("Enter minimum stock").min(0),
});

const AddItemDialog = ({ itemm, open, onClose, onSubmit }) => {
	const [errors, setErrors] = useState({});
	const [categories, setCategories] = useState([]);
	const [item, setItem] = useState({
		name: "",
		description: "",
		price: "",
		unit: "",
		category: "",
		minstock: "",
	});

	useEffect(() => {
		if (itemm) {
			setItem((prev) => ({
				...prev,
				...itemm, // Ensure all properties are copied
				category: itemm.category || "", // Ensures category is set
			}));
		}
	}, [itemm]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/category")
			.then((response) => {
				// const categoryList = response.data.map((category) => category.name);
				setCategories(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setItem((prev) => ({
			...prev,
			[name]: name === "price" || name === "minstock" ? parseInt(value) : value,
		}));
	};

	const handleValidation = (callback) => {
		itemSchema
			.validate(item, { abortEarly: false })
			.then(() => {
				setErrors({});
				callback();
			})
			.catch((validationErrors) => {
				const newErrors = {};
				validationErrors.inner.forEach((error) => {
					newErrors[error.path] = error.message;
				});
				setErrors(newErrors);
			});
	};

	const handleSubmit = () => {
		handleValidation(() => {
			onSubmit(item);
			setItem({
				name: "",
				description: "",
				price: "",
				unit: "",
				category: "",
				minstock: "",
			});
			onClose();
		});
	};

	const handleUpdate = () => {
		handleValidation(() => {
			console.log("Updated Item:", item);
			onSubmit(item);
			axios
				.put(process.env.REACT_APP_DEV_API_URL + "/item/" + item._id, item)
				.then((response) => {
					console.log(response);
					toast.success("Item updated successfully");
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch((error) => {
					console.error(error);
				});
			onClose();
		});
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{itemm ? "Update Item" : "Enter Item Details"}</DialogTitle>
			<DialogContent>
				<FormControl fullWidth sx={{ my: 1 }}>
					<InputLabel size='small' id='category'>
						Category
					</InputLabel>
					<Select
						size='small'
						margin='dense'
						fullWidth
						label='Category'
						name='category'
						variant='outlined'
						value={item.category || ""}
						error={!!errors.category}
						onChange={handleChange}
					>
						{categories.map((category, index) => (
							<MenuItem key={index} value={category._id}>
								{category.name}
							</MenuItem>
						))}
					</Select>
					{errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
				</FormControl>

				<TextField
					size='small'
					margin='dense'
					fullWidth
					label='Name'
					name='name'
					variant='outlined'
					value={item.name}
					error={!!errors.name}
					helperText={errors.name}
					onChange={handleChange}
				/>
				<TextField
					size='small'
					margin='dense'
					fullWidth
					label='Description'
					name='description'
					variant='outlined'
					value={item.description}
					error={!!errors.description}
					helperText={errors.description}
					onChange={handleChange}
				/>
				<TextField
					size='small'
					margin='dense'
					fullWidth
					label='Minimum Stock'
					name='minstock'
					variant='outlined'
					type='number'
					value={item.minstock}
					error={!!errors.minstock}
					helperText={errors.minstock}
					onChange={handleChange}
				/>
				<TextField
					size='small'
					margin='dense'
					fullWidth
					label='Price'
					name='price'
					variant='outlined'
					type='number'
					value={item.price}
					error={!!errors.price}
					helperText={errors.price}
					onChange={handleChange}
				/>

				<FormControl fullWidth sx={{ mt: 1 }}>
					<InputLabel size='small' id='unit'>
						Unit
					</InputLabel>
					<Select
						size='small'
						margin='dense'
						fullWidth
						label='Unit'
						name='unit'
						variant='outlined'
						value={item.unit || ""}
						error={!!errors.unit}
						onChange={handleChange}
					>
						<MenuItem value='litre'>Litre</MenuItem>
						<MenuItem value='gram'>Gram</MenuItem>
						<MenuItem value='piece'>Piece</MenuItem>
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button size='small' onClick={onClose} color='secondary'>
					Cancel
				</Button>
				{!itemm ? (
					<Button size='small' onClick={handleSubmit} color='primary' variant='contained'>
						Add
					</Button>
				) : (
					<Button size='small' onClick={handleUpdate} color='primary' variant='contained'>
						Update
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AddItemDialog;
