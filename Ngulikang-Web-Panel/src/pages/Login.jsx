import '../styles/Login.css';
import LiquidEther from '../components/effects/LiquidEther';
import logo from '../assets/LOGO/TERANG.png';

function Login({ onLoginSuccess }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log('Login:', {
            email: formData.get('email'),
            password: formData.get('password')
        });
        // Redirect to dashboard after login
        if (onLoginSuccess) onLoginSuccess();
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
                    <button type="submit" className="btn-masuk">
                        Masuk
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
