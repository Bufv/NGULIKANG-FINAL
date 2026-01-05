import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

const Cart = ({ onNavigate }) => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, promo, applyPromo, removePromo } = useCart();
    const { showNotification } = useNotification();

    // Assuming a flat list for now, but we can group by 'shop' if needed.
    // For "sama persis" look, we'll wrap them in a "Shop" card.
    const shopName = "TB. JAYA ABADI SENTOSA"; // Hardcoded for demo to match "Toko" feel

    const [selectedItems, setSelectedItems] = useState(cartItems.map(item => item.id)); // Default select all

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleDeleteSelected = () => {
        selectedItems.forEach(id => removeFromCart(id));
        setSelectedItems([]);
    }

    const totalSelectedPrice = cartItems
        .filter(item => selectedItems.includes(item.id))
        .reduce((total, item) => total + (item.price * item.quantity), 0);

    const countSelected = selectedItems.length;

    // Recommendations mock items
    const recommendedItems = [
        { id: 101, name: 'Semen Tigaroda 40kg', price: 58000, image: 'https://images.unsplash.com/photo-1518709779341-56cf8536f864?w=500&auto=format&fit=crop&q=60' },
        { id: 102, name: 'Cat Tembok Putih 5kg', price: 125000, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60' },
        { id: 103, name: 'Paku Beton 5cm', price: 15000, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60' },
        { id: 104, name: 'Kuas Cat 3 Inch', price: 12000, image: 'https://images.unsplash.com/photo-1599694605008-5d6361996724?w=500&auto=format&fit=crop&q=60' },
    ];

    // Local input state for the field
    const [inputCode, setInputCode] = useState('');

    useEffect(() => {
        if (promo.code) setInputCode(promo.code);
    }, [promo.code]);

    const handleApplyPromoClick = () => {
        const result = applyPromo(inputCode, totalSelectedPrice);
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    };

    const handleRemovePromoClick = () => {
        removePromo();
        setInputCode('');
        showNotification('Kode promo dihapus', 'info');
    };

    const finalTotal = totalSelectedPrice - promo.discount;

    return (
        <div style={{ padding: '120px 5% 50px', minHeight: '100vh', color: '#e4e4e7' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px' }}>Keranjang</h1>

            <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>

                {/* LEFT COLUMN: ITEM LIST */}
                <div style={{ flex: '3', minWidth: '300px' }}>

                    {/* Header Select All */}
                    <div style={{
                        background: '#18181b',
                        padding: '16px 24px',
                        borderRadius: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        border: '1px solid #27272a'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input
                                type="checkbox"
                                checked={countSelected === cartItems.length && cartItems.length > 0}
                                onChange={handleSelectAll}
                                style={{ width: '20px', height: '20px', accentColor: '#FF8C42', cursor: 'pointer' }}
                            />
                            <span style={{ fontWeight: '600', fontSize: '1rem' }}>Pilih Semua ({cartItems.length})</span>
                        </div>
                        {countSelected > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                style={{ color: '#FF8C42', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
                            >
                                Hapus
                            </button>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px', background: '#18181b', borderRadius: '16px', border: '1px solid #27272a' }}>
                            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Keranjang belanja Anda kosong.</p>
                            <button
                                onClick={() => onNavigate('marketplace')}
                                style={{ marginTop: '20px', padding: '10px 24px', background: '#FF8C42', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Mulai Belanja
                            </button>
                        </div>
                    ) : (
                        <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', overflow: 'hidden' }}>
                            {/* Shop Header */}
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length > 0} // Simplification logic
                                    readOnly
                                    style={{ width: '20px', height: '20px', accentColor: '#FF8C42' }}
                                />
                                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{shopName}</span>
                                <span style={{ fontSize: '0.8rem', background: '#FF8C42', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Official Store</span>
                            </div>

                            {/* Items */}
                            <div>
                                {cartItems.map((item, idx) => (
                                    <div key={idx} style={{ padding: '24px', borderBottom: idx !== cartItems.length - 1 ? '1px solid #27272a' : 'none', display: 'flex', gap: '16px' }}>
                                        <div style={{ paddingTop: '5px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                                style={{ width: '20px', height: '20px', accentColor: '#FF8C42', cursor: 'pointer' }}
                                            />
                                        </div>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #3f3f46', flexShrink: 0 }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', lineHeight: '1.4' }}>{item.name}</h3>
                                                <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Varian: Standard</p>
                                            </div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Rp{item.price.toLocaleString('id-ID')}</h4>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total: Rp{(item.price * item.quantity).toLocaleString('id-ID')}</h4>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <button
                                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                    onClick={() => removeFromCart(item.id)}
                                                    title="Hapus"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>

                                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #3f3f46', borderRadius: '8px' }}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: item.quantity <= 1 ? '#555' : 'white', cursor: item.quantity <= 1 ? 'default' : 'pointer', fontSize: '1.1rem' }}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#FF8C42', cursor: 'pointer', fontSize: '1.1rem' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* RECOMMENDATIONS */}
                    {cartItems.length > 0 && (
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.4rem', fontWeight: 'bold' }}>Rekomendasi untukmu</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                {recommendedItems.map(rec => (
                                    <motion.div
                                        key={rec.id}
                                        whileHover={{ y: -5 }}
                                        style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px', cursor: 'pointer' }}
                                        onClick={() => showNotification("Detail item akan ditampilkan!", "info")}
                                    >
                                        <div style={{ height: '150px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                                            <img src={rec.image} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px', lineHeight: '1.3' }}>{rec.name}</div>
                                        <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Rp{rec.price.toLocaleString('id-ID')}</div>
                                        <button style={{ width: '100%', padding: '8px', border: '1px solid #FF8C42', color: '#FF8C42', background: 'transparent', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>+ Keranjang</button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* RIGHT COLUMN: SUMMARY */}
                {cartItems.length > 0 && (
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{ position: 'sticky', top: '120px' }}>
                            <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
                                {/* PROMO CODE INPUT */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px' }}>Kode Promo</h3>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder="Masukkan kode promo"
                                            value={inputCode}
                                            onChange={(e) => setInputCode(e.target.value)}
                                            disabled={promo.code !== null}
                                            style={{
                                                flex: 1,
                                                padding: '10px 15px',
                                                borderRadius: '8px',
                                                border: '1px solid #3f3f46',
                                                background: '#27272a',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                        {promo.code ? (
                                            <button
                                                onClick={handleRemovePromoClick}
                                                style={{
                                                    padding: '10px 15px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ef4444',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleApplyPromoClick}
                                                style={{
                                                    padding: '10px 15px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#FF8C42',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Pakai
                                            </button>
                                        )}
                                    </div>
                                    {promo.code && (
                                        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#4ade80' }}>
                                            Kode promo <b>{promo.code}</b> berhasil digunakan!
                                        </div>
                                    )}
                                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#71717a' }}>
                                        Coba kode: <b>HEMAT10</b> atau <b>NGULI50</b>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Ringkasan belanja</h3>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: '#a1a1aa' }}>
                                    <span>Total Harga ({countSelected} barang)</span>
                                    <span>Rp{totalSelectedPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.95rem', color: promo.code ? '#4ade80' : '#a1a1aa' }}>
                                    <span>Total Diskon Barang</span>
                                    <span>-Rp{promo.discount.toLocaleString('id-ID')}</span>
                                </div>

                                <div style={{ borderTop: '1px solid #3f3f46', paddingTop: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total Belanja</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FF8C42' }}>Rp{finalTotal.toLocaleString('id-ID')}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onNavigate('checkout')}
                                    disabled={countSelected === 0}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: countSelected > 0 ? '#FF8C42' : '#3f3f46',
                                        color: countSelected > 0 ? 'white' : '#71717a',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        cursor: countSelected > 0 ? 'pointer' : 'not-allowed',
                                        boxShadow: countSelected > 0 ? '0 10px 20px -5px rgba(255, 140, 66, 0.4)' : 'none'
                                    }}
                                >
                                    Beli ({countSelected})
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
