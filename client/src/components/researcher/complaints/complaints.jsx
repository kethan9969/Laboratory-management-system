import {
	Button,
	ButtonGroup,
	Divider,
	Fab,
	IconButton,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import AddComplaintDialog from "./addComplaint";

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

export default function Complaints() {
	const navigate = useNavigate();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const role = Cookies.get("role");

	const [dialogOpen, setDialogOpen] = useState(false);

	const [complaints, setComplaints] = useState([]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	useEffect(() => {
		let role = Cookies.get("role");
		if (role === "Researcher") {
			axios
				.get(process.env.REACT_APP_DEV_API_URL + "/complaint/researcher/" + Cookies.get("id"))
				.then((res) => {
					setComplaints(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (role === "Technician" || role === "Administrator") {
			axios
				.get(process.env.REACT_APP_DEV_API_URL + "/complaint/status/pending")
				.then((res) => {
					setComplaints(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, []);

	const approve = (id) => {
		axios
			.put(process.env.REACT_APP_DEV_API_URL + "/complaint/" + id, { status: "Approved" })
			.then((res) => {
				toast.success("Complaint updated successfully");
				// setComplaints(complaints.filter((complaint) => complaint._id !== id));
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const decline = (id) => {
		axios
			.put(process.env.REACT_APP_DEV_API_URL + "/complaint/" + id, { status: "Declined" })
			.then((res) => {
				toast.success("Complaint declined successfully");
				// setComplaints(complaints.filter((complaint) => complaint._id !== id));
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div>
			<AddComplaintDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

			{role === "Researcher" && (
				<div>
					<Button size='small' variant='contained' color='primary' onClick={() => setDialogOpen(true)}>
						Add complaint
					</Button>
					<Divider sx={{ margin: "10px 0" }} />
				</div>
			)}
			<Paper elevation={2} sx={{ margin: 0, overflow: "hidden" }}>
				<TableContainer>
					<Table size='small' stickyHeader aria-label='sticky table'>
						<TableHead>
							<TableRow>
								<StyledTableCell>S.no</StyledTableCell>
								<StyledTableCell>Category</StyledTableCell>
								<StyledTableCell>Item</StyledTableCell>
								<StyledTableCell>Complaint</StyledTableCell>
								<StyledTableCell>Status</StyledTableCell>
								{role === "Technician" && <StyledTableCell>Action</StyledTableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							{complaints.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
								return (
									<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
										<StyledTableCell>{page * rowsPerPage + key + 1}</StyledTableCell>
										<StyledTableCell>{row.category.name}</StyledTableCell>
										<StyledTableCell>{row.item.name}</StyledTableCell>
										<StyledTableCell>{row.description}</StyledTableCell>
										<StyledTableCell>
											{row.status === "Pending" && (
												<Typography variant='body1' color='warning'>
													{row.status}
												</Typography>
											)}
											{row.status === "Approved" && (
												<Typography variant='body1' color='success'>
													{row.status}
												</Typography>
											)}
											{row.status === "Declined" && (
												<Typography variant='body1' color='error'>
													{row.status}
												</Typography>
											)}
										</StyledTableCell>
										{role === "Technician" && row.status === "Pending" && (
											<ButtonGroup variant='outlined'>
												<Button onClick={() => approve(row._id)}>Approve</Button>
												<Button onClick={() => decline(row._id)} color='error'>
													Decline
												</Button>
											</ButtonGroup>
										)}
									</StyledTableRow>
								);
							})}

							{complaints.length === 0 && (
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
					count={complaints.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
