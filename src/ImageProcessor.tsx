// src/ImageProcessor.tsx
import React, { useEffect } from 'react';

interface ImageProcessorProps {
  imageFile: File;
  setProcessedImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ imageFile, setProcessedImages }) => {
  useEffect(() => {
    const processImage = async () => {
      const image = new Image();
      image.src = URL.createObjectURL(imageFile);

      image.onload = () => {
        const width = image.width;
        const height = image.height;
        const aspectRatio = 16 / 9;

        // Calculate the maximum possible dimensions for the 16:9 ratio
        let maxHeight = height;
        let maxWidth = maxHeight * aspectRatio;

        if (maxWidth > width) {
          maxWidth = width;
          maxHeight = maxWidth / aspectRatio;
        }

        // Function to crop and resize
        const cropAndResize = (
          sx: number,
          sy: number,
          sWidth: number,
          sHeight: number
        ): string => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          // Resize logic
          let newWidth = sWidth;
          let newHeight = sHeight;
          if (sWidth >= sHeight) {
            newWidth = 2560;
            newHeight = (sHeight * 2560) / sWidth;
          } else {
            newHeight = 2560;
            newWidth = (sWidth * 2560) / sHeight;
          }
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(
            image,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            newWidth,
            newHeight
          );
          return canvas.toDataURL('image/png');
        };

        // Crop from top-left corner
        const leftImageSrc = cropAndResize(0, 0, maxWidth, maxHeight);

        // Crop from top-right corner
        const rightImageSrc = cropAndResize(
          width - maxWidth,
          0,
          maxWidth,
          maxHeight
        );

        setProcessedImages([leftImageSrc, rightImageSrc]);
      };
    };

    processImage();
  }, [imageFile, setProcessedImages]);

  return null;
};

export default ImageProcessor;
