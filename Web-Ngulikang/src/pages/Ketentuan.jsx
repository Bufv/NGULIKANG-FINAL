import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';

// --- IMAGES ---
import imgLayanan from '../components/ui/images/ciptakan_pekerjaan/kategori layanan lengkap.png';
import imgPenghasilan from '../components/ui/images/ciptakan_pekerjaan/penghasil hingga 10jt.png';
import imgLingkungan from '../components/ui/images/ciptakan_pekerjaan/perlindungan asuransi.png';
import imgSupport from '../components/ui/images/ciptakan_pekerjaan/tim support siap kapan aja.png';

// Job Category Images (FIXED NAMES)
import imgAllInOne from '../components/ui/images/ciptakan_pekerjaan/nguliallinone.png';
import imgKayu from '../components/ui/images/ciptakan_pekerjaan/nguli kayu.png';
import imgCatReal from '../components/ui/images/ciptakan_pekerjaan/ngulicat.png'; // Correct name without space
import imgListrik from '../components/ui/images/ciptakan_pekerjaan/nguli listrik.png';
import imgBangunan from '../components/ui/images/ciptakan_pekerjaan/nguli bangunan.png';
import imgPipa from '../components/ui/images/ciptakan_pekerjaan/nguli pipa.png';
import imgBesi from '../components/ui/images/ciptakan_pekerjaan/nguli besi.png';
import imgGypsum from '../components/ui/images/ciptakan_pekerjaan/nguli gypsum.png';
import imgKeramik from '../components/ui/images/ciptakan_pekerjaan/nguli keramik.png';
import imgAtap from '../components/ui/images/ciptakan_pekerjaan/nguli atap.png';
import imgPaving from '../components/ui/images/ciptakan_pekerjaan/ngulipaving.png';
import imgAc from '../components/ui/images/ciptakan_pekerjaan/nguli ac.png';
import imgBor from '../components/ui/images/ciptakan_pekerjaan/ngulibor.png'; // Correct name

// --- ICONS (Mock for the design) ---
// ... (icons remain)

// ... (in component)

