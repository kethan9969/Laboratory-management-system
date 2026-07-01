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
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddResearcher from "./addResearcher";

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

export default function Researchers() {
	const navigate = useNavigate();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const [dialogOpen, setDialogOpen] = useState(false);

	const [researchers, setResearchers] = useState([]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/auth/researcher")
			.then((res) => {
				setResearchers(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div>
			<AddResearcher open={dialogOpen} onClose={() => setDialogOpen(false)} />

			<Button size='small' variant='contained' color='primary' onClick={() => setDialogOpen(true)}>
				Add Researcher
			</Button>
			<Divider sx={{ margin: "10px 0" }} />
			<Paper elevation={2} sx={{ margin: 0, overflow: "hidden" }}>
				<TableContainer>
					<Table size='small' stickyHeader aria-label='sticky table'>
						<TableHead>
							<TableRow>
								<StyledTableCell>S.no</StyledTableCell>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell>Email</StyledTableCell>
								<StyledTableCell>Mobile</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{researchers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
								return (
									<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
										<StyledTableCell>{page * rowsPerPage + key + 1}</StyledTableCell>
										<StyledTableCell>{row.username}</StyledTableCell>
										<StyledTableCell>{row.email}</StyledTableCell>
										<StyledTableCell>{row.mobile}</StyledTableCell>
									</StyledTableRow>
								);
							})}

							{researchers.length === 0 && (
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
					count={researchers.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
