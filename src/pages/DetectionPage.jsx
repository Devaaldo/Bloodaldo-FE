import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
	FiAlertCircle,
	FiCheckCircle,
	FiInfo,
	FiFileText,
	FiDownload,
} from "react-icons/fi";
import axios from "axios";

const DetectionPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [loading, setLoading] = useState(true);
	const [analyzing, setAnalyzing] = useState(false);
	const [bloodTestData, setBloodTestData] = useState(null);
	const [detectionResult, setDetectionResult] = useState(null);
	const [selectedTest, setSelectedTest] = useState(null);

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
		const fetchRecentBloodTests = async () => {
			try {
				// Simulate API call
				setTimeout(() => {
					// Replace with actual API call
					// const response = await axios.get('/api/blood-tests/recent');

					const mockData = [
						{
							id: 1,
							date: "12 Mei 2025",
							patientName: "Ahmad Saputra",
							patientAge: 35,
							patientGender: "male",
							parameters: {
								hemoglobin: 14.5,
								hematocrit: 45,
								erythrocytes: 5.2,
								leukocytes: 7500,
								thrombocytes: 250000,
								mcv: 88,
								mch: 29,
								mchc: 33,
							},
						},
						{
							id: 2,
							date: "9 Mei 2025",
							patientName: "Siti Nurhayati",
							patientAge: 28,
							patientGender: "female",
							parameters: {
								hemoglobin: 11.2,
								hematocrit: 34,
								erythrocytes: 4.0,
								leukocytes: 9200,
								thrombocytes: 300000,
								mcv: 75,
								mch: 25,
								mchc: 31,
							},
						},
					];

					setBloodTestData(mockData);
					setSelectedTest(mockData[0]);
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching blood tests:", error);
				setLoading(false);
			}
		};

		fetchRecentBloodTests();
	}, []);

	const handleSelectTest = (test) => {
		setSelectedTest(test);
		setDetectionResult(null);
	};

	const performDetection = async () => {
		setAnalyzing(true);

		try {
			// Simulate API call for detection system
			setTimeout(() => {
				// Rule-based expert system implementation:
				// This is a simplified implementation of a rule-based system for blood test analysis

				const parameters = selectedTest.parameters;
				const gender = selectedTest.patientGender;
				const age = selectedTest.patientAge;

				// Define normal ranges based on gender
				const normalRanges = {
					hemoglobin:
						gender === "male"
							? { min: 13.5, max: 17.5 }
							: { min: 12.0, max: 15.5 },
					hematocrit:
						gender === "male" ? { min: 41, max: 50 } : { min: 36, max: 44 },
					erythrocytes:
						gender === "male" ? { min: 4.7, max: 6.1 } : { min: 4.2, max: 5.4 },
					leukocytes: { min: 4500, max: 11000 },
					thrombocytes: { min: 150000, max: 450000 },
					mcv: { min: 80, max: 96 },
					mch: { min: 27, max: 33 },
					mchc: { min: 33, max: 36 },
				};

				// Check which parameters are abnormal
				const abnormalParameters = {};
				Object.entries(parameters).forEach(([key, value]) => {
					if (normalRanges[key]) {
						if (value < normalRanges[key].min) {
							abnormalParameters[key] = {
								value,
								status: "low",
								normalRange: `${normalRanges[key].min} - ${normalRanges[key].max}`,
							};
						} else if (value > normalRanges[key].max) {
							abnormalParameters[key] = {
								value,
								status: "high",
								normalRange: `${normalRanges[key].min} - ${normalRanges[key].max}`,
							};
						}
					}
				});

				// Apply rule-based detection system
				const possibleConditions = [];

				// Rule 1: Anemia (low hemoglobin)
				if (
					abnormalParameters.hemoglobin &&
					abnormalParameters.hemoglobin.status === "low"
				) {
					// Check MCV to determine type of anemia
					if (
						abnormalParameters.mcv &&
						abnormalParameters.mcv.status === "low"
					) {
						possibleConditions.push({
							name: "Anemia Mikrositik",
							description:
								"Anemia dengan sel darah merah yang lebih kecil dari normal.",
							probability: "Tinggi",
							recommendations: [
								"Konsultasikan dengan dokter untuk evaluasi lebih lanjut",
								"Tes kadar ferritin dan besi untuk memeriksa anemia defisiensi besi",
								"Pertimbangkan suplemen besi jika direkomendasikan oleh dokter",
							],
						});
					} else if (
						abnormalParameters.mcv &&
						abnormalParameters.mcv.status === "high"
					) {
						possibleConditions.push({
							name: "Anemia Makrositik",
							description:
								"Anemia dengan sel darah merah yang lebih besar dari normal, sering dikaitkan dengan defisiensi vitamin B12 atau asam folat.",
							probability: "Tinggi",
							recommendations: [
								"Konsultasikan dengan dokter untuk evaluasi lebih lanjut",
								"Tes kadar vitamin B12 dan asam folat",
								"Evaluasi fungsi tiroid",
							],
						});
					} else {
						possibleConditions.push({
							name: "Anemia Normositik",
							description:
								"Anemia dengan ukuran sel darah merah normal, bisa disebabkan oleh penyakit kronis atau kehilangan darah.",
							probability: "Sedang",
							recommendations: [
								"Konsultasikan dengan dokter untuk evaluasi lebih lanjut",
								"Periksa adanya sumber perdarahan",
								"Evaluasi fungsi ginjal dan hati",
							],
						});
					}
				}

				// Rule 2: Polycythemia (high hemoglobin and hematocrit)
				if (
					abnormalParameters.hemoglobin &&
					abnormalParameters.hemoglobin.status === "high" &&
					abnormalParameters.hematocrit &&
					abnormalParameters.hematocrit.status === "high"
				) {
					possibleConditions.push({
						name: "Polisitemia",
						description:
							"Kondisi dimana tubuh memproduksi terlalu banyak sel darah merah, menyebabkan darah menjadi lebih kental.",
						probability: "Tinggi",
						recommendations: [
							"Segera konsultasikan dengan hematologis",
							"Pertimbangkan tes JAK2 untuk polisitemia vera",
							"Evaluasi saturasi oksigen untuk memeriksa penyebab sekunder",
						],
					});
				}

				// Rule 3: Leukocytosis (high white blood cells)
				if (
					abnormalParameters.leukocytes &&
					abnormalParameters.leukocytes.status === "high"
				) {
					possibleConditions.push({
						name: "Leukositosis",
						description:
							"Peningkatan jumlah sel darah putih, sering kali mengindikasikan infeksi atau peradangan.",
						probability: "Tinggi",
						recommendations: [
							"Evaluasi adanya sumber infeksi",
							"Pemeriksaan diferensial leukosit",
							"Pertimbangkan tes CRP atau laju endap darah",
						],
					});
				}

				// Rule 4: Leukopenia (low white blood cells)
				if (
					abnormalParameters.leukocytes &&
					abnormalParameters.leukocytes.status === "low"
				) {
					possibleConditions.push({
						name: "Leukopenia",
						description:
							"Penurunan jumlah sel darah putih, bisa mengindikasikan masalah dengan sumsum tulang atau autoimun.",
						probability: "Tinggi",
						recommendations: [
							"Konsultasikan dengan hematologis",
							"Evaluasi riwayat obat-obatan",
							"Tes autoimun sesuai rekomendasi dokter",
						],
					});
				}

				// Rule 5: Thrombocytopenia (low platelets)
				if (
					abnormalParameters.thrombocytes &&
					abnormalParameters.thrombocytes.status === "low"
				) {
					possibleConditions.push({
						name: "Trombositopenia",
						description:
							"Penurunan jumlah trombosit/keping darah, yang bisa meningkatkan risiko perdarahan.",
						probability: "Tinggi",
						recommendations: [
							"Pantau tanda-tanda perdarahan",
							"Konsultasikan dengan hematologis",
							"Evaluasi kemungkinan penyebab seperti obat-obatan atau infeksi",
						],
					});
				}

				// Rule 6: Thrombocytosis (high platelets)
				if (
					abnormalParameters.thrombocytes &&
					abnormalParameters.thrombocytes.status === "high"
				) {
					possibleConditions.push({
						name: "Trombositosis",
						description:
							"Peningkatan jumlah trombosit/keping darah, bisa reaktif atau disebabkan oleh gangguan sumsum tulang.",
						probability: "Sedang",
						recommendations: [
							"Evaluasi penyebab peradangan atau infeksi",
							"Pertimbangkan pemeriksaan sumsum tulang jika persisten",
							"Pantau untuk gejala pembekuan darah",
						],
					});
				}

				// If no conditions detected but abnormal parameters exist
				if (
					possibleConditions.length === 0 &&
					Object.keys(abnormalParameters).length > 0
				) {
					possibleConditions.push({
						name: "Abnormalitas Darah Non-spesifik",
						description:
							"Parameter darah abnormal terdeteksi tetapi tidak cocok dengan pola penyakit spesifik.",
						probability: "Rendah",
						recommendations: [
							"Ulangi tes dalam 2-4 minggu untuk konfirmasi",
							"Konsultasikan dengan dokter jika gejala muncul",
							"Pertimbangkan evaluasi lebih lanjut jika hasil tetap abnormal",
						],
					});
				}

				// If all parameters are normal
				if (Object.keys(abnormalParameters).length === 0) {
					possibleConditions.push({
						name: "Hasil Normal",
						description: "Semua parameter darah berada dalam rentang normal.",
						probability: "Tinggi",
						recommendations: [
							"Lanjutkan pemeriksaan rutin sesuai rekomendasi dokter",
							"Pertahankan gaya hidup sehat",
							"Lakukan tes ulang dalam 6-12 bulan",
						],
					});
				}

				const result = {
					testId: selectedTest.id,
					patientName: selectedTest.patientName,
					patientAge: selectedTest.patientAge,
					patientGender: selectedTest.patientGender,
					detectionDate: new Date().toLocaleDateString("id-ID", {
						day: "numeric",
						month: "long",
						year: "numeric",
					}),
					abnormalParameters,
					possibleConditions,
					analysisTime: "0.8 detik",
				};

				setDetectionResult(result);
				setAnalyzing(false);
			}, 2000);
		} catch (error) {
			console.error("Error during disease detection:", error);
			setAnalyzing(false);
		}
	};

	const saveResults = async () => {
		try {
			// Replace with actual API call
			// await axios.post('/api/detection-results', detectionResult);

			alert("Hasil deteksi berhasil disimpan");
		} catch (error) {
			console.error("Error saving detection results:", error);
			alert("Terjadi kesalahan saat menyimpan hasil");
		}
	};

	const downloadReport = () => {
		// In a real app, this would generate a PDF or Excel file
		alert("Laporan diunduh");
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
					Deteksi Penyakit
				</h1>
			</div>

			{bloodTestData.length === 0 ? (
				<motion.div
					className="bg-white rounded-xl shadow-md p-8 text-center"
					variants={itemVariants}
				>
					<div className="flex flex-col items-center mb-6">
						<FiFileText className="h-16 w-16 text-gray-400 mb-4" />
						<h3 className="text-xl font-semibold text-gray-800">
							Tidak Ada Data Tes Darah
						</h3>
						<p className="text-gray-600 mt-2">
							Anda belum memiliki data tes darah yang dapat dianalisis.
						</p>
					</div>
					<button
						onClick={() => navigate("/blood-test")}
						className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
					>
						<FiFileText className="mr-2" />
						Input Data Tes Darah
					</button>
				</motion.div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<motion.div
						className="lg:col-span-1 bg-white rounded-xl shadow-md p-6"
						variants={itemVariants}
					>
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Pilih Data Tes Darah
						</h3>

						<div className="space-y-3">
							{bloodTestData.map((test) => (
								<button
									key={test.id}
									className={`w-full flex items-center p-3 rounded-lg border transition-colors duration-200 ${
										selectedTest && selectedTest.id === test.id
											? "border-blood bg-red-50"
											: "border-gray-200 hover:bg-gray-50"
									}`}
									onClick={() => handleSelectTest(test)}
								>
									<div
										className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
											selectedTest && selectedTest.id === test.id
												? "bg-blood text-white"
												: "bg-gray-100 text-gray-600"
										}`}
									>
										<FiFileText className="h-4 w-4" />
									</div>
									<div className="text-left">
										<p className="font-medium text-gray-800">
											{test.patientName}
										</p>
										<p className="text-sm text-gray-500">{test.date}</p>
									</div>
								</button>
							))}
						</div>

						<div className="mt-6">
							<button
								onClick={() => navigate("/blood-test")}
								className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
							>
								Input Data Baru
							</button>
						</div>
					</motion.div>

					<motion.div
						className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
						variants={itemVariants}
					>
						{selectedTest && (
							<div>
								<h3 className="text-lg font-semibold text-gray-800 mb-4">
									Detail Tes Darah
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<div>
										<p className="text-sm text-gray-500">Nama Pasien</p>
										<p className="font-medium">{selectedTest.patientName}</p>
									</div>

									<div>
										<p className="text-sm text-gray-500">Tanggal Tes</p>
										<p className="font-medium">{selectedTest.date}</p>
									</div>

									<div>
										<p className="text-sm text-gray-500">Usia</p>
										<p className="font-medium">
											{selectedTest.patientAge} tahun
										</p>
									</div>

									<div>
										<p className="text-sm text-gray-500">Jenis Kelamin</p>
										<p className="font-medium">
											{selectedTest.patientGender === "male"
												? "Laki-laki"
												: "Perempuan"}
										</p>
									</div>
								</div>

								<div className="mb-6">
									<h4 className="text-base font-medium text-gray-800 mb-3">
										Parameter Darah
									</h4>

									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th
														scope="col"
														className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														Parameter
													</th>
													<th
														scope="col"
														className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														Nilai
													</th>
													<th
														scope="col"
														className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														Satuan
													</th>
													<th
														scope="col"
														className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
													>
														Rentang Normal
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														Hemoglobin
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.hemoglobin}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														g/dL
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														{selectedTest.patientGender === "male"
															? "13.5 - 17.5"
															: "12.0 - 15.5"}
													</td>
												</tr>
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														Hematokrit
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.hematocrit}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														%
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														{selectedTest.patientGender === "male"
															? "41 - 50"
															: "36 - 44"}
													</td>
												</tr>
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														Eritrosit
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.erythrocytes}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														juta/μL
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														{selectedTest.patientGender === "male"
															? "4.7 - 6.1"
															: "4.2 - 5.4"}
													</td>
												</tr>
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														Leukosit
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.leukocytes}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														/μL
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														4,500 - 11,000
													</td>
												</tr>
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														Trombosit
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.thrombocytes}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														/μL
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														150,000 - 450,000
													</td>
												</tr>
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														MCV
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.mcv}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														fL
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														80 - 96
													</td>
												</tr>
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														MCH
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.mch}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														pg
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														27 - 33
													</td>
												</tr>
												<tr>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														MCHC
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
														{selectedTest.parameters.mchc}
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														g/dL
													</td>
													<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
														33 - 36
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>

								{!detectionResult ? (
									<div className="flex justify-center">
										<button
											onClick={performDetection}
											disabled={analyzing}
											className="py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
										>
											{analyzing ? (
												<>
													<span className="inline-block mr-2">
														<svg
															className="animate-spin h-5 w-5 text-white"
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
													</span>
													Menganalisis...
												</>
											) : (
												"Mulai Deteksi Penyakit"
											)}
										</button>
									</div>
								) : (
									<div className="mt-8">
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-lg font-semibold text-gray-800">
												Hasil Deteksi
											</h3>
											<div className="text-sm text-gray-500">
												{detectionResult.detectionDate} •{" "}
												{detectionResult.analysisTime}
											</div>
										</div>

										{Object.keys(detectionResult.abnormalParameters).length >
										0 ? (
											<div className="mb-6">
												<h4 className="text-base font-medium text-gray-800 mb-3">
													Parameter Abnormal
												</h4>

												<div className="overflow-x-auto">
													<table className="min-w-full divide-y divide-gray-200">
														<thead className="bg-gray-50">
															<tr>
																<th
																	scope="col"
																	className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																>
																	Parameter
																</th>
																<th
																	scope="col"
																	className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																>
																	Nilai
																</th>
																<th
																	scope="col"
																	className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																>
																	Status
																</th>
																<th
																	scope="col"
																	className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																>
																	Rentang Normal
																</th>
															</tr>
														</thead>
														<tbody className="bg-white divide-y divide-gray-200">
															{Object.entries(
																detectionResult.abnormalParameters
															).map(([key, data], index) => (
																<tr key={index}>
																	<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
																		{data.normalRange}
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
										) : (
											<div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
												<div className="flex">
													<div className="flex-shrink-0">
														<FiCheckCircle className="h-5 w-5 text-green-400" />
													</div>
													<div className="ml-3">
														<p className="text-sm text-green-700">
															Semua parameter berada dalam rentang normal.
														</p>
													</div>
												</div>
											</div>
										)}

										<div className="mb-6">
											<h4 className="text-base font-medium text-gray-800 mb-3">
												Kemungkinan Kondisi
											</h4>

											<div className="space-y-4">
												{detectionResult.possibleConditions.map(
													(condition, index) => (
														<div
															key={index}
															className="p-4 bg-white border rounded-lg"
														>
															<div className="flex items-start">
																<div
																	className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
																		condition.probability === "Tinggi"
																			? "bg-red-100 text-red-600"
																			: condition.probability === "Sedang"
																			? "bg-yellow-100 text-yellow-600"
																			: "bg-blue-100 text-blue-600"
																	}`}
																>
																	<FiAlertCircle className="h-4 w-4" />
																</div>
																<div>
																	<div className="flex items-center">
																		<h5 className="text-base font-medium text-gray-900">
																			{condition.name}
																		</h5>
																		<span
																			className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
																				condition.probability === "Tinggi"
																					? "bg-red-100 text-red-800"
																					: condition.probability === "Sedang"
																					? "bg-yellow-100 text-yellow-800"
																					: "bg-blue-100 text-blue-800"
																			}`}
																		>
																			{condition.probability}
																		</span>
																	</div>
																	<p className="mt-1 text-sm text-gray-600">
																		{condition.description}
																	</p>

																	<div className="mt-3">
																		<h6 className="text-sm font-medium text-gray-800">
																			Rekomendasi:
																		</h6>
																		<ul className="mt-1 space-y-1">
																			{condition.recommendations.map(
																				(rec, recIndex) => (
																					<li
																						key={recIndex}
																						className="text-sm text-gray-600 flex items-start"
																					>
																						<span className="mr-2">•</span>
																						<span>{rec}</span>
																					</li>
																				)
																			)}
																		</ul>
																	</div>
																</div>
															</div>
														</div>
													)
												)}
											</div>
										</div>

										<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
											<div className="flex">
												<div className="flex-shrink-0">
													<FiInfo className="h-5 w-5 text-blue-500" />
												</div>
												<div className="ml-3">
													<p className="text-sm text-blue-700">
														Hasil deteksi ini hanya sebagai referensi awal dan
														tidak menggantikan diagnosis medis profesional.
														Konsultasikan dengan dokter untuk evaluasi lebih
														lanjut.
													</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-4">
											<button
												onClick={saveResults}
												className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
											>
												Simpan Hasil
											</button>
											<button
												onClick={downloadReport}
												className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
											>
												<FiDownload className="inline-block mr-2" />
												Unduh Laporan
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</motion.div>
				</div>
			)}
		</motion.div>
	);
};

export default DetectionPage;
