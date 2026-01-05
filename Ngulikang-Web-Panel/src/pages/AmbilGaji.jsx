import { useState } from 'react';
import logo from '../assets/LOGO/TERANG.png';
import '../styles/AmbilGaji.css';

function AmbilGaji({ onLogout, onNavigate }) {
    const [activeMenu, setActiveMenu] = useState('gaji');
    const [selectedProject, setSelectedProject] = useState('');
    const [jumlahPenarikan, setJumlahPenarikan] = useState('');
    const [nomorRekening, setNomorRekening] = useState('');

    // Data summary
    const saldoTersedia = 8000000;
    const pendingWithdraw = 8500000;
    const totalPendapatan = 28500000;

    // Available projects for withdrawal
    const danaProyek = [
        { nama: 'Renovasi Kamar Mandi', client: 'Budi Santoso', amount: 4500000 },
        { nama: 'Perbaikan Atap Rumah', client: 'Siti Aminah', amount: 3500000 }
    ];

    // Withdrawal history
    const riwayatPenarikan = [
        {
            proyek: 'Instalasi Listrik',
            tanggal: '20 Des 2024',
            amount: 2800000,
            status: 'Selesai'
        },
        {
            proyek: 'Perbaikan Atap Rumah',
            tanggal: '18 Des 2024',
            amount: 3500000,
            status: 'Pending'
        }
    ];

    const formatRupiah = (amount) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProject || !jumlahPenarikan || !nomorRekening) {
            alert('Mohon lengkapi semua field!');
            return;
        }
        alert(`Pengajuan penarikan berhasil!\nProyek: ${selectedProject}\nJumlah: ${formatRupiah(parseInt(jumlahPenarikan))}\nRekening: ${nomorRekening}`);
        // Reset form
        setSelectedProject('');
        setJumlahPenarikan('');
        setNomorRekening('');
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
                        onClick={() => onNavigate && onNavigate('dashboard')}
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
                        onClick={() => setActiveMenu('gaji')}
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
                    <h2>Ambil Gaji</h2>
                </header>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card saldo-card">
                        <div className="summary-icon">💰</div>
                        <div className="summary-content">
                            <h3 className="summary-title">Saldo Tersedia</h3>
                            <p className="summary-value">{formatRupiah(saldoTersedia)}</p>
                            <p className="summary-subtitle">Dapat ditarik kapan saja</p>
                        </div>
                    </div>

                    <div className="summary-card pending-card">
                        <div className="summary-icon">⏳</div>
                        <div className="summary-content">
                            <h3 className="summary-title">Pending Withdraw</h3>
                            <p className="summary-value">{formatRupiah(pendingWithdraw)}</p>
                            <p className="summary-subtitle">Menunggu approval</p>
                        </div>
                    </div>

                    <div className="summary-card total-card">
                        <div className="summary-icon">📈</div>
                        <div className="summary-content">
                            <h3 className="summary-title">Total Pendapatan</h3>
                            <p className="summary-value">{formatRupiah(totalPendapatan)}</p>
                            <p className="summary-subtitle">Sepanjang waktu</p>
                        </div>
                    </div>
                </div>

                <div className="gaji-grid">
                    {/* Tarik Gaji Form */}
                    <div className="gaji-section withdraw-section">
                        <h3 className="section-title">Tarik Gaji</h3>
                        <p className="section-subtitle">Ajukan penarikan dana dari proyek yang sudah selesai</p>

                        <form onSubmit={handleSubmit} className="withdraw-form">
                            <div className="form-group">
                                <label htmlFor="project">Pilih Proyek</label>
                                <select
                                    id="project"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Pilih proyek...</option>
                                    {danaProyek.map((proyek, index) => (
                                        <option key={index} value={proyek.nama}>
                                            {proyek.nama} - {formatRupiah(proyek.amount)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount">Jumlah Penarikan</label>
                                <input
                                    type="number"
                                    id="amount"
                                    placeholder="0"
                                    value={jumlahPenarikan}
                                    onChange={(e) => setJumlahPenarikan(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="rekening">Nomor Rekening</label>
                                <input
                                    type="text"
                                    id="rekening"
                                    placeholder="Contoh: 1234567890 (BCA)"
                                    value={nomorRekening}
                                    onChange={(e) => setNomorRekening(e.target.value)}
                                    className="form-input"
                                    required
                                />
                                <p className="input-hint">Masukkan nomor rekening dan nama bank</p>
                            </div>

                            <button type="submit" className="submit-withdraw-btn">
                                <span>💳</span>
                                Ajukan Penarikan
                            </button>
                        </form>
                    </div>

                    {/* Dana Tersedia */}
                    <div className="gaji-section dana-section">
                        <h3 className="section-title">Dana Tersedia</h3>

                        <div className="dana-list">
                            {danaProyek.map((proyek, index) => (
                                <div key={index} className="dana-item">
                                    <div className="dana-info">
                                        <h4 className="dana-project">{proyek.nama}</h4>
                                        <p className="dana-client">{proyek.client}</p>
                                    </div>
                                    <div className="dana-amount">{formatRupiah(proyek.amount)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Riwayat Penarikan */}
                <div className="gaji-section history-section">
                    <h3 className="section-title">Riwayat Penarikan</h3>
                    <p className="section-subtitle">Histori permintaan penarikan dana</p>

                    <div className="history-list">
                        {riwayatPenarikan.map((item, index) => (
                            <div key={index} className="history-item">
                                <div className={`history-status ${item.status.toLowerCase()}`}>
                                    {item.status === 'Selesai' ? '✓' : '⏳'}
                                </div>
                                <div className="history-content">
                                    <div className="history-header">
                                        <h4 className="history-project">{item.proyek}</h4>
                                        <span className="history-amount">{formatRupiah(item.amount)}</span>
                                    </div>
                                    <div className="history-footer">
                                        <span className="history-date">{item.tanggal}</span>
                                        <span className={`history-badge ${item.status.toLowerCase()}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AmbilGaji;

