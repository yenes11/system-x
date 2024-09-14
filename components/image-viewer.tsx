'use client';

import React, { useState, useRef } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  width?: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt, width = 200 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [thumbnailStyles, setThumbnailStyles] = useState({
    width: '0px',
    height: '0px',
    top: '0px',
    left: '0px'
  });
  const thumbnailRef: React.RefObject<HTMLImageElement> = useRef(null);

  const handleZoomIn = () => setZoom(zoom + 0.1);
  const handleZoomOut = () => setZoom(zoom > 0.1 ? zoom - 0.1 : 0.1);
  const handleRotate = () => setRotation(rotation + 90);

  const openImage = () => {
    const thumbnail = thumbnailRef.current;
    const rect = thumbnail?.getBoundingClientRect();

    if (!rect) return;

    setThumbnailStyles({
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    });

    setIsOpen(true);

    setTimeout(() => {
      setIsLoaded(true);
    }, 10);
  };

  const closeImage = () => {
    setIsLoaded(false);
    setTimeout(() => {
      setIsOpen(false);
      setZoom(1);
      setRotation(0);
    }, 300);
  };

  return (
    <div>
      <img
        ref={thumbnailRef}
        src={src}
        alt={alt}
        width={width}
        style={{ cursor: 'pointer' }}
        onClick={openImage}
      />

      {isOpen && (
        <div
          onClick={closeImage}
          style={{
            ...styles.modal,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...styles.modalContent,
              backgroundColor: 'white',
              width: isLoaded ? 'auto' : thumbnailStyles.width,
              height: isLoaded ? 'auto' : thumbnailStyles.height,
              top: isLoaded ? '50%' : thumbnailStyles.top,
              left: isLoaded ? '50%' : thumbnailStyles.left,
              transform: isLoaded
                ? `translate(-50%, -50%) scale(1)`
                : `translate(0, 0) scale(0.5)`,
              transition:
                'transform 0.3s ease-in-out, top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease'
            }}
          >
            <button style={styles.closeButton} onClick={closeImage}>
              &times;
            </button>

            <div style={styles.imageWrapper}>
              <img
                src={src}
                alt={alt}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                  maxWidth: '100%',
                  maxHeight: '80vh'
                }}
              />
            </div>

            <div style={styles.controls}>
              <button onClick={handleZoomIn}>Zoom In</button>
              <button onClick={handleZoomOut}>Zoom Out</button>
              <button onClick={handleRotate}>Rotate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modal: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    position: 'absolute' as 'absolute',
    // padding: '20px',
    maxWidth: '90%',
    maxHeight: '90%'
  },
  closeButton: {
    position: 'absolute' as 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer'
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '80vh'
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px'
  }
};

export default ImageViewer;
