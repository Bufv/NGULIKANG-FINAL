import React, { useEffect, useRef } from 'react';
import './Particles.css';

const Particles = ({ count = 50, color = '#FF8C42' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Generate particles
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 4 + 2; // 2-6px
            const left = Math.random() * 100; // 0-100%
            const animationDuration = Math.random() * 20 + 15; // 15-35s
            const animationDelay = Math.random() * 5; // 0-5s
            const opacity = Math.random() * 0.5 + 0.4; // 0.4 - 0.9 (Lebih Terang!)

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.backgroundColor = color;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${animationDuration}s`;
            particle.style.animationDelay = `${animationDelay}s`;

            container.appendChild(particle);
        }

        // Cleanup
        return () => {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        };
    }, [count, color]);

    return <div ref={containerRef} className="particles-container"></div>;
};

export default Particles;
