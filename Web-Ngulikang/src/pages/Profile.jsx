import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';

import { authApi } from '../lib/api';

// --- ICONS ---
const Icons = {
    User: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    Mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    Phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    MapPin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    Camera: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>,
    Edit: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    Chevron: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
};

const Profile = ({ onNavigate }) => {
    const { user, updateUser } = useUser();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    // --- FORM STATES ---
    const [editForm, setEditForm] = useState({ ...user });
    const [selectedFile, setSelectedFile] = useState(null);

    // Password Change State
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const fileInputRef = useRef(null);

    // --- HANDLERS ---

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsEditing(false); // Reset editing mode when switching tabs
        setEditForm({ ...user }); // Reset form
        setSelectedFile(null);
        setPasswordForm({ current: '', new: '', confirm: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) {
                showNotification("Ukuran file terlalu besar. Maksimal 5MB.", 'error');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, avatar: reader.result }));

                if (!isEditing) setIsEditing(true); // Auto enter edit mode on photo change
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('phone', editForm.phone || '');
            if (editForm.address) formData.append('address', editForm.address);

            if (selectedFile) {
                formData.append('avatar', selectedFile);
            }

            const response = await authApi.updateProfile(formData);
            if (response && (response.user || response.data?.user)) {
                // Handle different response structures gracefully (axios usually returns data in data)
                const returnedUser = response.user || response.data.user;
                updateUser(returnedUser);
                setIsEditing(false);
                setSelectedFile(null);
                showNotification('Profil berhasil diperbarui!', 'success');
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            showNotification('Gagal memperbarui profil. Silakan coba lagi.', 'error');
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePassword = () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            showNotification('Mohon lengkapi semua bidang.', 'error');
            return;
        }

        // Simulation check
        // Note: user.password handles the "real" current password
        const currentRealPassword = user.password || 'password123'; // Fallback for legacy data

        if (passwordForm.current !== currentRealPassword) {
            showNotification('Kata sandi saat ini salah!', 'error');
            return;
        }

        if (passwordForm.new !== passwordForm.confirm) {
            showNotification('Konfirmasi kata sandi baru tidak cocok!', 'error');
            return;
        }

        if (passwordForm.new.length < 6) {
            showNotification('Kata sandi baru minimal 6 karakter.', 'error');
            return;
        }

        // Save
        const updatedUser = { ...user, password: passwordForm.new };
        updateUser(updatedUser);
        setEditForm(updatedUser); // Sync local form
        setPasswordForm({ current: '', new: '', confirm: '' });
        showNotification('Kata sandi berhasil diubah!', 'success');
    };

    return (
        <div style={{ minHeight: '100vh', color: '#e4e4e7', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <Particles count={30} color="#FF8C42" />
            </div>

            <div style={{ paddingTop: '180px', paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>

                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '40px', textAlign: 'left' }}>Pengaturan Akun</h1>

                <div className="profile-layout" style={{ display: 'flex', gap: '30px' }}>
                    {/* --- SIDEBAR --- */}
                    <div className="profile-sidebar">
                        <div style={{ background: 'rgba(24, 24, 27, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <SidebarItem
                                icon={Icons.User}
                                label="Profil Saya"
                                active={activeTab === 'profile'}
                                onClick={() => handleTabChange('profile')}
                            />
                            <SidebarItem
                                icon={Icons.Lock}
                                label="Keamanan & Password"
                                active={activeTab === 'security'}
                                onClick={() => handleTabChange('security')}
                            />
                            {/* Placeholder for future features */}
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
                            <div style={{ padding: '10px 16px', fontSize: '0.8rem', color: '#71717a' }}>Versi Aplikasi 1.0.0</div>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={activeTab}
                        style={{ flex: 1, background: 'rgba(24, 24, 27, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px', overflow: 'hidden' }}
                    >
                        {activeTab === 'profile' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Profil Pribadi</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => { setIsEditing(true); setEditForm({ ...user }); }}
                                            style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '10px 20px', borderRadius: '100px', color: 'white', cursor: 'pointer', transition: '0.2s' }}
                                        >
                                            {Icons.Edit} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Edit</span>
                                        </button>
                                    )}
                                </div>

                                {/* AVATAR */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',
                                            border: '4px solid rgba(255, 140, 66, 0.3)', background: '#27272a',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {(isEditing ? editForm.avatar : user.avatar) ? (
                                                <img src={getImageUrl(isEditing ? editForm.avatar : user.avatar)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '2.5rem', color: '#71717a' }}>👤</span>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                style={{
                                                    position: 'absolute', bottom: '0', right: '0',
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: '#FF8C42', border: '3px solid #18181b',
                                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                {Icons.Camera}
                                            </button>
                                        )}
                                        <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                                    </div>
                                </div>

                                {/* FIELDS */}
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    <InputGroup label="Nama Lengkap" icon={Icons.User}>
                                        <input
                                            type="text" name="name"
                                            value={isEditing ? editForm.name : user.name}
                                            onChange={handleInputChange} disabled={!isEditing}
                                            className="profile-input"
                                        />
                                    </InputGroup>

                                    <InputGroup label="Nomor Telepon" icon={Icons.Phone}>
                                        <input
                                            type="tel" name="phone"
                                            value={isEditing ? editForm.phone : user.phone}
                                            onChange={handleInputChange} disabled={!isEditing}
                                            className="profile-input"
                                        />
                                    </InputGroup>

                                    <InputGroup label="Alamat" icon={Icons.MapPin}>
                                        <textarea
                                            name="address" rows="3"
                                            value={isEditing ? editForm.address : user.address}
                                            onChange={handleInputChange} disabled={!isEditing}
                                            className="profile-input"
                                            style={{ resize: 'none' }}
                                        />
                                    </InputGroup>
                                </div>

                                {isEditing && (
                                    <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => { setIsEditing(false); setEditForm({ ...user }); }}
                                            style={{ padding: '12px 24px', borderRadius: '100px', background: 'transparent', border: '1px solid #3f3f46', color: '#e4e4e7', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            style={{ padding: '12px 32px', borderRadius: '100px', background: '#FF8C42', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)' }}
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px' }}>Keamanan Akun</h2>

                                <div style={{ marginBottom: '40px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: '#FF8C42' }}>Email Address</h3>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                            <div style={{ padding: '10px', background: 'rgba(255, 140, 66, 0.1)', borderRadius: '12px', color: '#FF8C42' }}>
                                                {Icons.Mail}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Email saat ini</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.email}</div>
                                            </div>
                                        </div>

                                        {/* Simple Email Update */}
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            <label style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Ganti Email Baru</label>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <input
                                                    type="email"
                                                    placeholder="Masukkan email baru..."
                                                    value={editForm.email !== user.email ? editForm.email : ''}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                                    className="profile-input"
                                                    style={{ flex: 1 }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (editForm.email && editForm.email !== user.email) {
                                                            updateUser(editForm);
                                                            showNotification("Email berhasil diganti!", 'success');
                                                        }
                                                    }}
                                                    disabled={!editForm.email || editForm.email === user.email}
                                                    style={{
                                                        background: (!editForm.email || editForm.email === user.email) ? '#3f3f46' : '#FF8C42',
                                                        color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
                                                    }}
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: '#FF8C42' }}>Ganti Password</h3>
                                    <div style={{ display: 'grid', gap: '20px' }}>

                                        <InputGroup label="Password Saat Ini" icon={Icons.Lock}>
                                            <input
                                                type="password" name="current"
                                                placeholder="••••••••"
                                                value={passwordForm.current}
                                                onChange={handlePasswordChange}
                                                className="profile-input"
                                            />
                                        </InputGroup>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <InputGroup label="Password Baru" icon={Icons.Lock}>
                                                <input
                                                    type="password" name="new"
                                                    placeholder="••••••••"
                                                    value={passwordForm.new}
                                                    onChange={handlePasswordChange}
                                                    className="profile-input"
                                                />
                                            </InputGroup>
                                            <InputGroup label="Konfirmasi Password Baru" icon={Icons.Lock}>
                                                <input
                                                    type="password" name="confirm"
                                                    placeholder="••••••••"
                                                    value={passwordForm.confirm}
                                                    onChange={handlePasswordChange}
                                                    className="profile-input"
                                                />
                                            </InputGroup>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                            <button
                                                onClick={handleSavePassword}
                                                style={{ padding: '12px 32px', borderRadius: '100px', background: '#FF8C42', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)' }}
                                            >
                                                Ganti Password
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* --- CUSTOM STYLES INJECT --- */}
                <style>{`
                    .profile-layout {
                        flex-direction: column;
                    }
                    .profile-sidebar {
                        width: 100%;
                    }
                    
                    @media (min-width: 768px) {
                        .profile-layout {
                            flex-direction: row;
                            align-items: flex-start;
                        }
                        .profile-sidebar {
                            width: 280px;
                            flex-shrink: 0;
                        }
                    }

                    .profile-input {
                        width: 100%;
                        padding: 12px 16px;
                        border-radius: 12px;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.1);
                        color: white;
                        font-size: 1rem;
                        outline: none;
                        transition: all 0.2s;
                    }
                    .profile-input:disabled {
                        background: transparent;
                        border-color: transparent;
                        color: #e4e4e7;
                        padding-left: 0;
                    }
                    .profile-input:focus {
                        border-color: #FF8C42;
                        background: rgba(255,255,255,0.08);
                    }
                    /* Side bar item hover */
                    .sidebar-item:hover {
                        background: rgba(255,255,255,0.05);
                    }
                `}</style>
            </div>
        </div>
    );
};

// --- HELPER COMPONENTS ---

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:')) return path;
    if (path.startsWith('http')) return path;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className="sidebar-item"
        style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
            background: active ? '#FF8C42' : 'transparent',
            color: active ? 'white' : '#a1a1aa',
            fontWeight: active ? '600' : '400',
            transition: 'all 0.2s'
        }}
    >
        <div style={{ opacity: active ? 1 : 0.7 }}>{icon}</div>
        <span>{label}</span>
        {active && <div style={{ marginLeft: 'auto' }}>{Icons.Chevron}</div>}
    </div>
);

const InputGroup = ({ label, icon, children }) => (
    <div style={{ width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1aa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && React.cloneElement(icon, { width: 14, height: 14 })}
            {label}
        </label>
        {children}
    </div>
);

export default Profile;