const jobs = [
    {
        title: "Nguli All in One (Serbabisa)",
        desc: "Jasa tukang serbaguna untuk berbagai kebutuhan",
        longDesc: "Jasa tukang serbaguna adalah solusi terbaik bagi Anda yang memiliki berbagai keahlian di bidang konstruksi. Dalam peran ini, Anda tidak hanya terbatas pada satu jenis pekerjaan, melainkan siap menangani berbagai tantangan renovasi dan perbaikan rumah.\n\nLingkup pekerjaan mencakup pengecatan dinding yang rapi, perbaikan kerusakan kecil pada atap atau lantai, hingga instalasi kelistrikan dasar dan perpipaan sederhana. Fleksibilitas adalah kunci utama di sini; satu hari Anda mungkin memperbaiki keran yang bocor, dan hari berikutnya Anda bisa saja membantu pengecatan ulang kamar tidur.\n\nKami mencari individu yang memiliki inisiatif tinggi, kemampuan pemecahan masalah (troubleshooting) yang cepat, dan tentu saja hasil kerja yang rapi. Bergabung sebagai Nguli Serbabisa memungkinkan Anda untuk mendapatkan orderan yang lebih sering karena cakupan kebutuhan klien yang sangat luas. Maksimalkan potensi penghasilan Anda dengan menjadi solusi 'All-in-One' bagi setiap permasalahan rumah tangga klien Anda!",
        img: imgAllInOne,
        tags: ["Full-Time", "NguliAllInOne", "TukangSerbaguna"]
    },
    {
        title: "Nguli Kayu",
        desc: "Jasa pengerjaan kayu untuk perabot, pintu, jendela",
        longDesc: "Sebagai ahli dalam pengerjaan kayu, Anda akan bertanggung jawab untuk menciptakan karya yang tidak hanya fungsional tetapi juga estetis. Pekerjaan ini melingkupi pembuatan furniture custom seperti lemari, meja, dan kursi, hingga pemasangan elemen struktural seperti kusen pintu dan jendela.\n\nKeahlian dalam memilih jenis kayu yang tepat, pemotongan yang presisi, serta teknik penyambungan yang kuat sangatlah diutamakan. Anda juga diharapkan mampu melakukan finishing halus (amplas & pernis) agar hasil akhir terlihat mewah dan tahan lama.\n\nKami mencari tukang kayu yang memiliki jiwa seni dan ketelatenan tinggi. Jika Anda bangga dengan serpihan kayu dan aroma vernis, ini adalah tempat yang tepat untuk mengembangkan karir Anda.",
        img: imgKayu,
        tags: ["Full-Time", "NguliKayu", "KonstruksiKayu"]
    },
    {
        title: "Nguli Cat",
        desc: "Jasa pengecatatan dinding interior dan eksterior",
        longDesc: "Menjadi spesialis pengecatan berarti Anda adalah seniman yang memberikan 'wajah' baru bagi sebuah bangunan. Tugas Anda mencakup pengecatan dinding interior agar terasa hangat dan nyaman, serta perlindungan dinding eksterior dari cuaca ekstrem.\n\nProses kerja tidak hanya sekadar mengayunkan kuas. Anda harus ahli dalam persiapan permukaan (dempul, amplas), pemilihan jenis cat yang sesuai (water-based vs oil-based), serta teknik aplikasi yang rapi tanpa ceceran. Pengetahuan tentang kombinasi warna dan teknik dekoratif akan menjadi nilai tambah yang besar.\n\nBergabunglah dengan kami untuk mewarnai ribuan hunian dan gedung komersial, memberikan kepuasan visual bagi setiap klien.",
        img: imgCatReal,
        tags: ["Full-Time", "NguliCat", "Pengecatan"]
    },
    {
        title: "Nguli Listrik",
        desc: "Jasa instalasi listrik, perbaikan konsleting, dll",
        longDesc: "Keselamatan dan keandalan adalah prioritas utama bagi seorang Nguli Listrik. Anda akan menangani instalasi sistem kelistrikan mulai dari pemasangan titik lampu, stop kontak, hingga perakitan panel listrik utama (MCB Box).\n\nKemampuan analisis (troubleshooting) sangat dibutuhkan untuk mengatasi masalah seperti korsleting, arus pendek, atau tagihan listrik yang membengkak akibat kebocoran arus. Pemahaman mendalam tentang standar instalasi (PUIL) wajib dimiliki untuk menjamin keamanan penghuni rumah.\n\nJadilah pahlawan yang menerangi rumah klien dan memastikan semua peralatan elektronik mereka dapat beroperasi dengan aman dan lancar.",
        img: imgListrik,
        tags: ["Full-Time", "NguliListrik", "Instalasi"]
    },
    {
        title: "Nguli Bangunan",
        desc: "Jasa pembangunan rumah dari nol hingga jadi",
        longDesc: "Nguli Bangunan adalah tulang punggung dari setiap proyek konstruksi. Anda akan terlibat dalam proses pembangunan fisik mulai dari penggalian pondasi, pemasangan batu bata/hebel, plesteran, hingga pengacian dinding.\n\nFisik yang prima dan pemahaman tentang struktur bangunan sangatlah penting. Anda harus memastikan setiap dinding tegak lurus (waterpass) dan setiap campuran semen memiliki takaran yang pas agar bangunan kokoh berdiri selama puluhan tahun.\n\nKami mengundang para pekerja keras yang siap membangun masa depan, satu batu bata demi satu batu bata, untuk bergabung dalam tim konstruksi elite kami.",
        img: imgBangunan,
        tags: ["Full-Time", "NguliBangunan", "Konstruksi"]
    },
    {
        title: "Nguli Pipa/Ledeng",
        desc: "Jasa perbaikan pipa bocor, saluran air, kran",
        longDesc: "Air adalah kebutuhan vital, dan Anda adalah ahlinya. Tugas utama meliputi instalasi jalur pipa air bersih dan kotor, pemasangan tandon air, pompa, hingga fixture sanitasi seperti wastafel, closet, dan shower.\n\nKeahlian deteksi kebocoran yang tersembunyi di dalam dinding atau tanah adalah skill langka yang sangat dicari. Anda harus mampu bekerja dengan teliti agar tidak ada tetesan air yang terbuang percuma atau merusak struktur bangunan.\n\nBantu klien kami mendapatkan aliran air yang lancar dan sistem sanitasi yang sehat dengan keahlian plumbing Anda.",
        img: imgPipa,
        tags: ["Full-Time", "NguliPipa", "Plumbing"]
    },
    {
        title: "Nguli Besi",
        desc: "Jasa pembuatan dan pengelasan pagar besi",
        longDesc: "Spesialis pengolahan logam untuk berbagai kebutuhan konstruksi. Anda akan mengerjakan pembuatan pagar, teralis jendela, kanopi, railing tangga, hingga konstruksi atap baja ringan.\n\nKeahlian las listrik (welding) yang rapi dan kuat adalah syarat mutlak. Selain itu, kemampuan menghitung beban dan memotong material dengan presisi akan menentukan keamanan dan estetika hasil akhir.\n\nJika Anda ahli dalam menaklukkan kerasnya besi menjadi karya yang indah dan fungsional, segera bergabunglah untuk mendapatkan proyek-proyek bernilai tinggi.",
        img: imgBesi,
        tags: ["Full-Time", "NguliBesi", "Welding"]
    },
    {
        title: "Nguli Gypsum",
        desc: "Jasa pemasangan plafon gypsum dan partisi",
        longDesc: "Menciptakan langit-langit (plafon) yang indah dan partisi ruangan yang rapi adalah tugas utama Anda. Pekerjaan mencakup pemasangan rangka hollow, pemasangan papan gypsum, hingga finishing compound dan pengecatan.\n\nKerapian adalah segalanya. Sambungan antar papan gypsum harus tidak terlihat, dan permukaan harus rata sempurna. Anda juga mungkin diminta membuat desain drop ceiling atau hidden lamp yang estetik.\n\nBergabunglah untuk mempercantik interior ribuan rumah dengan sentuhan artistik dan kerapian tangan Anda.",
        img: imgGypsum,
        tags: ["Full-Time", "NguliGypsum", "Interior"]
    },
    {
        title: "Nguli Keramik",
        desc: "Jasa pemasangan lantik keramik, granit, marmer",
        longDesc: "Lantai adalah elemen interior yang paling sering bersentuhan dengan penghuni. Tugas Anda adalah memasang keramik, granit, atau marmer dengan presisi tinggi, memastikan pola potong yang pas dan nat yang lurus.\n\nAnda harus paham teknik leveling agar lantai tidak bergelombang dan air dapat mengalir dengan baik (terutama di kamar mandi). Pemasangan plint dan aksesoris lantai lainnya juga menjadi bagian dari tanggung jawab Anda.\n\nJadilah bagian dari tim kami untuk menciptakan pijakan yang nyaman dan mewah bagi setiap hunian.",
        img: imgKeramik,
        tags: ["Full-Time", "NguliKeramik", "Lantai"]
    },
    {
        title: "Nguli Atap",
        desc: "Jasa pemasangan dan perbaikan atap bocor",
        longDesc: "Bekerja di ketinggian adalah makanan sehari-hari Anda. Tugas utama meliputi pemasangan rangka atap (kayu/baja ringan), pemasangan genteng, hingga aplikasi waterproofing untuk mencegah kebocoran.\n\nKeahlian mendiagnosa sumber bocor pada atap lama sangat dibutuhkan. Anda adalah pelindung rumah dari panas matahari dan derasnya hujan. Keberanian dan ketaatan pada prosedur keselamatan kerja (K3) sangat diutamakan.\n\nLindungi keluarga klien kami dari cuaca tak menentu dengan keahlian konstruksi atap Anda.",
        img: imgAtap,
        tags: ["Full-Time", "Atap", "RenovasiAtap"]
    },
    {
        title: "Nguli Paving",
        desc: "Jasa pemasangan paving block untuk halaman",
        longDesc: "Menata halaman rumah, area parkir, atau jalan lingkungan agar rapi dan bebas becek. Tugas Anda meliputi pemadatan tanah (leveling), pemasangan abu batu, hingga penyusunan paving block dengan pola yang estetik.\n\nSistem drainase yang baik harus diperhatikan agar tidak terjadi genangan air. Kekuatan susunan paving agar tidak amblas saat dilalui kendaraan juga menjadi tanggung jawab utama Anda.\n\nTata lingkungan yang asri dan rapi bersama kami, dan dapatkan proyek lansekap yang berkelanjutan.",
        img: imgPaving,
        tags: ["Full-Time", "NguliPaving", "PavingBlock"]
    },
    {
        title: "Nguli AC",
        desc: "Jasa instalasi, service, dan cuci AC",
        longDesc: "Menjaga kesejukan udara di negara tropis adalah tugas mulia. Anda akan melayani pemasangan unit AC baru, cuci rutin (cleaning), isi freon, hingga perbaikan unit yang rusak atau tidak dingin.\n\nPengetahuan tentang berbagai tipe AC (Split, Cassette, Central) dan merek sangat membantu. Kejujuran dalam diagnosa kerusakan sparepart adalah kunci kepercayaan pelanggan.\n\nBergabunglah menjadi teknisi pendingin udara profesional dengan arus orderan yang tak pernah putus sepanjang tahun.",
        img: imgAc,
        tags: ["Full-Time", "NguliAC", "Elektronik"]
    },
    {
        title: "Nguli Bor Sumur",
        desc: "Jasa pengeboran sumur bor, sumur resapan",
        longDesc: "Menyediakan akses air bersih bagi rumah tangga maupun industri. Anda menggunakan mesin bor atau teknik manual untuk mencapai akuifer air tanah yang jernih dan layak konsumsi.\n\nPengetahuan tentang kondisi tanah (geologi) setempat sangat diperlukan untuk menentukan kedalaman pengeboran. Instalasi casing pipa dan pompa submersible juga menjadi bagian dari paket pekerjaan Anda.\n\nJadilah sumber kehidupan bagi banyak orang dengan menyediakan air bersih yang melimpah.",
        img: imgBor,
        tags: ["Full-Time", "SumurBor", "AirTanah"]
    },
];

