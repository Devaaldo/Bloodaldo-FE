import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	FiUser,
	FiMail,
	FiLock,
	FiEdit2,
	FiSave,
	FiX,
	FiAlertCircle,
	FiCheckCircle,
	FiShield,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const ProfilePage = () => {
	const { user, updateProfile } = useAuth();
	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState(false);
	const [changePassword, setChangePassword] = useState(false);
	const [profileData, setProfileData] = useState({
		name: "",
		email: "",
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState("");

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.3,
				when: "beforeChildren",
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.3 },
		},
	};

	useEffect(() => {
		// Initialize profile data with user info
		if (user) {
			setProfileData({
				name: user.name || "",
				email: user.email || "",
			});
		}
	}, [user]);

	const handleProfileChange = (e) => {
		const { name, value } = e.target;
		setProfileData({
			...profileData,
			[name]: value,
		});

		// Clear error when typing
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData({
			...passwordData,
			[name]: value,
		});

		// Clear error when typing
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const validateProfileData = () => {
		let tempErrors = {};
		let isValid = true;

		if (!profileData.name.trim()) {
			tempErrors.name = "Nama harus diisi";
			isValid = false;
		}

		if (!profileData.email.trim()) {
			tempErrors.email = "Email harus diisi";
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
			tempErrors.email = "Format email tidak valid";
			isValid = false;
		}

		setErrors(tempErrors);
		return isValid;
	};

	const validatePasswordData = () => {
		let tempErrors = {};
		let isValid = true;

		if (!passwordData.currentPassword) {
			tempErrors.currentPassword = "Password saat ini harus diisi";
			isValid = false;
		}

		if (!passwordData.newPassword) {
			tempErrors.newPassword = "Password baru harus diisi";
			isValid = false;
		} else if (passwordData.newPassword.length < 6) {
			tempErrors.newPassword = "Password baru minimal 6 karakter";
			isValid = false;
		}

		if (!passwordData.confirmPassword) {
			tempErrors.confirmPassword = "Konfirmasi password harus diisi";
			isValid = false;
		} else if (passwordData.newPassword !== passwordData.confirmPassword) {
			tempErrors.confirmPassword = "Password tidak cocok";
			isValid = false;
		}

		setErrors(tempErrors);
		return isValid;
	};

	const handleUpdateProfile = async () => {
		if (validateProfileData()) {
			setLoading(true);
			setSuccess("");

			try {
				// In a real app, this would call your updateProfile function from AuthContext
				// await updateProfile(profileData);

				// Simulate API call
				setTimeout(() => {
					setSuccess("Profil berhasil diperbarui");
					setEditing(false);
					setLoading(false);

					// Auto clear success message after 5 seconds
					setTimeout(() => {
						setSuccess("");
					}, 5000);
				}, 1000);
			} catch (error) {
				console.error("Error updating profile:", error);
				setErrors({ general: "Terjadi kesalahan saat memperbarui profil" });
				setLoading(false);
			}
		}
	};

	const handleChangePassword = async () => {
		if (validatePasswordData()) {
			setLoading(true);
			setSuccess("");

			try {
				// In a real app, this would call your API
				// await axios.put('/api/users/change-password',
				//   {
				//     currentPassword: passwordData.currentPassword,
				//     newPassword: passwordData.newPassword
				//   },
				//   {
				//     headers: {
				//       Authorization: `Bearer ${localStorage.getItem('token')}`
				//     }
				//   }
				// );

				// Simulate API call
				setTimeout(() => {
					setSuccess("Password berhasil diubah");
					setChangePassword(false);
					setPasswordData({
						currentPassword: "",
						newPassword: "",
						confirmPassword: "",
					});
					setLoading(false);

					// Auto clear success message after 5 seconds
					setTimeout(() => {
						setSuccess("");
					}, 5000);
				}, 1000);
			} catch (error) {
				console.error("Error changing password:", error);

				// Handle specific error like incorrect current password
				if (error.response && error.response.status === 400) {
					setErrors({ currentPassword: "Password saat ini tidak benar" });
				} else {
					setErrors({ general: "Terjadi kesalahan saat mengubah password" });
				}

				setLoading(false);
			}
		}
	};

	const cancelEdit = () => {
		// Reset form data to original user data
		setProfileData({
			name: user?.name || "",
			email: user?.email || "",
		});
		setEditing(false);
		setErrors({});
	};

	const cancelPasswordChange = () => {
		setPasswordData({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
		setChangePassword(false);
		setErrors({});
	};

	return (
		<motion.div
			className="h-full"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-display font-bold text-gray-800">
					Profil Pengguna
				</h1>
			</div>

			{success && (
				<motion.div
					className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-md"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="flex">
						<div className="flex-shrink-0">
							<FiCheckCircle className="h-5 w-5 text-green-400" />
						</div>
						<div className="ml-3">
							<p className="text-sm text-green-700">{success}</p>
						</div>
					</div>
				</motion.div>
			)}

			{errors.general && (
				<motion.div
					className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="flex">
						<div className="flex-shrink-0">
							<FiAlertCircle className="h-5 w-5 text-red-400" />
						</div>
						<div className="ml-3">
							<p className="text-sm text-red-700">{errors.general}</p>
						</div>
					</div>
				</motion.div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Profile Info Card */}
				<motion.div
					className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden"
					variants={itemVariants}
				>
					<div className="p-6 border-b border-gray-200">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-semibold text-gray-800">
								Informasi Pribadi
							</h2>

							{!editing && (
								<button
									onClick={() => setEditing(true)}
									className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
								>
									<FiEdit2 className="inline-block mr-1" />
									Edit
								</button>
							)}
						</div>
					</div>

					<div className="p-6">
						{editing ? (
							<form>
								<div className="grid grid-cols-1 gap-6">
									<div className="form-group">
										<label htmlFor="name" className="form-label">
											Nama Lengkap
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<FiUser className="h-5 w-5 text-gray-400" />
											</div>
											<input
												type="text"
												id="name"
												name="name"
												value={profileData.name}
												onChange={handleProfileChange}
												className={`input-field pl-10 w-full ${
													errors.name ? "border-red-500" : ""
												}`}
												placeholder="Masukkan nama lengkap Anda"
											/>
										</div>
										{errors.name && (
											<p className="mt-1 text-sm text-red-500 flex items-center">
												<FiAlertCircle className="mr-1" /> {errors.name}
											</p>
										)}
									</div>

									<div className="form-group">
										<label htmlFor="email" className="form-label">
											Email
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<FiMail className="h-5 w-5 text-gray-400" />
											</div>
											<input
												type="email"
												id="email"
												name="email"
												value={profileData.email}
												onChange={handleProfileChange}
												className={`input-field pl-10 w-full ${
													errors.email ? "border-red-500" : ""
												}`}
												placeholder="Masukkan email Anda"
											/>
										</div>
										{errors.email && (
											<p className="mt-1 text-sm text-red-500 flex items-center">
												<FiAlertCircle className="mr-1" /> {errors.email}
											</p>
										)}
									</div>
								</div>

								<div className="mt-6 flex justify-end space-x-3">
									<button
										type="button"
										onClick={cancelEdit}
										className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
									>
										<FiX className="inline-block mr-1" />
										Batal
									</button>

									<button
										type="button"
										onClick={handleUpdateProfile}
										disabled={loading}
										className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
									>
										{loading ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Menyimpan...
											</>
										) : (
											<>
												<FiSave className="inline-block mr-1" />
												Simpan
											</>
										)}
									</button>
								</div>
							</form>
						) : (
							<div className="space-y-6">
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Nama Lengkap
									</h3>
									<p className="mt-1 text-base font-medium text-gray-900 flex items-center">
										<FiUser className="mr-2 h-5 w-5 text-gray-400" />
										{user?.name || "Tidak ada data"}
									</p>
								</div>

								<div>
									<h3 className="text-sm font-medium text-gray-500">Email</h3>
									<p className="mt-1 text-base font-medium text-gray-900 flex items-center">
										<FiMail className="mr-2 h-5 w-5 text-gray-400" />
										{user?.email || "Tidak ada data"}
									</p>
								</div>

								<div>
									<h3 className="text-sm font-medium text-gray-500">Peran</h3>
									<p className="mt-1 text-base font-medium text-gray-900 flex items-center">
										<FiShield className="mr-2 h-5 w-5 text-gray-400" />
										{user?.role === "admin" ? "Administrator" : "Pengguna"}
									</p>
								</div>
							</div>
						)}
					</div>
				</motion.div>

				{/* Password Change Card */}
				<motion.div
					className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden"
					variants={itemVariants}
				>
					<div className="p-6 border-b border-gray-200">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-semibold text-gray-800">Keamanan</h2>

							{!changePassword && (
								<button
									onClick={() => setChangePassword(true)}
									className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
								>
									<FiEdit2 className="inline-block mr-1" />
									Ubah
								</button>
							)}
						</div>
					</div>

					<div className="p-6">
						{changePassword ? (
							<form>
								<div className="space-y-4">
									<div className="form-group">
										<label htmlFor="currentPassword" className="form-label">
											Password Saat Ini
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<FiLock className="h-5 w-5 text-gray-400" />
											</div>
											<input
												type="password"
												id="currentPassword"
												name="currentPassword"
												value={passwordData.currentPassword}
												onChange={handlePasswordChange}
												className={`input-field pl-10 w-full ${
													errors.currentPassword ? "border-red-500" : ""
												}`}
												placeholder="Masukkan password saat ini"
											/>
										</div>
										{errors.currentPassword && (
											<p className="mt-1 text-sm text-red-500 flex items-center">
												<FiAlertCircle className="mr-1" />{" "}
												{errors.currentPassword}
											</p>
										)}
									</div>

									<div className="form-group">
										<label htmlFor="newPassword" className="form-label">
											Password Baru
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<FiLock className="h-5 w-5 text-gray-400" />
											</div>
											<input
												type="password"
												id="newPassword"
												name="newPassword"
												value={passwordData.newPassword}
												onChange={handlePasswordChange}
												className={`input-field pl-10 w-full ${
													errors.newPassword ? "border-red-500" : ""
												}`}
												placeholder="Masukkan password baru"
											/>
										</div>
										{errors.newPassword && (
											<p className="mt-1 text-sm text-red-500 flex items-center">
												<FiAlertCircle className="mr-1" /> {errors.newPassword}
											</p>
										)}
									</div>

									<div className="form-group">
										<label htmlFor="confirmPassword" className="form-label">
											Konfirmasi Password
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<FiLock className="h-5 w-5 text-gray-400" />
											</div>
											<input
												type="password"
												id="confirmPassword"
												name="confirmPassword"
												value={passwordData.confirmPassword}
												onChange={handlePasswordChange}
												className={`input-field pl-10 w-full ${
													errors.confirmPassword ? "border-red-500" : ""
												}`}
												placeholder="Konfirmasi password baru"
											/>
										</div>
										{errors.confirmPassword && (
											<p className="mt-1 text-sm text-red-500 flex items-center">
												<FiAlertCircle className="mr-1" />{" "}
												{errors.confirmPassword}
											</p>
										)}
									</div>
								</div>

								<div className="mt-6 flex justify-end space-x-3">
									<button
										type="button"
										onClick={cancelPasswordChange}
										className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
									>
										<FiX className="inline-block mr-1" />
										Batal
									</button>

									<button
										type="button"
										onClick={handleChangePassword}
										disabled={loading}
										className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
									>
										{loading ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Menyimpan...
											</>
										) : (
											<>
												<FiSave className="inline-block mr-1" />
												Simpan
											</>
										)}
									</button>
								</div>
							</form>
						) : (
							<div>
								<h3 className="text-sm font-medium text-gray-500">Password</h3>
								<p className="mt-1 text-base font-medium text-gray-900 flex items-center">
									<FiLock className="mr-2 h-5 w-5 text-gray-400" />
									••••••••
								</p>

								<div className="mt-4 p-4 bg-yellow-50 rounded-md">
									<div className="flex">
										<div className="flex-shrink-0">
											<FiAlertCircle className="h-5 w-5 text-yellow-400" />
										</div>
										<div className="ml-3">
											<h3 className="text-sm font-medium text-yellow-800">
												Tips Keamanan
											</h3>
											<p className="mt-2 text-sm text-yellow-700">
												Pastikan menggunakan password yang kuat:
											</p>
											<ul className="mt-1 text-sm text-yellow-700 list-disc pl-5">
												<li>Minimal 8 karakter</li>
												<li>
													Kombinasi huruf besar, huruf kecil, angka, dan simbol
												</li>
												<li>
													Tidak menggunakan informasi pribadi yang mudah ditebak
												</li>
												<li>Berbeda dengan password akun lainnya</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</motion.div>

				{/* Account Activity Card */}
				<motion.div
					className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden"
					variants={itemVariants}
				>
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-800">
							Aktivitas Akun
						</h2>
					</div>

					<div className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="dashboard-card flex items-center">
								<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
									<FiFileText className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-800">
										Total Tes Darah
									</h3>
									<p className="text-2xl font-bold">24</p>
								</div>
							</div>

							<div className="dashboard-card flex items-center">
								<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
									<FiCheckCircle className="h-6 w-6 text-green-600" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-800">
										Hasil Normal
									</h3>
									<p className="text-2xl font-bold">19</p>
								</div>
							</div>

							<div className="dashboard-card flex items-center">
								<div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
									<FiAlertCircle className="h-6 w-6 text-red-600" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-800">
										Hasil Abnormal
									</h3>
									<p className="text-2xl font-bold">5</p>
								</div>
							</div>
						</div>

						<div className="mt-6">
							<h3 className="text-base font-medium text-gray-800 mb-3">
								Login Terakhir
							</h3>
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Tanggal
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Waktu
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Perangkat
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Lokasi
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									<tr>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											14 Mei 2025
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											08:45 WIB
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											Chrome di Windows
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											Magelang, Indonesia
										</td>
									</tr>
									<tr>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											10 Mei 2025
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											14:23 WIB
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											Safari di iPhone
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											Magelang, Indonesia
										</td>
									</tr>
									<tr>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											5 Mei 2025
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											19:12 WIB
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											Firefox di Windows
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											Magelang, Indonesia
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default ProfilePage;
