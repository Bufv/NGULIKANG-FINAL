import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NguliBorongan from './pages/NguliBorongan';
import NguliHarian from './pages/NguliHarian';
import NguliKorporate from './pages/NguliKorporate';
import NguliPremium from './pages/NguliPremium';
import NguliRenovasi from './pages/NguliRenovasi';
import BangunBaru from './pages/BangunBaru';
import CheckProgress from './pages/CheckProgress';
import Marketplace from './pages/Marketplace';

import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracker from './pages/OrderTracker';
import Profile from './pages/Profile';
import ChatTukang from './pages/ChatTukang';
import Ketentuan from './pages/Ketentuan';
import DaftarKerja from './pages/DaftarKerja';
import CekLamaran from './pages/CekLamaran';
import Login from './pages/Login';
import { getAccessToken } from './lib/api';

const protectedPages = new Set([
    'profile',
    'order-tracker',
    'cart',
    'checkout',
    'chat',
    'nguli-harian',
    'nguli-borongan',
    'nguli-renovasi',
    'nguli-premium',
    'nguli-korporate',
    'bangun-baru',
    'check-progress',
    'job-register',
    'cek-status-lamaran'
]);




function App() {
    // 1. Initialize logic to read 'page' from URL
    const getPageFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('page') || 'home';
    };

    const getInitialPage = () => {
        const page = getPageFromUrl();
        if (protectedPages.has(page) && !getAccessToken()) {
            return 'login';
        }
        return page;
    };

    const [currentPage, setCurrentPage] = useState(getInitialPage);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedBlogPost, setSelectedBlogPost] = useState(null);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        try {
            localStorage.setItem('ngulikang_selected_product_id', product?.id || '');
        } catch (err) {
            // ignore storage errors
        }
        handleNavigate('product-detail');
    };

    const handleBlogPostSelect = (post) => {
        setSelectedBlogPost(post);
        handleNavigate('blog-detail');
    };

    // 2. Handle Browser Back/Forward (Popstate)
    useEffect(() => {
        const handlePopState = () => {
            const page = getPageFromUrl();
            if (protectedPages.has(page) && !getAccessToken()) {
                setCurrentPage('login');
                return;
            }
            setCurrentPage(page);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // 3. Navigation Handler (updates State + URL)
    const handleNavigate = (page) => {
        if (protectedPages.has(page) && !getAccessToken()) {
            setCurrentPage('login');
        } else {
            setCurrentPage(page);
        }
        window.scrollTo(0, 0);

        // Update URL
        const url = new URL(window.location);
        if (page === 'home') {
            // Clean URL for home
            window.history.pushState({}, '', '/');
        } else {
            url.searchParams.set('page', page);
            // If switching pages, we might want to reset 'step' if it exists from previous page
            // But if we are just navigating to the page, maybe we want to keep it? 
            // Usually navigating to a MAIN page via menu implies starting fresh.
            // So let's clear 'step' unless we specifically want to keep it.
            // For now, let's clear 'step' to be safe when switching major sections.
            if (url.searchParams.get('step')) {
                url.searchParams.delete('step');
            }
            window.history.pushState({}, '', url);
        }
    };

    // 4. Update URL when currentPage changes (in case it changed via other means? No, handleNavigate covers it.
    // However, if the user manually changes the URL and hits enter, the app reloads and getPageFromUrl handles it.)

    useEffect(() => {
        if (protectedPages.has(currentPage) && !getAccessToken()) {
            setCurrentPage('login');
        }
    }, [currentPage]);

    return (
        <div className="app">
            {/* Pass navigation handler to Header */}
            <Header onNavigate={handleNavigate} activePage={currentPage} />

            {/* Conditional Rendering */}
            <main>
                {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
                {currentPage === 'nguli-borongan' && <NguliBorongan onNavigate={handleNavigate} />}
                {currentPage === 'nguli-harian' && <NguliHarian />}
                {currentPage === 'nguli-korporate' && <NguliKorporate />}
                {currentPage === 'nguli-premium' && <NguliPremium />}
                {currentPage === 'nguli-renovasi' && <NguliRenovasi />}
                {currentPage === 'bangun-baru' && <BangunBaru />}
                {currentPage === 'check-progress' && <CheckProgress />}
                {currentPage === 'marketplace' && <Marketplace onNavigate={handleNavigate} onProductSelect={handleProductSelect} />}
                {currentPage === 'product-detail' && (
                    <ProductDetail
                        product={selectedProduct}
                        onNavigate={handleNavigate}
                        onAddToCart={() => alert('Add to cart logic here')}
                    />
                )}
                {currentPage === 'blog' && <Blog onNavigate={handleNavigate} onPostSelect={handleBlogPostSelect} />}
                {currentPage === 'blog-detail' && <BlogDetail post={selectedBlogPost} onNavigate={handleNavigate} />}
                {currentPage === 'cart' && <Cart onNavigate={handleNavigate} />}
                {currentPage === 'checkout' && <Checkout onNavigate={handleNavigate} />}
                {currentPage === 'order-tracker' && <OrderTracker onNavigate={handleNavigate} />}
                {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}
                {currentPage === 'chat' && <ChatTukang onNavigate={handleNavigate} />}
                {currentPage === 'job-terms' && <Ketentuan onNavigate={handleNavigate} />}
                {currentPage === 'job-register' && <DaftarKerja onNavigate={handleNavigate} />}


                {currentPage === 'cek-status-lamaran' && <CekLamaran />}
                {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
                {/* 
                    Add other pages here as needed.
                    Currently, simple nav logic is replaced by routing or state. App;
                */}
            </main>

            <Footer />
        </div>
    );
}

export default App;
