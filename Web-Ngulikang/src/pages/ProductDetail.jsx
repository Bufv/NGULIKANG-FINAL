import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { marketplaceApi } from '../lib/api';

const formatRelativeDate = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'hari ini';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks} minggu lalu`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} bulan lalu`;
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} tahun lalu`;
};

const buildRatingStats = (reviews) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    reviews.forEach((review) => {
        const rating = Math.max(1, Math.min(5, Number(review.rating || 0)));
        counts[rating] += 1;
        sum += rating;
    });
    const total = reviews.length;
    const average = total ? Number((sum / total).toFixed(1)) : 0;
    const satisfaction = total
        ? Math.round((reviews.filter((review) => Number(review.rating || 0) >= 4).length / total) * 100)
        : 0;
    return { average, total, satisfaction, counts };
};


const ProductDetail = ({ product: initialProduct, onNavigate }) => {
    const { addToCart } = useCart();
    const { showNotification } = useNotification();
    const [productData, setProductData] = useState(initialProduct || null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('detail');
    const [mainImage, setMainImage] = useState(
        initialProduct ? (initialProduct.imageUrl || initialProduct.image || initialProduct.images?.[0] || '') : ''
    );

    useEffect(() => {
        let isActive = true;
        const selectedId = initialProduct?.id || localStorage.getItem('ngulikang_selected_product_id');

        if (initialProduct) {
            setProductData(initialProduct);
            setMainImage(initialProduct.imageUrl || initialProduct.image || initialProduct.images?.[0] || '');
        }

        if (!selectedId) {
            return () => {
                isActive = false;
            };
        }

        marketplaceApi
            .getProduct(selectedId)
            .then(({ data }) => {
                if (!isActive) {
                    return;
                }
                const fetched = data?.data;
                if (fetched) {
                    setProductData(fetched);
                    setMainImage(
                        fetched.imageUrl ||
                        fetched.images?.[0] ||
                        fetched.productImages?.[0]?.url ||
                        initialProduct?.imageUrl ||
                        initialProduct?.image ||
                        ''
                    );
                }
            })
            .catch(() => {
                if (!initialProduct && isActive) {
                    setProductData(null);
                }
            });

        return () => {
            isActive = false;
        };
    }, [initialProduct]);

    const product = productData;

    if (!product) return <div style={{ color: 'white', padding: '50px' }}>Loading...</div>;

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        addToCart({ ...product, image: product.imageUrl || product.image }, quantity);
        showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
    };

    const reviews = Array.isArray(product.reviews) ? product.reviews : [];
    const ratingStats = product.ratingStats || buildRatingStats(reviews);
    const ratingValue = Number(ratingStats.average || 0);
    const ratingTotal = Number(ratingStats.total || 0);
    const soldValue = product.sold || 0;
    const mainImageUrl = product.imageUrl || product.image || 'https://via.placeholder.com/400';
    const galleryImages = [
        mainImageUrl,
        ...(product.images || product.productImages?.map((img) => img.url) || [])
    ].filter(Boolean);
    const uniqueGallery = Array.from(new Set(galleryImages));
    const specs = product.specs || product.productSpecs?.map((spec) => ({ label: spec.label, value: spec.value })) || [];
    const detailText = product.description || `${product.name} adalah pilihan terbaik untuk kebutuhan konstruksi Anda.`;

    // Filter Logic
    const [filterMedia, setFilterMedia] = useState(false);
    const [filterRatings, setFilterRatings] = useState([]); // Array of numbers
    const [sortOption, setSortOption] = useState('paling_membantu');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const sortOptionsMap = {
        'paling_membantu': 'Paling Membantu',
        'terbaru': 'Terbaru',
        'rating_tertinggi': 'Rating Tertinggi',
        'rating_terendah': 'Rating Terendah'
    };

    const normalizedReviews = reviews.map((review, index) => {
        const rawMedia = Array.isArray(review.mediaUrls)
            ? review.mediaUrls
            : Array.isArray(review.images)
                ? review.images
                : [];
        const mediaUrls = rawMedia.filter(Boolean);
        return {
            ...review,
            id: review.id || `review-${index}`,
            authorName: review.authorName || review.user?.name || review.user || 'Pembeli',
            content: review.content || review.text || '',
            mediaUrls,
            hasMedia: mediaUrls.length > 0,
            displayDate: formatRelativeDate(review.createdAt) || review.date || ''
        };
    });

    const filteredReviews = normalizedReviews.filter(review => {
        // Filter by Media
        if (filterMedia && !review.hasMedia) return false;
        // Filter by Rating
        if (filterRatings.length > 0 && !filterRatings.includes(review.rating)) return false;
        return true;
    }).sort((a, b) => {
        if (sortOption === 'rating_tertinggi') return b.rating - a.rating;
        if (sortOption === 'rating_terendah') return a.rating - b.rating;
        if (sortOption === 'terbaru') {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        }
        return 0; // 'paling_membantu' (default mock)
    });

    const reviewMedia = normalizedReviews.flatMap((review) => review.mediaUrls || []);
    const mediaDisplay = reviewMedia.length ? reviewMedia : uniqueGallery;

    return (
        <div style={{ minHeight: '100vh', color: '#e4e4e7', fontFamily: 'Inter, sans-serif' }}>
            {/* Reuse specific header logic or simple back button if preferred, but user likely wants consistent nav */}
            {/* We can just use the provided Header component if it doesn't conflict, or a simple top bar */}

            <div style={{ paddingBottom: '40px', paddingTop: '220px' }}>
                {/* Breadcrumb / Back */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span onClick={() => onNavigate('marketplace')} style={{ cursor: 'pointer', color: '#FF8C42', fontWeight: 'bold' }}>Marketplace</span>
                    <span style={{ color: '#71717a' }}>/</span>
                    <span style={{ color: '#d4d4d8' }}>{product.name}</span>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>

                    {/* MAIN CONTENT COLUMN */}
                    <div>
                        {/* TOP SECTION: IMAGES AND INFO HEADER */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 400px) 1fr', gap: '40px', marginBottom: '40px' }}>
                            {/* IMAGES */}
                            <div>
                                <div style={{
                                    width: '100%', paddingTop: '100%', position: 'relative',
                                    borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a', marginBottom: '16px'
                                }}>
                                        <img
                                            src={mainImage || mainImageUrl}
                                            alt={product.name}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                                    {uniqueGallery.map((img, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setMainImage(img)}
                                            style={{
                                                minWidth: '60px', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                                                border: mainImage === img ? '2px solid #FF8C42' : '1px solid #27272a', cursor: 'pointer',
                                                opacity: mainImage === img ? 1 : 0.6,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* PRODUCT INFO HEADER & TABS & DETAIL */}
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.3', margin: '0 0 10px 0' }}>{product.name}</h1>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Terjual <span style={{ color: '#a1a1aa' }}>{soldValue}</span></span>
                                    <span style={{ borderLeft: '1px solid #3f3f46', height: '14px' }}></span>
                                        <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ color: '#fbbf24' }}>★</span> {ratingValue} <span style={{ color: '#a1a1aa' }}>({ratingTotal} ulasan)</span>
                                        </span>
                                </div>

                                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '30px' }}>
                                    Rp{Number(product.price).toLocaleString('id-ID')}
                                </div>

                                {/* TABS CONTAINER (Static here) */}
                                <div style={{ marginBottom: '20px', borderBottom: '1px solid #27272a', display: 'flex', gap: '40px' }}>
                                    {['Detail', 'Ulasan'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => {
                                                setActiveTab(tab.toLowerCase());
                                                if (tab === 'Ulasan') {
                                                    const element = document.getElementById('ulasan');
                                                    if (element) {
                                                        const offset = 80; // Adjust offset
                                                        const bodyRect = document.body.getBoundingClientRect().top;
                                                        const elementRect = element.getBoundingClientRect().top;
                                                        const elementPosition = elementRect - bodyRect;
                                                        const offsetPosition = elementPosition - offset;

                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        });
                                                    }
                                                }
                                            }}
                                            style={{
                                                background: 'transparent', border: 'none', padding: '0 0 10px',
                                                fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                                                color: activeTab === tab.toLowerCase() ? '#FF8C42' : '#a1a1aa', // Keep highlight logic or adjust? 
                                                // User might click "Detail" to just see detail here, Ulasan to scroll down.
                                                // If Detail is active, text shows. If Ulasan is active, maybe we assume they are looking down?
                                                // Let's keep logic simple: Detail tab just highlights, Ulasan tab scrolls.
                                                position: 'relative',
                                            }}
                                        >
                                            {tab} {tab === 'Ulasan' && <span style={{ color: '#71717a', fontWeight: '400', fontSize: '0.9rem' }}>({ratingTotal})</span>}
                                            {activeTab === tab.toLowerCase() && (
                                                <motion.div
                                                    layoutId="activeTabUnderline"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '3px',
                                                        background: '#FF8C42',
                                                        borderRadius: '3px 3px 0 0'
                                                    }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* DETAIL CONTENT (Always visible here if activeTab is detail? Or just always visible?) 
                                    User said "Detail dan pilihan detail ulasan benar di tempat tadi dekat foto".
                                    Implies the content is there too.
                                */}
                                <div style={{ color: '#d4d4d8', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    <p><b>Kondisi:</b> {product.condition || '-'}</p>
                                    <p>
                                        <b>Berat Satuan:</b>{' '}
                                        {product.weight ? `${product.weight} ${product.weightUnit || 'kg'}` : '-'}
                                    </p>
                                    <p><b>Kategori:</b> {product.category || '-'}</p>
                                    <p><b>Lokasi:</b> {product.location || '-'}</p>
                                    <br />
                                    <p>{detailText}</p>
                                    <br />
                                    <p><b>Spesifikasi Unggulan:</b></p>
                                    {specs.length ? (
                                        <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
                                            {specs.map((spec, idx) => (
                                                <li key={`${spec.label}-${idx}`}>{spec.label}: {spec.value}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Belum ada spesifikasi tambahan.</p>
                                    )}
                                </div>

                            </div>
                        </div>


                        {/* ULASAN SECTION (Full Width Below) */}
                        <div id="ulasan" style={{ paddingTop: '50px' }}>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px' }}>ULASAN PEMBELI</h3>

                                {/* SUMMARY CARD - Tokopedia Style */}
                                <div style={{
                                    background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '0',
                                    display: 'flex', alignItems: 'center', marginBottom: '40px', overflow: 'hidden'
                                }}>
                                    {/* Left: Overall Rating */}
                                    <div style={{
                                        padding: '40px', width: '30%', minWidth: '250px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '1.8rem', color: '#fbbf24' }}>★</span>
                                            <span style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1' }}>{ratingValue}</span>
                                            <span style={{ fontSize: '1.2rem', color: '#71717a', fontWeight: '400', alignSelf: 'flex-end', marginBottom: '6px' }}>/5.0</span>
                                        </div>
                                        <div style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>
                                            {ratingStats.satisfaction || 0}% pembeli merasa puas
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>
                                            {ratingTotal} rating • {Math.floor(ratingTotal / 1.5)} ulasan
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ width: '1px', alignSelf: 'stretch', background: '#27272a' }}></div>

                                    {/* Right: Star Bars */}
                                    <div style={{ flex: 1, padding: '30px 40px' }}>
                                        {[5, 4, 3, 2, 1].map(stars => (
                                            <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '30px' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 'bold' }}>{stars}</span>
                                                    <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>★</span>
                                                </div>
                                                <div style={{ flex: 1, height: '4px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${ratingTotal ? ((ratingStats.counts[stars] || 0) / ratingTotal) * 100 : 0}%`,
                                                        height: '100%', background: '#10b981', borderRadius: '4px'
                                                    }} />
                                                </div>
                                                <span style={{ width: '40px', textAlign: 'right', color: '#71717a', fontSize: '0.85rem' }}>{ratingStats.counts[stars] || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CONTENT SPLIT: FILTER SIDEBAR & LIST */}
                                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px' }}>

                                    {/* FILTERS SIDEBAR */}
                                    <div style={{ border: '1px solid #3f3f46', borderRadius: '12px', background: '#18181b', height: 'fit-content', overflow: 'hidden' }}>
                                        <div style={{ padding: '16px', borderBottom: '1px solid #3f3f46', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                                            FILTER ULASAN
                                        </div>

                                        {/* Media Section */}
                                        <div style={{ padding: '16px', borderBottom: '1px solid #3f3f46' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                Media
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            </div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '4px 0' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={filterMedia}
                                                    onChange={() => setFilterMedia(!filterMedia)}
                                                    style={{ accentColor: '#10b981', width: '18px', height: '18px', cursor: 'pointer' }}
                                                />
                                                <span style={{ fontSize: '0.9rem', color: '#d4d4d8' }}>Dengan Foto & Video</span>
                                            </label>
                                        </div>

                                        {/* Rating Section */}
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                Rating
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {[5, 4, 3, 2, 1].map(star => (
                                                    <label key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '2px 0' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={filterRatings.includes(star)}
                                                            onChange={() => {
                                                                setFilterRatings(prev =>
                                                                    prev.includes(star)
                                                                        ? prev.filter(r => r !== star)
                                                                        : [...prev, star]
                                                                );
                                                            }}
                                                            style={{ accentColor: '#10b981', width: '18px', height: '18px', cursor: 'pointer' }}
                                                        />
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                                            <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>★</span>
                                                            <span style={{ fontSize: '0.9rem', color: '#d4d4d8' }}>{star}</span>
                                                        </div>
                                                        <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>({ratingStats.counts[star] || 0})</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT COLUMN CONTENT */}
                                    <div>
                                        {/* PHOTOS SECTION */}
                                        <div style={{ marginBottom: '40px' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>FOTO & VIDEO PEMBELI</h4>
                                            <div style={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
                                                {mediaDisplay.slice(0, 5).map((mediaUrl, index) => (
                                                    <div key={mediaUrl || index} style={{
                                                        width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden',
                                                        border: '1px solid #27272a', position: 'relative', cursor: 'pointer'
                                                    }}>
                                                    <img src={mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        {index === 4 && reviewMedia.length > 5 && (
                                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                                +{reviewMedia.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* REVIEWS HEADER */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>ULASAN PILIHAN</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Urutkan:</span>
                                                <div
                                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                                    style={{
                                                        padding: '8px 16px', borderRadius: '8px', border: '1px solid #3f3f46',
                                                        fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
                                                        background: '#18181b', color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '8px',
                                                        minWidth: '160px', justifyContent: 'space-between'
                                                    }}
                                                >
                                                    {sortOptionsMap[sortOption]}
                                                    <svg
                                                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                        style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                                                    >
                                                        <polyline points="6 9 12 15 18 9"></polyline>
                                                    </svg>
                                                </div>

                                                {/* Custom Dropdown Menu */}
                                                {isSortOpen && (
                                                    <div style={{
                                                        position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                                        background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px',
                                                        overflow: 'hidden', zIndex: 50, width: '100%', minWidth: '180px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                                    }}>
                                                        {Object.entries(sortOptionsMap).map(([value, label]) => (
                                                            <div
                                                                key={value}
                                                                onClick={() => {
                                                                    setSortOption(value);
                                                                    setIsSortOpen(false);
                                                                }}
                                                                style={{
                                                                    padding: '10px 16px', fontSize: '0.9rem', cursor: 'pointer',
                                                                    color: sortOption === value ? '#FF8C42' : '#e4e4e7',
                                                                    background: sortOption === value ? 'rgba(255, 140, 66, 0.1)' : 'transparent',
                                                                    transition: 'background 0.2s',
                                                                    fontWeight: sortOption === value ? '600' : '400'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if (sortOption !== value) e.target.style.background = '#27272a';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (sortOption !== value) e.target.style.background = 'transparent';
                                                                }}
                                                            >
                                                                {label}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* REVIEWS LIST */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                            {filteredReviews.length > 0 ? (
                                                filteredReviews.map(review => (
                                                    <div key={review.id} style={{ borderBottom: '1px solid #27272a', paddingBottom: '32px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span key={i} style={{ color: i < review.rating ? '#fbbf24' : '#3f3f46', fontSize: '0.9rem' }}>★</span>
                                                                ))}
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', color: '#71717a', marginLeft: '6px' }}>• {review.displayDate || '-'}</span>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `hsl(${review.id * 50}, 70%, 50%)` }} />
                                                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{review.authorName}</div>
                                                        </div>

                                                        <div style={{ fontSize: '1rem', lineHeight: '1.5', color: '#e4e4e7', marginBottom: '16px' }}>
                                                            {review.content}
                                                        </div>

                                                        {review.hasMedia && (
                                                            <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #27272a' }}>
                                                                <img src={review.mediaUrls?.[0] || mainImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: '60px', textAlign: 'center', color: '#71717a', border: '1px dashed #27272a', borderRadius: '12px' }}>
                                                    Belum ada ulasan yang sesuai dengan filter ini.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* RIGHT: CARD (Sticky) */}
                    <div>
                        <div style={{ position: 'sticky', top: '120px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '20px' }}>
                            <div style={{ fontWeight: '700', marginBottom: '15px' }}>Atur jumlah dan catatan</div>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #3f3f46', borderRadius: '8px', padding: '8px', width: 'fit-content', marginBottom: '20px' }}>
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    style={{ background: 'transparent', border: 'none', color: '#FF8C42', fontSize: '1.2rem', padding: '0 10px', cursor: 'pointer' }}
                                >-</button>
                                <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    style={{ background: 'transparent', border: 'none', color: '#FF8C42', fontSize: '1.2rem', padding: '0 10px', cursor: 'pointer' }}
                                >+</button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ color: '#a1a1aa' }}>Subtotal</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Rp{(Number(product.price) * quantity).toLocaleString('id-ID')}</span>
                            </div>

                            <button onClick={handleAddToCart} style={{ width: '100%', padding: '12px', background: '#FF8C42', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '10px' }}>+ Keranjang</button>
                            <button style={{ width: '100%', padding: '12px', background: 'transparent', color: '#FF8C42', border: '1px solid #FF8C42', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Beli Langsung</button>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
};

export default ProductDetail;
