import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

const Analysis = () => {
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [patientData, setPatientData] = useState(null);
	const [analysisResult, setAnalysisResult] = useState(null);

	// COLORS for charts
	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				// Fetch patient data
				const patientResponse = await axios.get(
					`http://localhost:5000/api/patients/${id}`
				);

				if (patientResponse.data && patientResponse.data.success) {
					setPatientData(patientResponse.data.data);
				} else {
					throw new Error("Failed to fetch patient data");
				}

				// Fetch analysis result
				const analysisResponse = await axios.get(
					`http://localhost:5000/api/analysis/${id}`
				);

				if (analysisResponse.data && analysisResponse.data.success) {
					setAnalysisResult(analysisResponse.data.data);
				} else {
					throw new Error("Failed to fetch analysis data");
				}
			} catch (err) {
				console.error("Error fetching data:", err);
				setError(
					"Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti."
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id]);

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

	if (!patientData || !analysisResult) {
		return (
			<div
				className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
				role="alert"
			>
				<strong className="font-bold">Data tidak ditemukan! </strong>
				<span className="block sm:inline">
					Data pasien atau hasil analisis tidak ditemukan.
				</span>
				<Link
					to="/patient-form"
					className="text-blue-600 hover:underline mt-2 block"
				>
					Kembali ke Form Data Pasien
				</Link>
			</div>
		);
	}

	// Prepare chart data
	const bloodParameterData = [
		{
			name: "Hemoglobin",
			value: parseFloat(patientData.hemoglobin) || 0,
			normalRange:
				patientData.gender === "Laki-laki" ? "14-18 g/dL" : "12-16 g/dL",
		},
		{
			name: "Sel Darah Merah",
			value: parseFloat(patientData.redBloodCell) || 0,
			normalRange:
				patientData.gender === "Laki-laki"
					? "4.7-6.1 10^6/µL"
					: "4.2-5.4 10^6/µL",
		},
		{
			name: "Sel Darah Putih",
			value: parseFloat(patientData.whiteBloodCell) || 0,
			normalRange: "4.5-11.0 10^3/µL",
		},
		{
			name: "Trombosit",
			value: parseFloat(patientData.platelet) || 0,
			normalRange: "150-450 10^3/µL",
		},
		{
			name: "Hematokrit",
			value: parseFloat(patientData.hematocrit) || 0,
			normalRange: patientData.gender === "Laki-laki" ? "41-53%" : "36-46%",
		},
	];

	// Prepare probabilities data for pie chart
	const probabilityData = analysisResult.probabilities.map((item) => ({
		name: item.disease,
		value: item.probability * 100, // Convert to percentage
	}));

	return (
		<div className="max-w-5xl mx-auto">
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Header */}
				<div className="bg-blue-600 text-white p-4">
					<h1 className="text-2xl font-bold">Hasil Analisis Sistem Pakar</h1>
					<p className="text-blue-100">
						Deteksi Dini Penyakit Melalui Data Bank Darah
					</p>
				</div>

				{/* Patient Info */}
				<div className="p-6 border-b">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Informasi Pasien
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-gray-600">Nama:</p>
							<p className="font-medium">{patientData.name}</p>
						</div>
						<div>
							<p className="text-gray-600">Umur:</p>
							<p className="font-medium">{patientData.age} tahun</p>
						</div>
						<div>
							<p className="text-gray-600">Jenis Kelamin:</p>
							<p className="font-medium">{patientData.gender}</p>
						</div>
						<div>
							<p className="text-gray-600">Riwayat Penyakit:</p>
							<p className="font-medium">
								{patientData.medicalHistory || "Tidak ada"}
							</p>
						</div>
					</div>
				</div>

				{/* Diagnosis Result */}
				<div className="p-6 border-b">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Hasil Diagnosa
					</h2>

					<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-blue-500"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-blue-700">
									Berdasarkan analisis sistem pakar, kemungkinan diagnosa
									adalah:
								</p>
								<h3 className="text-lg font-bold text-blue-800 mt-1">
									{analysisResult.diagnosis}
								</h3>
								<p className="text-sm text-blue-700 mt-2">
									dengan probabilitas{" "}
									{(analysisResult.mainProbability * 100).toFixed(2)}%
								</p>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-700 mb-3">
							Penjelasan Diagnosa
						</h3>
						<p className="text-gray-600">{analysisResult.explanation}</p>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-700 mb-3">
							Rekomendasi
						</h3>
						<ul className="list-disc pl-5 text-gray-600 space-y-1">
							{analysisResult.recommendations.map((recommendation, index) => (
								<li key={index}>{recommendation}</li>
							))}
						</ul>
					</div>
				</div>

				{/* Charts */}
				<div className="p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-6">
						Visualisasi Data
					</h2>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Bar Chart for Blood Parameters */}
						<div className="bg-gray-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
								Parameter Darah
							</h3>
							<div className="h-80">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={bloodParameterData}
										margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" angle={-45} textAnchor="end" />
										<YAxis />
										<Tooltip
											formatter={(value, name, props) => [
												`${value}`,
												`${name}`,
											]}
											labelFormatter={(label) => `Parameter: ${label}`}
										/>
										<Legend />
										<Bar dataKey="value" fill="#3B82F6" name="Nilai" />
									</BarChart>
								</ResponsiveContainer>
							</div>
							<div className="mt-4">
								<h4 className="text-sm font-semibold text-gray-700 mb-2">
									Nilai Normal:
								</h4>
								<ul className="text-xs text-gray-600 space-y-1">
									{bloodParameterData.map((item, index) => (
										<li key={index}>
											<span className="font-medium">{item.name}:</span>{" "}
											{item.normalRange}
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Pie Chart for Probabilities */}
						<div className="bg-gray-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
								Probabilitas Diagnosa
							</h3>
							<div className="h-80">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											dataKey="value"
											data={probabilityData}
											cx="50%"
											cy="50%"
											outerRadius={100}
											fill="#8884d8"
											label={({ name, percent }) =>
												`${name}: ${(percent * 100).toFixed(2)}%`
											}
										>
											{probabilityData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="p-6 bg-gray-50 flex flex-wrap justify-between gap-4">
					<Link
						to="/patient-form"
						className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow hover:bg-gray-700 transition"
					>
						Form Data Pasien Baru
					</Link>
					<Link
						to="/history"
						className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
					>
						Lihat Riwayat Diagnosa
					</Link>
					<button
						onClick={() => window.print()}
						className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition"
					>
						Cetak Hasil
					</button>
				</div>
			</div>
		</div>
	);
};

export default Analysis;
