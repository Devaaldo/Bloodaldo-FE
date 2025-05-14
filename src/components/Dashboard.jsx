import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [stats, setStats] = useState({
		totalPatients: 0,
		diagnosisCounts: [],
		genderDistribution: [],
		ageGroups: [],
	});
	const [recentPatients, setRecentPatients] = useState([]);

	// Colors for charts
	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setIsLoading(true);

				// Fetch statistics
				const statsResponse = await axios.get(
					"http://localhost:5000/api/reports/stats"
				);
				if (statsResponse.data && statsResponse.data.success) {
					setStats(statsResponse.data.data);
				} else {
					throw new Error("Failed to fetch statistics");
				}

				// Fetch recent patients
				const patientsResponse = await axios.get(
					"http://localhost:5000/api/patients"
				);
				if (patientsResponse.data && patientsResponse.data.success) {
					// Get only the 5 most recent patients
					setRecentPatients(patientsResponse.data.data.slice(0, 5));
				} else {
					throw new Error("Failed to fetch patient data");
				}
			} catch (err) {
				console.error("Error fetching dashboard data:", err);
				setError(
					"Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti."
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
				role="alert"
			>
				<strong className="font-bold">Error! </strong>
				<span className="block sm:inline">{error}</span>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto">
			{/* Welcome Section */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
				<div className="flex items-center mb-4">
					<img
						src="/logo.png"
						alt="Bloodaldo Logo"
						className="h-16 w-16 mr-4"
					/>
					<div>
						<h1 className="text-3xl font-bold">Selamat datang di Bloodaldo</h1>
						<p className="text-blue-100">
							Sistem Pakar untuk Deteksi Dini Penyakit Melalui Data Bank Darah
						</p>
					</div>
				</div>
				<p className="mb-4">
					Bloodaldo membantu tenaga medis dalam mendeteksi potensi penyakit
					secara dini melalui analisis data darah. Gunakan sistem pakar ini
					untuk mendapatkan diagnosa awal berdasarkan parameter darah pasien.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link
						to="/patient-form"
						className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-md shadow hover:bg-gray-100 transition"
					>
						Input Data Pasien
					</Link>
					<Link
						to="/history"
						className="px-4 py-2 bg-blue-800 text-white font-semibold rounded-md shadow hover:bg-blue-900 transition"
					>
						Lihat Riwayat
					</Link>
					<Link
						to="/reports"
						className="px-4 py-2 bg-blue-800 text-white font-semibold rounded-md shadow hover:bg-blue-900 transition"
					>
						Laporan
					</Link>
				</div>
			</div>

			{/* Stats Section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-md p-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-2">
						Total Pasien
					</h2>
					<p className="text-3xl font-bold text-blue-600">
						{stats.totalPatients}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-2">
						Diagnosis Terbanyak
					</h2>
					<p className="text-3xl font-bold text-green-600">
						{stats.diagnosisCounts.length > 0
							? stats.diagnosisCounts[0].name
							: "Tidak ada data"}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-2">
						Distribusi Gender
					</h2>
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm text-gray-600">Laki-laki</p>
							<p className="text-xl font-bold text-blue-600">
								{stats.genderDistribution.find((g) => g.name === "Laki-laki")
									?.value || 0}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Perempuan</p>
							<p className="text-xl font-bold text-pink-600">
								{stats.genderDistribution.find((g) => g.name === "Perempuan")
									?.value || 0}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Diagnosis Distribution */}
				<div className="bg-white rounded-lg shadow-md p-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Distribusi Diagnosis
					</h2>
					{stats.diagnosisCounts.length > 0 ? (
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={stats.diagnosisCounts}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={80}
										fill="#8884d8"
										label={({ name, percent }) =>
											`${name}: ${(percent * 100).toFixed(0)}%`
										}
									>
										{stats.diagnosisCounts.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value, name) => [`${value} pasien`, `${name}`]}
									/>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="h-64 flex items-center justify-center">
							<p className="text-gray-500">Tidak ada data yang tersedia</p>
						</div>
					)}
				</div>

				{/* Age Group Distribution */}
				<div className="bg-white rounded-lg shadow-md p-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Distribusi Kelompok Usia
					</h2>
					{stats.ageGroups.length > 0 ? (
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={stats.ageGroups}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip
										formatter={(value) => [`${value} pasien`, "Jumlah"]}
									/>
									<Legend />
									<Bar dataKey="value" name="Jumlah Pasien" fill="#8884D8" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="h-64 flex items-center justify-center">
							<p className="text-gray-500">Tidak ada data yang tersedia</p>
						</div>
					)}
				</div>
			</div>

			{/* Recent Patients Section */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">
						Pasien Terbaru
					</h2>
					<Link
						to="/history"
						className="text-blue-600 hover:text-blue-800 text-sm"
					>
						Lihat Semua
					</Link>
				</div>

				{recentPatients.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Nama
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Umur/Gender
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Diagnosis
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tanggal
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{recentPatients.map((patient) => (
									<tr key={patient.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="font-medium text-gray-900">
												{patient.name}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-gray-900">{patient.age} tahun</div>
											<div className="text-gray-500">{patient.gender}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													patient.diagnosis?.toLowerCase().includes("normal")
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{patient.diagnosis || "Belum didiagnosis"}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-gray-500">
											{new Date(patient.createdAt).toLocaleDateString("id-ID", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<Link
												to={`/analysis/${patient.id}`}
												className="text-blue-600 hover:text-blue-900"
											>
												Lihat
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
						Belum ada data pasien. Silakan tambahkan pasien baru.
					</div>
				)}
			</div>

			{/* Features Section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="text-blue-600 mb-3">
						<svg
							className="h-8 w-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-800 mb-2">
						Input Data Pasien
					</h3>
					<p className="text-gray-600 mb-3">
						Masukkan data pasien dan hasil pemeriksaan darah untuk mendapatkan
						diagnosa awal
					</p>
					<Link
						to="/patient-form"
						className="text-blue-600 hover:text-blue-800 text-sm font-medium"
					>
						Input Data &rarr;
					</Link>
				</div>

				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="text-blue-600 mb-3">
						<svg
							className="h-8 w-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-800 mb-2">
						Riwayat Diagnosa
					</h3>
					<p className="text-gray-600 mb-3">
						Lihat daftar riwayat pasien yang telah didiagnosa, dengan filter dan
						pencarian
					</p>
					<Link
						to="/history"
						className="text-blue-600 hover:text-blue-800 text-sm font-medium"
					>
						Lihat Riwayat &rarr;
					</Link>
				</div>

				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="text-blue-600 mb-3">
						<svg
							className="h-8 w-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-800 mb-2">Laporan</h3>
					<p className="text-gray-600 mb-3">
						Lihat statistik dan unduh laporan dalam format CSV atau PDF untuk
						dokumentasi
					</p>
					<Link
						to="/reports"
						className="text-blue-600 hover:text-blue-800 text-sm font-medium"
					>
						Lihat Laporan &rarr;
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
