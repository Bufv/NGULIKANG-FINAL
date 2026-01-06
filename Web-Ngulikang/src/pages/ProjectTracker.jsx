import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ProjectTracker = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setIsLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        let color = '#888';
        let label = status;

        if (status === 'pending') { color = '#F59E0B'; label = 'Menunggu Pembayaran'; }
        if (status === 'in_progress') { color = '#3B82F6'; label = 'Sedang Dikerjakan'; }
        if (status === 'completed') { color = '#10B981'; label = 'Selesai'; }
        if (status === 'cancelled') { color = '#EF4444'; label = 'Dibatalkan'; }

        return (
            <span style={{
                background: `${color}20`,
                color: color,
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                border: `1px solid ${color}40`
            }}>
                {label}
            </span>
        );
    };

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            <Navbar />

            <div style={{
                paddingTop: '100px',
                paddingBottom: '50px',
                maxWidth: '1200px',
                margin: '0 auto',
                paddingLeft: '20px',
                paddingRight: '20px'
            }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>
                        Tracker <span style={{ color: '#FF8C42' }}>Proyek</span>
                    </h1>
                    <p style={{ color: '#888' }}>Pantau perkembangan proyek renovasi dan pembangunan Anda secara real-time.</p>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div style={{
                            display: 'inline-block',
                            width: '40px',
                            height: '40px',
                            border: '4px solid #333',
                            borderTop: '4px solid #FF8C42',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ marginTop: '20px', color: '#666' }}>Memuat data proyek...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px',
                        background: '#111',
                        borderRadius: '24px',
                        border: '1px solid #222'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏗️</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Belum Ada Proyek</h3>
                        <p style={{ color: '#666', marginBottom: '30px' }}>Anda belum memiliki proyek yang sedang berjalan.</p>
                        <a href="/borongan" style={{
                            background: '#FF8C42',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>Mulai Proyek Baru</a>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                whileHover={{ y: -5 }}
                                style={{
                                    background: '#111',
                                    borderRadius: '24px',
                                    padding: '24px',
                                    border: '1px solid #222',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                                    <div>
                                        <div style={{
                                            marginBottom: '8px',
                                            background: '#222',
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            color: '#aaa',
                                            fontWeight: '600'
                                        }}>
                                            #{order.id.slice(0, 8)}
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                                            {order.projectType || 'Proyek Renovasi'}
                                        </h3>
                                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                <div style={{
                                    background: '#1a1a1a',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <img
                                        src={order.tukang?.avatar || 'https://via.placeholder.com/50'}
                                        alt={order.tukang?.name}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Dikerjakan oleh</div>
                                        <div style={{ fontWeight: 'bold' }}>{order.tukang?.name || 'Menunggu Tukang'}</div>
                                    </div>
                                </div>

                                {/* Progress Bar Mini */}
                                {order.progressUpdates && order.progressUpdates[0] ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                            <span style={{ color: '#888' }}>Progress Terkini</span>
                                            <span style={{ color: '#FF8C42', fontWeight: 'bold' }}>{order.progressUpdates[0].progressPercentage}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: '#333', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${order.progressUpdates[0].progressPercentage}%`,
                                                height: '100%',
                                                background: '#FF8C42',
                                                borderRadius: '10px'
                                            }}></div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            "{order.progressUpdates[0].notes}"
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '10px 0', color: '#444', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        Belum ada update progress
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {/* DETAIL MODAL */}
            <AnimatePresence>
                {selectedOrder && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        background: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }} onClick={() => setSelectedOrder(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="no-scrollbar"
                            style={{
                                background: '#121212',
                                border: '1px solid #333',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '700px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                position: 'relative'
                            }}
                        >
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>Detail Proyek</h2>
                                        <div style={{ color: '#888' }}>ID: #{selectedOrder.id}</div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        style={{ background: '#222', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}
                                    >✕</button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>Total Biaya</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#FF8C42' }}>
                                            Rp {parseInt(selectedOrder.totalPrice).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>Status</div>
                                        <div style={{ marginTop: '5px' }}><StatusBadge status={selectedOrder.status} /></div>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    ⏱️ Riwayat Progress
                                </h3>

                                <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #333', marginLeft: '10px' }}>
                                    {selectedOrder.progressUpdates?.length > 0 ? (
                                        selectedOrder.progressUpdates.map((update, idx) => (
                                            <div key={idx} style={{ marginBottom: '30px', position: 'relative' }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '-29px',
                                                    top: '0',
                                                    width: '16px',
                                                    height: '16px',
                                                    background: idx === 0 ? '#FF8C42' : '#333',
                                                    borderRadius: '50%',
                                                    border: '4px solid #121212'
                                                }}></div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 'bold', color: idx === 0 ? 'white' : '#888' }}>
                                                        {update.progressPercentage}% Completed
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                                        {new Date(update.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <p style={{ color: '#aaa', lineHeight: '1.5', margin: '0 0 10px 0' }}>{update.notes}</p>

                                                {update.images && update.images.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                                                        {update.images.map((img, i) => (
                                                            <img key={i} src={img} alt="Progress" style={{ height: '80px', borderRadius: '8px', cursor: 'pointer' }} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ color: '#666', fontStyle: 'italic' }}>Belum ada update progress.</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectTracker;
