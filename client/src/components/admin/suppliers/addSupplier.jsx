import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

import * as yup from "yup";

const categorySchema = yup.object().shape({
	name: yup.string().required("Required"),
	email: yup.string().required("Required"),
	mobile: yup.string().required("Required"),
	address: yup.string().required("Required"),
});

const AddSupplierDialog = ({ open, onClose, onSubmit }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState({});

	const [supplier, setSupplier] = useState({
		name: "",
		email: "",
		mobile: "",
		address: "",
	});

	const handleChange = (e) => {
		setSupplier({ ...supplier, [e.target.name]: e.target.value });
	};

	const handleSubmit = () => {
		categorySchema
			.validate(supplier, { abortEarly: false })
			.then(() => {
				setErrors({});
				onSubmit(supplier); // Pass data to parent
				setSupplier({
					name: "",
					email: "",
					mobile: "",
					address: "",
				});
				onClose(); // Close dialog
			})
			.catch((validationErrors) => {
				const newErrors = {};
				validationErrors.inner.forEach((error) => {
					newErrors[error.path] = error.message;
				});
				setErrors(newErrors);
			});
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Enter supplier details</DialogTitle>
			<DialogContent>
				<TextField
					size='small'
					autoFocus
					margin='dense'
					type='text'
					placeholder='Supplier name'
					fullWidth
					name='name'
					variant='outlined'
					value={supplier.name}
					error={!!errors.name}
					helperText={errors.name}
					onChange={handleChange}
				/>
				<TextField
					size='small'
					margin='dense'
					placeholder='Email'
					type='text'
					fullWidth
					name='email'
					variant='outlined'
					value={supplier.email}
					error={!!errors.email}
					helperText={errors.email}
					onChange={handleChange}
				/>
				<TextField
					size='small'
					margin='dense'
					placeholder='Mobile number'
					type='number'
					name='mobile'
					fullWidth
					variant='outlined'
					value={supplier.mobile}
					error={!!errors.mobile}
					helperText={errors.mobile}
					onChange={handleChange}
				/>
				<TextField
					size='small'
					margin='dense'
					placeholder='Address'
					type='text'
					name='address'
					fullWidth
					multiline
					rows={3}
					variant='outlined'
					value={supplier.address}
					error={!!errors.address}
					helperText={errors.address}
					onChange={handleChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button size='small' onClick={onClose} color='secondary'>
					Cancel
				</Button>
				<Button size='small' onClick={handleSubmit} color='primary' variant='contained'>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddSupplierDialog;
