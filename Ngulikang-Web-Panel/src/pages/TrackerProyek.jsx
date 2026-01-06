import { useState, useEffect } from 'react';
import logo from '../assets/LOGO/TERANG.png';
import { UploadIcon, UserIcon, WalletIcon, CalendarIcon, ClockIcon } from '../components/Icons';
import { api } from '../lib/api';
import '../styles/TrackerProyek.css';

function TrackerProyek({ onLogout, onNavigate }) {
    const [activeMenu, setActiveMenu] = useState('tracker');
    const [projects, setProjects] = useState([]);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [progressNote, setProgressNote] = useState('');
    const [uploadedPhoto, setUploadedPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Endpoint /api/orders handles filtering by role 'tukang' logic in backend
                const response = await api.get('/orders');
                const fetchedProjects = response.data;
                setProjects(fetchedProjects);

                if (fetchedProjects.length > 0) {
                    // Set initial progress value from latest update of first project
                    const latestUpdate = fetchedProjects[0].progressUpdates?.[0];
                    setProgressValue(latestUpdate ? latestUpdate.progressPercentage : 0);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const currentProject = projects[selectedProjectIndex];

    const handleProjectSelect = (index) => {
        setSelectedProjectIndex(index);
        const project = projects[index];
        const latestUpdate = project.progressUpdates?.[0];
        setProgressValue(latestUpdate ? latestUpdate.progressPercentage : 0);
        setProgressNote('');
        setUploadedPhoto(null);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Silakan pilih file gambar (PNG, JPG, dll)');
        }
    };

    const handleSaveProgress = async (e) => {
        e.preventDefault();
        if (!currentProject) return;

        try {
            await api.post(`/orders/${currentProject.id}/progress`, {
                progressPercentage: progressValue,
                notes: progressNote,
                images: uploadedPhoto ? [uploadedPhoto] : []
            });

            alert('Progress berhasil diupdate!');

            // Refresh projects
            const response = await api.get('/orders');
            setProjects(response.data);
            setProgressNote('');
            setUploadedPhoto(null);
        } catch (error) {
            console.error('Error updating progress:', error);
            alert('Gagal update progress');
        }
    };

    if (isLoading) return <div className="loading-container">Memuat data proyek...</div>;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Ngulikang" className="logo-img" />
                    <p className="logo-subtitle">Portal Tukang</p>
                </div>

                <div className="user-profile">
                    <div className="avatar">TK</div>
                    <div className="user-info">
                        <h3>Panel Tukang</h3>
                        <p>tukang@nguli.com</p>
                    </div>
                </div>

                <nav className="nav-menu">
                    <button className={`nav-item`} onClick={() => onNavigate && onNavigate('dashboard')}>Dashboard</button>
                    <button className={`nav-item`} onClick={() => onNavigate && onNavigate('chat')}>Chat & Negosiasi</button>
                    <button className={`nav-item active`} onClick={() => setActiveMenu('tracker')}>Tracker Proyek</button>
                    <button className={`nav-item`} onClick={() => onNavigate && onNavigate('gaji')}>Ambil Gaji</button>
                </nav>

                <button className="logout-btn" onClick={onLogout}>Keluar</button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="dashboard-header">
                    <h2>Tracker Proyek</h2>
                </header>

                {!currentProject ? (
                    <div className="no-projects">
                        <h3>Belum ada proyek aktif.</h3>
                        <p>Proyek yang sudah disepakati akan muncul di sini.</p>
                    </div>
                ) : (
                    <>
                        <div className="project-cards">
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`project-card ${selectedProjectIndex === index ? 'active' : ''}`}
                                    onClick={() => handleProjectSelect(index)}
                                >
                                    <div className="project-card-header">
                                        <h3 className="project-card-title">{project.projectType || 'Proyek Renovasi'}</h3>
                                        <span className={`project-status ${project.status}`}>{project.status}</span>
                                    </div>
                                    <p className="project-client">{project.user?.name || 'Klien'}</p>
                                    <div className="project-card-progress">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${project.progressUpdates?.[0]?.progressPercentage || 0}%` }}></div>
                                        </div>
                                        <span className="progress-text">{project.progressUpdates?.[0]?.progressPercentage || 0}%</span>
                                    </div>
                                    <div className="project-card-footer">
                                        <span className="project-date">{new Date(project.createdAt).toLocaleDateString()}</span>
                                        <span className="project-budget">Rp {parseInt(project.totalPrice).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="tracker-grid">
                            <div className="tracker-section detail-section">
                                <h3 className="section-title">Detail Proyek</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <div className="detail-icon client-icon"><UserIcon size={20} color="#3B82F6" /></div>
                                        <div className="detail-content">
                                            <span className="detail-label">Client</span>
                                            <span className="detail-value">{currentProject.user?.name}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-icon budget-icon"><WalletIcon size={20} color="#FF6600" /></div>
                                        <div className="detail-content">
                                            <span className="detail-label">Budget</span>
                                            <span className="detail-value">Rp {parseInt(currentProject.totalPrice).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-icon date-icon"><CalendarIcon size={20} color="#22c55e" /></div>
                                        <div className="detail-content">
                                            <span className="detail-label">Mulai</span>
                                            <span className="detail-value">{new Date(currentProject.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tracker-section riwayat-section">
                                <h3 className="section-title">Riwayat Update</h3>
                                <div className="riwayat-list">
                                    {currentProject.progressUpdates?.map((update, index) => (
                                        <div key={index} className="riwayat-item">
                                            <div className="riwayat-marker">
                                                <div className="riwayat-dot"></div>
                                                {index < currentProject.progressUpdates.length - 1 && <div className="riwayat-line"></div>}
                                            </div>
                                            <div className="riwayat-content">
                                                <div className="riwayat-header">
                                                    <span className="riwayat-date">{new Date(update.updatedAt).toLocaleDateString()}</span>
                                                    <span className="riwayat-progress">{update.progressPercentage}%</span>
                                                </div>
                                                <p className="riwayat-text">{update.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="tracker-section upload-section">
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
                                            <div className="upload-icon"><UploadIcon size={48} /></div>
                                            <p className="upload-text">Klik untuk upload foto</p>
                                            <input type="file" className="file-input" accept="image/*" onChange={handlePhotoUpload} />
                                        </div>
                                    ) : (
                                        <div className="photo-preview-container">
                                            <img src={uploadedPhoto} alt="Preview" className="photo-preview" />
                                            <button type="button" className="remove-photo-btn" onClick={() => setUploadedPhoto(null)}>✕ Hapus Foto</button>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="save-progress-btn">Simpan Update Progress</button>
                            </form>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default TrackerProyek;
