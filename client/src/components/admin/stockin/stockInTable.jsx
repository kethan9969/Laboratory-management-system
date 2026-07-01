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
import React from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

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

export default function StockInTable({ stockInRecords }) {
	const navigate = useNavigate();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
								<StyledTableCell>Date of purchase</StyledTableCell>
								<StyledTableCell>Items purchased</StyledTableCell>
								<StyledTableCell>Supplier</StyledTableCell>
								<StyledTableCell>Total Amount</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stockInRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
								return (
									<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
										<StyledTableCell>{page * rowsPerPage + key + 1}</StyledTableCell>
										<StyledTableCell>{new Date(row.purchaseDate).toDateString()}</StyledTableCell>
										<StyledTableCell>{row.items.length}</StyledTableCell>
										<StyledTableCell>{row.supplier.name}</StyledTableCell>
										<StyledTableCell>{row.totalAmount}</StyledTableCell>
									</StyledTableRow>
								);
							})}

							{stockInRecords.length === 0 && (
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
					count={stockInRecords.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
