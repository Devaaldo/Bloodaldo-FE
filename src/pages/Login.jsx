import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const { login, loading } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear error when user types
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const validateForm = () => {
		let tempErrors = {};
		let isValid = true;

		if (!formData.email) {
			tempErrors.email = "Email harus diisi";
			isValid = false;
		}

		if (!formData.password) {
			tempErrors.password = "Password harus diisi";
			isValid = false;
		}

		setErrors(tempErrors);
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			const success = await login(formData);
			if (success) {
				navigate("/");
			}
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delay: 0.1,
				duration: 0.5,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<motion.div
				className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.div variants={itemVariants}>
					<div className="flex justify-center">
						<img src="/logo.png" alt="Bloodaldo Logo" className="h-16 w-16" />
					</div>
					<h2 className="mt-6 text-center text-3xl font-display font-bold text-gray-900">
						Login ke Bloodaldo
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Sistem Pakar untuk Deteksi Dini Penyakit Melalui Data Bank Darah
					</p>
				</motion.div>

				<motion.form
					variants={itemVariants}
					className="mt-8 space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="rounded-md space-y-4">
						<div>
							<label htmlFor="email" className="form-label">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								className={`input-field w-full ${
									errors.email ? "border-red-500" : ""
								}`}
								placeholder="Masukkan email Anda"
								value={formData.email}
								onChange={handleChange}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-500 flex items-center">
									<FiAlertCircle className="mr-1" /> {errors.email}
								</p>
							)}
						</div>

						<div>
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									className={`input-field w-full pr-10 ${
										errors.password ? "border-red-500" : ""
									}`}
									placeholder="Masukkan password Anda"
									value={formData.password}
									onChange={handleChange}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
								</button>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-500 flex items-center">
									<FiAlertCircle className="mr-1" /> {errors.password}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-sm">
							<Link
								to="/forgot-password"
								className="text-blood hover:text-blood-dark"
							>
								Lupa password?
							</Link>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood transition-colors duration-200"
						>
							{loading ? (
								<span className="absolute inset-y-0 left-0 flex items-center pl-3">
									<div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
								</span>
							) : null}
							{loading ? "Memproses..." : "Login"}
						</button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Belum punya akun?{" "}
							<Link
								to="/register"
								className="text-blood hover:text-blood-dark font-medium"
							>
								Daftar sekarang
							</Link>
						</p>
					</div>
				</motion.form>
			</motion.div>
		</div>
	);
};

export default Login;
