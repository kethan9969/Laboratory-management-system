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
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import AddCategoryDialog from "./addCategory";
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

export default function CategoriesTable({ categories }) {
	const navigate = useNavigate();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [category, setCategory] = useState({});

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleEdit = (row) => {
		setDialogOpen(true);
		setCategory(row);
	};

	const handleDelete = (id) => {
		console.log("Delete item with id:", id);
		axios
			.delete(process.env.REACT_APP_DEV_API_URL + "/category/" + id)
			.then((response) => {
				toast.success("Category deleted successfully");
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div>
			<AddCategoryDialog categoryy={category} open={dialogOpen} onClose={() => setDialogOpen(false)} />
			<Paper elevation={2} sx={{ margin: 0, overflow: "hidden" }}>
				<TableContainer>
					<Table size='small' stickyHeader aria-label='sticky table'>
						<TableHead>
							<TableRow>
								<StyledTableCell>S.no</StyledTableCell>
								<StyledTableCell>Category</StyledTableCell>
								<StyledTableCell>Description</StyledTableCell>
								<StyledTableCell></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
								return (
									<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
										<StyledTableCell>{page * rowsPerPage + key + 1}</StyledTableCell>
										<StyledTableCell>{row.name}</StyledTableCell>
										<StyledTableCell>{row.description}</StyledTableCell>
										<StyledTableCell>
											<IconButton onClick={() => handleEdit(row)} size='small' color='primary'>
												<EditIcon fontSize='small' />
											</IconButton>
											<IconButton onClick={() => handleDelete(row._id)} size='small' color='error'>
												<DeleteIcon fontSize='small' />
											</IconButton>
										</StyledTableCell>
									</StyledTableRow>
								);
							})}

							{categories.length === 0 && (
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
					count={categories.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
