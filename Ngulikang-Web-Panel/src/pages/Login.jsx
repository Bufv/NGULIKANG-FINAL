import { useState } from 'react';
import '../styles/Login.css';
import LiquidEther from '../components/effects/LiquidEther';
import logo from '../assets/LOGO/TERANG.png';

function Login({ onLoginSuccess }) {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login gagal');
            }

            // Cek role, harus tukang
            if (data.user.role !== 'tukang') {
                throw new Error('Akun ini bukan akun tukang');
            }

            localStorage.setItem('tukang_token', data.accessToken);
            localStorage.setItem('tukang_user', JSON.stringify(data.user));

            if (onLoginSuccess) onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <LiquidEther style={{ width: '100vw', height: '100vh' }} />

            <div
                className="login-card"
                onMouseMove={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
            >
                {/* Logo */}
                <div className="logo-placeholder">
                    <img src={logo} alt="Ngulikang Logo" className="login-logo" />
                </div>

                {/* Header */}
                <h2 className="portal-title">Portal Tukang</h2>
                <p className="portal-subtitle">Masuk ke akun tukang Anda</p>



                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', background: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="nama@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Masuk Button */}
                    <button type="submit" className="btn-masuk" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Masuk'}
                    </button>


                </form>

                {/* Footer */}
                <p className="footer-text">
                    Belum punya akun? Hubungi admin untuk registrasi
                </p>
            </div>
        </div>
    );
}

export default Login;
