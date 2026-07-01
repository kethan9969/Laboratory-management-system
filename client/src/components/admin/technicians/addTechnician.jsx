import React from "react";

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
	Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const signupSchema = yup.object().shape({
	username: yup.string().required("Enter your username"),
	email: yup.string().email("Invalid email format").required("Enter your email"),
	password: yup.string().required("Enter your password"),
	mobile: yup
		.string()
		.required("Enter your mobile number")
		.matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});
export default function AddTechnician({ open, onClose }) {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		mobile: "",
	});
	const [errors, setErrors] = useState({});

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleRegister = () => {
		signupSchema
			.validate(form, { abortEarly: false })
			.then(() => {
				form.role = "Technician";
				axios
					.post(process.env.REACT_APP_DEV_API_URL + "/auth/register", form)
					.then((res) => {
						console.log(res);
						toast.success("Technician added successfully");
						setTimeout(() => {
							onClose();
							window.location.reload();
						}, 1000);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((validationErrors) => {
				const validationErrorMap = {};
				validationErrors.inner.forEach((error) => {
					validationErrorMap[error.path] = error.message;
				});
				setErrors(validationErrorMap);
			});
	};
	return (
		<div>
			<Dialog open={open} onClose={onClose} maxWidth='xl'>
				<DialogTitle>Enter technician details</DialogTitle>
				<Divider />
				<DialogContent>
					<TextField
						size='small'
						required
						fullWidth
						type='text'
						name='username'
						value={form.username}
						id='outlined-username'
						error={!!errors.username}
						helperText={errors.username}
						onChange={handleChange}
						placeholder='Username'
					/>
					<br /> <br />
					<TextField
						size='small'
						required
						fullWidth
						type='email'
						name='email'
						value={form.email}
						id='outlined-email'
						error={!!errors.email}
						helperText={errors.email}
						onChange={handleChange}
						placeholder='Email address'
					/>
					<br /> <br />
					<TextField
						size='small'
						required
						fullWidth
						type='number'
						name='mobile'
						value={form.mobile}
						id='outlined-mobile'
						error={!!errors.mobile}
						helperText={errors.mobile}
						onChange={handleChange}
						placeholder='Mobile number'
					/>
					<br /> <br />
					<TextField
						size='small'
						required
						fullWidth
						name='password'
						value={form.password}
						id='outlined-password'
						placeholder='At least 6 characters'
						error={!!errors.password}
						helperText={errors.password}
						onChange={handleChange}
						type={showPassword ? "text" : "password"}
						InputProps={{
							endAdornment: (
								<>
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge='end'
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								</>
							),
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button size='small' onClick={onClose} color='secondary'>
						Cancel
					</Button>
					<Button size='small' onClick={handleRegister} color='primary' variant='contained'>
						register
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
