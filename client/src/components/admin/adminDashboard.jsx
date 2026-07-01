import Cookies from "js-cookie";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link, Outlet } from "react-router-dom";
import { Badge, Button } from "@mui/material";
import axios from "axios";

const drawerWidth = 240;

export default function AdminDashboard() {
	const [id, setId] = React.useState("");
	const [count, setCount] = React.useState([]);

	React.useEffect(() => {
		Cookies.get("id") && setId(Cookies.get("id"));
		axios
			.get(process.env.REACT_APP_DEV_API_URL + "/auth/count")
			.then((res) => {
				setCount(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const logout = () => {
		Cookies.remove("id");
		window.location.href = "/al";
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<Typography variant='h6' noWrap component='div'>
						Lab Inventory management | Admin
					</Typography>
					<Box sx={{ flexGrow: 1 }}></Box>
					{id && (
						<Button variant='contained' onClick={logout}>
							Logout
						</Button>
					)}
				</Toolbar>
			</AppBar>
			<Drawer
				variant='permanent'
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: "auto" }}>
					<List>
						<ListItem disablePadding component={Link} to='/admin/dashboard'>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Dashboard"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/technicians'>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Technicians"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/categories'>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Categories"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/suppliers'>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Suppliers"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/item-management'>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Item management"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/stock-in'>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Stock in"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/stock-out'>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Stock out"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/stock-alerts'>
							<ListItemButton>
								<ListItemIcon>
									<Badge badgeContent={count.alerts} color='error'>
										<InboxIcon />
									</Badge>
								</ListItemIcon>
								<ListItemText primary={"Stock alerts"} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding component={Link} to='/admin/complaints'>
							<ListItemButton>
								<ListItemIcon>
									<Badge badgeContent={count.pendingComplaints} color='error'>
										<InboxIcon />
									</Badge>
								</ListItemIcon>
								<ListItemText primary={"Complaints"} />
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
			</Drawer>
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<Box>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
