import {
	Button,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
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

export default function TechnicianItems() {
	const navigate = useNavigate();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [role, setRole] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [item, setItem] = useState({});
	const [items, setItems] = useState([]);

	useEffect(() => {
		let role = Cookies.get("role");
		setRole(role);
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/stockout/technician/" + Cookies.get("id"))
			.then((response) => {
				console.log(response);

				setItems(response.data.items);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<div>
			<Paper elevation={2} sx={{ margin: 0, overflow: "hidden" }}>
				<TableContainer>
					<Table size='small' stickyHeader aria-label='sticky table'>
						<TableHead>
							<TableRow>
								<StyledTableCell>S.no</StyledTableCell>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell>Description</StyledTableCell>
								<StyledTableCell>Price</StyledTableCell>
								<StyledTableCell>Quantity issued</StyledTableCell>
								<StyledTableCell>Minimum stock</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
								return (
									<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
										<StyledTableCell>{page * rowsPerPage + key + 1}</StyledTableCell>
										<StyledTableCell>{row.item.name}</StyledTableCell>
										<StyledTableCell>{row.item.description}</StyledTableCell>
										<StyledTableCell>
											{row.item.price} / {row.item.unit}
										</StyledTableCell>
										<StyledTableCell>
											{row.quantity} {row.item.unit + "s"}
										</StyledTableCell>
										<StyledTableCell>
											{row.item.minstock} {row.item.unit + "s"}
										</StyledTableCell>
									</StyledTableRow>
								);
							})}

							{items.length === 0 && (
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
					count={items.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
