import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import PatientFormPage from "./pages/PatientFormPage";
import AnalysisPage from "./pages/AnalysisPage";
import HistoryPage from "./pages/HistoryPage";
import ReportsPage from "./pages/ReportsPage";
import AdminLogin from "./pages/AdminLogin";
import { AuthProvider } from "./context/AuthContext";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="flex flex-col min-h-screen bg-gray-50">
					<Navbar />
					<main className="flex-grow container mx-auto px-4 py-8">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/patient-form" element={<PatientFormPage />} />
							<Route path="/analysis/:id" element={<AnalysisPage />} />
							<Route path="/history" element={<HistoryPage />} />
							<Route path="/reports" element={<ReportsPage />} />
							<Route path="/admin" element={<AdminLogin />} />
						</Routes>
					</main>
					<Footer />
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
