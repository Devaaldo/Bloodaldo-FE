# Bloodaldo Frontend

![Bloodaldo Logo](public/logo.png)

## 📋 Deskripsi Proyek

Bloodaldo adalah sistem pakar untuk deteksi dini penyakit melalui analisis data bank darah. Aplikasi ini membantu tenaga medis dan profesional kesehatan untuk melakukan diagnosa awal berdasarkan hasil tes darah pasien menggunakan pendekatan sistem pakar (expert system).

## 🛠️ Teknologi yang Digunakan

- **React** (dengan Vite sebagai build tool)
- **Tailwind CSS** untuk styling
- **Reactbits** untuk komponen UI dan visualisasi
- **React Router** untuk navigasi
- **Axios** untuk HTTP requests
- **React-to-PDF** & **React-CSV** untuk export laporan

## ⚙️ Instalasi dan Setup

1. Clone repository

```bash
git clone https://github.com/username/bloodaldo-frontend.git
cd bloodaldo-frontend
```

2. Install dependencies

```bash
npm install
```

3. Konfigurasi environment variables

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi backend

4. Jalankan aplikasi untuk development

```bash
npm run dev
```

5. Build untuk production

```bash
npm run build
```

## 📁 Struktur Proyek

```
bloodaldo-frontend/
├── public/
│   ├── logo.png
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── charts/
│   │   └── layout/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── PatientForm.jsx
│   │   ├── Analysis.jsx
│   │   ├── DiagnosisHistory.jsx
│   │   ├── Reports.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── expertSystem.js
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .eslintrc.js
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🌟 Fitur

1. **Halaman Utama (Home)**

   - Logo dan nama "Bloodaldo"
   - Penjelasan singkat tentang sistem
   - Navigasi ke fitur-fitur utama

2. **Form Data Pasien**

   - Input data pasien (nama, umur, jenis kelamin, riwayat penyakit)
   - Input hasil pemeriksaan darah (HB, WBC, RBC, dll.)
   - Validasi form untuk memastikan data valid

3. **Analisis (Sistem Pakar)**

   - Proses data menggunakan metode rule-based atau decision tree
   - Menampilkan hasil diagnosis berdasarkan input
   - Visualisasi hasil dengan chart dari reactbits

4. **Riwayat Diagnosa**

   - Tabel daftar pasien dan hasil diagnosa
   - Fitur pencarian dan filter berdasarkan berbagai parameter
   - Pagination untuk menampilkan banyak data

5. **Laporan**

   - Download laporan dalam format CSV atau PDF
   - Statistik analitik (distribusi penyakit, persentase berdasarkan usia/jenis kelamin)
   - Visualisasi data dengan grafik

6. **Admin Dashboard**
   - Login/autentikasi untuk admin
   - Manajemen data pengguna
   - Konfigurasi parameter sistem pakar

## 🚀 Penggunaan

Berikut adalah cara menggunakan aplikasi:

1. Buka halaman home untuk melihat gambaran umum sistem
2. Isi form data pasien dengan data yang dibutuhkan
3. Lihat hasil analisis sistem pakar
4. Akses riwayat diagnosa untuk melihat data pasien sebelumnya
5. Generate dan download laporan sesuai kebutuhan
6. Admin dapat login untuk mengakses dashboard khusus

## 📝 Metode Sistem Pakar

Sistem ini menggunakan kombinasi metode **Rule-Based System** dan **Decision Tree** untuk melakukan analisis data darah:

- **Rule-Based**: Menggunakan aturan "if-then" berdasarkan parameter darah untuk mendiagnosa kemungkinan penyakit
- **Decision Tree**: Menganalisis hasil tes darah melalui pohon keputusan untuk menentukan kemungkinan kondisi medis

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk berkontribusi:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request