const Section = ({ children, className = "", style = {} }) => (
    <div className={className} style={{ position: 'relative', width: '100%', overflow: 'hidden', ...style }}>
        {children}
    </div>
);

const Ketentuan = () => {
    // --- SLIDESHOW DATA & LOGIC ---

    const heroSlides = [
        {
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
            title: <>Bergabung Bersama <span style={{ color: '#FF8C42' }}>NguliKang</span></>,
            subtitle: "Bangun masa depan karir konstruksi Anda dengan akses ke ribuan proyek dari klien terpercaya di seluruh Indonesia."
        },
        {
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
            title: <>Keselamatan & <span style={{ color: '#FF8C42' }}>Keamanan Terjamin</span></>,
            subtitle: "Kami memprioritaskan keselamatan kerja dan jaminan pembayaran tepat waktu untuk setiap proyek yang Anda kerjakan."
        },
        {
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
            title: <>Komunitas Tukang <span style={{ color: '#FF8C42' }}>Profesional</span></>,
            subtitle: "Jadilah bagian dari jaringan profesional terbesar, tingkatkan keahlian, dan dapatkan sertifikasi resmi."
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Ganti slide setiap 5 detik
        return () => clearInterval(timer);
    }, []);

    // Lock Body Scroll when Modal is Open
    useEffect(() => {
        if (selectedJob) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedJob]);

    // --- DATA ---
    const benefits = [
        {
            img: imgLayanan,
            title: "Akses Layanan Lengkap",
            desc: "Beragam pilihan karir dan dukungan fasilitas lengkap untuk menunjang pekerjaan."
        },
        {
            img: imgPenghasilan,
            title: "Penghasilan Tinggi",
            desc: "Dapatkan bayaran yang kompetitif sesuai dengan keahlian Anda."
        },
        {
            img: imgLingkungan,
            title: "Lingkungan Nyaman",
            desc: "Kami menjamin keselamatan dan kenyamanan kerja di lapangan."
        },
        {
            img: imgSupport,
            title: "Asuransi Kerja",
            desc: "Perlindungan penuh untuk setiap pekerjaan yang Anda lakukan."
        }
    ];


    const steps = [
        { num: 1, title: "Daftar Online", desc: "Isi formulir pendaftaran dengan data diri lengkap." },
        { num: 2, title: "Verifikasi Data", desc: "Tim kami akan memverifikasi keahlian & sertifikat Anda." },
        { num: 3, title: "Latihan & Tes", desc: "Ikuti sesi pelatihan standar keselamatan kerja." },
        { num: 4, title: "Sertifikasi Proyek", desc: "Dapatkan badge verified & mulai ambil proyek!" }
    ];

    const testimonialColumns = [
        [
            { name: "Pak Slamet", role: "Nguli Besi", text: "Verifikasinya emang agak ketat, tapi itu bikin kita jadi lebih dipercaya sama pemilik rumah. Profesional.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Mas Tio", role: "Nguli Bangunan", text: "Klien-klien dari NguliKang rata-rata orang baik dan proyeknya jelas speknya. Gak bikin bingung di lapangan.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Bang Roji", role: "Nguli Cat", text: "Awalnya ragu, tapi ternyata beneran cair cepet duitnya tiap minggu. Mantap NguliKang, sangat membantu!", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        ],
        [
            { name: "Pak Heri", role: "Nguli Bangunan", text: "Sistemnya jelas, kitanya kerja jadi tenang. Kalo butuh alat khusus juga bisa dibantu sewakan dari pusat.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Mas Budi", role: "Nguli Pipa/Ledeng", text: "Komunitas tukangnya solid. Sering sharing ilmu baru soal teknik konstruksi modern di grup NguliKang.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Kang Asep", role: "Nguli All in One (Serbabisa)", text: "Buat tukang harian kayak saya, aplikasi ini nolong banget pas lagi kosong proyek borongan. Rezeki lancar.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        ],
        [
            { name: "Pak Joko", role: "Nguli Kayu", text: "Pendapatan saya naik 50% dibanding cuma ikut proyekan mandor lain. Sekarang bisa nabung buat beli alat sendiri.", img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Mas Feri", role: "Nguli Listrik", text: "Dukungan adminnya ramah. Kalau ada masalah teknis di lapangan langsung dibantu solusinya.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Bang Jefri", role: "Nguli Gypsum", text: "Gak perlu lagi nongkrong di pangkalan nunggu kerjaan dari pagi. Cukup pantau HP, tawaran masuk sendiri.", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        ],
        [
            { name: "Kang Dedi", role: "Nguli Atap", text: "Enaknya disini dibayar sesuai termin on-time. Gak ada lagi cerita pusing mikirin klien yang telat bayar.", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Pak Bambang", role: "Nguli Paving", text: "Alhamdulillah sejak gabung NguliKang, orderan renovasi gak pernah sepi. Bisa buat bayar sekolah anak lancar.", img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            { name: "Mas Yono", role: "Nguli Keramik", text: "Saya suka fitur jadwalnya. Jadi bisa atur waktu istirahat sama kerjaan sampingan tanpa bentrok.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        ]
    ];

    return (
        <div style={{ fontFamily: '"Inter", sans-serif', background: '#f5f5f5', color: '#18181b', overflowX: 'hidden' }}>

            {/* HERO SECTION */}
            <Section style={{ height: '100vh', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Background Slideshow */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'black' }}>
                    <AnimatePresence>
                        <motion.img
                            key={currentSlide}
                            src={heroSlides[currentSlide].image}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }} // Smooth crossfade transition
                            alt="Construction"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }}
                        />
                    </AnimatePresence>
                    {/* Dark Overlay for Text Readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1 }} />
                </div>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', maxWidth: '800px', padding: '0 20px', marginTop: '-50px' }}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }} // Text slides up when exiting
                            transition={{ duration: 0.8 }}
                        >
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                                {heroSlides[currentSlide].title}
                            </h1>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                {heroSlides[currentSlide].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Section>

            {/* BENEFITS SECTION */}
            <Section style={{ padding: '120px 40px', background: 'linear-gradient(180deg, #f5f5f5 0%, #fff7ed 100%)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                    {/* Left: Grid of Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {benefits.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(255, 140, 66, 0.15)' }}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '28px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px',
                                    border: '1px solid rgba(255, 140, 66, 0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ marginBottom: '8px' }}>
                                    <img src={item.img} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27272a' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.95rem', color: '#71717a', lineHeight: '1.6' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                    {/* Right: Text */}
                    <div>
                        <div style={{
                            background: '#FF8C42', color: 'white', padding: '8px 20px', borderRadius: '50px',
                            fontSize: '0.95rem', fontWeight: 'bold', width: 'fit-content', marginBottom: '24px'
                        }}>
                            Bangun Karir Anda
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '28px', color: '#27272a' }}>
                            Wujudkan <span style={{ color: '#FF8C42' }}>Karir Impian</span> <br />
                            Dengan Bergabung Bersama <span style={{ color: '#FF8C42' }}>Kami</span>
                        </h2>
                        <p style={{ fontSize: '1.15rem', color: '#52525b', lineHeight: '1.7', marginBottom: '32px' }}>
                            Bergabunglah dengan ribuan tukang profesional yang telah menemukan kemudahan dalam bekerja.
                            NguliKang hadir sebagai jembatan yang menghubungkan keahlian Anda dengan mereka yang membutuhkan,
                            didukung dengan sistem yang aman dan terpercaya.
                        </p>
                    </div>
                </div>
            </Section>

            {/* JOB CATEGORIES SECTION (Dark Orange Wave) */}
            <Section style={{
                background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)',
                padding: '100px 20px',
                color: 'white',
                borderTopLeftRadius: '100px',
                borderTopRightRadius: '100px',
                borderBottomLeftRadius: '100px',
                borderBottomRightRadius: '100px',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)', padding: '6px 20px', borderRadius: '50px',
                            fontSize: '0.9rem', width: 'fit-content', margin: '0 auto 20px auto', backdropFilter: 'blur(10px)'
                        }}>
                            Kategori Profesi
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>Mulai Ciptakan Pekerjaan Anda</h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                            Pilih bidang yang sesuai dengan keahlian Anda dan temukan peluang tak terbatas.
                        </p>
                    </div>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.12)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '50px', // Pill shape
                                    padding: '16px 32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '24px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    ...(idx === jobs.length - 1 ? { gridColumn: '1 / -1', maxWidth: '700px', marginInline: 'auto', width: '100%' } : {})
                                }}
                                onClick={() => setSelectedJob(job)}
                            >
                                <div style={{ flexShrink: 0 }}>
                                    <img src={job.img} alt={job.title} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{job.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', lineHeight: '1.4' }}>{job.desc}</p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {job.tags.map((tag, tIdx) => (
                                            <span key={tIdx} style={{
                                                fontSize: '0.65rem', fontWeight: 'bold',
                                                padding: '4px 10px', borderRadius: '20px',
                                                background: tIdx === 0 ? '#00b894' : 'transparent',
                                                color: 'white',
                                                border: '1px solid white'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>


                </div>
            </Section>

            {/* PROCESS STEPS */}
            <Section style={{ padding: '80px 20px', background: 'white', color: '#27272a' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'left', marginBottom: '60px' }}>
                        <div style={{
                            color: '#FF8C42', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px'
                        }}>
                            PROSES RECRUITMENT
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#27272a' }}>
                            Dari Persiapan hingga <br /> Sertifikasi Proyek
                        </h2>
                        <p style={{ color: '#71717a', maxWidth: '600px', margin: '15px 0 0 0' }}>
                            Proses cepat dan transparan untuk memastikan kualitas terbaik tukang kami. Ikuti langkah mudah ini untuk memulai karir Anda.
                        </p>
                    </div>

                    <div style={{ position: 'relative', height: '450px', maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Wavy Line SVG */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'visible' }} viewBox="0 0 1100 300" preserveAspectRatio="none">
                            <defs>
                                <style>
                                    {`
                                        @keyframes dashOffset {
                                            from { stroke-dashoffset: 0; }
                                            to { stroke-dashoffset: -28; }
                                        }
                                    `}
                                </style>
                            </defs>
                            <path
                                d="M160,230 C260,230 320,50 420,50 C520,50 580,230 680,230 C780,230 840,50 940,50"
                                fill="none"
                                stroke="#FF8C42"
                                strokeWidth="2"
                                strokeDasharray="8 6"
                                strokeLinecap="round"
                                style={{ animation: 'dashOffset 1s linear infinite' }}
                            />

                            {/* SMALLER DOTS - Full Orange */}
                            <circle cx="160" cy="230" r="5" fill="#FF8C42" stroke="#FF8C42" strokeWidth="3" />
                            <circle cx="420" cy="50" r="5" fill="#FF8C42" stroke="#FF8C42" strokeWidth="3" />
                            <circle cx="680" cy="230" r="5" fill="#FF8C42" stroke="#FF8C42" strokeWidth="3" />
                            <circle cx="940" cy="50" r="5" fill="#FF8C42" stroke="#FF8C42" strokeWidth="3" />
                        </svg>

                        {/* Steps Content */}
                        {[
                            { title: "Seleksi Berkas", desc: "Lengkapi data diri dan portofolio Anda secara online.", left: "160px", top: "200px" },
                            { title: "Tes Teknis", desc: "Uji kompetensi sesuai bidang keahlian Anda.", left: "420px", top: "140px" },
                            { title: "Wawancara", desc: "Diskusi langsung dengan tim ahli kami.", left: "680px", top: "200px" },
                            { title: "Onboarding", desc: "Siap diterjunkan ke proyek nyata dengan sertifikasi.", left: "940px", top: "140px" }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.2 }}
                                style={{
                                    position: 'absolute',
                                    left: step.left,
                                    top: step.top,
                                    transform: 'translateX(-50%)',
                                    width: '260px',
                                    textAlign: 'center',
                                    zIndex: 1,
                                    marginLeft: '-130px'
                                }}
                            >
                                {/* Big Number Background */}
                                <div style={{
                                    fontSize: '8rem', fontWeight: '900', color: '#f3f4f6',
                                    lineHeight: 0.8, position: 'absolute', top: idx % 2 === 0 ? '-40px' : '-20px', left: '50%', transform: 'translateX(-50%)',
                                    zIndex: -1, pointerEvents: 'none'
                                }}>
                                    {idx + 1}
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px', color: '#27272a' }}>{step.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#71717a', lineHeight: '1.5' }}>{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* TESTIMONIALS SECTION - MARQUEE ANIMATION */}
            <Section style={{ padding: '100px 0', background: '#fff7ed', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{
                            color: '#ea580c', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px'
                        }}>
                            TESTIMONI PETUGAS
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#27272a', marginBottom: '15px' }}>
                            Cerita & Pengalaman Dari Lapangan
                        </h2>
                        <p style={{ color: '#71717a', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                            Dengar langsung apa kata para mitra tukang dan tenaga ahli yang telah bergabung bersama kami.
                        </p>
                    </div>

                    {/* Marquee Container */}
                    <div style={{ position: 'relative', height: '600px', overflow: 'hidden', padding: '20px 0' }}>
                        {/* Gradients for fade effect */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to bottom, #fff7ed 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, #fff7ed 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>

                        <style>{`
                            @keyframes scrollVertical {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(-33.33%); }
                            }
                            @keyframes scrollVerticalReverse {
                                0% { transform: translateY(-33.33%); }
                                100% { transform: translateY(0); }
                            }
                        `}</style>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', height: '100%' }}>
                            {testimonialColumns.map((column, colIdx) => (
                                <div key={colIdx} style={{ height: '100%', overflow: 'hidden' }}>
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', gap: '24px',
                                        animation: `${colIdx % 2 === 0 ? 'scrollVertical' : 'scrollVerticalReverse'} ${colIdx % 2 === 0 ? '45s' : '55s'} linear infinite`
                                    }}>
                                        {/* Triple the content for smooth loop (33.33% scroll) */}
                                        {[...column, ...column, ...column].map((t, idx) => (
                                            <div key={idx} style={{
                                                background: 'white', padding: '24px', borderRadius: '16px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                                border: '1px solid rgba(0,0,0,0.03)',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                                minHeight: '200px'
                                            }}>
                                                <p style={{ fontSize: '0.95rem', color: '#52525b', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.6' }}>"{t.text}"</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img src={t.img} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', backgroundColor: '#e4e4e7' }} />
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#27272a' }}>{t.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#FF8C42' }}>{t.role}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>



            {/* REQUIREMENTS SECTION */}


            {/* FAQ SECTION */}





            {/* MODAL POPUP SELECTED JOB */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedJob(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'rgba(0, 0, 0, 0.25)', // Very Transparent Black
                                backdropFilter: 'blur(10px)', // Softer Blur
                                border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle light border
                                borderRadius: '24px',
                                padding: '50px',
                                maxWidth: '900px',
                                width: '100%',
                                position: 'relative',
                                color: 'white',
                                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            {/* Close Button */}
                            {/* Close Button with Animation */}
                            <motion.button
                                onClick={() => setSelectedJob(null)}
                                whileHover={{ rotate: 90, scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    position: 'absolute', top: '24px', right: '24px',
                                    background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%',
                                    width: '40px', height: '40px', color: 'rgba(255,255,255,0.7)',
                                    cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    outline: 'none'
                                }}
                            >
                                ✕
                            </motion.button>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 1.5fr', gap: '60px', alignItems: 'center' }}>
                                {/* Left Side - Image */}
                                <div style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    position: 'relative'
                                }}>
                                    {/* Glow effect behind image */}
                                    <div style={{
                                        position: 'absolute', width: '80%', height: '80%',
                                        background: 'radial-gradient(circle, rgba(255, 140, 66, 0.3) 0%, transparent 70%)',
                                        zIndex: 0, filter: 'blur(30px)'
                                    }}></div>
                                    <motion.img
                                        animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        src={selectedJob.img}
                                        alt={selectedJob.title}
                                        style={{ width: '100%', maxWidth: '300px', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }}
                                    />
                                </div>

                                {/* Right Side - Content */}
                                <div>
                                    <h2 style={{
                                        fontSize: '2.8rem', fontWeight: '800', marginBottom: '25px', lineHeight: 1.1,
                                        background: 'linear-gradient(to right, #fff, #ffedd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                    }}>
                                        {selectedJob.title}
                                    </h2>

                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                                        {selectedJob.tags.map(tag => (
                                            <span key={tag} style={{
                                                background: tag === 'Full-Time' ? '#059669' : '#431407',
                                                border: `1px solid ${tag === 'Full-Time' ? '#10b981' : 'rgba(255, 140, 66, 0.4)'}`,
                                                color: tag === 'Full-Time' ? 'white' : '#fdba74',
                                                padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,140,66,0.5), transparent)', marginBottom: '30px' }}></div>

                                    <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '15px' }} className="custom-scroll">
                                        <style>{`
                                            .custom-scroll::-webkit-scrollbar { width: 6px; }
                                            .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
                                            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,140,66,0.5); border-radius: 10px; }
                                            .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,140,66,0.8); }
                                        `}</style>
                                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', fontWeight: '300', whiteSpace: 'pre-line' }}>
                                            {selectedJob.longDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Ketentuan;
