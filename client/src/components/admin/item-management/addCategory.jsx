import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const categorySchema = yup.object().shape({
	name: yup.string().required("Enter category name"),
	description: yup.string().required("Enter category description"),
});

const AddCategoryDialog = ({ categoryy, open, onClose, onSubmit }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState({});
	const [id, setId] = useState("");

	const handleValidation = (callback) => {
		categorySchema
			.validate({ name, description }, { abortEarly: false })
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
			// onSubmit(category);
			setName("");
			setDescription("");
			onClose();
		});
	};

	useEffect(() => {
		if (categoryy) {
			setId(categoryy._id);
			setName(categoryy.name);
			setDescription(categoryy.description);
		}
	}, [categoryy]);

	const handleUpdate = () => {
		handleValidation(() => {
			// console.log("Updated Item:", item);
			// onSubmit(item);
			axios
				.put(process.env.REACT_APP_DEV_API_URL + "/category/" + id, { name, description })
				.then((response) => {
					console.log(response);
					toast.success("Category updated successfully");
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
			<DialogTitle>{categoryy ? "Update Category" : "Enter Category details"}</DialogTitle>
			<DialogContent>
				<TextField
					size='small'
					autoFocus
					margin='dense'
					type='text'
					placeholder='Category name'
					fullWidth
					variant='outlined'
					value={name}
					error={!!errors.name}
					helperText={errors.name}
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					size='small'
					margin='dense'
					placeholder='Description'
					type='text'
					fullWidth
					multiline
					rows={3}
					variant='outlined'
					value={description}
					error={!!errors.description}
					helperText={errors.description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button size='small' onClick={onClose} color='secondary'>
					Cancel
				</Button>
				{!categoryy ? (
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

export default AddCategoryDialog;
