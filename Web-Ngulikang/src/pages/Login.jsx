import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../components/ui/images/LOGO/TERANG.png';
import { authApi, setAuthTokens, clearAuthTokens } from '../lib/api';
import { useUser } from '../context/UserContext';


// Icons
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12V14.45H18.46C18.18 15.92 17.32 17.16 16.03 18.03V21H19.9C22.16 18.92 23.52 15.86 23.52 12.29Z" fill="#4285F4" />
        <path d="M12 24C15.24 24 17.96 22.92 19.9 21.13L16.03 18.16C14.95 18.88 13.58 19.31 12 19.31C8.87 19.31 6.22 17.2 5.27 14.36H1.26V17.47C3.25 21.43 7.33 24 12 24Z" fill="#34A853" />
        <path d="M5.27 14.36C5.03 13.62 4.9 12.83 4.9 12C4.9 11.17 5.03 10.38 5.27 9.64V6.53H1.26C0.46 8.13 0 9.99 0 12C0 14.01 0.46 15.87 1.26 17.47L5.27 14.36Z" fill="#FBBC05" />
        <path d="M12 4.69C13.76 4.69 15.34 5.3 16.59 6.49L19.98 3.09C17.95 1.2 15.24 0 12 0C7.33 0 3.25 2.57 1.26 6.53L5.27 9.64C6.22 6.8 8.87 4.69 12 4.69Z" fill="#EA4335" />
    </svg>
);

