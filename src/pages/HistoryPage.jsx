import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const HistoryPage = () => {
	const [patients, setPatients] = useState([]);
	const [filteredPatients, setFilteredPatients] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filters, setFilters] = useState({
		gender: "",
		diagnosis: "",
		dateFrom: "",
		dateTo: "",
	});

	const { isAuthenticated } = useAuth();

	// Fetch patient history
	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await axios.get("http://localhost:5000/api/patients");
				setPatients(response.data);
				setFilteredPatients(response.data);
			} catch (err) {
				console.error("Error fetching patients:", err);
				setError("Terjadi kesalahan saat mengambil data pasien.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPatients();
	}, []);

	// Handle search & filters
	useEffect(() => {
		// Apply all filters
		let results = patients;

		// Search term filter
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			results = results.filter(
				(patient) =>
					patient.name.toLowerCase().includes(term) ||
					patient.diagnosis.toLowerCase().includes(term)
			);
		}

		// Gender filter
		if (filters.gender) {
			results = results.filter((patient) => patient.gender === filters.gender);
		}

		// Diagnosis filter
		if (filters.diagnosis) {
			results = results.filter(
				(patient) => patient.diagnosis === filters.diagnosis
			);
		}

		// Date range filter
		if (filters.dateFrom) {
			const fromDate = new Date(filters.dateFrom);
			results = results.filter(
				(patient) => new Date(patient.createdAt) >= fromDate
			);
		}

		if (filters.dateTo) {
			const toDate = new Date(filters.dateTo);
			// Set time to end of day
			toDate.setHours(23, 59, 59, 999);
			results = results.filter(
				(patient) => new Date(patient.createdAt) <= toDate
			);
		}

		setFilteredPatients(results);
	}, [searchTerm, filters, patients]);

	// Get unique diagnoses for filter dropdown
	const uniqueDiagnoses = [
		...new Set(patients.map((patient) => patient.diagnosis)),
	].filter(Boolean);

	// Handle search change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle filter change
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	// Reset all filters
	const resetFilters = () => {
		setSearchTerm("");
		setFilters({
			gender: "",
			diagnosis: "",
			dateFrom: "",
			dateTo: "",
		});
	};

	// Delete patient (admin only)
	const handleDeletePatient = async (id) => {
		if (!isAuthenticated) {
			alert("Anda harus login sebagai admin untuk menghapus data pasien.");
			return;
		}

		if (!window.confirm("Apakah Anda yakin ingin menghapus data pasien ini?")) {
			return;
		}

		try {
			await axios.delete(`http://localhost:5000/api/patients/${id}`);
			// Update state to remove deleted patient
			setPatients(patients.filter((patient) => patient.id !== id));
		} catch (err) {
			console.error("Error deleting patient:", err);
			alert("Terjadi kesalahan saat menghapus data pasien.");
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
					<h1 className="text-2xl font-bold">Riwayat Diagnosa</h1>
					<p className="text-blue-100">Daftar pasien dan hasil diagnosa</p>
				</div>

				{/* Search & Filters */}
				<div className="p-4 bg-gray-50 border-b">
					<div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
						{/* Search */}
						<div className="flex-grow">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Pencarian
							</label>
							<input
								type="text"
								placeholder="Cari berdasarkan nama atau diagnosis..."
								value={searchTerm}
								onChange={handleSearchChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Gender Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Jenis Kelamin
							</label>
							<select
								name="gender"
								value={filters.gender}
								onChange={handleFilterChange}
								className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Semua</option>
								<option value="Laki-laki">Laki-laki</option>
								<option value="Perempuan">Perempuan</option>
							</select>
						</div>

						{/* Diagnosis Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Diagnosis
							</label>
							<select
								name="diagnosis"
								value={filters.diagnosis}
								onChange={handleFilterChange}
								className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Semua</option>
								{uniqueDiagnoses.map((diagnosis, index) => (
									<option key={index} value={diagnosis}>
										{diagnosis}
									</option>
								))}
							</select>
						</div>

						{/* Reset button */}
						<div>
							<button
								onClick={resetFilters}
								className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
							>
								Reset
							</button>
						</div>
					</div>

					{/* Date Range Filters */}
					<div className="flex flex-col md:flex-row md:items-end gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Dari Tanggal
							</label>
							<input
								type="date"
								name="dateFrom"
								value={filters.dateFrom}
								onChange={handleFilterChange}
								className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Sampai Tanggal
							</label>
							<input
								type="date"
								name="dateTo"
								value={filters.dateTo}
								onChange={handleFilterChange}
								className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				{/* Patient List */}
				<div className="p-4">
					<div className="mb-4 flex justify-between items-center">
						<p className="text-gray-600">
							Menampilkan {filteredPatients.length} dari {patients.length}{" "}
							pasien
						</p>
						<Link
							to="/patient-form"
							className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
						>
							Tambah Pasien Baru
						</Link>
					</div>

					{filteredPatients.length === 0 ? (
						<div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
							Tidak ada data pasien yang sesuai dengan filter.
						</div>
					) : (
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
									{filteredPatients.map((patient) => (
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
												{new Date(patient.createdAt).toLocaleDateString(
													"id-ID",
													{
														year: "numeric",
														month: "short",
														day: "numeric",
													}
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<div className="flex justify-end space-x-2">
													<Link
														to={`/analysis/${patient.id}`}
														className="text-blue-600 hover:text-blue-900"
													>
														Lihat
													</Link>
													{isAuthenticated && (
														<button
															onClick={() => handleDeletePatient(patient.id)}
															className="text-red-600 hover:text-red-900"
														>
															Hapus
														</button>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default HistoryPage;
