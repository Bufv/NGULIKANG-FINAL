import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';

const OrderTracker = () => {
    // Mock Data Orders
    const [orders, setOrders] = useState([]);

useEffect(() => {
  let alive = true;
  apiGet('/api/market-orders')
    .then((data) => { if (alive) setOrders(data || []); })
    .catch(console.error);
  return () => { alive = false; };
}, []);


    const [selectedOrder, setSelectedOrder] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Menunggu Pembayaran': return '#f59e0b';
            case 'Diproses': return '#3b82f6';
            case 'Dikirim': return '#FF8C42';
            case 'Selesai': return '#10b981';
            case 'Dibatalkan': return '#ef4444';
            default: return '#71717a';
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
            {/* Background Gradient to match Home */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 100%, rgba(255, 140, 66, 0.15), transparent 70%), linear-gradient(180deg, #18181b 0%, #000 100%)', zIndex: 0 }} />

            <Particles count={40} color="#FF8C42" />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '160px 20px 80px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', color: 'white' }}>
                    Daftar Transaksi
                </h1>

                {/* Filter / Tabs (Simple Version) */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {['Semua', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map(status => (
                        <button key={status} style={{
                            padding: '8px 16px',
                            background: status === 'Semua' ? 'rgba(255, 140, 66, 0.1)' : 'rgba(24, 24, 27, 0.6)',
                            color: status === 'Semua' ? '#FF8C42' : '#a1a1aa',
                            border: status === 'Semua' ? '1px solid #FF8C42' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            fontWeight: status === 'Semua' ? 'bold' : 'normal',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {status}
                        </button>
                    ))}
                </div>

                {/* Order List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(24, 24, 27, 0.8)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Header */}
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(31, 31, 35, 0.5)' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Belanja</span>
                                    <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{order.date}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: `${getStatusColor(order.status)}20`,
                                        color: getStatusColor(order.status),
                                        fontWeight: 'bold'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: '#71717a' }}>{order.id}</span>
                            </div>

                            {/* Products */}
                            <div style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <img
                                        src={order.products[0].image}
                                        alt={order.products[0].name}
                                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', background: '#27272a' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '5px', color: 'white' }}>{order.products[0].name}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>
                                            {order.products[0].quantity} barang x Rp{order.products[0].price.toLocaleString('id-ID')}
                                        </div>
                                        {order.products.length > 1 && (
                                            <div style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '5px' }}>
                                                +{order.products.length - 1} produk lainnya
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '150px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Total Belanja</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Rp{order.total.toLocaleString('id-ID')}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                <button style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#FF8C42',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }} onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                                    Lihat Detail Transaksi
                                </button>
                                {order.status === 'Selesai' && (
                                    <button style={{
                                        padding: '8px 24px',
                                        background: '#FF8C42',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}>
                                        Beli Lagi
                                    </button>
                                )}
                                {order.status === 'Dikirim' && (
                                    <button style={{
                                        padding: '8px 24px',
                                        background: '#FF8C42',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }} onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                                        Lacak Paket
                                    </button>
                                )}
                            </div>

                            {/* EXPANDED DETAILS (TRACKING) */}
                            <AnimatePresence>
                                {selectedOrder?.id === order.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        <div style={{ padding: '24px' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '20px', color: '#FF8C42' }}>Status Pengiriman</h4>

                                            <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Kurir</div>
                                                    <div style={{ fontWeight: 'bold' }}>{order.shipping.courier}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>No. Resi</div>
                                                    <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{order.shipping.resi}</div>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div style={{ position: 'relative', marginLeft: '5px' }}>
                                                {order.shipping.history.map((hist, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '20px', paddingBottom: '20px', position: 'relative' }}>
                                                        {/* Line */}
                                                        {idx !== order.shipping.history.length - 1 && (
                                                            <div style={{ position: 'absolute', left: '5px', top: '20px', bottom: '0', width: '2px', background: '#3f3f46' }}></div>
                                                        )}

                                                        <div style={{
                                                            width: '12px', height: '12px', borderRadius: '50%', background: idx === 0 ? '#FF8C42' : '#3f3f46',
                                                            zIndex: 1, marginTop: '5px', boxShadow: idx === 0 ? '0 0 10px rgba(255,140,66,0.5)' : 'none'
                                                        }}></div>

                                                        <div>
                                                            <div style={{ fontSize: '0.9rem', color: idx === 0 ? 'white' : '#a1a1aa', fontWeight: idx === 0 ? 'bold' : 'normal' }}>
                                                                {hist.desc}
                                                            </div>
                                                            <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '4px' }}>{hist.date}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default OrderTracker;
