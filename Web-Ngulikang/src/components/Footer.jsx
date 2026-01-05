import React from 'react';
import logo from './ui/images/LOGO/TERANG.png';

const Footer = () => {
    return (
        <footer style={{
            background: '#0a0a0a',
            padding: '80px 0 30px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Top Border Gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 140, 66, 0.5), transparent)'
            }} />

            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1000px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(255, 140, 66, 0.05) 0%, transparent 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '60px',
                    marginBottom: '60px'
                }}>
                    {/* Column 1: Brand */}
                    <div style={{ maxWidth: '400px' }}>
                        <img src={logo} alt="NguliKang" style={{ height: '64px', width: 'auto', marginBottom: '20px' }} />
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.8', marginBottom: '30px' }}>
                            Platform jasa konstruksi terpercaya di Indonesia. Wujudkan hunian impian Anda bersama tukang profesional kami yang berpengalaman.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social, index) => (
                                <a key={index} href="#" style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease',
                                    color: 'white'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#FF8C42';
                                        e.currentTarget.style.borderColor = '#FF8C42';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                    {/* Simple SVG Icons */}
                                    {social === 'twitter' && <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>}
                                    {social === 'facebook' && <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>}
                                    {social === 'instagram' && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>}
                                    {social === 'linkedin' && <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
                        {/* Column 2: Cari Tukang */}
                        <div>
                            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '25px' }}>Cari Tukang</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Renovasi Rumah', 'Bangun Baru', 'Desain Interior', 'Instalasi Listrik', 'Perbaikan Atap'].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '15px' }}>
                                        <a href="#" style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            fontSize: '15px',
                                            transition: 'all 0.3s ease',
                                            display: 'inline-block'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = '#FF8C42';
                                                e.target.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = 'rgba(255,255,255,0.7)';
                                                e.target.style.transform = 'translateX(0)';
                                            }}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Ciptakan Pekerjaan */}
                        <div>
                            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '25px' }}>Ciptakan Pekerjaan</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Tentang Kami', 'Portofolio', 'Karir', 'Blog', 'Hubungi Kami'].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '15px' }}>
                                        <a href="#" style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            fontSize: '15px',
                                            transition: 'all 0.3s ease',
                                            display: 'inline-block'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = '#FF8C42';
                                                e.target.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = 'rgba(255,255,255,0.7)';
                                                e.target.style.transform = 'translateX(0)';
                                            }}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                    alignItems: 'center'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        &copy; 2025 NguliKang. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '30px' }}>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Privacy Policy</a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
