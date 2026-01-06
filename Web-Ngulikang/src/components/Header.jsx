import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './ui/images/LOGO/TERANG.png';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import MobileStaggeredMenu from './MobileStaggeredMenu';

const Header = ({ onNavigate, activePage }) => { // 1. Accept onNavigate prop
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const { user, isAuthenticated, logout } = useUser();
    const { showNotification } = useNotification();

    // Determine which nav ID should be active based on current page
    const activeLinkId = (() => {
        if (!activePage || activePage === 'home') return 'home';

        // Pages for "Cari Tukang"
        const searchPages = ['nguli-borongan', 'nguli-harian', 'nguli-korporate', 'nguli-premium', 'nguli-renovasi', 'bangun-baru', 'check-progress'];
        if (searchPages.includes(activePage)) return 'search';

        // Pages for "Ciptakan Pekerjaan"
        const createPages = ['job-terms', 'job-register', 'cek-status-lamaran'];
        if (createPages.includes(activePage)) return 'create';

        // Pages for "Marketplace" Context
        const marketplacePages = ['product-detail', 'cart', 'checkout', 'order-tracker'];
        if (marketplacePages.includes(activePage)) return 'marketplace';

        return activePage;
    })();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(hover: none)');
        const updateTouch = () => {
            setIsTouchDevice(mediaQuery.matches || 'ontouchstart' in window);
        };
        updateTouch();
        mediaQuery.addEventListener?.('change', updateTouch);
        return () => mediaQuery.removeEventListener?.('change', updateTouch);
    }, []);

    const navItems = [
        { id: 'home', label: 'Home', href: '#home', hasDropdown: false },
        { id: 'search', label: 'Cari Tukang ▾', href: '#search', hasDropdown: true },
        { id: 'create', label: 'Ciptakan Pekerjaan ▾', href: '#create', hasDropdown: true },
        { id: 'marketplace', label: 'Marketplace', href: '#marketplace', hasDropdown: false },
        { id: 'chat', label: 'Chat Tukang', href: '#chat', hasDropdown: false },
        { id: 'blog', label: 'Blog', href: '#blog', hasDropdown: false }
    ];

    const menuVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            x: "-50%",
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            x: "-50%",
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 25 }
        },
        exit: {
            opacity: 0,
            y: -10,
            x: "-50%",
            transition: { duration: 0.2 }
        }
    };

    // Helper to handle menu clicks
    const handleMenuClick = (id) => {
        if (id === 'nguli-harian') {
            onNavigate('nguli-harian');
            setActiveDropdown(null);
            return;
        }

        if (id === 'nguli-korporate') {
            onNavigate('nguli-korporate');
            setActiveDropdown(null);
            return;
        }

        if (id === 'nguli-premium') {
            onNavigate('nguli-premium');
            setActiveDropdown(null);
            return;
        }

        if (id === 'nguli-renovasi') {
            onNavigate('nguli-renovasi');
            setActiveDropdown(null);
            return;
        }

        if (id === 'nguli-borongan') {
            onNavigate('nguli-borongan');
            setActiveDropdown(null);
            return;
        }

        if (id === 'bangun-baru') {
            console.log('🔨 Navigating to Bangun Baru...');
            onNavigate('bangun-baru');
            setActiveDropdown(null);
            return;
        }

        // Placeholder for other items like bangun-baru
        console.log("Clicked:", id);
    };

    const handleLogoClick = () => {
        onNavigate('home');
        setActiveDropdown(null);
    }

    const [isCartOpen, setIsCartOpen] = useState(false);
    const { getCartCount, cartItems, removeFromCart, getCartTotal } = useCart();
    const cartCount = getCartCount();
    const cartTotal = getCartTotal();

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <motion.nav
                className={`navbar ${scrolled ? 'navbar-glass' : ''}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* 1. Left Section: Logo */}
                <div className="navbar-left">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setActiveDropdown(activeDropdown === 'mobile' ? null : 'mobile')}
                        style={{ marginRight: '10px', opacity: activeDropdown === 'mobile' ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: activeDropdown === 'mobile' ? 'none' : 'auto' }}
                    >
                        ☰
                    </button>
                    <motion.div
                        className="logo"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ cursor: 'pointer' }}
                        onClick={handleLogoClick}
                    >
                        <img src={logo} alt="NguliKang" style={{ height: '48px', width: 'auto' }} />
                    </motion.div>
                </div>

                {/* 2. Center Section: Navigation */}
                <div className="navbar-center">
                    <ul className="nav-menu">
                        {navItems.map((item) => (
                            <li
                                key={item.id}
                                onMouseEnter={() => {
                                    if (isTouchDevice) return;
                                    if (item.hasDropdown) {
                                        setActiveDropdown(item.id);
                                    } else if (activeDropdown !== null) {
                                        setActiveDropdown(null);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (!isTouchDevice) {
                                        setActiveDropdown(null);
                                    }
                                }}
                            >
                                <a
                                    href={item.href}
                                    className={activeLinkId === item.id ? 'active' : ''}
                                    onClick={(e) => {
                                        if (item.hasDropdown) {
                                            if (isTouchDevice) {
                                                e.preventDefault();
                                                setActiveDropdown(activeDropdown === item.id ? null : item.id);
                                            }
                                            return;
                                        }
                                        if (item.id === 'home') onNavigate('home');
                                        if (item.id === 'marketplace') onNavigate('marketplace');
                                        if (item.id === 'blog') onNavigate('blog');
                                        if (item.id === 'chat') onNavigate('chat');
                                        setActiveDropdown(null);
                                    }}
                                >
                                    {item.label}
                                    {activeLinkId === item.id && (
                                        <motion.div
                                            className="nav-underline"
                                            layoutId="underline"
                                        />
                                    )}
                                </a>

                                {/* MEGA MENU DROPDOWN */}
                                <AnimatePresence>
                                    {activeDropdown === item.id && item.id === 'search' && (
                                        <motion.div
                                            variants={menuVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            style={{
                                                position: 'fixed',
                                                top: '110px',
                                                left: '50%',
                                                width: '900px',
                                                backgroundColor: 'rgba(20, 20, 20, 0.98)',
                                                backdropFilter: 'blur(20px)',
                                                borderRadius: '24px',
                                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                                boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                                                padding: '12px',
                                                zIndex: 9999,
                                                display: 'flex',
                                                overflow: 'hidden',
                                                cursor: 'default'
                                            }}
                                        >
                                            {/* LEFT SIDE: Visual Promo */}
                                            <div style={{
                                                width: '300px',
                                                flexShrink: 0,
                                                position: 'relative',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                marginRight: '16px'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop") center/cover no-repeat',
                                                }} />
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.1) 100%)'
                                                }} />

                                                <div style={{
                                                    position: 'relative',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-end',
                                                    padding: '24px',
                                                    zIndex: 2
                                                }}>
                                                    <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '8px', lineHeight: 1.2 }}>
                                                        Temukan Tukang Terbaik
                                                    </h3>
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.5 }}>
                                                        Jelajahi berbagai layanan tukang profesional.
                                                    </p>
                                                    <motion.button
                                                        onClick={() => {
                                                            onNavigate('check-progress');
                                                            setActiveDropdown(null);
                                                        }}
                                                        whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(255, 140, 66, 0.4)' }}
                                                        whileTap={{ scale: 0.98 }}
                                                        style={{
                                                            background: '#FF8C42',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '12px',
                                                            borderRadius: '12px',
                                                            fontWeight: '700',
                                                            fontSize: '0.9rem',
                                                            cursor: 'pointer',
                                                            boxShadow: '0 4px 15px rgba(255, 140, 66, 0.3)'
                                                        }}
                                                    >
                                                        Cek Progres
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* RIGHT SIDE: Menu Items */}
                                            <div style={{ flex: 1, padding: '12px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                                    {[
                                                        { id: 'nguli-borongan', title: 'Nguli Borongan', desc: 'Full package', icon: 'home' },
                                                        { id: 'nguli-harian', title: 'Nguli Harian', desc: 'Per hari kerja', icon: 'clock' },
                                                        { id: 'nguli-korporate', title: 'Nguli Korporate', desc: 'Untuk perusahaan', icon: 'building' },
                                                        { id: 'nguli-premium', title: 'Nguli Premium', desc: 'Konsultasi dengan ahli', icon: 'star' },
                                                        { id: 'nguli-renovasi', title: 'Nguli Renovasi', desc: 'Perbaikan', icon: 'tool' },
                                                        { id: 'bangun-baru', title: 'Bangun Baru', desc: 'Dari awal', icon: 'hammer' }
                                                    ].map((menuItem, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            onClick={() => handleMenuClick(menuItem.id)}
                                                            whileHover={{
                                                                scale: 1.02,
                                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                                borderColor: 'rgba(255, 255, 255, 0.2)'
                                                            }}
                                                            style={{
                                                                cursor: 'pointer', // Make it clickable
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                textAlign: 'center',
                                                                padding: '24px 12px',
                                                                borderRadius: '16px',
                                                                border: menuItem.id === activePage ? '1px solid #FF8C42' : '1px solid rgba(255, 255, 255, 0.05)',
                                                                transition: 'all 0.2s ease',
                                                                background: menuItem.id === activePage ? 'rgba(255, 140, 66, 0.1)' : 'rgba(255, 255, 255, 0.02)'
                                                            }}
                                                        >
                                                            <div style={{
                                                                width: '42px',
                                                                height: '42px',
                                                                borderRadius: '12px',
                                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginBottom: '12px',
                                                                color: '#FF8C42',
                                                                border: '1px solid rgba(255,255,255,0.05)'
                                                            }}>
                                                                {menuItem.icon === 'home' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                                                                {menuItem.icon === 'clock' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                                                                {menuItem.icon === 'building' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>}
                                                                {menuItem.icon === 'star' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>}
                                                                {menuItem.icon === 'tool' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>}
                                                                {menuItem.icon === 'hammer' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>}
                                                            </div>
                                                            <div>
                                                                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600', margin: '0 0 4px 0' }}>{menuItem.title}</h4>
                                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>{menuItem.desc}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* MEGA MENU FOR 'CREATE' */}
                                    {activeDropdown === item.id && item.id === 'create' && (
                                        <motion.div
                                            variants={menuVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            style={{
                                                position: 'fixed',
                                                top: '110px',
                                                left: '50%',
                                                width: '800px', // Slightly smaller width
                                                backgroundColor: 'rgba(20, 20, 20, 0.98)',
                                                backdropFilter: 'blur(20px)',
                                                borderRadius: '24px',
                                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                                boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                                                padding: '12px',
                                                zIndex: 9999,
                                                display: 'flex',
                                                overflow: 'hidden',
                                                cursor: 'default'
                                            }}
                                        >
                                            {/* LEFT SIDE: Visual Promo */}
                                            <div style={{
                                                width: '280px',
                                                flexShrink: 0,
                                                position: 'relative',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                marginRight: '16px'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'url("https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=1000&auto=format&fit=crop") center/cover no-repeat', // Construction/Work image
                                                }} />
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.1) 100%)'
                                                }} />

                                                <div style={{
                                                    position: 'relative',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-end',
                                                    padding: '24px',
                                                    zIndex: 2
                                                }}>
                                                    <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '8px', lineHeight: 1.2 }}>
                                                        Gabung Bersama Kami
                                                    </h3>
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.5 }}>
                                                        Bangun karir dan proyek masa depan Anda.
                                                    </p>
                                                    <motion.button
                                                        onClick={() => {
                                                            onNavigate('cek-status-lamaran');
                                                            setActiveDropdown(null);
                                                        }}
                                                        whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(255, 140, 66, 0.4)' }}
                                                        whileTap={{ scale: 0.98 }}
                                                        style={{
                                                            background: '#FF8C42',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '12px',
                                                            borderRadius: '12px',
                                                            fontWeight: '700',
                                                            fontSize: '0.9rem',
                                                            cursor: 'pointer',
                                                            boxShadow: '0 4px 15px rgba(255, 140, 66, 0.3)'
                                                        }}
                                                    >
                                                        Cek Status Lamaran
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* RIGHT SIDE: Menu Items (Only 2) */}
                                            <div style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', width: '100%' }}>
                                                    {[
                                                        { id: 'job-terms', title: 'Ketentuan', desc: 'Syarat & Ketentuan Pekerjaan', icon: 'file-text' },
                                                        { id: 'job-register', title: 'Daftar Kerja', desc: 'Mulai Karir Anda', icon: 'briefcase' }
                                                    ].map((menuItem, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            onClick={() => {
                                                                console.log("Create menu clicked:", menuItem.id);
                                                                onNavigate(menuItem.id); // Assuming these pages/routes will handle it
                                                                setActiveDropdown(null);
                                                            }}
                                                            whileHover={{
                                                                scale: 1.02,
                                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                                borderColor: 'rgba(255, 255, 255, 0.2)'
                                                            }}
                                                            style={{
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center', // Horizontal layout for list feel
                                                                justifyContent: 'flex-start',
                                                                textAlign: 'left',
                                                                padding: '20px 24px',
                                                                borderRadius: '16px',
                                                                border: menuItem.id === activePage ? '1px solid #FF8C42' : '1px solid rgba(255, 255, 255, 0.05)',
                                                                transition: 'all 0.2s ease',
                                                                background: menuItem.id === activePage ? 'rgba(255, 140, 66, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                                                gap: '16px'
                                                            }}
                                                        >
                                                            <div style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                borderRadius: '12px',
                                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#FF8C42',
                                                                border: '1px solid rgba(255,255,255,0.05)',
                                                                flexShrink: 0
                                                            }}>
                                                                {menuItem.icon === 'file-text' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                                                                {menuItem.icon === 'briefcase' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>}
                                                            </div>
                                                            <div>
                                                                <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>{menuItem.title}</h4>
                                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>{menuItem.desc}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. Right Section: Icons & CTA */}
                <div className="navbar-right">
                    <motion.button
                        className="icon-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ marginRight: '4px' }}
                        onClick={() => onNavigate('order-tracker')}
                        title="Cek Pesanan"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                            <rect x="9" y="3" width="6" height="4" rx="2"></rect>
                            <path d="M9 14h6"></path>
                            <path d="M9 18h6"></path>
                            <path d="M9 10h2"></path>
                        </svg>
                    </motion.button>
                    <motion.button
                        className="icon-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={isCartOpen ? { scale: 1.1, color: '#FF8C42' } : { scale: 1, color: 'white' }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        style={{ position: 'relative' }}
                        onClick={() => {
                            if (isCartOpen) {
                                onNavigate('cart');
                                setIsCartOpen(false);
                            } else {
                                setIsCartOpen(true);
                            }
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#FF8C42',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}

                        {/* CART DROPDOWN */}
                        <AnimatePresence>
                            {isCartOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                    style={{
                                        position: 'absolute',
                                        top: '60px',
                                        right: '-10px',
                                        width: '400px',
                                        background: 'rgba(24, 24, 27, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '24px',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                        zIndex: 10000,
                                        cursor: 'default',
                                        overflow: 'hidden',
                                        transformOrigin: 'top center'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header */}
                                    {/* Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px 24px',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Keranjang</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsCartOpen(false);
                                            }}
                                            style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                border: 'none',
                                                color: '#a1a1aa',
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                fontSize: '1rem'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.color = '#a1a1aa';
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                                        {cartItems.length === 0 ? (
                                            <div style={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center'
                                            }}>
                                                {/* Empty State Illustration */}
                                                <div style={{ position: 'relative', marginBottom: '24px' }}>
                                                    <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="100" cy="100" r="80" fill="#FF8C42" fillOpacity="0.1" />
                                                        <path d="M65 85L85 145H115L135 85H65Z" fill="#2D2D35" stroke="#FF8C42" strokeWidth="4" strokeLinejoin="round" />
                                                        <path d="M75 85L60 60H140L125 85" stroke="#FF8C42" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M100 115V125" stroke="#FF8C42" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                                                        <path d="M90 115L92 125" stroke="#FF8C42" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                                                        <path d="M110 115L108 125" stroke="#FF8C42" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                                                        {/* Sparkles */}
                                                        <path d="M150 60L155 50L160 60L170 65L160 70L155 80L150 70L140 65L150 60Z" fill="#FF8C42" />
                                                        <path d="M40 70L43 64L49 61L43 58L40 52L37 58L31 61L37 64L40 70Z" fill="#FF8C42" fillOpacity="0.6" />
                                                    </svg>
                                                </div>

                                                <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>Wah, keranjang belanjamu kosong</h4>
                                                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '280px' }}>Yuk, isi dengan barang-barang impianmu!</p>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setIsCartOpen(false);
                                                        onNavigate('marketplace');
                                                    }}
                                                    style={{
                                                        padding: '12px 32px',
                                                        background: '#FF8C42',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 8px 16px -4px rgba(255, 140, 66, 0.4)'
                                                    }}
                                                >
                                                    Mulai Belanja
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Cart Items List */}
                                                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
                                                    {cartItems.map((item, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            style={{
                                                                display: 'flex',
                                                                gap: '16px',
                                                                marginBottom: '16px',
                                                                padding: '12px',
                                                                borderRadius: '16px',
                                                                background: 'rgba(255, 255, 255, 0.03)',
                                                                border: '1px solid rgba(255, 255, 255, 0.05)'
                                                            }}
                                                        >
                                                            <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                                <div style={{ color: 'white', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '4px', lineHeight: '1.3' }}>{item.name}</div>
                                                                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                    <span style={{ color: '#FF8C42', fontWeight: 'bold' }}>{item.quantity}x</span> Rp{item.price.toLocaleString('id-ID')}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }}>Total</span>
                                                        <span style={{ color: '#FF8C42', fontSize: '1.4rem', fontWeight: 'bold' }}>Rp{cartTotal.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            onNavigate('cart');
                                                            setIsCartOpen(false);
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '14px',
                                                            background: '#FF8C42',
                                                            border: 'none',
                                                            color: 'white',
                                                            borderRadius: '12px',
                                                            fontSize: '1rem',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.1s'
                                                        }}
                                                        onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                                                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                                                    >
                                                        Lihat Keranjang
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    {isAuthenticated ? (
                        <motion.button
                            className="nav-cta desktop-only"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 8px 20px rgba(179, 84, 30, 0.4)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                logout();
                                onNavigate('home');
                            }}
                        >
                            Keluar
                        </motion.button>
                    ) : (
                        <motion.button
                            className="nav-cta desktop-only"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 8px 20px rgba(179, 84, 30, 0.4)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('login')}
                        >
                            Masuk / Daftar
                        </motion.button>
                    )}
                </div>
                {/* MOBILE MENU OVERLAY */}
                <MobileStaggeredMenu
                    isOpen={activeDropdown === 'mobile'}
                    onClose={() => setActiveDropdown(null)}
                    onNavigate={onNavigate}
                />
            </motion.nav>
        </header>
    );
};

export default Header;
