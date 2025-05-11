import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BloodTestForm from "./pages/BloodTestForm";
import DetectionPage from "./pages/DetectionPage";
import HistoryPage from "./pages/HistoryPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RuleManagement from "./pages/admin/RuleManagement";
import SystemSettings from "./pages/admin/SystemSettings";

function App() {
	return (
		<AuthProvider>
			<Router>
				<ToastContainer position="top-right" autoClose={3000} />
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected Routes */}
					<Route element={<Layout />}>
						{/* User Routes */}
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/blood-test"
							element={
								<ProtectedRoute>
									<BloodTestForm />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/detection"
							element={
								<ProtectedRoute>
									<DetectionPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/history"
							element={
								<ProtectedRoute>
									<HistoryPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/reports"
							element={
								<ProtectedRoute>
									<ReportsPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<ProfilePage />
								</ProtectedRoute>
							}
						/>

						{/* Admin Routes */}
						<Route
							path="/admin"
							element={
								<AdminRoute>
									<AdminDashboard />
								</AdminRoute>
							}
						/>

						<Route
							path="/admin/users"
							element={
								<AdminRoute>
									<UserManagement />
								</AdminRoute>
							}
						/>

						<Route
							path="/admin/rules"
							element={
								<AdminRoute>
									<RuleManagement />
								</AdminRoute>
							}
						/>

						<Route
							path="/admin/settings"
							element={
								<AdminRoute>
									<SystemSettings />
								</AdminRoute>
							}
						/>
					</Route>

					{/* Not Found Route */}
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
