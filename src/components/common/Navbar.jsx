import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isAuthenticated, logout } = useAuth();
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname === path
			? "font-bold text-blue-600"
			: "text-gray-700";
	};

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="bg-white shadow-md">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center py-4">
					<Link to="/" className="flex items-center space-x-3">
						<img src="/logo.png" alt="Bloodaldo Logo" className="h-10 w-10" />
						<span className="text-xl font-bold text-blue-700">Bloodaldo</span>
					</Link>

					{/* Desktop menu */}
					<div className="hidden md:flex space-x-8">
						<Link
							to="/"
							className={`${isActive(
								"/"
							)} hover:text-blue-500 transition-colors`}
						>
							Home
						</Link>
						<Link
							to="/patient-form"
							className={`${isActive(
								"/patient-form"
							)} hover:text-blue-500 transition-colors`}
						>
							Form Data Pasien
						</Link>
						<Link
							to="/history"
							className={`${isActive(
								"/history"
							)} hover:text-blue-500 transition-colors`}
						>
							Riwayat Diagnosa
						</Link>
						<Link
							to="/reports"
							className={`${isActive(
								"/reports"
							)} hover:text-blue-500 transition-colors`}
						>
							Laporan
						</Link>
						{isAuthenticated ? (
							<button
								onClick={logout}
								className="text-red-600 hover:text-red-800 transition-colors"
							>
								Logout
							</button>
						) : (
							<Link
								to="/admin"
								className={`${isActive(
									"/admin"
								)} hover:text-blue-500 transition-colors`}
							>
								Admin
							</Link>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={toggleMenu}
							className="text-gray-500 hover:text-blue-500 focus:outline-none"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{isOpen && (
					<div className="md:hidden py-4 space-y-4">
						<Link
							to="/"
							className={`${isActive(
								"/"
							)} block hover:text-blue-500 transition-colors`}
							onClick={() => setIsOpen(false)}
						>
							Home
						</Link>
						<Link
							to="/patient-form"
							className={`${isActive(
								"/patient-form"
							)} block hover:text-blue-500 transition-colors`}
							onClick={() => setIsOpen(false)}
						>
							Form Data Pasien
						</Link>
						<Link
							to="/history"
							className={`${isActive(
								"/history"
							)} block hover:text-blue-500 transition-colors`}
							onClick={() => setIsOpen(false)}
						>
							Riwayat Diagnosa
						</Link>
						<Link
							to="/reports"
							className={`${isActive(
								"/reports"
							)} block hover:text-blue-500 transition-colors`}
							onClick={() => setIsOpen(false)}
						>
							Laporan
						</Link>
						{isAuthenticated ? (
							<button
								onClick={() => {
									logout();
									setIsOpen(false);
								}}
								className="block text-red-600 hover:text-red-800 transition-colors"
							>
								Logout
							</button>
						) : (
							<Link
								to="/admin"
								className={`${isActive(
									"/admin"
								)} block hover:text-blue-500 transition-colors`}
								onClick={() => setIsOpen(false)}
							>
								Admin
							</Link>
						)}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
