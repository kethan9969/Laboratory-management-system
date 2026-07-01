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

const OutStockDialog = ({ open, onClose, onSubmit }) => {
	const [errors, setErrors] = useState({});
	const [technician, setTechnicians] = useState([]);
	const [items, setItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [categories, setCategories] = useState([]);
	const [addedItems, setAddedItems] = useState([]);
	const [selected, setSelected] = useState({
		technician: "",
		purpose: "",
		category: "",
	});

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const [selectedItem, setSelectedItem] = useState({
		item: "",
		quantity: 0,
		total: 0,
	});

	const handleItemChange = (e) => {
		const { name, value } = e.target;
		setSelectedItem((prev) => ({
			...prev,
			[name]: name === "quantity" ? parseInt(value) : value,
		}));

		if (name === "quantity") {
			let item = items.find((item) => item._id === selectedItem.item._id);
			setSelectedItem((prev) => ({
				...prev,
				total: item.price * value,
			}));
		}
	};

	const handleSelectedChange = (e) => {
		const { name, value } = e.target;
		setSelected((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "category") {
			setSelectedItem({
				item: "",
				quantity: 0,
				total: 0,
			});
			let filter = items.filter((item) => item.category.name === value);
			setFilteredItems(filter);
		}
	};

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/auth/technician")
			.then((response) => {
				setTechnicians(response.data);
			})
			.catch((error) => {
				console.error(error);
			});

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

	const addItem = () => {
		console.log(selectedItem);
		setAddedItems((prev) => [...prev, selectedItem]);
		setSelectedItem({
			item: "",
			quantity: 0,
			total: 0,
		});
		setSelected((prev) => ({
			...prev,
			category: "",
		}));
		setFilteredItems([]);
	};

	const handleSubmit = () => {
		let totalAmount = 0;
		addedItems.forEach((item) => {
			totalAmount += item.total;
		});
		let stockOut = {
			issuedTo: selected.technician,
            purpose: selected.purpose,
			issuedDate: new Date(),
			items: addedItems,
			totalAmount: totalAmount,
		};

		axios
			.post(process.env.REACT_APP_DEV_API_URL + "/stockout", stockOut)
			.then((response) => {
				console.log(response.data);
				setAddedItems([]);
				toast.success("Stock issued successfully");
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
			<DialogTitle>Enter Stock Out details</DialogTitle>
			<Divider />
			<DialogContent>
				{/* <br /> */}
				<FormControl sx={{ mb: 1 }} fullWidth>
					<InputLabel size='small' id='technician'>
						Technician
					</InputLabel>
					<Select
						label='Technician'
						fullWidth
						size='small'
						name='technician'
						variant='outlined'
						value={selected.technician}
						error={!!errors.technician}
						onChange={handleSelectedChange}
					>
						{technician.map((technician, index) => (
							<MenuItem key={index} value={technician._id}>
								{technician.username}
							</MenuItem>
						))}
					</Select>
					{errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
				</FormControl>
				<TextField
					sx={{ mb: 2 }}
					size='small'
					label='Purpose'
					margin='dense'
					fullWidth
					name='purpose'
					variant='outlined'
					value={selected.purpose}
					onChange={handleSelectedChange}
				/>
				<Stack direction='row' spacing={2} mb={2}>
					<FormControl fullWidth>
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
								<MenuItem key={index} value={category.name}>
									{category.name}
								</MenuItem>
							))}
						</Select>
						{errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
					</FormControl>
					<FormControl fullWidth>
						<InputLabel size='small' id='supplier'>
							Item
						</InputLabel>
						<Select
							label='Item'
							fullWidth
							size='small'
							name='item'
							variant='outlined'
							value={selectedItem.item}
							error={!!errors.item}
							onChange={handleItemChange}
						>
							{filteredItems.map((item, index) => (
								<MenuItem key={index} value={item}>
									{item.name}
								</MenuItem>
							))}
						</Select>
						{errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
					</FormControl>
					{selectedItem.item && (
						<>
							<TextField
								size='small'
								InputProps={{ readOnly: true }}
								InputLabelProps={{ shrink: true }}
								label='Price'
								margin='dense'
								fullWidth
								name='Price'
								variant='outlined'
								value={selectedItem.item.price}
							/>
							<TextField
								size='small'
								margin='dense'
								fullWidth
								type='number'
								InputLabelProps={{ shrink: true }}
								label='Quantity'
								name='quantity'
								onChange={handleItemChange}
								variant='outlined'
								value={selectedItem.quantity}
							/>
							<TextField
								size='small'
								InputProps={{ readOnly: true }}
								InputLabelProps={{ shrink: true }}
								label='Total'
								margin='dense'
								fullWidth
								name='Total'
								variant='outlined'
								value={selectedItem.total}
							/>
							<Button onClick={addItem}>Add</Button>
						</>
					)}
				</Stack>
				<Paper elevation={2} sx={{ margin: 0, overflow: "hidden" }}>
					<TableContainer>
						<Table size='small' stickyHeader aria-label='sticky table'>
							<TableHead>
								<TableRow>
									<StyledTableCell>S.no</StyledTableCell>
									<StyledTableCell>Name</StyledTableCell>
									<StyledTableCell>Category</StyledTableCell>
									<StyledTableCell>Price</StyledTableCell>
									<StyledTableCell>Quantity</StyledTableCell>
									<StyledTableCell>Total</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{addedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
									return (
										<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
											<StyledTableCell>{page * rowsPerPage + key + 1}</StyledTableCell>
											<StyledTableCell>{row.item.name}</StyledTableCell>
											<StyledTableCell>{row.item.category.name}</StyledTableCell>
											<StyledTableCell>{row.item.price}</StyledTableCell>
											<StyledTableCell>{row.item.quantity}</StyledTableCell>
											<StyledTableCell>{row.total}</StyledTableCell>
										</StyledTableRow>
									);
								})}

								{addedItems.length === 0 && (
									<StyledTableRow>
										<StyledTableCell colSpan={3} sx={{ textAlign: "center" }}>
											No projects found
										</StyledTableCell>
									</StyledTableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 25, 100]}
						component='div'
						count={addedItems.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
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

export default OutStockDialog;
