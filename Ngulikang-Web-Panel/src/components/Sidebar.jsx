import logo from '../assets/LOGO/TERANG.png';

function Sidebar({ activeMenu, onNavigate, onLogout }) {
    return (
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
                    onClick={() => onNavigate && onNavigate('gaji')}
                >
                    Ambil Gaji
                </button>
            </nav>

            <button className="logout-btn" onClick={onLogout}>
                Keluar
            </button>
        </aside>
    );
}

export default Sidebar;
