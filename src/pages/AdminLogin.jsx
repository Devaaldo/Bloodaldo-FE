import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const { login } = useAuth();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setError(""); // Clear error when user types
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const success = await login(formData.username, formData.password);
			if (success) {
				navigate("/reports");
			} else {
				setError("Username atau password salah.");
			}
		} catch (err) {
			console.error("Login error:", err);
			setError("Terjadi kesalahan saat login. Silakan coba lagi.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
			<div className="bg-blue-600 text-white p-6 text-center">
				<h1 className="text-2xl font-bold">Admin Login</h1>
				<p className="text-blue-100">Masuk untuk mengakses fitur admin</p>
			</div>

			<div className="p-6">
				{error && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
						role="alert"
					>
						<span className="block sm:inline">{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="username">
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="mb-6">
						<label className="block text-gray-700 mb-2" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={isLoading}
							className={`w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition ${
								isLoading ? "opacity-70 cursor-not-allowed" : ""
							}`}
						>
							{isLoading ? "Memproses..." : "Login"}
						</button>
					</div>
				</form>

				<div className="mt-6 text-center text-sm text-gray-600">
					<p>
						Untuk mengakses fitur admin seperti ekspor data, penghapusan data
						pasien, dan fitur lainnya, silakan login dengan kredensial admin.
					</p>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
