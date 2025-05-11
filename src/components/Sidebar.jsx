import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
	FiHome,
	FiFileText,
	FiActivity,
	FiClock,
	FiDownload,
	FiSettings,
	FiUsers,
	FiDatabase,
	FiSliders,
} from "react-icons/fi";

const Sidebar = ({ isOpen, toggleSidebar }) => {
	const location = useLocation();
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	// Animation variants
	const sidebarVariants = {
		open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
		closed: {
			x: "-100%",
			transition: { type: "spring", stiffness: 300, damping: 30 },
		},
	};

	const itemVariants = {
		open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
		closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
	};

	const navItems = [
		{
			path: "/",
			name: "Dashboard",
			icon: <FiHome size={20} />,
			forAdmin: false,
		},
		{
			path: "/blood-test",
			name: "Input Data Darah",
			icon: <FiFileText size={20} />,
			forAdmin: false,
		},
		{
			path: "/detection",
			name: "Deteksi Penyakit",
			icon: <FiActivity size={20} />,
			forAdmin: false,
		},
		{
			path: "/history",
			name: "Riwayat Pemeriksaan",
			icon: <FiClock size={20} />,
			forAdmin: false,
		},
		{
			path: "/reports",
			name: "Laporan",
			icon: <FiDownload size={20} />,
			forAdmin: false,
		},
		{
			path: "/admin",
			name: "Admin Dashboard",
			icon: <FiSettings size={20} />,
			forAdmin: true,
		},
		{
			path: "/admin/users",
			name: "Manajemen Pengguna",
			icon: <FiUsers size={20} />,
			forAdmin: true,
		},
		{
			path: "/admin/rules",
			name: "Aturan Sistem Pakar",
			icon: <FiDatabase size={20} />,
			forAdmin: true,
		},
		{
			path: "/admin/settings",
			name: "Pengaturan Sistem",
			icon: <FiSliders size={20} />,
			forAdmin: true,
		},
	];

	useEffect(() => {
		// Close sidebar on mobile when route changes
		const handleRouteChange = () => {
			if (window.innerWidth < 1024 && isOpen) {
				toggleSidebar();
			}
		};

		// Close sidebar when clicking outside on mobile
		const handleClickOutside = (e) => {
			if (window.innerWidth < 1024 && isOpen && !e.target.closest(".sidebar")) {
				toggleSidebar();
			}
		};

		window.addEventListener("click", handleClickOutside);
		return () => {
			window.removeEventListener("click", handleClickOutside);
		};
	}, [isOpen, toggleSidebar]);

	return (
		<motion.div
			className="sidebar fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 lg:translate-x-0"
			variants={sidebarVariants}
			initial={false}
			animate={isOpen ? "open" : "closed"}
			layout
		>
			<div className="p-6">
				<Link to="/" className="flex items-center justify-center mb-8">
					<motion.div className="flex items-center" variants={itemVariants}>
						<img src="/logo.png" alt="Bloodaldo Logo" className="h-12 w-12" />
						<span className="ml-2 font-display font-bold text-xl text-blood">
							Bloodaldo
						</span>
					</motion.div>
				</Link>

				<nav>
					<ul className="space-y-2">
						{navItems.map((item, index) => {
							// Skip admin routes for non-admin users
							if (item.forAdmin && !isAdmin) return null;

							const isActive = location.pathname === item.path;

							return (
								<motion.li key={index} variants={itemVariants}>
									<Link
										to={item.path}
										className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
											isActive
												? "bg-blood text-white"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										<span className="mr-3">{item.icon}</span>
										<span className="font-medium">{item.name}</span>
									</Link>
								</motion.li>
							);
						})}
					</ul>
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;
