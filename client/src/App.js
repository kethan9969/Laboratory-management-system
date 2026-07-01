import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Adminlogin from "./components/admin/adminlogin";
import Signup from "./components/signup";
import Login from "./components/login";
import AdminDashboard from "./components/admin/adminDashboard";
import Items from "./components/admin/item-management/items";
import Categories from "./components/admin/item-management/categories";
import Suppliers from "./components/admin/suppliers/suppliers";
import Dashboard from "./components/admin/dashboard";
import TDashboard from "./components/technician/dashboard";
import { ToastContainer } from "react-toastify";
import StockInRecords from "./components/admin/stockin/stockInRecords";
import StockOutRecords from "./components/admin/stockout/stockOutRecords";
import Alerts from "./components/admin/alerts";
import Technicians from "./components/admin/technicians/technicians";
import TechnicianDashboard from "./components/technician/technicianDashboard";
import Researchers from "./components/technician/researchers/researchers";
import TechnicianItems from "./components/technician/items/items";
import ResearcherDashboard from "./components/researcher/researcherDashboard";
import RDashboard from "./components/researcher/dashboard";
import Complaints from "./components/researcher/complaints/complaints";

function App() {
	return (
		<BrowserRouter>
			<ToastContainer
				position='top-right'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
				style={{
					borderRadius: "0px",
					fontSize: "14px",
					fontWeight: "bold",
					fontFamily: "Poppins, sans-serif",
					zIndex: 9999,
				}}
			/>
			<Routes>
				<Route path='/' element={<Navigate to='signin' />} />
				<Route path='signin' element={<Login />} />
				<Route path='al' element={<Adminlogin />} />
				<Route path='register' element={<Signup />} />
				<Route path='admin' element={<AdminDashboard />}>
					<Route path='dashboard' element={<Dashboard />} />
					<Route path='technicians' element={<Technicians />} />
					<Route path='categories' element={<Categories />} />
					<Route path='suppliers' element={<Suppliers />} />
					<Route path='item-management' element={<Items />} />
					<Route path='stock-in' element={<StockInRecords />} />
					<Route path='stock-out' element={<StockOutRecords />} />
					<Route path='stock-alerts' element={<Alerts />} />
					<Route path='complaints' element={<Complaints />} />
				</Route>
				<Route path='technician' element={<TechnicianDashboard />}>
					<Route path='dashboard' element={<TDashboard />} />
					<Route path='researchers' element={<Researchers />} />
					<Route path='lab-inventory' element={<TechnicianItems />} />
					<Route path='stock-alerts' element={<Alerts />} />
					<Route path='complaints' element={<Complaints />} />
				</Route>
				<Route path='researcher' element={<ResearcherDashboard />}>
					<Route path='dashboard' element={<RDashboard />} />
					<Route path='complaints' element={<Complaints />} />
					<Route path='inventory' element={<Items />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
