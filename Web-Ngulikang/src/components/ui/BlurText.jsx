import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BlurText = ({
    text,
    className = '',
    delay = 0,
    duration = 1,
    animateBy = 'words', // 'words' or 'letters'
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay,
            },
        },
    };

    const child = {
        hidden: {
            filter: 'blur(10px)',
            opacity: 0,
            y: 20
        },
        visible: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            transition: {
                duration: duration,
                ease: "easeOut"
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={className}
            style={{ display: 'flex', flexWrap: 'wrap', gap: animateBy === 'words' ? '0.3em' : '0em' }}
        >
            {elements.map((el, i) => (
                <motion.span key={i} variants={child} style={{ display: 'inline-block' }}>
                    {el}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default BlurText;
