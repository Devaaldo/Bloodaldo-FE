// src/pages/ReportsPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	FiDownload,
	FiFileText,
	FiBarChart2,
	FiCalendar,
	FiFilter,
	FiX,
	FiUser,
	FiInfo,
	FiCheck,
	FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const ReportsPage = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [generating, setGenerating] = useState(false);
	const [dateRange, setDateRange] = useState({
		startDate: "",
		endDate: "",
	});
	const [selectedReportType, setSelectedReportType] =
		useState("blood-test-history");
	const [selectedFormat, setSelectedFormat] = useState("csv");
	const [reportData, setReportData] = useState([]);

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

	// Report types options
	const reportTypes = [
		{
			id: "blood-test-history",
			name: "Riwayat Tes Darah",
			description: "Laporan lengkap semua tes darah yang telah dilakukan",
			icon: <FiFileText className="h-6 w-6 text-blood" />,
		},
		{
			id: "detection-results",
			name: "Hasil Deteksi Penyakit",
			description: "Laporan hasil deteksi dan analisis penyakit",
			icon: <FiBarChart2 className="h-6 w-6 text-blue-600" />,
		},
		{
			id: "monthly-summary",
			name: "Ringkasan Bulanan",
			description: "Ringkasan statistik dan tren bulanan",
			icon: <FiCalendar className="h-6 w-6 text-green-600" />,
		},
	];

	// Format options
	const formatOptions = [
		{
			id: "csv",
			name: "CSV",
			description: "Comma-Separated Values (dapat dibuka di Excel)",
		},
		{ id: "pdf", name: "PDF", description: "Portable Document Format" },
		{ id: "xlsx", name: "Excel", description: "Microsoft Excel Spreadsheet" },
	];

	useEffect(() => {
		const fetchReportData = async () => {
			try {
				// Simulate API call
				setTimeout(() => {
					// Replace with actual API call
					// const response = await axios.get(`/api/reports/preview/${selectedReportType}`, {
					//   headers: {
					//     Authorization: `Bearer ${localStorage.getItem('token')}`
					//   },
					//   params: {
					//     startDate: dateRange.startDate || undefined,
					//     endDate: dateRange.endDate || undefined
					//   }
					// });

					// Simulate different data based on report type
					let mockData = [];

					if (selectedReportType === "blood-test-history") {
						mockData = [
							{
								id: 1,
								date: "12 Mei 2025",
								patient: "Ahmad Saputra",
								hemoglobin: 14.5,
								status: "Normal",
							},
							{
								id: 2,
								date: "9 Mei 2025",
								patient: "Siti Nurhayati",
								hemoglobin: 11.2,
								status: "Abnormal",
							},
							{
								id: 3,
								date: "15 Apr 2025",
								patient: "Budi Santoso",
								hemoglobin: 17.8,
								status: "Abnormal",
							},
							{
								id: 4,
								date: "2 Apr 2025",
								patient: "Dewi Kusuma",
								hemoglobin: 12.5,
								status: "Abnormal",
							},
							{
								id: 5,
								date: "18 Mar 2025",
								patient: "Agus Pranoto",
								hemoglobin: 15.0,
								status: "Abnormal",
							},
						];
					} else if (selectedReportType === "detection-results") {
						mockData = [
							{
								id: 1,
								date: "12 Mei 2025",
								patient: "Ahmad Saputra",
								condition: "Hasil Normal",
								probability: "Tinggi",
							},
							{
								id: 2,
								date: "9 Mei 2025",
								patient: "Siti Nurhayati",
								condition: "Anemia Mikrositik",
								probability: "Tinggi",
							},
							{
								id: 3,
								date: "15 Apr 2025",
								patient: "Budi Santoso",
								condition: "Polisitemia",
								probability: "Tinggi",
							},
							{
								id: 4,
								date: "2 Apr 2025",
								patient: "Dewi Kusuma",
								condition: "Leukopenia",
								probability: "Tinggi",
							},
							{
								id: 5,
								date: "18 Mar 2025",
								patient: "Agus Pranoto",
								condition: "Leukositosis, Trombositosis",
								probability: "Tinggi",
							},
						];
					} else if (selectedReportType === "monthly-summary") {
						mockData = [
							{
								month: "Mei 2025",
								totalTests: 12,
								normalResults: 8,
								abnormalResults: 4,
							},
							{
								month: "April 2025",
								totalTests: 18,
								normalResults: 12,
								abnormalResults: 6,
							},
							{
								month: "Maret 2025",
								totalTests: 15,
								normalResults: 10,
								abnormalResults: 5,
							},
							{
								month: "Februari 2025",
								totalTests: 9,
								normalResults: 7,
								abnormalResults: 2,
							},
							{
								month: "Januari 2025",
								totalTests: 11,
								normalResults: 8,
								abnormalResults: 3,
							},
						];
					}

					setReportData(mockData);
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching report data:", error);
				setLoading(false);
			}
		};

		setLoading(true);
		fetchReportData();
	}, [selectedReportType, dateRange]);

	const handleReportTypeChange = (reportType) => {
		setSelectedReportType(reportType);
	};

	const handleFormatChange = (format) => {
		setSelectedFormat(format);
	};

	const handleDateRangeChange = (e) => {
		const { name, value } = e.target;
		setDateRange((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const clearDateRange = () => {
		setDateRange({
			startDate: "",
			endDate: "",
		});
	};

	const handleGenerateReport = async () => {
		setGenerating(true);

		try {
			// In a real app, this would call an API to generate a report
			// const response = await axios.get(`/api/reports/download/${selectedReportType}`, {
			//   headers: {
			//     Authorization: `Bearer ${localStorage.getItem('token')}`
			//   },
			//   params: {
			//     format: selectedFormat,
			//     startDate: dateRange.startDate || undefined,
			//     endDate: dateRange.endDate || undefined
			//   },
			//   responseType: 'blob'
			// });

			// const url = window.URL.createObjectURL(new Blob([response.data]));
			// const link = document.createElement('a');
			// link.href = url;
			// link.setAttribute('download', `bloodaldo_${selectedReportType}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`);
			// document.body.appendChild(link);
			// link.click();
			// link.remove();

			// Simulate API call delay
			setTimeout(() => {
				alert(
					`Laporan ${getReportTypeName(
						selectedReportType
					)} berhasil diunduh dalam format ${selectedFormat.toUpperCase()}`
				);
				setGenerating(false);
			}, 2000);
		} catch (error) {
			console.error("Error generating report:", error);
			alert("Terjadi kesalahan saat mengunduh laporan");
			setGenerating(false);
		}
	};

	const getReportTypeName = (reportTypeId) => {
		const reportType = reportTypes.find((type) => type.id === reportTypeId);
		return reportType ? reportType.name : reportTypeId;
	};

	// Render preview table based on report type
	const renderPreviewTable = () => {
		if (reportData.length === 0) {
			return (
				<div className="text-center py-8 text-gray-500">
					<FiInfo className="h-10 w-10 mx-auto mb-4" />
					<p>Tidak ada data yang tersedia untuk laporan ini</p>
				</div>
			);
		}

		if (selectedReportType === "blood-test-history") {
			return (
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
								Pasien
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Hemoglobin
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Status
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{reportData.map((item) => (
							<tr key={item.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{item.date}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{item.patient}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{item.hemoglobin} g/dL
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											item.status === "Normal"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{item.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			);
		} else if (selectedReportType === "detection-results") {
			return (
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
								Pasien
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Kondisi
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Probabilitas
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{reportData.map((item) => (
							<tr key={item.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{item.date}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{item.patient}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{item.condition}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											item.probability === "Tinggi"
												? "bg-red-100 text-red-800"
												: item.probability === "Sedang"
												? "bg-yellow-100 text-yellow-800"
												: "bg-blue-100 text-blue-800"
										}`}
									>
										{item.probability}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			);
		} else if (selectedReportType === "monthly-summary") {
			return (
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Bulan
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Total Tes
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Hasil Normal
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Hasil Abnormal
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{reportData.map((item, index) => (
							<tr key={index} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
									{item.month}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{item.totalTests}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className="text-sm text-gray-900 flex items-center">
										<FiCheck className="mr-1 text-green-500" />
										{item.normalResults}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className="text-sm text-gray-900 flex items-center">
										<FiAlertCircle className="mr-1 text-red-500" />
										{item.abnormalResults}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			);
		}
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
					Laporan
				</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Report Configuration */}
				<motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
					{/* Report Type Selection */}
					<div className="bg-white rounded-xl shadow-md p-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">
							Jenis Laporan
						</h2>

						<div className="space-y-3">
							{reportTypes.map((type) => (
								<div
									key={type.id}
									className={`flex items-start p-3 rounded-lg cursor-pointer border transition-colors duration-200 ${
										selectedReportType === type.id
											? "border-blood bg-red-50"
											: "border-gray-200 hover:bg-gray-50"
									}`}
									onClick={() => handleReportTypeChange(type.id)}
								>
									<div className="flex-shrink-0">{type.icon}</div>
									<div className="ml-4">
										<h3 className="text-base font-medium text-gray-900">
											{type.name}
										</h3>
										<p className="text-sm text-gray-500">{type.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Format Selection */}
					<div className="bg-white rounded-xl shadow-md p-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">
							Format Laporan
						</h2>

						<div className="space-y-3">
							{formatOptions.map((format) => (
								<div
									key={format.id}
									className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors duration-200 ${
										selectedFormat === format.id
											? "border-blood bg-red-50"
											: "border-gray-200 hover:bg-gray-50"
									}`}
									onClick={() => handleFormatChange(format.id)}
								>
									<div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-3">
										{selectedFormat === format.id && (
											<div className="w-3 h-3 rounded-full bg-blood"></div>
										)}
									</div>
									<div>
										<h3 className="text-base font-medium text-gray-900">
											{format.name}
										</h3>
										<p className="text-sm text-gray-500">
											{format.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Date Range Filter */}
					<div className="bg-white rounded-xl shadow-md p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold text-gray-800">
								Rentang Waktu
							</h2>

							{(dateRange.startDate || dateRange.endDate) && (
								<button
									onClick={clearDateRange}
									className="text-sm text-gray-600 hover:text-blood flex items-center"
								>
									<FiX className="mr-1" />
									Reset
								</button>
							)}
						</div>

						<div className="space-y-4">
							<div className="form-group">
								<label htmlFor="startDate" className="form-label">
									Dari Tanggal
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FiCalendar className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="date"
										id="startDate"
										name="startDate"
										className="input-field pl-10 w-full"
										value={dateRange.startDate}
										onChange={handleDateRangeChange}
									/>
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="endDate" className="form-label">
									Sampai Tanggal
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FiCalendar className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="date"
										id="endDate"
										name="endDate"
										className="input-field pl-10 w-full"
										value={dateRange.endDate}
										onChange={handleDateRangeChange}
										min={dateRange.startDate}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Generate Button */}
					<div className="bg-white rounded-xl shadow-md p-6">
						<button
							onClick={handleGenerateReport}
							disabled={generating}
							className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood transition-colors duration-200 flex items-center justify-center"
						>
							{generating ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
									Menghasilkan Laporan...
								</>
							) : (
								<>
									<FiDownload className="mr-2" />
									Unduh Laporan
								</>
							)}
						</button>

						<p className="text-xs text-gray-500 mt-2 text-center">
							Mengunduh laporan {getReportTypeName(selectedReportType)} dalam
							format {selectedFormat.toUpperCase()}
						</p>
					</div>
				</motion.div>

				{/* Report Preview */}
				<motion.div
					className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden"
					variants={itemVariants}
				>
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-800">
							Pratinjau Laporan: {getReportTypeName(selectedReportType)}
						</h2>
						<p className="text-sm text-gray-500">
							Ini adalah pratinjau dari laporan Anda. Data lengkap akan tersedia
							saat laporan diunduh.
						</p>
					</div>

					<div className="overflow-x-auto">{renderPreviewTable()}</div>

					<div className="p-6 border-t border-gray-200 bg-gray-50 text-sm text-center text-gray-500">
						<FiUser className="inline-block mr-1" />
						Laporan dibuat oleh: {user?.name || "User"} |
						<FiCalendar className="inline-block mx-1" />
						Tanggal: {new Date().toLocaleDateString("id-ID")}
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default ReportsPage;
