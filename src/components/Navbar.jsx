import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { FiMenu, FiBell, FiUser, FiLogOut } from "react-icons/fi";

const Navbar = ({ toggleSidebar }) => {
	const { user, logout } = useAuth();
	const [showDropdown, setShowDropdown] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	// Animation variants
	const dropdownVariants = {
		hidden: { opacity: 0, y: -10 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
	};

	const logoVariants = {
		initial: { scale: 1 },
		hover: { scale: 1.05, transition: { duration: 0.2 } },
	};

	return (
		<nav className="bg-white shadow-md px-4 py-2">
			<div className="flex justify-between items-center">
				<div className="flex items-center">
					<button
						onClick={toggleSidebar}
						className="mr-4 lg:hidden text-gray-500 hover:text-blood"
					>
						<FiMenu size={24} />
					</button>

					<Link to="/">
						<motion.div
							className="flex items-center"
							variants={logoVariants}
							initial="initial"
							whileHover="hover"
						>
							<img src="/logo.png" alt="Bloodaldo Logo" className="h-10 w-10" />
							<span className="ml-2 font-display font-bold text-xl text-blood">
								Bloodaldo
							</span>
						</motion.div>
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					<div className="relative">
						<button
							className="p-2 rounded-full hover:bg-gray-100"
							onClick={() => setShowDropdown(!showDropdown)}
						>
							<div className="relative">
								<FiBell size={20} className="text-gray-600" />
								{notifications.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-blood text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
										{notifications.length}
									</span>
								)}
							</div>
						</button>

						{showDropdown && (
							<motion.div
								className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10"
								variants={dropdownVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								<div className="px-4 py-2 border-b">
									<h3 className="text-sm font-semibold">Notifikasi</h3>
								</div>
								{notifications.length === 0 ? (
									<div className="px-4 py-3 text-sm text-gray-500">
										Tidak ada notifikasi
									</div>
								) : (
									notifications.map((notification, index) => (
										<div
											key={index}
											className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100"
										>
											<p className="text-sm">{notification.message}</p>
											<p className="text-xs text-gray-500 mt-1">
												{notification.time}
											</p>
										</div>
									))
								)}
							</motion.div>
						)}
					</div>

					<div className="relative">
						<button
							className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
							onClick={() => setShowDropdown(!showDropdown)}
						>
							<div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
								<FiUser size={18} className="text-gray-600" />
							</div>
							<span className="text-sm font-medium hidden md:block">
								{user?.name || "User"}
							</span>
						</button>

						{showDropdown && (
							<motion.div
								className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
								variants={dropdownVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								<Link
									to="/profile"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onClick={() => setShowDropdown(false)}
								>
									Profil
								</Link>
								<button
									onClick={handleLogout}
									className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
								>
									<FiLogOut size={16} className="mr-2" />
									Keluar
								</button>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
