import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import {
	Chart as ChartJS,
	ArcElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import {
	FiActivity,
	FiFileText,
	FiClock,
	FiAlertCircle,
	FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const Dashboard = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalTests: 0,
		abnormalResults: 0,
		normalResults: 0,
		recentTests: [],
	});
	const [chartData, setChartData] = useState({
		labels: [],
		values: [],
	});

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
		const fetchDashboardData = async () => {
			try {
				// Replace with actual API call
				// For now, using dummy data
				setTimeout(() => {
					const dummyStats = {
						totalTests: 24,
						abnormalResults: 5,
						normalResults: 19,
						recentTests: [
							{
								id: 1,
								date: "12 Mei 2025",
								result: "Normal",
								parameter: "Hemoglobin",
							},
							{
								id: 2,
								date: "9 Mei 2025",
								result: "Abnormal",
								parameter: "Leukosit",
							},
							{
								id: 3,
								date: "3 Mei 2025",
								result: "Normal",
								parameter: "Trombosit",
							},
							{
								id: 4,
								date: "25 Apr 2025",
								result: "Normal",
								parameter: "Eritrosit",
							},
							{
								id: 5,
								date: "20 Apr 2025",
								result: "Abnormal",
								parameter: "Hematokrit",
							},
						],
					};

					const dummyChartData = {
						labels: ["Jan", "Feb", "Mar", "Apr", "Mei"],
						values: [3, 5, 8, 4, 4],
					};

					setStats(dummyStats);
					setChartData(dummyChartData);
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	// Line chart configuration
	const lineChartData = {
		labels: chartData.labels,
		datasets: [
			{
				label: "Jumlah Tes Darah",
				data: chartData.values,
				fill: true,
				backgroundColor: "rgba(229, 62, 62, 0.1)",
				borderColor: "rgb(229, 62, 62)",
				tension: 0.4,
			},
		],
	};

	const lineChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Jumlah Tes Darah Bulanan",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0,
				},
			},
		},
		maintainAspectRatio: false,
	};

	// Doughnut chart configuration
	const doughnutChartData = {
		labels: ["Normal", "Abnormal"],
		datasets: [
			{
				data: [stats.normalResults, stats.abnormalResults],
				backgroundColor: ["rgba(54, 211, 153, 0.8)", "rgba(229, 62, 62, 0.8)"],
				borderColor: ["rgba(54, 211, 153, 1)", "rgba(229, 62, 62, 1)"],
				borderWidth: 1,
			},
		],
	};

	const doughnutChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Distribusi Hasil Tes",
			},
		},
		maintainAspectRatio: false,
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blood"></div>
			</div>
		);
	}

	return (
		<motion.div
			className="h-full"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-display font-bold text-gray-800">
					Selamat {getGreeting()}, {user?.name || "User"}!
				</h1>

				<Link
					to="/blood-test"
					className="bg-blood hover:bg-blood-dark text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
				>
					<FiFileText className="mr-2" />
					Tes Darah Baru
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				<motion.div
					className="dashboard-card flex items-center"
					variants={itemVariants}
				>
					<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
						<FiFileText className="h-6 w-6 text-blue-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-800">Total Tes</h3>
						<p className="text-2xl font-bold">{stats.totalTests}</p>
					</div>
				</motion.div>

				<motion.div
					className="dashboard-card flex items-center"
					variants={itemVariants}
				>
					<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
						<FiCheckCircle className="h-6 w-6 text-green-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-800">
							Hasil Normal
						</h3>
						<p className="text-2xl font-bold">{stats.normalResults}</p>
					</div>
				</motion.div>

				<motion.div
					className="dashboard-card flex items-center"
					variants={itemVariants}
				>
					<div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
						<FiAlertCircle className="h-6 w-6 text-red-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-800">
							Hasil Abnormal
						</h3>
						<p className="text-2xl font-bold">{stats.abnormalResults}</p>
					</div>
				</motion.div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				<motion.div
					className="dashboard-card lg:col-span-2"
					variants={itemVariants}
				>
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Tren Tes Darah
					</h3>
					<div className="h-64">
						<Line data={lineChartData} options={lineChartOptions} />
					</div>
				</motion.div>

				<motion.div className="dashboard-card" variants={itemVariants}>
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Distribusi Hasil
					</h3>
					<div className="h-64">
						<Doughnut data={doughnutChartData} options={doughnutChartOptions} />
					</div>
				</motion.div>
			</div>

			{/* Recent Blood Tests */}
			<motion.div className="dashboard-card" variants={itemVariants}>
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800">
						Tes Darah Terbaru
					</h3>
					<Link
						to="/history"
						className="text-sm text-blood hover:text-blood-dark font-medium"
					>
						Lihat Semua
					</Link>
				</div>

				<div className="overflow-x-auto">
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
									Parameter
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Hasil
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Aksi
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{stats.recentTests.map((test) => (
								<tr key={test.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{test.date}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{test.parameter}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												test.result === "Normal"
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{test.result}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<Link
											to={`/history/${test.id}`}
											className="text-blood hover:text-blood-dark"
										>
											Detail
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>
		</motion.div>
	);
};

// Helper function to get greeting based on time of day
const getGreeting = () => {
	const hour = new Date().getHours();

	if (hour < 12) {
		return "pagi";
	} else if (hour < 15) {
		return "siang";
	} else if (hour < 19) {
		return "sore";
	} else {
		return "malam";
	}
};

export default Dashboard;
