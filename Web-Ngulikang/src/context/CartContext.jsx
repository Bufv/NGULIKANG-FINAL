import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Persist cart items
        const savedCart = localStorage.getItem('nguli_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('nguli_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        console.log('Adding to cart:', product, quantity);
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // New item
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems => prevItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Promo System
    const [promo, setPromo] = useState({ code: null, discount: 0, type: null });

    const applyPromo = (code, currentTotal) => {
        if (!code) return { success: false, message: 'Kode kosong' };

        const cleanCode = code.toUpperCase();

        if (cleanCode === 'HEMAT10') {
            const discount = currentTotal * 0.1;
            setPromo({ code: cleanCode, discount: discount, type: 'percent' });
            return { success: true, message: 'Kode promo HEMAT10 berhasil digunakan!' };
        } else if (cleanCode === 'NGULI50') {
            setPromo({ code: cleanCode, discount: 50000, type: 'fixed' });
            return { success: true, message: 'Kode promo NGULI50 berhasil digunakan!' };
        } else {
            return { success: false, message: 'Kode promo tidak valid' };
        }
    };

    const removePromo = () => {
        setPromo({ code: null, discount: 0, type: null });
    };

    // Re-calculate percentage discount if cart total changes
    useEffect(() => {
        if (promo.type === 'percent' && promo.code === 'HEMAT10') {
            const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            setPromo(prev => ({ ...prev, discount: total * 0.1 }));
        }
    }, [cartItems, promo.type, promo.code]);


    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        promo,
        applyPromo,
        removePromo
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
