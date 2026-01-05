import React, { useRef } from 'react';
import BlurText from '../components/ui/BlurText';
import Ballpit from '../components/ui/Ballpit';
import CardSwap, { Card } from '../components/ui/CardSwap';
import Particles from '../components/ui/Particles';
import TiltedCard from '../components/ui/TiltedCard';
import ProfileCard from '../components/ui/ProfileCard';

// Import local images
import constructionImg1 from '../components/ui/images/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg';
import constructionImg2 from '../components/ui/images/scott-blake-x-ghf9LjrVg-unsplash.jpg';
import constructionImg3 from '../components/ui/images/glenov-brankovic-ZYUcxbMeaIY-unsplash.jpg';
import constructionImg4 from '../components/ui/images/joe-holland-80zZ1s24Nag-unsplash.jpg';
import tukangImage from '../components/ui/images/TUKANG.PNG.png';

import LiveChat from '../components/ui/LiveChat';

// Import Team Images
import halimImg from '../components/ui/images/anggota-kelompok/halim.jpg';
import zakiImg from '../components/ui/images/anggota-kelompok/zaki.jpg';
import rifkiImg from '../components/ui/images/anggota-kelompok/rifki.jpg';
import handivaImg from '../components/ui/images/anggota-kelompok/handiva.jpg';
import zhilalulImg from '../components/ui/images/anggota-kelompok/zhilalul.jpg';

