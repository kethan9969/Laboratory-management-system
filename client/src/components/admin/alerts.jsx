import axios from "axios";
import React, { useEffect } from "react";
import {
	Button,
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
import { useNavigate } from "react-router-dom";
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
export default function Alerts() {
	const [stocks, setStocks] = React.useState([]);

	const navigate = useNavigate();

	const [role, setRole] = React.useState("");

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	useEffect(() => {
		const role = Cookies.get("role");
		setRole(role);
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/item/alert")
			.then((res) => {
				setStocks(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<div>
			<Typography mb={1} variant='body1'>
				Below items are under threshold level.
			</Typography>

			{role === "Administrator" && (
				<>
					<Button size='small' variant='contained' onClick={() => navigate("/admin/item-management")} color='primary'>
						Add items
					</Button>
					<Divider sx={{ margin: "10px 0" }}></Divider>
				</>
			)}

			<Paper elevation={2} sx={{ margin: 0, overflow: "hidden" }}>
				<TableContainer>
					<Table size='small' stickyHeader aria-label='sticky table'>
						<TableHead>
							<TableRow>
								<StyledTableCell>S.no</StyledTableCell>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell>Description</StyledTableCell>
								<StyledTableCell>Category</StyledTableCell>
								<StyledTableCell>Price</StyledTableCell>
								<StyledTableCell>Quantity in inventory</StyledTableCell>
								<StyledTableCell>Minimum stock</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
								return (
									<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
										<StyledTableCell>{page * rowsPerPage + key + 1}</StyledTableCell>
										<StyledTableCell>{row.name}</StyledTableCell>
										<StyledTableCell>{row.description}</StyledTableCell>
										<StyledTableCell>{row.category.name}</StyledTableCell>
										<StyledTableCell>
											{row.price} / {row.unit}
										</StyledTableCell>
										<StyledTableCell>
											{row.quantity} {row.unit + "s"}{" "}
										</StyledTableCell>
										<StyledTableCell>
											{row.minstock} {row.unit + "s"}
										</StyledTableCell>
									</StyledTableRow>
								);
							})}

							{stocks.length === 0 && (
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
					count={stocks.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
