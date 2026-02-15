import React, { useState, useRef } from 'react';
import TogetherImg from '../../assets/Together.jpg';
import WavingVid from '../../assets/Video_Generation_Smiling_and_Waving.mp4';

export default function HoverMedia() {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.log("Video play interrupted:", err));
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Static Image */}
            <img
                src={TogetherImg}
                alt="Together"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Hover Video */}
            <video
                ref={videoRef}
                src={WavingVid}
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
}
