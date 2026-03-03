import { useState } from "react";

export const useImageCrop = () => {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ===================== INTERNAL CROP FUNCTION ===================== */
  const getCroppedImg = (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;

    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    const ctx = canvas.getContext("2d");

    return new Promise((resolve, reject) => {
      image.onload = () => {
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          resolve(blob);
        }, "image/jpeg");
      };

      image.onerror = reject;
    });
  };

  /* ===================== IMAGE SELECT ===================== */
  const onSelectImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setOpen(true);
    };
    reader.readAsDataURL(file);
  };

  /* ===================== CANCEL (RESET CROP ONLY) ===================== */
  const cancelCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
    // modal stays open
  };

  /* ===================== HARD CLOSE ===================== */
  const closeModal = () => {
    setOpen(false);
  };

  /* ===================== APPLY CROP ===================== */
  const applyCrop = async () => {
    if (!croppedPixels) return;

    const blob = await getCroppedImg(imageSrc, croppedPixels);
    const croppedFile = new File([blob], "image.jpg", {
      type: blob.type,
    });

    setFile(croppedFile);
    setPreview(URL.createObjectURL(croppedFile));
    setOpen(false);
  };

  /* ===================== FULL RESET ===================== */
  const reset = () => {
    setOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
    setFile(null);
    setPreview(null);
  };

  return {
    open,
    imageSrc,
    crop,
    zoom,
    preview,
    file,

    setCrop,
    setZoom,
    setCroppedPixels,

    onSelectImage,
    applyCrop,
    cancelCrop,
    closeModal,
    reset,
    setOpen,
  };
};