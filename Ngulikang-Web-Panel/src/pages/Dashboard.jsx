import { useState } from 'react';
import '../styles/Dashboard.css';
import logo from '../assets/LOGO/TERANG.png';

function Dashboard({ onLogout, onNavigate }) {
    const [activeMenu, setActiveMenu] = useState('dashboard');

    // Dummy data
    const stats = [
        { title: 'Total Proyek', value: '24', subtitle: '+3 Bulan ini' },
        { title: 'Client Dilayani', value: '18', subtitle: 'Total client' },
        { title: 'Rating Rata-rata', value: '4.8', subtitle: 'Dari 24 proyek' },
        { title: 'Pembayaran Bulan Ini', value: 'Rp 8.5jt', subtitle: '+15% dari bulan lalu' }
    ];

    const kinerja = [
        { bulan: 'Sep 2024', jumlah: 4, progress: 40 },
        { bulan: 'Okt 2024', jumlah: 5, progress: 50 },
        { bulan: 'Nov 2024', jumlah: 7, progress: 70 },
        { bulan: 'Des 2024', jumlah: 8, progress: 80 }
    ];

    const ratings = [
        {
            nama: 'Budi Santoso',
            tanggal: '2 Jan 2024',
            rating: 5,
            komentar: 'Kerja sangat rapi dan profesional!'
        },
        {
            nama: 'Siti Aminah',
            tanggal: '30 Des 2024',
            rating: 5,
            komentar: 'Sangat puas dengan hasilnya. Terima kasih!'
        },
        {
            nama: 'Ahmad Ibrahim',
            tanggal: '28 Des 2024',
            rating: 4,
            komentar: 'Bagus, tapi ada sedikit keterlambatan.'
        }
    ];

    const proyekTerbaru = [
        {
            nama: 'Renovasi Kamar Mandi',
            client: 'Budi Santoso',
            progress: 85,
            status: 'Dalam Pengerjaan'
        }
    ];

    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Ngulikang" className="logo-img" />
                    <p className="logo-subtitle">Portal Tukang</p>
                </div>

                <div className="user-profile">
                    <div className="avatar">AR</div>
                    <div className="user-info">
                        <h3>Ahmad Rizki</h3>
                        <p>demo@tukang.ngulikang.com</p>
                    </div>
                </div>

                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('dashboard')}
                    >

                        Dashboard
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'chat' ? 'active' : ''}`}
                        onClick={() => onNavigate && onNavigate('chat')}
                    >

                        Chat & Negosiasi
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'tracker' ? 'active' : ''}`}
                        onClick={() => onNavigate && onNavigate('tracker')}
                    >

                        Tracker Proyek
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'gaji' ? 'active' : ''}`}
                        onClick={() => onNavigate && onNavigate('gaji')}
                    >

                        Ambil Gaji
                    </button>
                </nav>

                <button className="logout-btn" onClick={onLogout}>
                    Keluar
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="dashboard-header">
                    <h2>Dashboard</h2>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-content">
                                <h3 className="stat-title">{stat.title}</h3>
                                <p className="stat-value">{stat.value}</p>
                                <p className="stat-subtitle">{stat.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-grid">
                    {/* Kinerja Bulanan */}
                    <div className="dashboard-section kinerja-section">
                        <div className="section-header">
                            <h3>Kinerja Bulanan</h3>
                            <p className="section-subtitle">Proyek diselesaikan per bulan</p>
                        </div>
                        <div className="kinerja-list">
                            {kinerja.map((item, index) => (
                                <div key={index} className="kinerja-item">
                                    <div className="kinerja-label">
                                        <span className="kinerja-bulan">{item.bulan}</span>
                                        <span className="kinerja-jumlah">{item.jumlah} proyek</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${item.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="trend-indicator">
                            <span className="trend-icon">📈</span>
                            <span className="trend-text">Trend naik 15%</span>
                        </div>
                    </div>

                    {/* Rating Terbaru */}
                    <div className="dashboard-section rating-section">
                        <div className="section-header">
                            <h3>Rating Terbaru</h3>
                            <p className="section-subtitle">Ulasan dari client</p>
                        </div>
                        <div className="rating-list">
                            {ratings.map((review, index) => (
                                <div key={index} className="rating-item">
                                    <div className="rating-header">
                                        <div>
                                            <h4 className="client-name">{review.nama}</h4>
                                            <p className="review-date">{review.tanggal}</p>
                                        </div>
                                        <div className="stars">{renderStars(review.rating)}</div>
                                    </div>
                                    <p className="review-comment">{review.komentar}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Proyek Terbaru */}
                <div className="dashboard-section proyek-section">
                    <div className="section-header">
                        <h3>Proyek Terbaru</h3>
                        <p className="section-subtitle">Status proyek yang sedang dikerjakan</p>
                    </div>
                    {proyekTerbaru.map((proyek, index) => (
                        <div key={index} className="proyek-item">
                            <div className="proyek-info">
                                <h4 className="proyek-nama">{proyek.nama}</h4>
                                <p className="proyek-client">Client: {proyek.client}</p>
                            </div>
                            <div className="proyek-progress">
                                <div className="progress-header">
                                    <span className="progress-label">{proyek.status}</span>
                                    <span className="progress-percentage">{proyek.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${proyek.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
