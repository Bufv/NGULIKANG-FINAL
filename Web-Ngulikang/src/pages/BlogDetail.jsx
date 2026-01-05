import React from 'react';
import { motion } from 'framer-motion';

const BlogDetail = ({ post, onNavigate }) => {
    if (!post) {
        // Fallback if no post is selected (e.g. reload), maybe redirect or show invalid
        return (
            <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
                <p>Artikel tidak ditemukan.</p>
                <button onClick={() => onNavigate('blog')}>Kembali ke Blog</button>
            </div>
        );
    }

    // --- ARTICLE CONTENT DATABASE ---
    const ARTICLE_CONTENT = {
        1: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Kamar mandi seringkali menjadi ruang yang paling "tricky" untuk didesain. Selain harus fungsional dan tahan lama, kita tentu menginginkan tampilan yang estetik dan menenangkan. Salah satu elemen kunci yang menentukan nuansa dan keamanan kamar mandi adalah pemilihan keramik (ubin).
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Banyak pemilik rumah yang terjebak memilih keramik hanya berdasarkan motif yang cantik, tanpa memperhitungkan aspek keselamatan. Padahal, kamar mandi adalah area basah dengan risiko tergelincir yang tinggi. Lantas, bagaimana cara menyeimbangkan antara keamanan dan keindahan? Berikut panduan lengkapnya.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    1. Kenali Tekstur dan "Slip Resistance"
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Aturan emas dalam memilih keramik lantai kamar mandi adalah: <strong>Jangan gunakan keramik dinding untuk lantai</strong>. Keramik dinding biasanya memiliki lapisan <em>glaze</em> yang licin dan mengkilap. Untuk lantai, Anda wajib memilih keramik dengan tekstur permukaan yang kasar atau <em>matte</em>.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Dalam dunia konstruksi, ada standar penilaian anti-selip yang disebut <em>R-rating</em>. Untuk kamar mandi, idealnya gunakan keramik dengan rating <strong>R10 atau R11</strong>. Tekstur seperti batu alam, <em>unpolished granite</em>, atau keramik berpori kasar sangat direkomendasikan karena memberikan cengkraman kaki yang baik bahkan saat kondisi bersabun.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    2. Ukuran Keramik Mempengaruhi Visual Ruangan
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Ada mitos yang mengatakan kamar mandi kecil harus memakai keramik kecil. Hal ini tidak sepenuhnya benar. Justru, penggunaan keramik berukuran besar (misalnya 60x60 cm) di ruangan kecil dapat memberikan ilusi ruangan yang lebih luas dan <em>seamless</em> karena jumlah garis nat yang lebih sedikit.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Namun, keramik kecil seperti mozaik atau hexagon punya keunggulan tersendiri dari sisi keamanan. Semakin banyak garis nat, semakin banyak "rem" atau friksi untuk kaki Anda, sehingga risiko terpeleset semakin kecil. Pilihan terbaik adalah mengkombinasikan keduanya: keramik besar untuk dinding agar terlihat lega, dan keramik ukuran sedang atau bermotif tekstur untuk lantai.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    3. Material: Keramik vs Granit (Porcelain)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Apa bedanya? Keramik biasa terbuat dari tanah liat merah/putih dengan lapisan glasir di atasnya. Granit (atau <em>homogeneous tile</em>) dibuat dengan suhu pembakaran yang jauh lebih tinggi sehingga pori-porinya sangat kecil (<em>imporsi</em>).
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Ketahanan Air:</strong> Granit jauh lebih tahan air (water resistant) dibanding keramik biasa, membuatnya lebih awet dan tidak mudah "mengangkat" atau <em>popping</em>.</li>
                    <li><strong>Kekuatan:</strong> Jika kejatuhan benda berat, keramik biasa bisa retak dan pecah, sedangkan granit lebih keras dan tahan benturan.</li>
                    <li><strong>Harga:</strong> Granit memang lebih mahal, namun untuk investasi jangka panjang (10-20 tahun), granit adalah pilihan yang lebih ekonomis.</li>
                </ul>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    4. Memilih Warna dan Pencahayaan
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Untuk kamar mandi tanpa jendela (yang hanya mengandalkan lampu & exhaust fan), hindari warna gelap pekat seperti hitam atau abu tua untuk keseluruhan ruangan karena akan terasa sumpek dan menyeramkan. Pilihlah warna <em>beige</em>, krem, putih tulang, atau abu muda.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Jika Anda menyukai konsep industrial atau maskulin dengan warna gelap, pastikan pencahayaan buatan Anda maksimal. Gunakan lampu <em>downlight</em> dengan temperatur warna 4000K (Natural White) agar warna keramik terlihat asli dan ruangan tetap terasa bersih.
                </p>

                <div style={{ background: '#1c1c1f', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #FF8C42' }}>
                    <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>💡 Pro Tip:</h5>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Jangan lupa memilih warna <em>grouting</em> (pengisi nat) yang sesuai. Semen nat warna putih pada lantai kamar mandi akan cepat terlihat kotor dan menghitam. Gunakan nat berwarna abu-abu atau senada dengan warna tergelap pada motif keramik Anda untuk menyamarkan noda.
                    </p>
                </div>
            </>
        ),
        2: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Dunia desain interior selalu berputar. Jika satu dekade terakhir didominasi oleh gaya Skandinavia yang serba putih, abu-abu, dan garis tegas minimalis, tahun 2026 diprediksi akan menjadi titik balik kembalinya kehangatan dan kenyamanan maksimal. Selamat tinggal kesan "klinis" dan dingin, selamat datang kembali di dekapan alam.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Tren "Back to Nature" bukan hanya sekadar menaruh tanaman di pot. Ini adalah pendekatan holistik tentang bagaimana warna bisa mempengaruhi psikologis penghuninya. Di tengah dunia digital yang serba cepat dan melelahkan, rumah dituntut menjadi <em>sanctuary</em>—tempat perlindungan yang menenangkan jiwa.
                </p>

                <div style={{ margin: '40px 0', borderRadius: '16px', overflow: 'hidden' }}>
                    <img src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80" alt="Earth tone living room" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginTop: '10px', textAlign: 'center' }}>Ruang keluarga dengan dominasi warna hangat dan material kayu.</p>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    1. Mengapa 'Earth Tones'?
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Warna-warna bumi (Earth Tones) seperti cokelat tanah, merah bata, hijau lumut, dan krem pasir memiliki efek psikologis <em>grounding</em>. Warna-warna ini secara tidak sadar menurunkan detak jantung dan tingkat stres, mirip dengan efek saat kita berjalan-jalan di hutan atau pantai.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    2. Palet Warna Utama 2026
                </h3>

                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>A. Terracotta & Clay</h4>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Warna merah bata yang diredam (muted) atau warna tanah liat bakar. Warna ini memberikan energi hangat tanpa menjadi agresif seperti merah cabai. Sangat cocok diterapkan di ruang makan atau ruang keluarga untuk memancing kehangatan percakapan.
                </p>

                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>B. Sage & Olive Green</h4>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Hijau bukan lagi sekadar aksen. Hijau <em>Sage</em> (hijau keabuan lembut) bisa menjadi "The New Neutral" menggantikan warna putih polos. Untuk kesan lebih mewah dan dramatis, <em>Olive Green</em> atau hijau zaitun pada lemari dapur atau dinding kamar tidur adalah pilihan berani yang elegan.
                </p>

                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>C. Warm Beige (Greige)</h4>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Lupakan abu-abu dingin. Tren netral beralih ke <em>Greige</em> (Grey + Beige) atau warna "Oatmeal". Warna ini memantulkan cahaya matahari dengan lebih lembut, menciptakan suasana runagan yang <em>cozy</em> dan nyaman dipandang mata dalam waktu lama.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    3. Kombinasi Material Pendukung
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Warna cat dinding tidak berdiri sendiri. Tren ini harus didukung dengan tekstur material yang nyata.
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Kayu Unfinished:</strong> Furnitur kayu dengan <em>finishing matte</em> atau menampilkan serat asli yang tidak sempurna.</li>
                    <li><strong>Rotan dan Anyaman:</strong> Memberikan tekstur organik yang memecah kebosanan dinding polos.</li>
                    <li><strong>Kain Linen dan Katun:</strong> Ganti sofa kulit sintetis mengkilap dengan bahan kain yang lembut dan "bernapas".</li>
                    <li><strong>Logam Matte:</strong> Aksesoris keran atau gagang pintu warna emas mati (brushed gold) atau hitam doff.</li>
                </ul>

                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Jadi, jika Anda merencanakan renovasi di tahun depan, pertimbangkan untuk meninggalkan kaleng cat putih bersih Anda. Beranilah bermain dengan warna alam untuk menciptakan rumah yang benar-benar bisa menjadi tempat istirahat jiwa dan raga.
                </p>
            </>
        ),
        3: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Seringkali pemilik rumah hanya fokus pada pemilihan keramik atau cat yang cantik, namun melupakan elemen paling dasar dari sebuah bangunan: Pasir. Padahal, pasir adalah "tulang punggung" dari kekuatan tembok dan beton rumah Anda.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Menggunakan jenis pasir yang salah bukan hanya pemborosan uang, tapi bisa berakibat fatal. Mulai dari tembok yang retak rambut, plesteran yang mudah rontok, hingga struktur beton yang keropos dan tidak kuat menahan beban. Sebelum Anda memesan satu truk pasir, kenali dulu jenis-jenisnya agar tidak tertipu.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    1. Pasir Beton (Pasir Cor)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Ini adalah "raja" dari segala pasir. Ciri khasnya adalah butirannya yang kasar, tajam, dan keras. Warnanya biasanya hitam pekat atau abu-abu gelap. Pasir ini sangat minim kandungan lumpur.
                </p>
                <div style={{ background: '#1c1c1f', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <strong style={{ color: '#FF8C42' }}>Kegunaan Utama:</strong> Pengecoran struktur utama seperti pondasi (cakar ayam), sloof, kolom, balok, dan plat lantai. Pasir ini memberikan daya ikat yang sangat kuat dengan semen.
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    2. Pasir Pasang
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Memiliki butiran yang lebih halus dibandingkan pasir beton, namun masih terasa sedikit kasar saat diraba. Pasir ini biasanya diambil dari sungai atau pegunungan. Kualitasnya di bawah pasir beton karena kadang masih mengandung sedikit tanah/lumpur yang membuat adukan lebih "puled" atau lengket.
                </p>
                <div style={{ background: '#1c1c1f', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <strong style={{ color: '#FF8C42' }}>Kegunaan Utama:</strong> Pasangan bata merah/batako, plesteran dinding tahap awal, dan perekat keramik lantai dasar.
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    3. Pasir Plester (Pasir Halus)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Sesuai namanya, pasir ini sangat halus dan bersih dari kerikil. Biasanya didapat dari proses pengayakan pasir pasang atau memang dari tambang khusus. Tujuannya adalah untuk mendapatkan permukaan yang mulus sempurna.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Penggunaan pasir yang kasar untuk finishing akan membuat tembok terlihat berpori dan boros penggunaan cat atau acian.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    4. Pasir Urug
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Ini adalah pasir dengan kasta terendah. Biasanya merupakan pasir sisa ayakan, pasir laut yang belum dicuci (masih asin), atau pasir sungai yang bercampur banyak lumpur dan sampah organik. Harganya paling murah.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    <strong>PERINGATAN:</strong> Jangan pernah gunakan pasir urug untuk adukan semen! Pasir ini tidak punya daya rekat. Gunakan hanya untuk menimbun tanah, meninggikan level lantai, atau memadatkan tanah di bawah keramik.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    Tips Cek Kualitas Pasir Tanpa Alat Lab
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Tes Genggam:</strong> Ambil segenggam pasir, kepal dengan kuat, lalu buka tangan. Jika pasir ambyar (terurai) kembali, berarti kadar lumpurnya sedikit (Bagus). Jika pasir menggumpal membentuk kepalan tangan, berarti banyak lumpur (Jelek untuk beton).</li>
                    <li><strong>Tes Air:</strong> Masukkan segenggam pasir ke dalam botol air bening, kocok, dan diamkan. Lihat seberapa tebal lapisan lumpur yang mengendap di atas lapisan pasir. Semakin tebal lumpurnya, semakin buruk kualitasnya.</li>
                </ul>
            </>
        ),
        4: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Tidak ada yang lebih menjengkelkan daripada suara "tik... tik... tik..." di tengah malam saat hujan deras, diikuti dengan rembesan air cokelat di plafon gypsum kesayangan Anda. Atap bocor adalah musuh utama rumah tropis, dan jika dibiarkan, kerusakannya bisa merambat kemana-mana.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Air hujan yang terjebak di plafon bisa menyebabkan rangka atap (terutama kayu) lapuk, plafon ambruk, hingga korsleting listrik yang berujung kebakaran. Sebelum memanggil tukang, ada beberapa langkah pertolongan pertama dan diagnosa yang bisa Anda lakukan sendiri.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    1. Detektif Kebocoran: Cari Sumbernya!
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Titik air yang menetes di kamar tidur belum tentu bocornya tepat di atasnya. Air memiliki sifat mengalir (run-off). Ia bisa saja masuk dari genteng yang pecah 3 meter jauhnya, lalu mengalir melalui rangka atap/kaso, dan baru menetes saat menemukan titik terendah.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    <strong>Cara Cek:</strong> Naiklah ke plafon (manhole) pada siang hari yang cerah. Matikan lampu senter dan cari celah cahaya matahari yang tembus dari genteng. Lubang sekecil jarum pun bisa menjadi jalan masuk air saat hujan deras disertai angin.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    2. Perbaikan Darurat (Sementara)
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Ember & Kain Pel:</strong> Klasik tapi efektif. Letakkan ember di bawah titik bocor untuk mencegah air merusak lantai parket atau karpet.</li>
                    <li><strong>Lubangi Plafon:</strong> Jika Anda melihat plafon gypsum sudah menggelembung berisi air, <strong>segera tusuk</strong> dengan obeng kecil untuk mengeluarkan airnya. Ini mencegah plafon menjadi terlalu berat dan ambruk menimpa orang di bawahnya. Plafon yang bolong kecil lebih mudah ditambal daripada plafon yang rubuh total.</li>
                </ul>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    3. Solusi Waterproofing yang Benar
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Banyak orang mengira cukup dioles cat anti-bocor sekali lalu selesai. Salah! Waterproofing yang efektif ada tekniknya:
                </p>
                <div style={{ background: '#1c1c1f', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #FF8C42' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '10px' }}><strong>Langkah 1:</strong> Bersihkan area retak dari lumut dan debu dengan sikat kawat.</p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '10px' }}><strong>Langkah 2:</strong> Oleskan cat anti-bocor (primer) lapisan pertama.</p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '10px' }}><strong>Langkah 3:</strong> Saat masih basah, tempelkan <em>serat fiber</em> (kain kasa penguat).</p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}><strong>Langkah 4:</strong> Timpa lagi dengan cat anti-bocor lapisan kedua dan ketiga secara menyilang (vertikal lalu horizontal).</p>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    4. Masalah Klasik: Talang & Sambungan
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    80% kebocoran terjadi bukan di tengah genteng, tapi di pertemuan antar bidang atap (jurai) dan karpet talang. Karpet talang merah/hitam memiliki umur ekonomis (biasanya 2-3 tahun sudah getas). Cek apakah karpet talang Anda sudah kaku/retak. Jika ya, ganti karpet talang baru yang dilapisi seng anti karat.
                </p>

                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Ingat, memperbaiki atap bocor memiliki risiko jatuh yang tinggi. Jika atap Anda curam atau licin, jangan ambil risiko. Serahkan pada tim profesional yang memiliki peralatan keselamatan lengkap.
                </p>
            </>
        ),
        5: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Dapur sering disebut sebagai "jantung" rumah. Sayangnya, renovasi dapur juga dikenal sebagai salah satu yang paling menguras kantong. Bagi Anda yang memiliki rumah subsidi atau tipe 36/45 dengan lahan dapur terbatas (biasanya 3x3 meter), tantangannya adalah membuat dapur fungsional namun tetap hemat biaya.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Banyak orang tergiur dengan desain Kitchen Set mewah ala majalah yang harganya bisa mencapai puluhan juta. Padahal, dengan strategi yang tepat, Anda bisa memangkas biaya hingga 50% tanpa mengorbankan kualitas. Berikut bedah rincian biaya riil untuk tahun 2025.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    1. Pondasi Utama: Meja Dapur Cor
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Alih-alih menggunakan lemari kayu full yang mahal dan rawan rayap/lapuk karena lembab, solusi "budget" terbaik adalah membuat meja beton (cor).
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Biaya Material (Bata, Besi 8mm, Semen, Pasir):</strong> ~Rp 1.500.000</li>
                    <li><strong>Upah Tukang (Borongan):</strong> ~Rp 1.000.000</li>
                    <li><strong>Granit Meja (60x60 cm, 3 box):</strong> ~Rp 600.000</li>
                    <li><strong>Total Meja Cor Leter L:</strong> ~Rp 3.100.000</li>
                </ul>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Kelebihan meja cor adalah super awet, tahan banjir, dan tahan beban berat (cobek batu sekalipun!).
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    2. Kitchen Set: Pintu Bawah & Kabinet Atas
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Ini komponen yang paling mahal. Untuk menekan biaya, Anda tidak perlu membuat lemari kabinet full body untuk bagian bawah. Cukup buat <strong>Pintu/Frame Saja</strong> yang menutupi kolong meja cor.
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Pintu Bawah (Aluminium Composite Panel - ACP):</strong> Lebih tahan air dan rayap dibanding HPL plywood. Estimasi: Rp 2.500.000.</li>
                    <li><strong>Kabinet Atas (Opsional):</strong> Jika budget mepet, ganti kabinet atas tertutup dengan <em>Open Shelving</em> (Rak Ambalan Terbuka) dari kayu solid atau besi. Jauh lebih murah (~Rp 500.000) dan membuat dapur kecil terasa lebih lega.</li>
                </ul>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    3. Backsplash dan Finishing
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Dinding antarpintu meja dan lemari atas rawan terkena cipratan minyak. Jangan biarkan hanya cat tembok.
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Keramik Kereta Api (Subway Tile) KW 1:</strong> Rp 90.000/dus. Butuh sekitar 3-4 dus = Rp 360.000.</li>
                    <li><strong>Sink (Bak Cuci Piring):</strong> Pilih yang kedalamannya minimal 20cm agar air tidak nyiprat. Stainless SUS 304. Harga: ~Rp 600.000.</li>
                    <li><strong>Kran Angsa Fleksibel:</strong> Rp 150.000.</li>
                </ul>

                <div style={{ background: '#1c1c1f', padding: '25px', borderRadius: '12px', border: '1px solid #27272a', marginTop: '30px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '20px', textAlign: 'center' }}>
                        Total Estimasi Biaya
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem', borderBottom: '1px solid #3f3f46', paddingBottom: '10px' }}>
                        <span>Struktur Meja & Lantai</span>
                        <span>Rp 3.500.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem', borderBottom: '1px solid #3f3f46', paddingBottom: '10px' }}>
                        <span>Kitchen Set (Pintu Bawah ACP)</span>
                        <span>Rp 2.500.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem', borderBottom: '1px solid #3f3f46', paddingBottom: '10px' }}>
                        <span>Sink, Kran, Backsplash</span>
                        <span>Rp 1.200.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem', borderBottom: '1px solid #3f3f46', paddingBottom: '10px' }}>
                        <span>Instalasi Listrik & Air</span>
                        <span>Rp 500.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>
                        <span>GRAND TOTAL</span>
                        <span>± Rp 7.700.000</span>
                    </div>
                    <p style={{ marginTop: '15px', color: '#a1a1aa', fontSize: '0.9rem', textAlign: 'center' }}>*Harga estimasi Jabodetabek 2025, belum termasuk biaya tak terduga (10%).</p>
                </div>
            </>
        ),
        6: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Saat membangun atau merenovasi rumah, salah satu keputusan terbesar ada di struktur dinding: Pilih Bata Merah tradisional atau Bata Ringan (Hebel) modern? Pertanyaan ini sering memicu debat panjang antara pemilik rumah, arsitek, dan tukang bangunan senior.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Keduanya material yang baik, namun memiliki karakter yang sangat berbeda. Memahami karakteristik masing-masing akan membantu Anda menghemat biaya, waktu, dan menyesuaikan dengan kebutuhan spesifik bangunan Anda.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    1. Bata Merah (The Classic)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Terbuat dari tanah liat yang dibakar suhu tinggi. Material ini sudah lintas generasi dan teruji ratusan tahun.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: '#1c1c1f', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#4ade80', fontSize: '1.1rem' }}>KELEBIHAN</strong>
                        <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
                            <li>Sangat kuat, dinding bisa dipaku beban berat tanpa <em>fisher</em>.</li>
                            <li>Tahan panas (adem) karena menyerap suhu.</li>
                            <li>Tahan rembesan air secara alami.</li>
                            <li>Tukang di pelosok pun pasti bisa pasang.</li>
                        </ul>
                    </div>
                    <div style={{ background: '#1c1c1f', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#f87171', fontSize: '1.1rem' }}>KEKURANGAN</strong>
                        <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
                            <li>Berat, membebani struktur pondasi.</li>
                            <li>Ukuran tidak presisi, boros semen plesteran.</li>
                            <li>Pemasangan lambat (butuh rendam air, susun satu-satu).</li>
                        </ul>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    2. Bata Ringan / Hebel (The Modern)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Terbuat dari campuran pasir silika, semen, kapur, dan alumunium pasta yang diaerasi (diberi gelembung udara).
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: '#1c1c1f', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#4ade80', fontSize: '1.1rem' }}>KELEBIHAN</strong>
                        <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
                            <li>Ringan, ideal untuk rumah bertingkat.</li>
                            <li>Dimensi besar & presisi, pemasangan 3x lebih cepat.</li>
                            <li>Plesteran bisa sangat tipis (hemat material finishing).</li>
                            <li>Insulator suara yang baik.</li>
                        </ul>
                    </div>
                    <div style={{ background: '#1c1c1f', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#f87171', fontSize: '1.1rem' }}>KEKURANGAN</strong>
                        <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
                            <li>Butuh perekat khusus (mortar instan).</li>
                            <li>Menyerap air (swelling), wajib diplester kedap air (trasram).</li>
                            <li>Sulit dipaku, butuh fisher khusus hebel.</li>
                        </ul>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    3. Analisa Biaya per m2 (Terpasang)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Secara material satuan, Hebel terlihat lebih mahal. Namun jika dihitung "terpasang" (termasuk upah tukang dan material plester aci), <strong>Hebel justru lebih hemat sekitar 15-20%</strong>. Hal ini karena kecepatan pemasangan hebel memangkas biaya Harian tukang secara signifikan, dan kepresisiannya menghemat semen plester.
                </p>

                <div style={{ background: '#27272a', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #FF8C42', marginTop: '30px' }}>
                    <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>🏆 Rekomendasi NguliKang:</h5>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Gunakan <strong>Kombinasi Hybrid</strong>. Pakai Bata Merah untuk area basah (Kamar Mandi) dan dinding luar yang terkena hujan langsung. Pakai Hebel untuk dinding penyekat antar ruang (partisi) dan untuk lantai 2 ke atas demi mengurangi beban struktur.
                    </p>
                </div>
            </>
        ),
        7: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Lahan sisa di belakang atau samping rumah seringkali terbengkalai. Ditanami rumput jepang, tapi malas memotongnya. Dibiarkan tanah, malah jadi becek dan sarang nyamuk. Solusinya? <strong>Dry Garden</strong> atau Taman Kering.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Konsep ini mengadaptasi <em>Zen Garden</em> jepang yang mengutamakan elemen "keras" (batu, pasir, kerikil) dibanding elemen "lunak" (tanaman), sehingga perawatannya sangat minim (low maintenance).
                </p>

                <div style={{ margin: '40px 0', borderRadius: '16px', overflow: 'hidden' }}>
                    <img src="https://images.unsplash.com/photo-1558293842-c0fd3db8a8b6?w=1200&q=80" alt="Zen Garden" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    Langkah Membuat Taman Kering Sendiri
                </h3>

                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>1. Persiapan Lahan (Krusial!)</h4>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Kesalahan pemula adalah langsung menabur batu koral di atas tanah. Akibatnya? Dalam 2 minggu, batu akan amblas tertelan tanah dan rumput liar akan tumbuh di sela-sela batu.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    <strong>Cara Benar:</strong> Ratakan tanah, padatkan. Gelar <em>Geotextile</em> atau <em>Weed Mat</em> (karpet pori-pori hitam). Ini berfungsi menahan batu agar tidak tercampur tanah dan menghambat gulma, namun air hujan tetap bisa meresap ke tanah (tidak banjir).
                </p>

                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>2. Memilih Jenis Batu Hamparan</h4>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Batu Koral Putih (Kupang):</strong> Memberikan kesan bersih, luas, dan modern. Kekurangannya: Bisa berlumut jika area terlalu lembab/teduh.</li>
                    <li><strong>Batu Koral Hitam (Alor):</strong> Kesan elegan dan maskulin. Lebih tahan kotor.</li>
                    <li><strong>Batu Pancawarna:</strong> Warna-warni alami sungai, cocok untuk kesan natural pedesaan.</li>
                </ul>

                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>3. Tanaman "Bandell"</h4>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Pilih tanaman yang tahan panas, butuh sedikit air, dan lambat pertumbuhannya.
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Kaktus & Sukulen:</strong> Icon taman kering. Pastikan media tanamnya poros (banyak pasir malang).</li>
                    <li><strong>Siklok (Agave):</strong> Berbentuk seperti nanas raksasa, sangat <em>sculptural</em>.</li>
                    <li><strong>Lidah Mertua (Sansevieria):</strong> Tahan banting, bisa hidup di segala kondisi cahaya.</li>
                    <li><strong>Bromelia:</strong> Memberikan aksen warna merah/kuning di tengah hijaunya taman.</li>
                </ul>

                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8C42', marginBottom: '10px' }}>4. Stepping Stone & Lighting</h4>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Letakkan batu pijakan (batu andesit atau cor beton) agar Anda bisa berjalan menyiram tanaman tanpa "mengacak-acak" susunan kerikil. Terakhir, tambahkan lampu sorot (spotlight) warm white yang menembak ke arah tanaman utama (Point of Interest) untuk nuansa dramatis di malam hari.
                </p>
            </>
        ),
        8: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Bagi kontraktor maupun pemilik rumah yang sedang membangun, pergerakan harga besi beton adalah "menu sarapan" wajib. Besi beton menyumbang porsi biaya yang signifikan dalam struktur bangunan. Sedikit kenaikan harga global bisa membengkakkan RAB (Rencana Anggaran Biaya) Anda.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Berikut adalah update harga rata-rata besi beton SNI (Standar Nasional Indonesia) di tingkat distributor area Jabodetabek per <strong>Desember 2025</strong>. Perlu diingat, harga eceran di toko material (depo) mungkin lebih tinggi 5-10% karena biaya logistik dan margin.
                </p>

                <div style={{ overflowX: 'auto', marginBottom: '30px', borderRadius: '12px', border: '1px solid #3f3f46' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e4e4e7', fontSize: '1.1rem' }}>
                        <thead>
                            <tr style={{ background: '#27272a', textAlign: 'left' }}>
                                <th style={{ padding: '15px', borderBottom: '2px solid #3f3f46' }}>Jenis Besi</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #3f3f46' }}>Ukuran (Diameter)</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #3f3f46' }}>Harga Satuan (12m)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: "Besi Polos (BJTP 280)", size: "6mm (Full SNI)", price: "Rp 32.000" },
                                { name: "Besi Polos (BJTP 280)", size: "8mm (Full SNI)", price: "Rp 54.000" },
                                { name: "Besi Polos (BJTP 280)", size: "10mm (Full SNI)", price: "Rp 83.000" },
                                { name: "Besi Polos (BJTP 280)", size: "12mm (Full SNI)", price: "Rp 118.000" },
                                { name: "Besi Ulir (BJTS 420)", size: "10mm (Full SNI)", price: "Rp 85.000" },
                                { name: "Besi Ulir (BJTS 420)", size: "13mm (Full SNI)", price: "Rp 142.000" },
                                { name: "Besi Ulir (BJTS 420)", size: "16mm (Full SNI)", price: "Rp 215.000" },
                                { name: "Besi Ulir (BJTS 420)", size: "19mm (Full SNI)", price: "Rp 310.000" },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #3f3f46', background: i % 2 === 0 ? 'transparent' : '#1f1f22' }}>
                                    <td style={{ padding: '15px' }}>{row.name}</td>
                                    <td style={{ padding: '15px' }}>{row.size}</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#FF8C42' }}>{row.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    Waspada Bahaya "Besi Banci"
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Jangan tergiur harga murah! Di pasaran, beredar luas istilah <strong>Besi Banci</strong>. Ini adalah besi yang diameternya tidak sesuai standar (kuru).
                </p>
                <div style={{ background: '#3f1212', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #ef4444', marginBottom: '30px' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '10px', color: '#fca5a5' }}>
                        Contoh Kasus: Anda membeli besi 10mm Banci. Realnya (jika diukur sigmat), ukurannya hanya 8.2mm atau 7.8mm.
                    </p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#fca5a5' }}>
                        <strong>Dampaknya:</strong> Kekuatan struktur bangunan Anda berkurang hingga 30-40%. Untuk bangunan bertingkat, ini sangat berbahaya dan berisiko runtuh saat gempa.
                    </p>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    Tips Membeli Besi yang Aman
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Cek Marking (Cap):</strong> Besi SNI asli pasti memiliki cap timbul (emboss) di batangnya. Contoh: CS, KS, IS, MS. Ada logo SNI, ukuran diameter, dan kode kelas baja.</li>
                    <li><strong>Bawa Sketmat/Jangka Sorong:</strong> Jangan ragu untuk mengukur diameter besi di toko. Toleransi SNI hanya 0.3mm - 0.4mm. Jika besi 10mm diukur kurang dari 9.6mm, itu pasti banci.</li>
                    <li><strong>Warnai Ujung:</strong> Biasanya toko menandai ujung besi SNI dengan cat warna tertentu (misal kuning untuk 10mm Full, hijau untuk 12mm Full). Pelajari kode warna toko langganan Anda.</li>
                </ul>
            </>
        ),
        9: (
            <>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Tagihan listrik yang membengkak setiap bulan seringkali disebabkan oleh ketergantungan kita pada AC dan lampu di siang hari. Padahal, Indonesia sebagai negara tropis dianugerahi sinar matahari melimpah dan angin yang bertiup sepanjang tahun.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Rumah Hemat Energi bukan berarti harus masang panel surya mahal. Kuncinya ada pada <strong>Desain Pasif</strong> yang merespon iklim.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    1. Cross Ventilation (Ventilasi Silang)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Prinsipnya sederhana: Udara butuh jalan masuk dan jalan keluar. Jendela ventilasi yang hanya ada di satu sisi tembok tidak akan efektif mengalirkan udara (udara hanya berputar di situ saja).
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    <strong>Solusi:</strong> Buatlah bukaan jendela atau roster di sisi dinding yang berseberangan. Angin akan masuk dari sisi A, membawa panas ruangan, dan meniupnya keluar lewat sisi B. Dengan ventilasi silang yang benar, Anda bisa menurunkan suhu ruangan alami hingga 3-4 derajat Celcius!
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    2. Memanen Cahaya (Daylighting)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Rumah yang gelap dan lembab adalah sarang penyakit. Namun jendela kaca yang terlalu lebar di sisi Barat/Timur justru bikin ruangan panas.
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    <li><strong>Skylight:</strong> Gunakan 1-2 lembar genteng kaca di area tangga, kamar mandi, atau dapur. Cahaya dari atas jauh lebih terang daripada dari samping.</li>
                    <li><strong>Clerestory Windows:</strong> Jendela kaca mati di bagian atas dinding (dekat plafon). Ini memberikan cahaya bias yang lembut tanpa silau dan panas langsung.</li>
                    <li><strong>Glass Block:</strong> Pengganti sebagian dinding bata untuk area yang butuh privasi tapi tetap terang.</li>
                </ul>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    3. Plafon Tinggi (High Ceiling)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Hukum fisika: Udara panas lebih ringan daripada udara dingin, sehingga ia akan naik ke atas. Rumah dengan plafon rendah (2.8m - 3m) akan terasa pengap karena panas "terperangkap" di area kepala kita.
                </p>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                    Idealnya, buatlah plafon setinggi 3.5m - 4m. Berikan ventilasi pembuangan (bouven) di titik tertinggi dinding (sopisan) agar udara panas yang naik bisa segera keluar dari rumah.
                </p>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '15px' }}>
                    4. Shading (Bayangan)
                </h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    Lindungi dinding kaca Anda dari sinar matahari langsung dengan <strong>Overstek</strong> (tritisan atap) yang lebar minimal 1 meter. Atau gunakan <em>Secondary Skin</em> (kisi-kisi kayu/aluminium) di fasad depan. Ini akan menyaring panas matahari sebelum menyentuh dinding rumah, sehingga AC tidak perlu bekerja terlalu keras.
                </p>
            </>
        ),
    };

    const getPostContent = (post) => {
        return (
            <>
                {ARTICLE_CONTENT[post.id] || (
                    <>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                            {post.excerpt}
                        </p>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                            Mohon maaf, konten lengkap untuk artikel ini sedang dalam tahap penyuntingan akhir oleh tim redaksi kami. Silakan kembali lagi nanti.
                        </p>
                    </>
                )}


            </>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: '#09090b', minHeight: '100vh', color: '#e4e4e7', fontFamily: 'Inter, sans-serif', paddingBottom: '80px' }}
        >
            {/* Nav / Header placeholder (assuming main header is fixed or sticky, but we add spacing) */}
            <div style={{ height: '100px' }}></div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '30px' }}>
                    <span style={{ cursor: 'pointer', color: '#FF8C42' }} onClick={() => onNavigate('blog')}>Blog</span>
                    <span>/</span>
                    <span>{post.category}</span>
                    <span>/</span>
                    <span style={{ color: '#e4e4e7' }}>Reading</span>
                </div>

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <span style={{ background: 'rgba(255, 140, 66, 0.15)', color: '#FF8C42', padding: '8px 20px', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '20px', display: 'inline-block' }}>
                        {post.category}
                    </span>
                    <h1 style={{ fontSize: '2.5rem', md: { fontSize: '3.5rem' }, fontWeight: '800', lineHeight: 1.2, color: 'white', marginBottom: '20px' }}>
                        {post.title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', color: '#a1a1aa', fontSize: '1rem' }}>
                        <span>📅 {post.date}</span>
                        <span>•</span>
                        <span>✍️ Tim NguliKang</span>
                    </div>
                </div>

                {/* Main Image */}
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '24px', overflow: 'hidden', marginBottom: '50px', border: '1px solid #27272a' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Content */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {getPostContent(post)}
                </div>



            </div>
        </motion.div>
    );
};

export default BlogDetail;
