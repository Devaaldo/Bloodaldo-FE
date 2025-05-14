const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-blue-800 text-white py-6">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="flex items-center mb-4 md:mb-0">
						<img
							src="/logo.png"
							alt="Bloodaldo Logo"
							className="h-8 w-8 mr-2"
						/>
						<span className="text-xl font-bold">Bloodaldo</span>
					</div>

					<div className="text-center md:text-right">
						<p className="text-sm">
							Sistem Pakar untuk Deteksi Dini Penyakit Melalui Data Bank Darah
						</p>
						<p className="text-xs mt-2">
							© {currentYear} Bloodaldo. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
