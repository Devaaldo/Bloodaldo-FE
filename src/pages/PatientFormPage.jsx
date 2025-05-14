import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientFormPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		// Data pasien
		name: "",
		age: "",
		gender: "",
		medicalHistory: "",

		// Hasil pemeriksaan darah
		hemoglobin: "",
		redBloodCell: "",
		whiteBloodCell: "",
		platelet: "",
		hematocrit: "",
		mcv: "", // Mean Corpuscular Volume
		mch: "", // Mean Corpuscular Hemoglobin
		mchc: "", // Mean Corpuscular Hemoglobin Concentration
		neutrophils: "",
		lymphocytes: "",
		monocytes: "",
		eosinophils: "",
		basophils: "",
	});

	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Clear error when field is edited
		if (errors[name]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const validateForm = () => {
		const newErrors = {};

		// Validate patient data
		if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
		if (!formData.age) newErrors.age = "Umur harus diisi";
		if (
			formData.age &&
			(isNaN(formData.age) || formData.age <= 0 || formData.age > 120)
		) {
			newErrors.age = "Umur harus berupa angka antara 1-120";
		}
		if (!formData.gender) newErrors.gender = "Jenis kelamin harus dipilih";

		// Validate blood test results (only required fields)
		if (!formData.hemoglobin)
			newErrors.hemoglobin = "Nilai Hemoglobin harus diisi";
		if (!formData.redBloodCell)
			newErrors.redBloodCell = "Nilai Sel Darah Merah harus diisi";
		if (!formData.whiteBloodCell)
			newErrors.whiteBloodCell = "Nilai Sel Darah Putih harus diisi";
		if (!formData.platelet) newErrors.platelet = "Nilai Trombosit harus diisi";

		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate form
		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		// Submit form
		setIsLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:5000/api/patients",
				formData
			);

			if (response.data && response.data.id) {
				// Redirect to analysis page with patient ID
				navigate(`/analysis/${response.data.id}`);
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				Form Data Pasien
			</h1>

			<form onSubmit={handleSubmit}>
				{/* Data Pasien Section */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-blue-700 mb-4">
						Data Pasien
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-gray-700 mb-2" htmlFor="name">
								Nama Lengkap <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.name ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">{errors.name}</p>
							)}
						</div>

						<div>
							<label className="block text-gray-700 mb-2" htmlFor="age">
								Umur <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								id="age"
								name="age"
								value={formData.age}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.age ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.age && (
								<p className="text-red-500 text-sm mt-1">{errors.age}</p>
							)}
						</div>

						<div>
							<label className="block text-gray-700 mb-2">
								Jenis Kelamin <span className="text-red-500">*</span>
							</label>
							<div className="flex space-x-4">
								<label className="inline-flex items-center">
									<input
										type="radio"
										name="gender"
										value="Laki-laki"
										checked={formData.gender === "Laki-laki"}
										onChange={handleChange}
										className="form-radio h-5 w-5 text-blue-600"
									/>
									<span className="ml-2 text-gray-700">Laki-laki</span>
								</label>
								<label className="inline-flex items-center">
									<input
										type="radio"
										name="gender"
										value="Perempuan"
										checked={formData.gender === "Perempuan"}
										onChange={handleChange}
										className="form-radio h-5 w-5 text-blue-600"
									/>
									<span className="ml-2 text-gray-700">Perempuan</span>
								</label>
							</div>
							{errors.gender && (
								<p className="text-red-500 text-sm mt-1">{errors.gender}</p>
							)}
						</div>

						<div>
							<label
								className="block text-gray-700 mb-2"
								htmlFor="medicalHistory"
							>
								Riwayat Penyakit
							</label>
							<textarea
								id="medicalHistory"
								name="medicalHistory"
								value={formData.medicalHistory}
								onChange={handleChange}
								rows="3"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Contoh: Diabetes, Hipertensi, dll."
							/>
						</div>
					</div>
				</div>

				{/* Hasil Pemeriksaan Darah Section */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-blue-700 mb-4">
						Hasil Pemeriksaan Darah
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Row 1 */}
						<div>
							<label className="block text-gray-700 mb-2" htmlFor="hemoglobin">
								Hemoglobin (g/dL) <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								step="0.01"
								id="hemoglobin"
								name="hemoglobin"
								value={formData.hemoglobin}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.hemoglobin ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.hemoglobin && (
								<p className="text-red-500 text-sm mt-1">{errors.hemoglobin}</p>
							)}
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 12-16 g/dL (wanita), 14-18 g/dL (pria)
							</p>
						</div>

						<div>
							<label
								className="block text-gray-700 mb-2"
								htmlFor="redBloodCell"
							>
								Sel Darah Merah (10^6/µL){" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								step="0.01"
								id="redBloodCell"
								name="redBloodCell"
								value={formData.redBloodCell}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.redBloodCell ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.redBloodCell && (
								<p className="text-red-500 text-sm mt-1">
									{errors.redBloodCell}
								</p>
							)}
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 4.2-5.4 (wanita), 4.7-6.1 (pria)
							</p>
						</div>

						<div>
							<label
								className="block text-gray-700 mb-2"
								htmlFor="whiteBloodCell"
							>
								Sel Darah Putih (10^3/µL){" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								step="0.01"
								id="whiteBloodCell"
								name="whiteBloodCell"
								value={formData.whiteBloodCell}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.whiteBloodCell ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.whiteBloodCell && (
								<p className="text-red-500 text-sm mt-1">
									{errors.whiteBloodCell}
								</p>
							)}
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 4.5-11.0
							</p>
						</div>

						{/* Row 2 */}
						<div>
							<label className="block text-gray-700 mb-2" htmlFor="platelet">
								Trombosit (10^3/µL) <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								step="1"
								id="platelet"
								name="platelet"
								value={formData.platelet}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.platelet ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.platelet && (
								<p className="text-red-500 text-sm mt-1">{errors.platelet}</p>
							)}
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 150-450
							</p>
						</div>

						<div>
							<label className="block text-gray-700 mb-2" htmlFor="hematocrit">
								Hematokrit (%)
							</label>
							<input
								type="number"
								step="0.1"
								id="hematocrit"
								name="hematocrit"
								value={formData.hematocrit}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 36-46% (wanita), 41-53% (pria)
							</p>
						</div>

						<div>
							<label className="block text-gray-700 mb-2" htmlFor="mcv">
								MCV (fL)
							</label>
							<input
								type="number"
								step="0.1"
								id="mcv"
								name="mcv"
								value={formData.mcv}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 80-100 fL
							</p>
						</div>

						{/* Row 3 */}
						<div>
							<label className="block text-gray-700 mb-2" htmlFor="mch">
								MCH (pg)
							</label>
							<input
								type="number"
								step="0.1"
								id="mch"
								name="mch"
								value={formData.mch}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 27-31 pg
							</p>
						</div>

						<div>
							<label className="block text-gray-700 mb-2" htmlFor="mchc">
								MCHC (g/dL)
							</label>
							<input
								type="number"
								step="0.1"
								id="mchc"
								name="mchc"
								value={formData.mchc}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Nilai normal: 32-36 g/dL
							</p>
						</div>

						<div>
							<label className="block text-gray-700 mb-2" htmlFor="neutrophils">
								Neutrofil (%)
							</label>
							<input
								type="number"
								step="0.1"
								id="neutrophils"
								name="neutrophils"
								value={formData.neutrophils}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">Nilai normal: 40-60%</p>
						</div>

						{/* Row 4 */}
						<div>
							<label className="block text-gray-700 mb-2" htmlFor="lymphocytes">
								Limfosit (%)
							</label>
							<input
								type="number"
								step="0.1"
								id="lymphocytes"
								name="lymphocytes"
								value={formData.lymphocytes}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">Nilai normal: 20-40%</p>
						</div>

						<div>
							<label className="block text-gray-700 mb-2" htmlFor="monocytes">
								Monosit (%)
							</label>
							<input
								type="number"
								step="0.1"
								id="monocytes"
								name="monocytes"
								value={formData.monocytes}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">Nilai normal: 2-8%</p>
						</div>

						<div>
							<label className="block text-gray-700 mb-2" htmlFor="eosinophils">
								Eosinofil (%)
							</label>
							<input
								type="number"
								step="0.1"
								id="eosinophils"
								name="eosinophils"
								value={formData.eosinophils}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">Nilai normal: 1-4%</p>
						</div>

						{/* Row 5 */}
						<div>
							<label className="block text-gray-700 mb-2" htmlFor="basophils">
								Basofil (%)
							</label>
							<input
								type="number"
								step="0.1"
								id="basophils"
								name="basophils"
								value={formData.basophils}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">Nilai normal: 0-1%</p>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={isLoading}
						className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition ${
							isLoading ? "opacity-70 cursor-not-allowed" : ""
						}`}
					>
						{isLoading ? "Memproses..." : "Submit & Analisis"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default PatientFormPage;
