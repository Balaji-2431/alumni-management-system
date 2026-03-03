import Cropper from "react-easy-crop";
import { IoClose } from "react-icons/io5";

const ImageCropModal = ({
  open,
  imageSrc,
  aspect,
  crop,
  zoom,
  setCrop,
  setZoom,
  onCropComplete,
  onCancel,
  onApply,
    closeModal,  // hard close
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[420px] h-[520px] p-4 flex flex-col relative">
         <button
          onClick={closeModal}
          className=" absolute top-0 right-0 text-zinc-500 hover:text-black"
        >
          <IoClose size={24} />
        </button>
        <div className="relative flex-1">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-1 rounded bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="px-4 py-1 rounded bg-black text-white"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImageCropModal;