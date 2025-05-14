import { Link } from "react-router-dom";

const Home = () => {
	const features = [
		{
			title: "Form Data Pasien",
			description:
				"Input data pasien beserta hasil pemeriksaan darah untuk mendapatkan diagnosa.",
			icon: (
				<svg
					className="w-8 h-8"
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
			),
			link: "/patient-form",
		},
		{
			title: "Analisis Sistem Pakar",
			description:
				"Algoritma diagnosa yang akurat berdasarkan parameter pemeriksaan darah.",
			icon: (
				<svg
					className="w-8 h-8"
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
			),
			link: "/history",
		},
		{
			title: "Riwayat Diagnosa",
			description:
				"Melihat daftar riwayat pasien yang telah didiagnosa sebelumnya.",
			icon: (
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
			link: "/history",
		},
		{
			title: "Laporan",
			description:
				"Download laporan dalam format CSV atau PDF untuk dokumentasi.",
			icon: (
				<svg
					className="w-8 h-8"
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
			),
			link: "/reports",
		},
	];

	return (
		<div className="min-h-[calc(100vh-200px)]">
			{/* Hero Section */}
			<section className="py-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg mb-12">
				<div className="container mx-auto px-4 text-center">
					<div className="flex justify-center mb-6">
						<img src="/logo.png" alt="Bloodaldo Logo" className="h-24 w-24" />
					</div>
					<h1 className="text-4xl font-bold text-white mb-4">Bloodaldo</h1>
					<p className="text-xl text-blue-100 mb-8">
						Sistem Pakar untuk Deteksi Dini Penyakit Melalui Data Bank Darah
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link
							to="/patient-form"
							className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-md shadow hover:bg-gray-100 transition"
						>
							Mulai Diagnosa
						</Link>
						<Link
							to="/history"
							className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-md shadow hover:bg-blue-900 transition"
						>
							Lihat Riwayat
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-12">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
						Fitur Utama
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<Link
								key={index}
								to={feature.link}
								className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition group"
							>
								<div className="text-blue-600 mb-4 group-hover:text-blue-700 transition">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.description}</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* About Section */}
			<section className="py-12 bg-gray-100 rounded-lg">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
						Tentang Bloodaldo
					</h2>
					<div className="max-w-3xl mx-auto text-center">
						<p className="text-lg text-gray-700 mb-6">
							Bloodaldo adalah sistem pakar berbasis web yang dirancang untuk
							membantu tenaga medis dalam mendeteksi potensi penyakit secara
							dini melalui analisis data bank darah. Dengan menggunakan
							algoritma dan rule-based system, Bloodaldo dapat memberikan
							prediksi akurat berdasarkan parameter hasil tes darah.
						</p>
						<p className="text-lg text-gray-700">
							Platform ini menyediakan antarmuka yang mudah digunakan untuk
							input data pasien, visualisasi hasil, penyimpanan riwayat
							diagnosa, serta pembuatan laporan untuk kebutuhan dokumentasi
							medis.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
