/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		// Pindahkan fontFamily ke sini (di luar extend)
		fontFamily: {
			sans: ["Inter", "sans-serif"],
			display: ["Poppins", "sans-serif"],
		},
		extend: {
			colors: {
				primary: {
					50: "#f0f9ff",
					100: "#e0f2fe",
					200: "#bae6fd",
					300: "#7dd3fc",
					400: "#38bdf8",
					500: "#0ea5e9",
					600: "#0284c7",
					700: "#0369a1",
					800: "#075985",
					900: "#0c4a6e",
					950: "#082f49",
				},
				secondary: {
					50: "#fdf2f8",
					100: "#fce7f3",
					200: "#fbcfe8",
					300: "#f9a8d4",
					400: "#f472b6",
					500: "#ec4899",
					600: "#db2777",
					700: "#be185d",
					800: "#9d174d",
					900: "#831843",
					950: "#500724",
				},
				// Warna khusus yang terkait dengan darah/medis
				blood: {
					light: "#ff6b6b",
					DEFAULT: "#e53e3e",
					dark: "#c53030",
				},
			},
			// fontFamily dihapus dari sini
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				bloodaldo: {
					primary: "#e53e3e",
					secondary: "#0ea5e9",
					accent: "#be185d",
					neutral: "#191D24",
					"base-100": "#ffffff",
					info: "#3ABFF8",
					success: "#36D399",
					warning: "#FBBD23",
					error: "#F87272",
				},
			},
			"light",
			"dark",
		],
	},
};