const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2" />
        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Login = ({ onNavigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false); // New state for checkbox
    const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for forgot password
    const [authError, setAuthError] = useState('');
    const { updateUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthError('');

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const name = formData.get('name');

        try {
            let response;
            if (isLogin) {
                response = await authApi.login({ email, password });
            } else {
                response = await authApi.register({ name, email, password, role: 'user' });
            }

            const { data } = response;
            if (data.user?.role && data.user.role !== 'user') {
                clearAuthTokens();
                setAuthError('Akun ini bukan user.');
                return;
            }

            setAuthTokens(data);
            const profile = {
                name: data.user?.name || name || 'User',
                email: data.user?.email || email,
                phone: data.user?.phone || '',
                address: '',
                avatar: data.user?.avatar || null
            };
            localStorage.setItem('userProfile', JSON.stringify(profile));
            updateUser(profile);
            setIsLoading(false);
            if (onNavigate) onNavigate('home');
        } catch (error) {
            setAuthError(error.response?.data?.message || 'Login/Register gagal. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        alert('Link reset password telah dikirim ke email Anda!');
        setShowForgotPassword(false);
        setIsLogin(true);
    };

    const handleGoogleLogin = () => {
        if (!termsAccepted && !isLogin) {
            alert('Silakan setujui Syarat Layanan dan Kebijakan Privasi terlebih dahulu');
            return;
        }
        alert('Google login clicked! (This would redirect to Google OAuth)');
    };

    // RENDER: FORGOT PASSWORD VIEW
    if (showForgotPassword) {
        return (
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                fontFamily: "'Inter', sans-serif",
                background: '#FFF3E0', // Changed to orange theme
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 99999,
                padding: '20px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        width: '100%',
                        maxWidth: '480px',
                        padding: '48px',
                        textAlign: 'left'
                    }}
                >
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        marginBottom: '12px'
                    }}>
                        Lupa Password?
                    </h1>
                    <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.5' }}>
                        Masukkan alamat email yang terkait dengan akun Anda dan kami akan mengirimkan link untuk mereset password Anda.
                    </p>

                    <form onSubmit={handleForgotPasswordSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#FF8C42', // Changed to orange
                                marginBottom: '8px'
                            }}>
                                Email <span style={{ color: '#FF8C42' }}>*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Masukkan alamat email Anda"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd', // Changed to solid #ddd
                                    fontSize: '0.95rem',
                                    color: '#333',
                                    outline: 'none',
                                    transition: 'border 0.2s'
                                }}
                                onFocus={e => e.target.style.border = '1px solid #FF8C42'} // Changed to solid orange
                                onBlur={e => e.target.style.border = '1px solid #ddd'} // Changed to solid #ddd
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '13px',
                                background: '#FF8C42',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                marginBottom: '20px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#e6732f'}
                            onMouseLeave={e => e.currentTarget.style.background = '#FF8C42'}
                        >
                            Kirim Link Reset Password
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                        <button
                            onClick={() => {
                                setShowForgotPassword(false);
                                setIsLogin(true);
                            }}
                            style={{ background: 'none', border: 'none', color: '#FF8C42', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', padding: 0, textDecoration: 'underline' }}
                        >
                            Kembali ke Login
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // RENDER: REGISTER VIEW (Centered Card - DigitalOcean Style)
    if (!isLogin) {
        // Show Email Registration Form
        if (showEmailForm) {
            return (
                <div style={{
                    display: 'flex',
                    minHeight: '100vh',
                    fontFamily: "'Inter', sans-serif",
                    background: '#FFF3E0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 99999,
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                            width: '100%',
                            maxWidth: '480px',
                            padding: '48px',
                            textAlign: 'left'
                        }}
                    >
                        <h1 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '12px'
                        }}>
                            Daftar dengan Email
                        </h1>
                        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '32px' }}>
                            Atau daftar dengan <button onClick={handleGoogleLogin} style={{ background: 'none', border: 'none', color: '#FF8C42', textDecoration: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontWeight: '600' }}>Google</button>
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: '8px'
                                }}>
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '0.95rem',
                                        color: '#333',
                                        outline: 'none',
                                        transition: 'border 0.2s'
                                    }}
                                    onFocus={e => e.target.style.border = '1px solid #FF8C42'}
                                    onBlur={e => e.target.style.border = '1px solid #ddd'}
                                />
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: '8px'
                                }}>
                                    Email <span style={{ color: '#FF8C42' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="nama@email.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '0.95rem',
                                        color: '#333',
                                        outline: 'none',
                                        transition: 'border 0.2s'
                                    }}
                                    onFocus={e => e.target.style.border = '1px solid #FF8C42'}
                                    onBlur={e => e.target.style.border = '1px solid #ddd'}
                                />
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: '28px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: '8px'
                                }}>
                                    Password <span style={{ color: '#FF8C42' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    required
                                    minLength={8}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '0.95rem',
                                        color: '#333',
                                        outline: 'none',
                                        transition: 'border 0.2s'
                                    }}
                                    onFocus={e => e.target.style.border = '1px solid #FF8C42'}
                                    onBlur={e => e.target.style.border = '1px solid #ddd'}
                                />
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    background: '#FF8C42',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#e6732f'}
                                onMouseLeave={e => e.currentTarget.style.background = '#FF8C42'}
                            >
                                Buat Akun
                            </button>
                            {authError && (
                                <p style={{ marginTop: '12px', color: '#ff4d4f', fontSize: '0.9rem' }}>
                                    {authError}
                                </p>
                            )}
                        </form>

                        <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Sudah punya akun? </span>
                            <button
                                onClick={() => {
                                    setShowEmailForm(false);
                                    setIsLogin(true);
                                }}
                                style={{ background: 'none', border: 'none', color: '#FF8C42', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                            >
                                Masuk di sini
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        // Show Initial Sign Up Options
        return (
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                fontFamily: "'Inter', sans-serif",
                background: '#FFF3E0', // Light orange background matching Home
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 99999,
                padding: '20px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        width: '100%',
                        maxWidth: '480px',
                        padding: '48px',
                        textAlign: 'center'
                    }}
                >
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#1a1a1a',
                        marginBottom: '12px'
                    }}>
                        Buat Akun Anda
                    </h1>
                    <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.5' }}>
                        Mulai habiskan lebih banyak waktu untuk proyek Anda dan lebih sedikit waktu mengelola infrastruktur.
                    </p>

                    {/* Terms Checkbox */}
                    <div style={{ marginBottom: '32px', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={{ marginTop: '4px' }}
                        />
                        <label htmlFor="terms" style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.4' }}>
                            Dengan mendaftar di bawah ini, saya menyetujui <a href="#" style={{ color: '#FF8C42', textDecoration: 'none' }}>Syarat Layanan</a> dan <a href="#" style={{ color: '#FF8C42', textDecoration: 'none' }}>Kebijakan Privasi</a> NguliKang.
                        </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Google Sign Up */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={!termsAccepted}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                color: '#333',
                                fontWeight: '600',
                                cursor: termsAccepted ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'all 0.2s',
                                fontSize: '0.95rem',
                                opacity: termsAccepted ? 1 : 0.5
                            }}
                            onMouseEnter={e => termsAccepted && (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                            onMouseLeave={e => termsAccepted && (e.currentTarget.style.backgroundColor = 'white')}
                        >
                            <GoogleIcon />
                            <span>Daftar dengan Google</span>
                        </button>

                        {/* Email Sign Up - Orange Button */}
                        <button
                            onClick={() => termsAccepted && setShowEmailForm(true)}
                            disabled={!termsAccepted}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#FF8C42', // NguliKang Orange
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: '600',
                                cursor: termsAccepted ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                fontSize: '0.95rem',
                                boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3)',
                                opacity: termsAccepted ? 1 : 0.5
                            }}
                            onMouseEnter={e => termsAccepted && (e.currentTarget.style.background = '#e6732f')}
                            onMouseLeave={e => termsAccepted && (e.currentTarget.style.background = '#FF8C42')}
                        >
                            Daftar dengan Email
                        </button>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>Sudah punya akun? </span>
                        <button
                            onClick={() => setIsLogin(true)}
                            style={{ background: 'none', border: 'none', color: '#FF8C42', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                        >
                            Masuk
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // RENDER: LOGIN VIEW (Existing Split Layout)
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            background: 'white',
            position: 'absolute', // Force full coverage
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 99999 // Ensure it sits on top of everything
        }}>
            {/* LEFT SIDE - FORM */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                background: '#fff',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <motion.div
                        key={isLogin ? 'login-header' : 'register-header'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: '#1a1a1a',
                            marginBottom: '30px',
                            letterSpacing: '-0.02em',
                            textAlign: 'left'
                        }}>
                            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
                        </h1>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#FF8C42', marginBottom: '8px' }}>
                                    Nama Lengkap <span style={{ color: '#ff4d4f' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#333'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#FF8C42'}
                                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#FF8C42', marginBottom: '8px' }}>
                                Email <span style={{ color: '#ff4d4f' }}>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Masukkan email anda"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    color: '#333'
                                }}
                                onFocus={e => e.target.style.borderColor = '#FF8C42'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#FF8C42', marginBottom: '8px' }}>
                                Password <span style={{ color: '#ff4d4f' }}>*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Masukkan password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    color: '#333'
                                }}
                                onFocus={e => e.target.style.borderColor = '#FF8C42'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#FF8C42', // Orange
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: isLoading ? 'wait' : 'pointer',
                                marginBottom: '20px',
                                boxShadow: '0 4px 6px rgba(255, 140, 66, 0.2)'
                            }}
                        >
                            {isLoading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
                        </motion.button>
                        {authError && (
                            <p style={{ marginBottom: '20px', color: '#ff4d4f', fontSize: '0.9rem' }}>
                                {authError}
                            </p>
                        )}

                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                color: '#333',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.2s',
                                marginBottom: '24px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <GoogleIcon />
                            <span>Sign {isLogin ? 'In' : 'Up'} with Google</span>
                        </button>
                    </form>

                    <div style={{ textAlign: 'left', marginTop: '20px' }}>
                        {isLogin ? (
                            <>
                                <button
                                    onClick={() => setShowForgotPassword(true)}
                                    style={{ background: 'none', border: 'none', color: '#FF8C42', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', display: 'block', marginBottom: '24px', cursor: 'pointer', padding: 0 }}
                                >
                                    Lupa Password?
                                </button>
                                <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Belum punya akun? </span>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        style={{ background: 'none', border: 'none', color: '#FF8C42', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                                    >
                                        Daftar sekarang
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>Sudah punya akun? </span>
                                <button
                                    onClick={() => setIsLogin(true)}
                                    style={{ background: 'none', border: 'none', color: '#FF8C42', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                                >
                                    Masuk disini
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - VISUAL */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #FF8C42 0%, #F54A00 100%)', // Richer Orange Gradient base
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 50, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-20%',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 200, 100, 0.4) 0%, rgba(255, 140, 66, 0) 70%)',
                        filter: 'blur(60px)',
                        zIndex: 1
                    }}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -30, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 70, 70, 0.3) 0%, rgba(255, 69, 0, 0) 70%)',
                        filter: 'blur(80px)',
                        zIndex: 1
                    }}
                />

                {/* Grid Pattern Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    zIndex: 2,
                    pointerEvents: 'none'
                }} />

                {/* Content Container - No Card, Direct on Gradient */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    color: 'white',
                    maxWidth: '500px',
                    textAlign: 'left'
                }}>
                    {/* NguliKang Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            marginBottom: '32px',
                            marginLeft: '-30px', // Shift logo more to the left
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <img
                            src={logo}
                            alt="NguliKang"
                            style={{
                                height: '80px',
                                width: 'auto',
                                filter: 'brightness(0) invert(1)' // Make logo white
                            }}
                        />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            fontSize: '2.8rem',
                            fontWeight: '800',
                            marginBottom: '24px',
                            lineHeight: '1.2',
                            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        Bangun Rumah Impian Bersama NguliKang
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{
                            fontSize: '1.15rem',
                            lineHeight: '1.7',
                            opacity: 0.95,
                            marginBottom: '40px',
                            textShadow: '0 1px 3px rgba(0,0,0,0.15)'
                        }}
                    >
                        Platform terpercaya yang menghubungkan Anda dengan tukang profesional dan layanan konstruksi terbaik. Wujudkan proyek Anda dengan mudah, aman, dan transparan.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '40px' }}
                    >
                        {[
                            { icon: '✓', text: 'Tukang Terverifikasi & Profesional' },
                            { icon: '✓', text: 'Sistem Pembayaran Aman' },
                            { icon: '✓', text: 'Progress Tracking Real-time' }
                        ].map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    minWidth: '28px',
                                    height: '28px',
                                    background: 'rgba(255,255,255,0.25)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {item.icon}
                                </div>
                                <span style={{
                                    fontSize: '1.05rem',
                                    fontWeight: '500',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>{item.text}</span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{
                            padding: '14px 32px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#FF8C42',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                    >
                        Pelajari Selengkapnya
                    </motion.button>
                </div>

                {/* Mobile Responsive Style Injection */}
                <style>{`
                @media (max-width: 900px) {
                    div[style*="flex: 1"][style*="background: linear-gradient"] {
                        display: none !important;
                    }
                }
            `}</style>
            </div>
        </div>
    );
};

export default Login;
