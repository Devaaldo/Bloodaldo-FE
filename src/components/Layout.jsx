import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Animation variants for main content
	const contentVariants = {
		expanded: {
			marginLeft: "0rem",
			width: "100%",
			transition: { duration: 0.3 },
		},
		collapsed: {
			marginLeft: "16rem", // 64px (sidebar width)
			width: "calc(100% - 16rem)",
			transition: { duration: 0.3 },
		},
	};

	return (
		<div className="h-screen flex flex-col bg-gray-50">
			<Navbar toggleSidebar={toggleSidebar} />

			<div className="flex flex-1 overflow-hidden">
				<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

				<motion.main
					className="flex-1 overflow-auto p-6"
					variants={contentVariants}
					initial={false}
					animate={
						isSidebarOpen && window.innerWidth >= 1024
							? "collapsed"
							: "expanded"
					}
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={location.pathname}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="h-full"
						>
							<Outlet />
						</motion.div>
					</AnimatePresence>
				</motion.main>
			</div>
		</div>
	);
};

export default Layout;
