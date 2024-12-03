'use client';

import React, { useState } from 'react';

interface CustomZoomProps {
  children: React.ReactNode;
}

const CustomZoom: React.FC<CustomZoomProps> = ({ children }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleOpenZoom = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget.querySelector('img') as HTMLImageElement;
    if (target) {
      setImageSrc(target.src);
      setIsZoomed(true);
    }
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
    setImageSrc(null);
  };

  return (
    <>
      <div className="custom-zoom-thumbnail" onClick={handleOpenZoom}>
        {children}
      </div>
      {isZoomed && (
        <div className="custom-zoom-overlay" onClick={handleCloseZoom}>
          <div className="custom-zoom-content">{children}</div>
        </div>
      )}
    </>
  );
};

export default CustomZoom;
