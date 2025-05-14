import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle, FiArrowLeft, FiHome } from "react-icons/fi";

const NotFoundPage = () => {
	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.5,
				when: "beforeChildren",
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.5 },
		},
	};

	const pulseVariants = {
		pulse: {
			scale: [1, 1.05, 1],
			opacity: [0.8, 1, 0.8],
			transition: {
				duration: 2,
				repeat: Infinity,
				repeatType: "reverse",
			},
		},
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<motion.div
				className="max-w-lg w-full space-y-8 text-center"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.div
					variants={pulseVariants}
					animate="pulse"
					className="mx-auto"
				>
					<div className="h-32 w-32 rounded-full bg-red-100 flex items-center justify-center mx-auto">
						<FiAlertCircle className="h-16 w-16 text-blood" />
					</div>
				</motion.div>

				<motion.h1
					className="text-4xl font-display font-bold text-gray-900 tracking-tight"
					variants={itemVariants}
				>
					404 - Halaman Tidak Ditemukan
				</motion.h1>

				<motion.p
					className="mt-4 text-lg text-gray-600 max-w-md mx-auto"
					variants={itemVariants}
				>
					Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
					dipindahkan.
				</motion.p>

				<motion.div
					className="mt-8 flex justify-center space-x-4"
					variants={itemVariants}
				>
					<Link
						to="/"
						className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
					>
						<FiHome className="mr-2 -ml-1" />
						Kembali ke Dashboard
					</Link>

					<button
						onClick={() => window.history.back()}
						className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
					>
						<FiArrowLeft className="mr-2 -ml-1" />
						Kembali ke Halaman Sebelumnya
					</button>
				</motion.div>

				<motion.div className="mt-12" variants={itemVariants}>
					<img
						src="/logo.png"
						alt="Bloodaldo Logo"
						className="h-16 w-16 mx-auto"
					/>
					<p className="mt-2 text-sm text-gray-500">
						&copy; {new Date().getFullYear()} Bloodaldo. All rights reserved.
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default NotFoundPage;
