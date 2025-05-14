import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	FiClock,
	FiFileText,
	FiChevronRight,
	FiDownload,
	FiSearch,
	FiFilter,
	FiX,
} from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const HistoryPage = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [bloodTests, setBloodTests] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [resultsPerPage] = useState(10);
	const [expandedTest, setExpandedTest] = useState(null);

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
		const fetchBloodTests = async () => {
			try {
				// Simulate API call
				setTimeout(() => {
					// Replace with actual API call
					// const response = await axios.get('/api/blood-tests', {
					//   headers: {
					//     Authorization: `Bearer ${localStorage.getItem('token')}`
					//   }
					// });

					const mockData = [
						{
							id: 1,
							patient_name: "Ahmad Saputra",
							patient_age: 35,
							patient_gender: "male",
							hemoglobin: 14.5,
							hematocrit: 45,
							erythrocytes: 5.2,
							leukocytes: 7500,
							thrombocytes: 250000,
							mcv: 88,
							mch: 29,
							mchc: 33,
							test_date: "2025-05-12T09:30:00",
							has_detection: true,
							detection_result: {
								id: 1,
								detection_date: "2025-05-12T09:35:00",
								abnormal_parameters: {},
								possible_conditions: [
									{
										name: "Hasil Normal",
										probability: "Tinggi",
									},
								],
							},
						},
						{
							id: 2,
							patient_name: "Siti Nurhayati",
							patient_age: 28,
							patient_gender: "female",
							hemoglobin: 11.2,
							hematocrit: 34,
							erythrocytes: 4.0,
							leukocytes: 9200,
							thrombocytes: 300000,
							mcv: 75,
							mch: 25,
							mchc: 31,
							test_date: "2025-05-09T14:45:00",
							has_detection: true,
							detection_result: {
								id: 2,
								detection_date: "2025-05-09T14:50:00",
								abnormal_parameters: {
									hemoglobin: {
										value: 11.2,
										status: "low",
										normalRange: "12.0 - 15.5",
									},
									hematocrit: {
										value: 34,
										status: "low",
										normalRange: "36 - 44",
									},
									mcv: {
										value: 75,
										status: "low",
										normalRange: "80 - 96",
									},
								},
								possible_conditions: [
									{
										name: "Anemia Mikrositik",
										probability: "Tinggi",
									},
								],
							},
						},
						{
							id: 3,
							patient_name: "Budi Santoso",
							patient_age: 42,
							patient_gender: "male",
							hemoglobin: 17.8,
							hematocrit: 53,
							erythrocytes: 6.2,
							leukocytes: 8500,
							thrombocytes: 220000,
							mcv: 90,
							mch: 30,
							mchc: 34,
							test_date: "2025-04-15T10:15:00",
							has_detection: true,
							detection_result: {
								id: 3,
								detection_date: "2025-04-15T10:20:00",
								abnormal_parameters: {
									hemoglobin: {
										value: 17.8,
										status: "high",
										normalRange: "13.5 - 17.5",
									},
									hematocrit: {
										value: 53,
										status: "high",
										normalRange: "41 - 50",
									},
									erythrocytes: {
										value: 6.2,
										status: "high",
										normalRange: "4.7 - 6.1",
									},
								},
								possible_conditions: [
									{
										name: "Polisitemia",
										probability: "Tinggi",
									},
								],
							},
						},
						{
							id: 4,
							patient_name: "Dewi Kusuma",
							patient_age: 33,
							patient_gender: "female",
							hemoglobin: 12.5,
							hematocrit: 38,
							erythrocytes: 4.5,
							leukocytes: 3800,
							thrombocytes: 180000,
							mcv: 85,
							mch: 28,
							mchc: 33,
							test_date: "2025-04-02T11:00:00",
							has_detection: true,
							detection_result: {
								id: 4,
								detection_date: "2025-04-02T11:05:00",
								abnormal_parameters: {
									leukocytes: {
										value: 3800,
										status: "low",
										normalRange: "4,500 - 11,000",
									},
								},
								possible_conditions: [
									{
										name: "Leukopenia",
										probability: "Tinggi",
									},
								],
							},
						},
						{
							id: 5,
							patient_name: "Agus Pranoto",
							patient_age: 55,
							patient_gender: "male",
							hemoglobin: 15.0,
							hematocrit: 45,
							erythrocytes: 5.0,
							leukocytes: 12500,
							thrombocytes: 480000,
							mcv: 88,
							mch: 29,
							mchc: 33,
							test_date: "2025-03-18T09:20:00",
							has_detection: true,
							detection_result: {
								id: 5,
								detection_date: "2025-03-18T09:25:00",
								abnormal_parameters: {
									leukocytes: {
										value: 12500,
										status: "high",
										normalRange: "4,500 - 11,000",
									},
									thrombocytes: {
										value: 480000,
										status: "high",
										normalRange: "150,000 - 450,000",
									},
								},
								possible_conditions: [
									{
										name: "Leukositosis",
										probability: "Tinggi",
									},
									{
										name: "Trombositosis",
										probability: "Sedang",
									},
								],
							},
						},
					];

					setBloodTests(mockData);
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching blood tests:", error);
				setLoading(false);
			}
		};

		fetchBloodTests();
	}, []);

	// Filter tests by search term and date
	const filteredTests = bloodTests.filter((test) => {
		const matchesSearchTerm =
			test.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			test.detection_result?.possible_conditions[0]?.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesDateFilter =
			!dateFilter ||
			new Date(test.test_date).toLocaleDateString().includes(dateFilter);

		return matchesSearchTerm && matchesDateFilter;
	});

	// Paginate tests
	const indexOfLastResult = currentPage * resultsPerPage;
	const indexOfFirstResult = indexOfLastResult - resultsPerPage;
	const currentTests = filteredTests.slice(
		indexOfFirstResult,
		indexOfLastResult
	);

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	// Format date
	const formatDate = (dateString) => {
		const options = {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateString).toLocaleDateString("id-ID", options);
	};

	// Get status badge class based on test result
	const getStatusBadge = (test) => {
		if (!test.has_detection) {
			return "bg-yellow-100 text-yellow-800";
		}

		const hasAbnormalParams =
			test.detection_result &&
			Object.keys(test.detection_result.abnormal_parameters || {}).length > 0;

		return hasAbnormalParams
			? "bg-red-100 text-red-800"
			: "bg-green-100 text-green-800";
	};

	// Get status text based on test result
	const getStatusText = (test) => {
		if (!test.has_detection) {
			return "Belum Dianalisis";
		}

		const hasAbnormalParams =
			test.detection_result &&
			Object.keys(test.detection_result.abnormal_parameters || {}).length > 0;

		return hasAbnormalParams ? "Hasil Abnormal" : "Hasil Normal";
	};

	const toggleTestDetails = (id) => {
		if (expandedTest === id) {
			setExpandedTest(null);
		} else {
			setExpandedTest(id);
		}
	};

	// Handle download report
	const handleDownloadReport = (testId) => {
		// In a real app, this would call an API to generate and download a report
		alert(`Downloading report for test ID: ${testId}`);
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchTerm("");
		setDateFilter("");
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
					Riwayat Pemeriksaan
				</h1>
				<Link
					to="/blood-test"
					className="bg-blood hover:bg-blood-dark text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
				>
					<FiFileText className="mr-2" />
					Tes Darah Baru
				</Link>
			</div>

			{/* Filters */}
			<motion.div
				className="bg-white rounded-xl shadow-md p-6 mb-6"
				variants={itemVariants}
			>
				<div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
					<div className="flex-1">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiSearch className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								className="input-field pl-10 w-full"
								placeholder="Cari berdasarkan nama atau hasil deteksi..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
					<div className="w-full md:w-auto">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiFilter className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="date"
								className="input-field pl-10 w-full"
								value={dateFilter}
								onChange={(e) => setDateFilter(e.target.value)}
							/>
						</div>
					</div>
					{(searchTerm || dateFilter) && (
						<button
							onClick={clearFilters}
							className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 flex items-center"
						>
							<FiX className="mr-2" />
							Hapus Filter
						</button>
					)}
				</div>
			</motion.div>

			{/* Test History */}
			{currentTests.length === 0 ? (
				<motion.div
					className="bg-white rounded-xl shadow-md p-8 text-center"
					variants={itemVariants}
				>
					<div className="flex flex-col items-center mb-6">
						<FiClock className="h-16 w-16 text-gray-400 mb-4" />
						<h3 className="text-xl font-semibold text-gray-800">
							Tidak Ada Riwayat Pemeriksaan
						</h3>
						<p className="text-gray-600 mt-2">
							{filteredTests.length === 0 && bloodTests.length > 0
								? "Tidak ada hasil yang sesuai dengan filter"
								: "Anda belum memiliki riwayat pemeriksaan tes darah"}
						</p>
					</div>
					{filteredTests.length === 0 && bloodTests.length > 0 && (
						<button
							onClick={clearFilters}
							className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
						>
							<FiX className="mr-2 h-5 w-5" />
							Hapus Filter
						</button>
					)}
				</motion.div>
			) : (
				<>
					<motion.div
						className="bg-white rounded-xl shadow-md overflow-hidden"
						variants={itemVariants}
					>
						{currentTests.map((test, index) => (
							<div
								key={test.id}
								className={`border-b border-gray-200 ${
									index === currentTests.length - 1 ? "border-b-0" : ""
								}`}
							>
								<div
									className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
									onClick={() => toggleTestDetails(test.id)}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-start">
											<div className="flex-shrink-0">
												<div className="h-10 w-10 rounded-full bg-blood-light bg-opacity-20 flex items-center justify-center">
													<FiFileText className="h-5 w-5 text-blood" />
												</div>
											</div>
											<div className="ml-4">
												<h3 className="text-lg font-medium text-gray-900">
													{test.patient_name}
												</h3>
												<div className="flex items-center text-sm text-gray-500">
													<FiClock className="mr-1 h-4 w-4" />
													{formatDate(test.test_date)}
												</div>
											</div>
										</div>
										<div className="flex items-center">
											<span
												className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
													test
												)}`}
											>
												{getStatusText(test)}
											</span>
											<div
												className={`ml-4 transform transition-transform duration-200 ${
													expandedTest === test.id ? "rotate-90" : ""
												}`}
											>
												<FiChevronRight className="h-5 w-5 text-gray-400" />
											</div>
										</div>
									</div>
								</div>

								{expandedTest === test.id && (
									<div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<h4 className="text-base font-medium text-gray-900 mb-3">
													Informasi Pasien
												</h4>
												<div className="grid grid-cols-2 gap-2">
													<div>
														<p className="text-sm text-gray-500">Nama</p>
														<p className="font-medium">{test.patient_name}</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">Tanggal Tes</p>
														<p className="font-medium">
															{formatDate(test.test_date)}
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">Usia</p>
														<p className="font-medium">
															{test.patient_age} tahun
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">
															Jenis Kelamin
														</p>
														<p className="font-medium">
															{test.patient_gender === "male"
																? "Laki-laki"
																: "Perempuan"}
														</p>
													</div>
												</div>
											</div>

											<div>
												<h4 className="text-base font-medium text-gray-900 mb-3">
													Parameter Utama
												</h4>
												<div className="grid grid-cols-2 gap-2">
													<div>
														<p className="text-sm text-gray-500">Hemoglobin</p>
														<p
															className={`font-medium ${
																test.has_detection &&
																test.detection_result?.abnormal_parameters
																	?.hemoglobin
																	? test.detection_result.abnormal_parameters
																			.hemoglobin.status === "low"
																		? "text-blue-600"
																		: "text-red-600"
																	: ""
															}`}
														>
															{test.hemoglobin} g/dL
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">Leukosit</p>
														<p
															className={`font-medium ${
																test.has_detection &&
																test.detection_result?.abnormal_parameters
																	?.leukocytes
																	? test.detection_result.abnormal_parameters
																			.leukocytes.status === "low"
																		? "text-blue-600"
																		: "text-red-600"
																	: ""
															}`}
														>
															{test.leukocytes} /μL
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">Trombosit</p>
														<p
															className={`font-medium ${
																test.has_detection &&
																test.detection_result?.abnormal_parameters
																	?.thrombocytes
																	? test.detection_result.abnormal_parameters
																			.thrombocytes.status === "low"
																		? "text-blue-600"
																		: "text-red-600"
																	: ""
															}`}
														>
															{test.thrombocytes} /μL
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">Eritrosit</p>
														<p
															className={`font-medium ${
																test.has_detection &&
																test.detection_result?.abnormal_parameters
																	?.erythrocytes
																	? test.detection_result.abnormal_parameters
																			.erythrocytes.status === "low"
																		? "text-blue-600"
																		: "text-red-600"
																	: ""
															}`}
														>
															{test.erythrocytes} juta/μL
														</p>
													</div>
												</div>
											</div>
										</div>

										{test.has_detection && (
											<div className="mt-4">
												<h4 className="text-base font-medium text-gray-900 mb-3">
													Hasil Deteksi
												</h4>
												<div className="bg-white rounded-lg border border-gray-200 p-3">
													<div className="flex items-center justify-between">
														<div>
															<p className="text-sm text-gray-500">
																Kemungkinan Kondisi
															</p>
															<p className="font-medium">
																{test.detection_result.possible_conditions
																	.map((condition) => condition.name)
																	.join(", ")}
															</p>
														</div>
														<div>
															<p className="text-sm text-gray-500">
																Tanggal Deteksi
															</p>
															<p className="font-medium">
																{formatDate(
																	test.detection_result.detection_date
																)}
															</p>
														</div>
													</div>
												</div>
											</div>
										)}

										<div className="mt-4 flex justify-end space-x-3">
											<Link
												to={`/history/${test.id}`}
												className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
											>
												Lihat Detail
											</Link>
											<button
												onClick={() => handleDownloadReport(test.id)}
												className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
											>
												<FiDownload className="mr-2 h-4 w-4" />
												Unduh Laporan
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</motion.div>

					{/* Pagination */}
					{filteredTests.length > resultsPerPage && (
						<motion.div
							className="mt-6 flex justify-center"
							variants={itemVariants}
						>
							<nav className="flex items-center space-x-2">
								<button
									onClick={() => paginate(currentPage - 1)}
									disabled={currentPage === 1}
									className={`px-3 py-1 rounded-md ${
										currentPage === 1
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-white text-gray-700 hover:bg-gray-50"
									}`}
								>
									Prev
								</button>

								{Array.from({
									length: Math.ceil(filteredTests.length / resultsPerPage),
								}).map((_, index) => (
									<button
										key={index}
										onClick={() => paginate(index + 1)}
										className={`px-3 py-1 rounded-md ${
											currentPage === index + 1
												? "bg-blood text-white"
												: "bg-white text-gray-700 hover:bg-gray-50"
										}`}
									>
										{index + 1}
									</button>
								))}

								<button
									onClick={() => paginate(currentPage + 1)}
									disabled={
										currentPage ===
										Math.ceil(filteredTests.length / resultsPerPage)
									}
									className={`px-3 py-1 rounded-md ${
										currentPage ===
										Math.ceil(filteredTests.length / resultsPerPage)
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-white text-gray-700 hover:bg-gray-50"
									}`}
								>
									Next
								</button>
							</nav>
						</motion.div>
					)}
				</>
			)}
		</motion.div>
	);
};

export default HistoryPage;
