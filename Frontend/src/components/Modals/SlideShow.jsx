import { useEffect, useState } from 'react';
import classes from './image-slideshow.module.css';

const images = [

  { image: '/models/698a21e105b43df7aa2a658aEVA1.png', alt: 'EVA 1 model', name: 'JANE' },
  { image: '/models/698754c747a75ab0c824e11aMAN.png', alt: 'Man model', name: 'VIJAY' },
  { image: '/models/698a26fb05b43df7aa2ac766Orange.png', alt: 'Orange model', name: 'ORANGE' },
];

export default function ImageSlideshow({ onChange }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex < images.length - 1 ? prevIndex + 1 : 0;
        if (onChange) {
          onChange(images[nextIndex].name);
        }
        return nextIndex;
      });
    }, 3000);

    // Initial call to set the first name
    if (onChange) {
      onChange(images[0].name);
    }

    return () => clearInterval(interval);
  }, [onChange]);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image.image}
          className={index === currentImageIndex ? classes.active : ''}
          alt={image.alt}
        />
      ))}
    </div>
  );
}

