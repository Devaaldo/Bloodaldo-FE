import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Check if user is already logged in on mount
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const token = localStorage.getItem("bloodaldo_token");

				if (token) {
					// Set default authorization header
					axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

					// Verify token with backend
					const response = await axios.get(
						"http://localhost:5000/api/auth/verify"
					);

					if (response.data.valid) {
						setIsAuthenticated(true);
						setUser(response.data.user);
					} else {
						// Token is invalid or expired
						localStorage.removeItem("bloodaldo_token");
						delete axios.defaults.headers.common["Authorization"];
					}
				}
			} catch (error) {
				console.error("Auth verification error:", error);
				localStorage.removeItem("bloodaldo_token");
				delete axios.defaults.headers.common["Authorization"];
			} finally {
				setLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	// Login function
	const login = async (username, password) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/login",
				{
					username,
					password,
				}
			);

			const { token, user } = response.data;

			// Save token in localStorage
			localStorage.setItem("bloodaldo_token", token);

			// Set default authorization header
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			// Update state
			setIsAuthenticated(true);
			setUser(user);

			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	// Logout function
	const logout = () => {
		// Remove token from localStorage
		localStorage.removeItem("bloodaldo_token");

		// Remove authorization header
		delete axios.defaults.headers.common["Authorization"];

		// Update state
		setIsAuthenticated(false);
		setUser(null);
	};

	// Context value
	const value = {
		isAuthenticated,
		user,
		loading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthContext;
