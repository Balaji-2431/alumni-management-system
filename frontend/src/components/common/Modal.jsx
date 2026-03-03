import {formatRelativeTime} from "../../utils/formatRelativeTime"

const Modal = ({ open, onClose ,createdBy,createdAt, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-[95%] sm:w-[600px] max-h-[85vh] rounded-2xl shadow-2xl z-10 flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">

            <div className="mt-auto pt-3 flex items-center gap-3">
            {createdBy?.profilePic && (
                <img
                src={`http://localhost:3000${createdBy.profilePic}`}
                alt={createdBy.name}
                className="w-8 h-8 rounded-full object-cover"
                />
            )}

            <div className="text-xs text-gray-500 leading-tight">
                <div className="font-medium text-gray-700">
                {createdBy?.name}
                </div>
                <div>{formatRelativeTime(createdAt)}</div>
            </div>
            </div>

            <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;