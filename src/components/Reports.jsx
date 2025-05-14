import { useState, useEffect } from "react";
import axios from "axios";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

const Reports = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [stats, setStats] = useState({
		totalPatients: 0,
		diagnosisCounts: [],
		genderDistribution: [],
		ageGroups: [],
	});
	const [dateRange, setDateRange] = useState({
		from: "",
		to: "",
	});

	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Check if user is authenticated
	useEffect(() => {
		const token = localStorage.getItem("bloodaldo_token");
		setIsAuthenticated(!!token);
	}, []);

	// Colors for charts
	const COLORS = [
		"#0088FE",
		"#00C49F",
		"#FFBB28",
		"#FF8042",
		"#8884D8",
		"#82ca9d",
	];

	// Fetch statistics
	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(
					"http://localhost:5000/api/reports/stats",
					{
						params: {
							from: dateRange.from || undefined,
							to: dateRange.to || undefined,
						},
					}
				);

				if (response.data && response.data.success) {
					setStats(response.data.data);
				} else {
					throw new Error("Failed to fetch statistics");
				}
			} catch (err) {
				console.error("Error fetching statistics:", err);
				setError("Terjadi kesalahan saat mengambil data statistik.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, [dateRange]);

	// Handle date range change
	const handleDateChange = (e) => {
		const { name, value } = e.target;
		setDateRange((prev) => ({ ...prev, [name]: value }));
	};

	// Export data as CSV
	const exportCSV = async () => {
		if (!isAuthenticated) {
			alert("Anda harus login sebagai admin untuk mengekspor data.");
			return;
		}

		try {
			const response = await axios.get(
				"http://localhost:5000/api/reports/export-csv",
				{
					params: {
						from: dateRange.from || undefined,
						to: dateRange.to || undefined,
					},
					responseType: "blob",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bloodaldo_token")}`,
					},
				}
			);

			// Create download link
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`bloodaldo-report-${new Date().toISOString().slice(0, 10)}.csv`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Error exporting CSV:", err);
			if (err.response && err.response.status === 401) {
				alert("Anda harus login sebagai admin untuk mengekspor data.");
			} else {
				alert("Terjadi kesalahan saat mengekspor data.");
			}
		}
	};

	// Export data as PDF
	const exportPDF = async () => {
		if (!isAuthenticated) {
			alert("Anda harus login sebagai admin untuk mengekspor data.");
			return;
		}

		try {
			const response = await axios.get(
				"http://localhost:5000/api/reports/export-pdf",
				{
					params: {
						from: dateRange.from || undefined,
						to: dateRange.to || undefined,
					},
					responseType: "blob",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bloodaldo_token")}`,
					},
				}
			);

			// Create download link
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`bloodaldo-report-${new Date().toISOString().slice(0, 10)}.pdf`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Error exporting PDF:", err);
			if (err.response && err.response.status === 401) {
				alert("Anda harus login sebagai admin untuk mengekspor data.");
			} else {
				alert("Terjadi kesalahan saat mengekspor data.");
			}
		}
	};

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
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Header */}
				<div className="bg-blue-600 text-white p-4">
					<h1 className="text-2xl font-bold">Laporan</h1>
					<p className="text-blue-100">Statistik dan ekspor data pasien</p>
				</div>

				{/* Date Range Filter */}
				<div className="p-4 bg-gray-50 border-b">
					<div className="flex flex-col md:flex-row md:items-end gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Dari Tanggal
							</label>
							<input
								type="date"
								name="from"
								value={dateRange.from}
								onChange={handleDateChange}
								className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Sampai Tanggal
							</label>
							<input
								type="date"
								name="to"
								value={dateRange.to}
								onChange={handleDateChange}
								className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<button
								onClick={() => setDateRange({ from: "", to: "" })}
								className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
							>
								Reset
							</button>
						</div>
					</div>
				</div>

				{/* Statistics */}
				<div className="p-6">
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Ringkasan
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
								<h3 className="text-lg font-medium text-blue-800 mb-2">
									Total Pasien
								</h3>
								<p className="text-3xl font-bold text-blue-600">
									{stats.totalPatients}
								</p>
							</div>

							<div className="bg-green-50 rounded-lg p-6 border border-green-200">
								<h3 className="text-lg font-medium text-green-800 mb-2">
									Diagnosis Paling Umum
								</h3>
								<p className="text-3xl font-bold text-green-600">
									{stats.diagnosisCounts.length > 0
										? stats.diagnosisCounts[0].name
										: "Tidak ada data"}
								</p>
							</div>

							<div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
								<h3 className="text-lg font-medium text-purple-800 mb-2">
									Kelompok Usia Dominan
								</h3>
								<p className="text-3xl font-bold text-purple-600">
									{stats.ageGroups.length > 0
										? stats.ageGroups[0].name
										: "Tidak ada data"}
								</p>
							</div>
						</div>
					</div>

					{/* Charts */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-800 mb-6">
							Visualisasi Data
						</h2>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Diagnosis Distribution */}
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
									Distribusi Diagnosis
								</h3>
								{stats.diagnosisCounts.length > 0 ? (
									<div className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={stats.diagnosisCounts}
													dataKey="value"
													nameKey="name"
													cx="50%"
													cy="50%"
													outerRadius={100}
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
													formatter={(value, name) => [
														`${value} pasien`,
														`${name}`,
													]}
												/>
												<Legend />
											</PieChart>
										</ResponsiveContainer>
									</div>
								) : (
									<div className="h-80 flex items-center justify-center">
										<p className="text-gray-500">
											Tidak ada data yang tersedia
										</p>
									</div>
								)}
							</div>

							{/* Gender Distribution */}
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
									Distribusi Jenis Kelamin
								</h3>
								{stats.genderDistribution.length > 0 ? (
									<div className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={stats.genderDistribution}
													dataKey="value"
													nameKey="name"
													cx="50%"
													cy="50%"
													outerRadius={100}
													fill="#8884d8"
													label={({ name, percent }) =>
														`${name}: ${(percent * 100).toFixed(0)}%`
													}
												>
													<Cell fill="#0088FE" />
													<Cell fill="#FF8042" />
												</Pie>
												<Tooltip
													formatter={(value, name) => [
														`${value} pasien`,
														`${name}`,
													]}
												/>
												<Legend />
											</PieChart>
										</ResponsiveContainer>
									</div>
								) : (
									<div className="h-80 flex items-center justify-center">
										<p className="text-gray-500">
											Tidak ada data yang tersedia
										</p>
									</div>
								)}
							</div>

							{/* Age Group Distribution */}
							<div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
								<h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
									Distribusi Kelompok Usia
								</h3>
								{stats.ageGroups.length > 0 ? (
									<div className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart
												data={stats.ageGroups}
												margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip
													formatter={(value) => [`${value} pasien`, "Jumlah"]}
												/>
												<Legend />
												<Bar
													dataKey="value"
													name="Jumlah Pasien"
													fill="#8884D8"
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								) : (
									<div className="h-80 flex items-center justify-center">
										<p className="text-gray-500">
											Tidak ada data yang tersedia
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Export Options */}
					<div>
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Ekspor Data
						</h2>
						<div className="flex flex-wrap gap-4">
							<button
								onClick={exportCSV}
								disabled={!isAuthenticated}
								className={`flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition ${
									!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Ekspor CSV
							</button>

							<button
								onClick={exportPDF}
								disabled={!isAuthenticated}
								className={`flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 transition ${
									!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Ekspor PDF
							</button>

							{!isAuthenticated && (
								<div className="w-full mt-2 text-orange-500 text-sm">
									<svg
										className="w-4 h-4 inline mr-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Login sebagai admin untuk mengakses fitur ekspor data.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reports;
