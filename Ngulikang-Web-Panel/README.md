# 🏗️ Ngulikang - Portal Tukang

Web panel modern untuk tukang bangunan. Kelola proyek, chat dengan klien, tracking progress, sampai ambil gaji - semua dalam satu tempat.

**by IMPJTEN**

---

## 🎯 Kenapa Ada Aplikasi Ini?

Tukang bangunan juga butuh tools yang proper untuk manage pekerjaan mereka. Bukan cuma developer aja yang bisa pake aplikasi keren 😎

Platform ini dibuat buat ngebantu para tukang:
- Track progress proyek real-time
- Komunikasi sama klien lebih gampang
- Kelola pembayaran dengan rapi
- Dokumentasi progress pake foto

## ✨ Fitur Utama

### 📊 Dashboard
Overview lengkap: total proyek, client, rating, dan income bulan ini. Semua data penting langsung keliatan.

### 💬 Chat & Negosiasi
Langsung chat sama klien dari dalam aplikasi. Nego harga, diskusi detail proyek, semua tercatat rapi.

### 📍 Tracker Proyek
- Update progress pakai slider (0-100%)
- Upload foto dokumentasi kerja
- Catat detail pekerjaan yang udah dilakukan
- Riwayat update tersimpan otomatis

### 💵 Ambil Gaji
Tarik dana dari proyek yang udah selesai. Semua transaksi ada historynya, transparent.

## 🛠️ Tech Stack

- **React** - UI framework
- **Three.js** - Background effects (LiquidEther)
- **CSS** - Styling, no framework (clean & custom)
- **JavaScript (ES6+)** - Logic

## 🚀 Cara Jalanin

1. Install dependencies
```bash
npm install
```

2. Jalanin development server
```bash
npm start
```

3. Buka browser ke `http://localhost:3000`

4. Login page akan muncul - tinggal masukkin email & password

## 📁 Struktur Project

```
src/
├── components/          # Reusable components
│   ├── Icons.jsx       # SVG icons
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── effects/        # Visual effects
├── pages/              # Halaman utama
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── ChatNegosiasi.jsx
│   ├── TrackerProyek.jsx
│   └── AmbilGaji.jsx
├── styles/             # CSS per page
├── assets/             # Images & logo
└── App.js              # Main app routing
```

## 🎨 Design Philosophy

Design ini dibuat dengan fokus:

- **Clean & Professional** - Bukan template gratisan yang norak
- **Dark Theme** - Orange accent (#FF6600) biar ga ngebosenin
- **No Clutter** - Semua fitur accessible tapi ga berantakan
- **Mobile-Ready** - Responsive (walau belum 100% dioptimize)

## 🔐 Login Flow

1. User buka app → langsung ke halaman Login
2. Input credentials → klik "Masuk"
3. Redirect ke Dashboard
4. Navigation antar pages lewat sidebar
5. Logout → balik ke Login page

Note: Untuk sekarang belum ada backend, jadi login form masih dummy. Tinggal klik Masuk langsung masuk.


## 📝 TODO / Future Plans

- [ ] Backend integration (API)
- [ ] Real authentication
- [ ] Database untuk nyimpen data
- [ ] Notifikasi real-time
- [ ] Export laporan ke PDF
- [ ] Multi-language support
- [ ] PWA (bisa di-install di HP)
- [ ] Dark mode toggle (sekarang fixed dark)


## 📄 License

This project is created for educational purposes.

---

**Built with ☕ by IMPJTEN**