const Home = () => {
    return (
        <div className="home-page" style={{ position: 'relative', overflow: 'hidden' }}>
            <LiveChat />
            <Particles count={40} color="#FF8C42" />
            {/* Hero Section */}
            <section className="hero" id="home" style={{ background: 'transparent' }}>
                <Ballpit
                    count={100}
                    colors={['#FF4500', '#FF8C00', '#ffffff', '#1a1a1a']}
                    gravity={0.35}
                    friction={0.99}
                    wallBounce={0.9}
                    followCursor={false}
                    style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
                />
                <div className="hero-overlay" style={{ opacity: 0.6, pointerEvents: 'none' }}></div>

                <div className="container">
                    <div className="hero-content">
                        <div className="logo-section" style={{ position: 'relative', zIndex: 10 }}>
                            <h2 className="logo-subtitle">Layanan Kami</h2>
                            <div className="logo-title-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                                <BlurText
                                    text="NGULIKANG"
                                    className="logo-title"
                                    delay={0.2}
                                    animateBy="letters"
                                />
                            </div>
                            <p className="logo-tagline">UNTUK MEMBANGUN RUMAH</p>
                        </div>
                        <p className="hero-description">
                            Kami menyediakan layanan konstruksi profesional dengan tim berpengalaman untuk mewujudkan rumah
                            impian Anda
                        </p>
                        <button className="cta-button">Hubungi Kami</button>
                    </div>
                </div>
            </section>

            {/* Card Swap Section - React Bits Style */}
            <section style={{
                padding: '150px 20px',
                background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container" style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    position: 'relative',
                    zIndex: 2
                }}>
                    {/* Two Column Layout like React Bits */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '80px',
                        alignItems: 'center'
                    }}>
                        {/* Left Side - Text */}
                        <div style={{ paddingRight: '40px' }}>
                            <h2 style={{
                                fontSize: '3.5rem',
                                fontWeight: '700',
                                color: 'white',
                                lineHeight: '1.2',
                                marginBottom: '20px',
                                letterSpacing: '-0.02em'
                            }}>
                                Cari Tukang Jadi Mudah dengan NguliKang
                            </h2>
                            <p style={{
                                fontSize: '1.2rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                                lineHeight: '1.6'
                            }}>
                                Platform terpercaya untuk menemukan tukang profesional sesuai kebutuhan Anda. Dari borongan hingga harian, semua ada di sini dengan harga transparan dan kualitas terjamin.
                            </p>
                        </div>

                        {/* Right Side - Card Swap */}
                        <div style={{
                            height: '700px',
                            position: 'relative',
                            overflow: 'visible',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingRight: '0'
                        }}>
                            <CardSwap
                                width={700}
                                height={550}
                                cardDistance={60}
                                verticalDistance={70}
                                delay={2500}
                                pauseOnHover={true}
                                easing="elastic"
                                skewAmount={6}
                            >
                                <Card customClass="window-card">
                                    <div className="window-bar">
                                        <div className="window-bar-item">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                            </svg>
                                            <span>Borongan</span>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{
                                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4), transparent 50%),
                                                         radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.3), transparent 50%),
                                                         url(${constructionImg1})`
                                    }}>
                                        <h4>Nguli Borongan</h4>
                                        <p>Paket lengkap proyek konstruksi dengan sistem borongan. Cocok untuk pembangunan rumah, renovasi total, atau proyek besar lainnya dengan harga tetap.</p>
                                    </div>
                                </Card>

                                <Card customClass="window-card">
                                    <div className="window-bar">
                                        <div className="window-bar-item">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="16 18 22 12 16 6"></polyline>
                                                <polyline points="8 6 2 12 8 18"></polyline>
                                            </svg>
                                            <span>Harian</span>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{
                                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4), transparent 50%),
                                                         radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.3), transparent 50%),
                                                         url(${constructionImg2})`
                                    }}>
                                        <h4>Nguli Harian</h4>
                                        <p>Sistem pembayaran harian untuk kebutuhan tukang sementara. Fleksibel dan efisien untuk pekerjaan kecil atau perbaikan cepat tanpa komitmen jangka panjang.</p>
                                    </div>
                                </Card>

                                <Card customClass="window-card">
                                    <div className="window-bar">
                                        <div className="window-bar-item">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                            </svg>
                                            <span>Korporate</span>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{
                                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4), transparent 50%),
                                                         radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.3), transparent 50%),
                                                         url(${constructionImg3})`
                                    }}>
                                        <h4>Nguli Korporate</h4>
                                        <p>Solusi konstruksi khusus untuk perusahaan dan proyek komersial. Manajemen profesional, dokumentasi lengkap, dan jaminan kualitas standar korporat.</p>
                                    </div>
                                </Card>

                                <Card customClass="window-card">
                                    <div className="window-bar">
                                        <div className="window-bar-item">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                                            </svg>
                                            <span>Premium</span>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{
                                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4), transparent 50%),
                                                         radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.3), transparent 50%),
                                                         url(${constructionImg1})`
                                    }}>
                                        <h4>Nguli Jagoan Premium</h4>
                                        <p>Layanan konsultasi dan pengerjaan dengan tukang berpengalaman pilihan. Mendapatkan tenaga ahli terbaik dengan track record terbukti untuk hasil maksimal.</p>
                                    </div>
                                </Card>

                                <Card customClass="window-card">
                                    <div className="window-bar">
                                        <div className="window-bar-item">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                            <span>Renovasi</span>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{
                                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4), transparent 50%),
                                                         radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.3), transparent 50%),
                                                         url(${constructionImg2})`
                                    }}>
                                        <h4>Nguli Renovasi</h4>
                                        <p>Spesialis renovasi dan perbaikan bangunan existing. Dari perubahan kecil hingga renovasi total, ditangani tim berpengalaman dengan hasil rapi dan berkualitas.</p>
                                    </div>
                                </Card>

                                <Card customClass="window-card">
                                    <div className="window-bar">
                                        <div className="window-bar-item">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            <span>Bangun Baru</span>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{
                                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4), transparent 50%),
                                                         radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.3), transparent 50%),
                                                         url(${constructionImg3})`
                                    }}>
                                        <h4>Nguli Bangun Baru</h4>
                                        <p>Pembangunan dari nol dengan perencanaan matang dan eksekusi profesional. Mulai dari pondasi hingga finishing, semua dikerjakan dengan standar kualitas tinggi.</p>
                                    </div>
                                </Card>
                            </CardSwap>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '20px' }}>
                            Mengapa Harus <span style={{ color: '#FF8C42' }}>NguliKang?</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                            Kami memberikan standar baru dalam dunia konstruksi dengan mengutamakan kualitas, transparansi, dan kepercayaan.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '40px',
                        justifyItems: 'center'
                    }}>
                        <TiltedCard
                            imageSrc={constructionImg1}
                            altText="Tukang Terverifikasi"
                            captionText="NguliKang - Terverifikasi"
                            containerHeight="400px"
                            containerWidth="100%"
                            imageHeight="400px"
                            imageWidth="100%"
                            rotateAmplitude={12}
                            scaleOnHover={1.05}
                            showMobileWarning={false}
                            showTooltip={true}
                            displayOverlayContent={true}
                            overlayContent={
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    padding: '30px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    textAlign: 'left'
                                }}>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '10px' }}>Tukang Terverifikasi</h3>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                                        Setiap tukang telah melewati proses seleksi ketat dan sertifikasi untuk menjamin kualitas pekerjaan.
                                    </p>
                                </div>
                            }
                        />

                        <TiltedCard
                            imageSrc={constructionImg2}
                            altText="Harga Transparan"
                            captionText="NguliKang - Transparan"
                            containerHeight="400px"
                            containerWidth="100%"
                            imageHeight="400px"
                            imageWidth="100%"
                            rotateAmplitude={12}
                            scaleOnHover={1.05}
                            showMobileWarning={false}
                            showTooltip={true}
                            displayOverlayContent={true}
                            overlayContent={
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    padding: '30px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    textAlign: 'left'
                                }}>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '10px' }}>Harga Transparan</h3>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                                        Rincian biaya jelas di awal (RAB). Tidak ada biaya tersembunyi atau mark-up mendadak.
                                    </p>
                                </div>
                            }
                        />

                        <TiltedCard
                            imageSrc={constructionImg3}
                            altText="Garansi Pekerjaan"
                            captionText="NguliKang - Bergaransi"
                            containerHeight="400px"
                            containerWidth="100%"
                            imageHeight="400px"
                            imageWidth="100%"
                            rotateAmplitude={12}
                            scaleOnHover={1.05}
                            showMobileWarning={false}
                            showTooltip={true}
                            displayOverlayContent={true}
                            overlayContent={
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    padding: '30px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    textAlign: 'left'
                                }}>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '10px' }}>Garansi 1 Tahun</h3>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                                        Kami memberikan jaminan garansi pemeliharaan selama 1 tahun untuk ketenangan hati Anda.
                                    </p>
                                </div>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Tim Pengembang Section */}
            <section style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '20px' }}>
                            Tim <span style={{ color: '#FF8C42' }}>Pengembang</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                            Di balik NguliKang, ada tim hebat yang berdedikasi untuk memberikan solusi terbaik bagi kebutuhan konstruksi Anda.
                        </p>
                    </div>

                    {/* Slider Control Wrapper */}
                    <div style={{ position: 'relative', padding: '0 20px' }}>



                        {/* Cards Container - Horizontal Scroll */}
                        <div
                            id="team-scroll-container"
                            style={{
                                display: 'flex',
                                gap: '30px',
                                overflowX: 'auto',
                                padding: '40px 10px',
                                scrollBehavior: 'smooth',
                                scrollbarWidth: 'none', // Firefox
                                msOverflowStyle: 'none', // IE/Edge
                                alignItems: 'stretch'
                            }}
                            className="hide-scrollbar" // Helper class if needed, but inline style works for most
                        >
                            <style>{`
                                #team-scroll-container::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            <ProfileCard
                                name="Halim Widyakesuma Suwanto"
                                title="Project Manager"
                                handle="halim_ws"
                                avatarUrl={halimImg}
                                miniAvatarUrl={halimImg}
                                status="Managing"
                            />
                            <ProfileCard
                                name="M Zaky Fathurrahman"
                                title="System Architecture"
                                handle="zaky_fathur"
                                avatarUrl={zakiImg}
                                miniAvatarUrl={zakiImg}
                                status="Architecting"
                            />
                            <ProfileCard
                                name="Muhammad Rifki Apreliant"
                                title="Full Stack (Frontend & Backend)"
                                handle="miki"
                                avatarUrl={rifkiImg}
                                miniAvatarUrl={rifkiImg}
                                status="Coding"
                            />
                            <ProfileCard
                                name="Handiva Rahmawan Diachmadja"
                                title="Quality Assurance"
                                handle="handiva_rd"
                                avatarUrl={handivaImg}
                                miniAvatarUrl={handivaImg}
                                status="Testing"
                            />
                            <ProfileCard
                                name="Zhilalul Furqan"
                                title="Backend Developer"
                                handle="zhilalul_fq"
                                avatarUrl={zhilalulImg}
                                miniAvatarUrl={zhilalulImg}
                                status="Developing"
                            />
                        </div>


                    </div>
                </div>
            </section>

            {/* Testimoni Section */}
            <section style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '20px' }}>
                            Apa Kata <span style={{ color: '#FF8C42' }}>Mereka?</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                            Kepercayaan pelanggan adalah prioritas kami. Dengarkan pengalaman mereka yang telah menggunakan layanan NguliKang.
                        </p>
                    </div>

                    {/* Testimonial Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px',
                        justifyItems: 'center'
                    }}>
                        {/* Testimonial Card 1 */}
                        <div style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '30px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                            backdropFilter: 'blur(20px) saturate(120%)',
                            border: '1px solid rgba(255, 140, 66, 0.25)',
                            borderRadius: '24px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 140, 66, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}>
                            {/* Rating Stars */}
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} style={{ color: '#FF8C42', fontSize: '20px' }}>★</span>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p style={{
                                fontSize: '1rem',
                                color: 'rgba(255, 255, 255, 0.85)',
                                lineHeight: '1.7',
                                marginBottom: '25px',
                                fontStyle: 'italic'
                            }}>
                                "Pelayanan NguliKang sangat memuaskan! Tukang yang datang profesional dan hasil kerjanya rapi. Harga juga transparan, tidak ada biaya tersembunyi."
                            </p>

                            {/* Customer Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img
                                    src="https://i.pravatar.cc/100?img=1"
                                    alt="Customer"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(255, 140, 66, 0.3)',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '3px' }}>
                                        Budi Santoso
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 140, 66, 0.8)' }}>
                                        Pemilik Rumah, Jakarta
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Card 2 */}
                        <div style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '30px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                            backdropFilter: 'blur(20px) saturate(120%)',
                            border: '1px solid rgba(255, 140, 66, 0.25)',
                            borderRadius: '24px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 140, 66, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} style={{ color: '#FF8C42', fontSize: '20px' }}>★</span>
                                ))}
                            </div>

                            <p style={{
                                fontSize: '1rem',
                                color: 'rgba(255, 255, 255, 0.85)',
                                lineHeight: '1.7',
                                marginBottom: '25px',
                                fontStyle: 'italic'
                            }}>
                                "Renovasi rumah jadi mudah dengan NguliKang. Tim mereka sangat responsif dan selalu update progress pekerjaan. Highly recommended!"
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img
                                    src="https://i.pravatar.cc/100?img=2"
                                    alt="Customer"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(255, 140, 66, 0.3)',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '3px' }}>
                                        Siti Nurhaliza
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 140, 66, 0.8)' }}>
                                        Pengusaha, Bandung
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Card 3 */}
                        <div style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '30px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                            backdropFilter: 'blur(20px) saturate(120%)',
                            border: '1px solid rgba(255, 140, 66, 0.25)',
                            borderRadius: '24px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 140, 66, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} style={{ color: '#FF8C42', fontSize: '20px' }}>★</span>
                                ))}
                            </div>

                            <p style={{
                                fontSize: '1rem',
                                color: 'rgba(255, 255, 255, 0.85)',
                                lineHeight: '1.7',
                                marginBottom: '25px',
                                fontStyle: 'italic'
                            }}>
                                "Pengalaman terbaik menggunakan jasa konstruksi. Dari konsultasi hingga finishing, semuanya profesional. Terima kasih NguliKang!"
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img
                                    src="https://i.pravatar.cc/100?img=3"
                                    alt="Customer"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(255, 140, 66, 0.3)',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '3px' }}>
                                        Ahmad Rizki
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 140, 66, 0.8)' }}>
                                        Arsitek, Surabaya
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 20px',
                position: 'relative',
                zIndex: 2,
                overflow: 'hidden'
            }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                        backdropFilter: 'blur(30px) saturate(150%)',
                        borderRadius: '32px',
                        padding: '60px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 140, 66, 0.3)',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '60px',
                        alignItems: 'center'
                    }}>
                        {/* Left Content */}
                        <div>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                color: 'white',
                                marginBottom: '30px',
                                lineHeight: '1.2',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                            }}>
                                Inilah, <span style={{ color: '#FF8C42' }}>NguliKang.</span> Jasa Andalan Masyarakat Indonesia.
                            </h2>

                            <button style={{
                                padding: '16px 40px',
                                background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.3), rgba(255, 140, 66, 0.15))',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                border: '1px solid rgba(255, 140, 66, 0.4)',
                                borderRadius: '16px',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(255, 140, 66, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                            }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 8px 24px rgba(255, 140, 66, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)';
                                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 140, 66, 0.5), rgba(255, 140, 66, 0.25))';
                                    e.target.style.borderColor = 'rgba(255, 140, 66, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 16px rgba(255, 140, 66, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)';
                                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 140, 66, 0.3), rgba(255, 140, 66, 0.15))';
                                    e.target.style.borderColor = 'rgba(255, 140, 66, 0.4)';
                                }}>
                                Hubungi Kami
                            </button>
                        </div>

                        {/* Right Image */}
                        <div style={{
                            width: '280px',
                            height: '280px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        }}>
                            <img
                                src={tukangImage}
                                alt="NguliKang Worker"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '20px' }}>
                            Tips & <span style={{ color: '#FF8C42' }}>Artikel</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                            Dapatkan tips konstruksi, panduan renovasi, dan informasi terbaru seputar dunia bangunan.
                        </p>
                    </div>

                    {/* Blog Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px',
                        justifyItems: 'center'
                    }}>
                        {/* Blog Card 1 */}
                        <div style={{
                            width: '100%',
                            maxWidth: '400px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                            backdropFilter: 'blur(20px) saturate(120%)',
                            border: '1px solid rgba(255, 140, 66, 0.25)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 140, 66, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}>
                            {/* Blog Image */}
                            <div style={{
                                width: '100%',
                                height: '220px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop"
                                    alt="Blog Post"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(255, 140, 66, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    Tips
                                </div>
                            </div>

                            {/* Blog Content */}
                            <div style={{ padding: '25px' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'rgba(255, 140, 66, 0.8)',
                                    marginBottom: '12px',
                                    fontWeight: '500'
                                }}>
                                    28 Desember 2024
                                </p>

                                <h3 style={{
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    marginBottom: '15px',
                                    lineHeight: '1.3'
                                }}>
                                    5 Tips Memilih Tukang Bangunan yang Profesional
                                </h3>

                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    lineHeight: '1.6',
                                    marginBottom: '20px'
                                }}>
                                    Panduan lengkap memilih tukang bangunan yang tepat untuk proyek konstruksi rumah Anda.
                                </p>

                            </div>
                        </div>

                        {/* Blog Card 2 */}
                        <div style={{
                            width: '100%',
                            maxWidth: '400px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                            backdropFilter: 'blur(20px) saturate(120%)',
                            border: '1px solid rgba(255, 140, 66, 0.25)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 140, 66, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}>
                            <div style={{
                                width: '100%',
                                height: '220px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop"
                                    alt="Blog Post"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(255, 140, 66, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    Panduan
                                </div>
                            </div>

                            <div style={{ padding: '25px' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'rgba(255, 140, 66, 0.8)',
                                    marginBottom: '12px',
                                    fontWeight: '500'
                                }}>
                                    25 Desember 2024
                                </p>

                                <h3 style={{
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    marginBottom: '15px',
                                    lineHeight: '1.3'
                                }}>
                                    Estimasi Biaya Renovasi Rumah Type 36
                                </h3>

                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    lineHeight: '1.6',
                                    marginBottom: '20px'
                                }}>
                                    Rincian lengkap estimasi biaya untuk renovasi rumah type 36 dengan berbagai pilihan material.
                                </p>

                            </div>
                        </div>

                        {/* Blog Card 3 */}
                        <div style={{
                            width: '100%',
                            maxWidth: '400px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                            backdropFilter: 'blur(20px) saturate(120%)',
                            border: '1px solid rgba(255, 140, 66, 0.25)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 140, 66, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}>
                            <div style={{
                                width: '100%',
                                height: '220px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop"
                                    alt="Blog Post"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(255, 140, 66, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    Artikel
                                </div>
                            </div>

                            <div style={{ padding: '25px' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'rgba(255, 140, 66, 0.8)',
                                    marginBottom: '12px',
                                    fontWeight: '500'
                                }}>
                                    20 Desember 2024
                                </p>

                                <h3 style={{
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    marginBottom: '15px',
                                    lineHeight: '1.3'
                                }}>
                                    Tren Desain Interior Rumah Minimalis 2024
                                </h3>

                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    lineHeight: '1.6',
                                    marginBottom: '20px'
                                }}>
                                    Inspirasi desain interior rumah minimalis modern yang sedang trending di tahun 2024.
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
