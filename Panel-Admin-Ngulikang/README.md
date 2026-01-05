# Ngulikang Dashboard Admin

Panel admin modern untuk manajemen platform Ngulikang. Dibangun menggunakan React, Material UI, dan Vite untuk performa yang cepat dan responsif.

## 🚀 Fitur Utama

- **Dashboard**: Statistik visual real-time untuk lamaran masuk, tukang aktif, dan transaksi.
- **Manajemen Lamaran**: Pipeline pelacakan status lamaran kerja (Masuk, Interview, Diterima).
- **Kelola Pengguna**:
  - **Akun User**: Manajemen data pengguna aplikasi.
  - **Akun Tukang**: Verifikasi dan manajemen status mitra tukang.
- **Marketplace**: Kelola listing produk, harga, dan stok barang.
- **Keuangan**: Monitor laporan gaji dan arus kas transaksi.
- **Live Chat**: Pusat komunikasi untuk support dan koordinasi.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **UI Framework**: Material UI (MUI) v5
- **Routing**: React Router DOM
- **Icons**: Ant Design Icons
- **Build Tool**: Vite

## 💻 Cara Menjalankan Project

Pastikan Node.js sudah terinstall di komputer kamu.

1. **Install Dependencies**
   Jalankan perintah berikut di terminal:
   ```bash
   npm install
   # atau jika menggunakan yarn
   yarn install
   ```

2. **Jalankan Mode Development**
   Untuk memulai local server:
   ```bash
   npm run dev
   ```
   Akses di browser: `http://localhost:3000` (atau port yang muncul di terminal).

3. **Build untuk Production**
   Untuk membuat file siap deploy:
   ```bash
   npm run build
   ```

## 📂 Struktur Folder Penting

- `/src/pages` - Berisi file halaman utama (Dashboard, Lamaran, Akun, dll).
- `/src/components` - Komponen UI yang digunakan berulang (Cards, Inputs, dll).
- `/src/layout` - Struktur layout utama (Sidebar, Header, Drawer).
- `/src/menu-items` - Konfigurasi menu navigasi sidebar.
- `/src/themes` - Konfigurasi tema warna dan styling global.

---

**Ngulikang Team** &copy; 2026
