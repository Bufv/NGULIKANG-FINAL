import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const CATEGORIES = [
    "Semua", "Tips & Trik", "Inspirasi Renovasi", "Material Bangunan", "Gaya Hidup", "Kabar NguliKang"
];

const BLOG_POSTS = [
    {
        id: 1,
        title: "5 Tips Memilih Keramik Kamar Mandi yang Aman dan Estetik",
        excerpt: "Jangan salah pilih! Simak tips memilih keramik kamar mandi yang tidak licin namun tetap mempercantik ruangan Anda.",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
        date: "31 Des 2025",
        category: "Tips & Trik",
        featured: true
    },
    {
        id: 2,
        title: "Tren Warna Cat Rumah 2026: Kembali ke Alam",
        excerpt: "Warna-warna earth tone diprediksi akan mendominasi tren desain interior tahun depan. Temukan inspirasinya di sini.",
        image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
        date: "30 Des 2025",
        category: "Inspirasi Renovasi",
        featured: true
    },
    {
        id: 3,
        title: "Mengenal Jenis-Jenis Pasir untuk Konstruksi Bangunan",
        excerpt: "Tidak semua pasir sama. Ketahui jenis pasir yang tepat untuk pondasi, plesteran, dan cor beton agar bangunan kokoh.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
        date: "28 Des 2025",
        category: "Material Bangunan",
        featured: true
    },
    {
        id: 4,
        title: "Cara Mengatasi Atap Bocor Saat Musim Hujan",
        excerpt: "Atap bocor bisa merusak plafon dan perabot. Lakukan perbaikan darurat ini sebelum tukang datang.",
        image: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=800&q=80",
        date: "25 Des 2025",
        category: "Tips & Trik",
        featured: false
    },
    {
        id: 5,
        title: "Biaya Renovasi Dapur Minimalis Ukuran 3x3 Meter",
        excerpt: "Simulasi biaya renovasi dapur kecil dengan budget hemat tapi hasil mewah. Cek rinciannya.",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
        date: "22 Des 2025",
        category: "Inspirasi Renovasi",
        featured: false
    },
    {
        id: 6,
        title: "Keunggulan Bata Ringan (Hebel) vs Bata Merah",
        excerpt: "Bingung pilih bahan dinding? Bandingkan kelebihan dan kekurangan hebel dengan bata merah konvensional.",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        date: "20 Des 2025",
        category: "Material Bangunan",
        featured: false
    },
    {
        id: 7,
        title: "Inspirasi Taman Kering di Lahan Sempit",
        excerpt: "Punya sisa lahan sedikit? Ubah jadi taman kering (zen garden) yang minim perawatan.",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
        date: "18 Des 2025",
        category: "Gaya Hidup",
        featured: false
    },
    {
        id: 8,
        title: "Update Harga Besi Beton Terbaru Desember 2025",
        excerpt: "Pantau pergerakan harga material besi beton berbagai ukuran di pasaran saat ini.",
        image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&q=80",
        date: "15 Des 2025",
        category: "Kabar NguliKang",
        featured: false
    },
    {
        id: 9,
        title: "Tips Hemat Listrik dengan Desain Rumah Terbuka",
        excerpt: "Pencahayaan alami dan sirkulasi udara yang baik bisa pangkas tagihan listrik hingga 30%.",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
        date: "10 Des 2025",
        category: "Tips & Trik",
        featured: false
    }
];

