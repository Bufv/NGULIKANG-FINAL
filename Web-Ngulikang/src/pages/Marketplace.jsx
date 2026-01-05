import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import { marketplaceApi } from '../lib/api';

const CATEGORY_OPTIONS = [
    'Bahan Bangunan',
    'Peralatan',
    'Listrik',
    'Pipa & Sanitasi',
    'Cat & Finishing',
    'Kayu & Furnitur',
    'Atap & Plafon',
    'Lainnya'
];

const Marketplace = ({ onNavigate, onProductSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryQuery, setCategoryQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [sortBy, setSortBy] = useState('popular');
    const [cartCount, setCartCount] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1, limit: 12 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resultsRef = useRef(null);

    const handleSearchScroll = () => {
        if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchScroll();
        }
    };

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await marketplaceApi.listProducts({
                page,
                limit: pagination.limit,
                search: searchQuery || undefined,
                category: categoryQuery || undefined,
                minPrice: priceRange[0],
                maxPrice: priceRange[1]
            });
            setProducts(data.data || []);
            setPagination((prev) => ({
                ...prev,
                page: data.pagination?.page || page,
                total: data.pagination?.total || 0,
                totalPages: data.pagination?.totalPages || 1
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat produk');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, [searchQuery, categoryQuery, priceRange]);

    const handleAddToCart = (productName) => {
        setCartCount(prev => prev + 1);
        setToastMessage(`${productName} berhasil ditambahkan ke keranjang`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price_low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price_high') return Number(b.price) - Number(a.price);
        return 0;
    });

    const handlePageChange = (nextPage) => {
        if (nextPage < 1 || nextPage > pagination.totalPages) {
            return;
        }
        fetchProducts(nextPage);
    };

    return (
        <div style={{ minHeight: '100vh', color: '#e4e4e7', fontFamily: 'Inter, sans-serif' }}>
            <Particles count={40} color="#FF8C42" />
            <div style={{
                position: 'relative', height: '100vh', width: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '0px', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <img
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                        alt="Background"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), #18181b)' }} />
                </div>

                <div className="marketplace-hero-content" style={{ position: 'relative', zIndex: 10, padding: '0 20px', maxWidth: '800px', width: '100%', marginTop: '60px' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '0 0 10px', lineHeight: '1.1', color: 'white' }}>NguliKang <span style={{ color: '#FF8C42' }}>Marketplace</span></h1>
                        <p style={{ fontSize: '1.2rem', color: '#d4d4d8', marginBottom: '40px' }}>Temukan material bangunan berkualitas & alat konstruksi terbaik <br /> dengan harga terjangkau.</p>
                        <div style={{ position: 'relative', background: 'rgba(39, 39, 42, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '10px', display: 'flex', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <input
                                type="text"
                                placeholder="Cari produk material, alat, atau perlengkapan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '15px 20px', fontSize: '1.1rem', outline: 'none' }}
                            />
                            <button
                                onClick={handleSearchScroll}
                                style={{ background: '#FF8C42', color: 'white', border: 'none', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', fontSize: '1.2rem' }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div ref={resultsRef} style={{ width: '100%', padding: '160px 40px 40px 40px', minHeight: '100vh' }}>
                <div className="marketplace-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px' }}>

                    <div className="marketplace-filter" style={{ alignSelf: 'start', position: 'sticky', top: '100px', background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Filter</h2>
                            <span
                                style={{ fontSize: '0.8rem', color: '#FF8C42', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryQuery('');
                                    setPriceRange([0, 1000000]);
                                }}
                            >
                                Reset
                            </span>
                        </div>
                        <div style={{ marginBottom: '24px', borderBottom: '1px solid #3f3f46', paddingBottom: '20px' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '12px' }}>Kategori</h3>
                            <select
                                value={categoryQuery}
                                onChange={(e) => setCategoryQuery(e.target.value)}
                                style={{ width: '100%', background: '#27272a', border: '1px solid #3f3f46', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                            >
                                <option value="">Semua kategori</option>
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '12px' }}>Harga</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#27272a', borderRadius: '6px', padding: '0 10px' }}>
                                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Rp</span>
                                    <input
                                        type="number"
                                        placeholder="Harga Minimum"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
                                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px', fontSize: '0.9rem', width: '100%', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#27272a', borderRadius: '6px', padding: '0 10px' }}>
                                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Rp</span>
                                    <input
                                        type="number"
                                        placeholder="Harga Maksimum"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value || 0)])}
                                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px', fontSize: '0.9rem', width: '100%', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                                <button onClick={() => setPriceRange([0, 100000])} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '100px', background: '#27272a', color: '#ccc', border: '1px solid #3f3f46', cursor: 'pointer' }}>&lt; 100rb</button>
                                <button onClick={() => setPriceRange([100000, 500000])} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '100px', background: '#27272a', color: '#ccc', border: '1px solid #3f3f46', cursor: 'pointer' }}>100-500rb</button>
                                <button onClick={() => setPriceRange([500000, 2000000])} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '100px', background: '#27272a', color: '#ccc', border: '1px solid #3f3f46', cursor: 'pointer' }}>&gt; 500rb</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Menampilkan <strong>{products.length}</strong> produk dari <strong>{pagination.total}</strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Urutkan:</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#18181b', color: 'white', border: '1px solid #27272a', cursor: 'pointer', outline: 'none', fontWeight: '600' }}>
                                    <option value="popular">Terbaru</option>
                                    <option value="price_low">Harga Terendah</option>
                                    <option value="price_high">Harga Tertinggi</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div style={{ marginBottom: '20px', color: '#f87171' }}>{error}</div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                            <AnimatePresence>
                                {sortedProducts.map(product => (
                                    <motion.div
                                        layout
                                        key={product.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                        style={{ background: '#1f1f23', borderRadius: '8px', border: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                                        onClick={() => onProductSelect(product)}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '100%', width: '100%' }}>
                                            <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: '8px 10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: '400', margin: '0 0 4px 0', lineHeight: '1.35', color: '#fff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.7em' }}>{product.name}</h3>
                                            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Rp{Number(product.price).toLocaleString('id-ID')}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#a1a1aa', marginTop: 'auto' }}>
                                                <span>📍 {product.location || 'Lokasi tidak tersedia'}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#a1a1aa' }}>Memuat produk...</div>
                        )}
                        {!loading && sortedProducts.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
                                <h3>Produk tidak ditemukan</h3>
                                <p>Coba gunakan kata kunci lain atau ubah filter.</p>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '30px' }}>
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                style={{ padding: '10px 16px', background: '#27272a', color: '#e4e4e7', border: '1px solid #3f3f46', borderRadius: '8px', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                            >
                                Sebelumnya
                            </button>
                            <div style={{ padding: '10px 16px', color: '#a1a1aa' }}>
                                Halaman {pagination.page} / {pagination.totalPages}
                            </div>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                style={{ padding: '10px 16px', background: '#27272a', color: '#e4e4e7', border: '1px solid #3f3f46', borderRadius: '8px', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                Berikutnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
