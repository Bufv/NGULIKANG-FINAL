import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const SplitText = ({
    text,
    className = '',
    delay = 0,
    duration = 0.5, // Duration per character
    stagger = 0.03  // Stagger delay between characters
}) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    // Splitting text into words first to handle spacing correctly, then into characters
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    const child = {
        hidden: {
            opacity: 0,
            y: 40,
            rotateX: -40,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
                duration: duration,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={controls}
            className={`split-text ${className}`}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em', perspective: '1000px' }}
        >
            {words.map((word, i) => (
                <div key={i} style={{ display: 'flex' }}>
                    {word.split("").map((char, j) => (
                        <motion.span key={j} variants={child} style={{ display: 'inline-block' }}>
                            {char}
                        </motion.span>
                    ))}
                </div>
            ))}
        </motion.div>
    );
};

export default SplitText;
