import { useState } from 'react';
import logo from '../assets/LOGO/TERANG.png';
import { UploadIcon, UserIcon, WalletIcon, CalendarIcon, ClockIcon } from '../components/Icons';
import '../styles/TrackerProyek.css';

function TrackerProyek({ onLogout, onNavigate }) {
    const [activeMenu, setActiveMenu] = useState('tracker');
    const [selectedProject, setSelectedProject] = useState(0);
    const [progressValue, setProgressValue] = useState(91);
    const [progressNote, setProgressNote] = useState('');
    const [uploadedPhoto, setUploadedPhoto] = useState(null);

    // Projects data
    const projects = [
        {
            id: 1,
            nama: 'Renovasi Kamar Mandi',
            client: 'Budi Santoso',
            status: 'Berlangsung',
            progress: 85,
            mulai: '15 Des 2024',
            selesai: '5 Jan 2025',
            budget: 'Rp 4.500.000',
            deadline: '5 Jan 2025'
        },
        {
            id: 2,
            nama: 'Perbaikan Atap Rumah',
            client: 'Siti Aminah',
            status: 'Selesai',
            progress: 100,
            mulai: '10 Des 2024',
            selesai: '19 Des 2024',
            budget: 'Rp 3.500.000',
            deadline: '19 Des 2024'
        },
        {
            id: 3,
            nama: 'Pengecatan Rumah',
            client: 'Joko Widodo',
            status: 'Berlangsung',
            progress: 45,
            mulai: '20 Des 2024',
            selesai: '-',
            budget: 'Rp 5.500.000',
            deadline: '10 Jan 2025'
        }
    ];

    const riwayatUpdates = [
        {
            tanggal: '28 Des 2024',
            progress: 85,
            keterangan: 'Pemasangan keramik lantai 90% selesai. Tinggal grouting dan finishing.'
        },
        {
            tanggal: '22 Des 2024',
            progress: 60,
            keterangan: 'Instalasi pipa air bersih dan kotor sudah selesai. Mulai waterproofing.'
        },
        {
            tanggal: '18 Des 2024',
            progress: 30,
            keterangan: 'Pembongkaran keramik lama selesai. Mulai perbaikan struktur.'
        }
    ];

    const currentProject = projects[selectedProject];

    const handlePhotoUpload = (e) => {
        console.log('Photo upload triggered');
        const file = e.target.files[0];
        console.log('Selected file:', file);

        if (file && file.type.startsWith('image/')) {
            console.log('Valid image file detected');
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('FileReader finished, setting photo');
                setUploadedPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Silakan pilih file gambar (PNG, JPG, dll)');
        }
    };

    const handleSaveProgress = (e) => {
        e.preventDefault();
        const photoText = uploadedPhoto ? '\nFoto: Terlampir' : '';
        alert(`Progress tersimpan!\nProyek: ${currentProject.nama}\nProgress: ${progressValue}%\nCatatan: ${progressNote}${photoText}`);
        setProgressNote('');
        setUploadedPhoto(null);
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
                        onClick={() => setActiveMenu('tracker')}
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
                    <h2>Tracker Proyek</h2>
                </header>

                {/* Project Cards */}
                <div className="project-cards">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`project-card ${selectedProject === index ? 'active' : ''}`}
                            onClick={() => setSelectedProject(index)}
                        >
                            <div className="project-card-header">
                                <h3 className="project-card-title">{project.nama}</h3>
                                <span className={`project-status ${project.status.toLowerCase()}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="project-client">{project.client}</p>
                            <div className="project-card-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{project.progress}%</span>
                            </div>
                            <div className="project-card-footer">
                                <span className="project-date">{project.mulai}</span>
                                <span className="project-budget">{project.budget}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="tracker-grid">
                    {/* Detail Proyek */}
                    <div className="tracker-section detail-section">
                        <h3 className="section-title">Detail Proyek</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="detail-icon client-icon">
                                    <UserIcon size={20} color="#3B82F6" />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Client</span>
                                    <span className="detail-value">{currentProject.client}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-icon budget-icon">
                                    <WalletIcon size={20} color="#FF6600" />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Budget</span>
                                    <span className="detail-value">{currentProject.budget}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-icon date-icon">
                                    <CalendarIcon size={20} color="#22c55e" />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Mulai</span>
                                    <span className="detail-value">{currentProject.mulai}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-icon deadline-icon">
                                    <ClockIcon size={20} color="#a855f7" />
                                </div>
                                <div className="detail-content">
                                    <span className="detail-label">Target Selesai</span>
                                    <span className="detail-value">{currentProject.deadline}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Riwayat Update */}
                    <div className="tracker-section riwayat-section">
                        <h3 className="section-title">Riwayat Update</h3>
                        <div className="riwayat-list">
                            {riwayatUpdates.map((update, index) => (
                                <div key={index} className="riwayat-item">
                                    <div className="riwayat-marker">
                                        <div className="riwayat-dot"></div>
                                        {index < riwayatUpdates.length - 1 && <div className="riwayat-line"></div>}
                                    </div>
                                    <div className="riwayat-content">
                                        <div className="riwayat-header">
                                            <span className="riwayat-date">{update.tanggal}</span>
                                            <span className="riwayat-progress">{update.progress}%</span>
                                        </div>
                                        <p className="riwayat-text">{update.keterangan}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div >
                </div >

                {/* Upload Progress */}
                < div className="tracker-section upload-section" >
                    <h3 className="section-title">Upload Progress Proyek</h3>

                    <form onSubmit={handleSaveProgress}>
                        <div className="progress-slider-container">
                            <label className="slider-label">Progress Pekerjaan ({progressValue}%)</label>
                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progressValue}
                                    onChange={(e) => setProgressValue(Number(e.target.value))}
                                    className="progress-slider"
                                />
                                <span className="slider-value">{progressValue}%</span>
                            </div>
                        </div>

                        <div className="progress-note-container">
                            <label className="note-label">Catatan Progress</label>
                            <textarea
                                className="progress-textarea"
                                placeholder="Jelaskan progress pekerjaan yang sudah dilakukan..."
                                value={progressNote}
                                onChange={(e) => setProgressNote(e.target.value)}
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="photo-upload-container">
                            <label className="upload-label">
                                Upload Foto Progress
                                {uploadedPhoto && <span style={{ color: '#22c55e', marginLeft: '8px' }}>✓ Foto terupload</span>}
                            </label>
                            {!uploadedPhoto ? (
                                <div className="upload-area">
                                    <div className="upload-icon">
                                        <UploadIcon size={48} />
                                    </div>
                                    <p className="upload-text">Klik untuk upload foto</p>
                                    <p className="upload-hint">PNG, JPG hingga 10MB</p>
                                    <input
                                        type="file"
                                        className="file-input"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                </div>
                            ) : (
                                <div className="photo-preview-container">
                                    <img src={uploadedPhoto} alt="Preview" className="photo-preview" />
                                    <button
                                        type="button"
                                        className="remove-photo-btn"
                                        onClick={() => setUploadedPhoto(null)}
                                    >
                                        ✕ Hapus Foto
                                    </button>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="save-progress-btn">
                            Simpan Update Progress
                        </button>
                    </form>
                </div >
            </main >
        </div >
    );
}

export default TrackerProyek;