const Blog = ({ onNavigate, onPostSelect }) => {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);

    // Helper to open post
    const handlePostClick = (post) => {
        if (onPostSelect) {
            onPostSelect(post);
        }
    };

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(6);
    }, [activeCategory, searchQuery]);

    // --- FILTER LOGIC ---
    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchCategory = activeCategory === "Semua" || post.category === activeCategory;
        const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const featuredPost = BLOG_POSTS[0];
    const subFeaturedPosts = BLOG_POSTS.slice(1, 4);

    return (
        <div style={{ background: '#09090b', minHeight: '100vh', color: '#e4e4e7', fontFamily: 'Inter, sans-serif' }}>

            {/* --- HERO SECTION --- */}
            <div style={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                overflow: 'hidden'
            }}>
                {/* Background Image & Overlay */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(9,9,11,1) 100%)', zIndex: 2 }} />
                    <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop" alt="Construction Blog" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', padding: '0 20px', width: '100%' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 20px', lineHeight: '1.1', color: 'white' }}>
                            Yuk, Liat Apa yang <br /> <span style={{ color: '#FF8C42' }}>Baru di NguliKang</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#d4d4d8', marginBottom: '40px' }}>
                            Temukan inspirasi, tips, dan kabar terbaru seputar dunia konstruksi.
                        </p>

                        {/* Search Bar (Marketplace Style) */}
                        <div style={{
                            position: 'relative',
                            background: 'rgba(39, 39, 42, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            <span style={{ paddingLeft: '20px', fontSize: '1.2rem' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Cari artikel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px 15px',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Categories Section (Moved out of hero container to be below it) */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '8px 24px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap',
                                cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                                background: activeCategory === cat ? '#FF8C42' : 'white',
                                color: activeCategory === cat ? 'white' : 'black'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px' }}>

                {/* FEATURED SECTION (Only show on 'Semua' and no search) */}
                {activeCategory === "Semua" && !searchQuery && (
                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Kamu Mungkin Suka</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '30px', height: '400px' }}>

                            {/* Big Featured */}
                            <div
                                onClick={() => handlePostClick(featuredPost)}
                                style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', group: 'hover' }}
                            >
                                <img src={featuredPost.image} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '30px' }}>
                                    <span style={{ background: '#FF8C42', color: 'black', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block' }}>{featuredPost.category}</span>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '10px', lineHeight: 1.2 }}>{featuredPost.title}</h3>
                                    <p style={{ color: '#d4d4d8', fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{featuredPost.excerpt}</p>
                                    <div style={{ marginTop: '15px', color: '#a1a1aa', fontSize: '0.85rem' }}>{featuredPost.date}</div>
                                </div>
                            </div>

                            {/* Side Features */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {subFeaturedPosts.map(post => (
                                    <div
                                        key={post.id}
                                        onClick={() => handlePostClick(post)}
                                        style={{ display: 'flex', gap: '20px', height: '33%', cursor: 'pointer' }}
                                    >
                                        <div style={{ width: '140px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#FF8C42', fontWeight: 'bold', marginBottom: '4px' }}>{post.category}</div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginBottom: '6px', lineHeight: 1.3 }}>{post.title}</h4>
                                            <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{post.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )}

                {/* GRID SECTION */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Artikel Terbaru</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                        <AnimatePresence>
                            {filteredPosts.slice(0, visibleCount).map(post => (
                                <motion.div
                                    key={post.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handlePostClick(post)}
                                >
                                    <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/3', marginBottom: '16px', border: '1px solid #27272a' }}>
                                        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                            onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#a1a1aa', marginBottom: '8px' }}>
                                            {post.date} • <span style={{ color: '#FF8C42' }}>{post.category}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '8px', lineHeight: 1.4 }}>{post.title}</h3>
                                        <p style={{ fontSize: '0.95rem', color: '#71717a', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredPosts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>
                            <p>Tidak ada artikel yang ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* LOAD MORE */}
                {filteredPosts.length > visibleCount && (
                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            style={{
                                background: 'transparent', border: '1px solid #3f3f46', borderRadius: '100px',
                                color: 'white', padding: '12px 40px', fontSize: '0.9rem', fontWeight: 'bold',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.target.style.background = '#27272a'}
                            onMouseOut={e => e.target.style.background = 'transparent'}
                        >
                            Lihat Selengkapnya
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Blog;
