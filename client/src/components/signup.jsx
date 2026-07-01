import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";

import {
	FormControl,
	InputLabel,
	Button,
	Select,
	MenuItem,
	Typography,
	Paper,
	Box,
	TextField,
	FormHelperText,
	IconButton,
	InputAdornment,
	LinearProgress,
} from "@mui/material";
import Cookies from "js-cookie";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import * as yup from "yup";

const signupSchema = yup.object().shape({
	username: yup.string().required("Enter your username"),
	email: yup.string().email("Invalid email format").required("Enter your email"),
	password: yup.string().required("Enter your password"),
	mobile: yup
		.string()
		.required("Enter your mobile number")
		.matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});

export default function Signup() {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		mobile: "",
	});
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [username, setUsername] = useState("");
	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState("");
	const [password, setPassword] = useState("");
	const [mobile, setMobile] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showOtp, setShowOtp] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [progressMessage, setProgressMessage] = useState("");

	const navigate = useNavigate();

	const openAlert = (status, message) => {
		setStatus(status);
		setErrorMessage(message);
		setIsAlertOpen(true);
	};

	const closeAlert = () => {
		setIsAlertOpen(false);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleOtpChange = (event) => {
		setOtp(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleRequestOtp = () => {
		signupSchema
			.validate(form, { abortEarly: false })
			.then(() => {
				// setProgressMessage("Sending OTP to email");
				setIsLoading(true);
				axios
					.post(process.env.REACT_APP_DEV_API_URL + "/register", form)
					.then((res) => {
						console.log(res);
						setIsLoading(false);
						openAlert("success", res.data.message);
					})
					.catch((err) => {
						console.log(err);

						setIsLoading(false);
						openAlert("error", err.response.data.message);
						// console.log(err);
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
		<div className='customer-login-box'>
			<Paper className='loginBox' elevation={5}>
				<>
					<Box p={3}>
						<div id='create'>
							<Typography variant='h5'>Create Account</Typography> <br />
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
							<br />
							<br />
							<Button fullWidth variant='contained' onClick={handleRequestOtp}>
								Create Account
							</Button>
						</div>
					</Box>
				</>
			</Paper>
		</div>
	);
}
