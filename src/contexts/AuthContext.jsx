import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const API_URL = "http://localhost:5000/api";

	// Check if user is logged in (on initial load)
	useEffect(() => {
		const checkAuthStatus = async () => {
			const token = localStorage.getItem("token");

			if (token) {
				try {
					const response = await axios.get(`${API_URL}/auth/me`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					setUser(response.data.user);
				} catch (error) {
					console.error("Authentication error:", error);
					localStorage.removeItem("token");
					setUser(null);
				}
			}

			setLoading(false);
		};

		checkAuthStatus();
	}, []);

	// Register user
	const register = async (userData) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(`${API_URL}/auth/register`, userData);

			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				setUser(response.data.user);
				toast.success("Registrasi berhasil!");
				return true;
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Terjadi kesalahan saat registrasi.";
			setError(errorMessage);
			toast.error(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Login user
	const login = async (credentials) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(`${API_URL}/auth/login`, credentials);

			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				setUser(response.data.user);
				toast.success("Login berhasil!");
				return true;
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Username atau password salah.";
			setError(errorMessage);
			toast.error(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Logout user
	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		toast.info("Anda telah keluar dari sistem");
	};

	// Update user profile
	const updateProfile = async (userData) => {
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");

			const response = await axios.put(`${API_URL}/users/profile`, userData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setUser({ ...user, ...response.data.user });
			toast.success("Profil berhasil diperbarui!");
			return true;
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				"Terjadi kesalahan saat memperbarui profil.";
			setError(errorMessage);
			toast.error(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Check if user is admin
	const isAdmin = () => {
		return user && user.role === "admin";
	};

	const value = {
		user,
		loading,
		error,
		register,
		login,
		logout,
		updateProfile,
		isAdmin,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
