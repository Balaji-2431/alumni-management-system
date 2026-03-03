import { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEye, FiCheckCircle, FiTrash2, FiSend } from "react-icons/fi";
import DropdownPortal from "./DropdownPortal";

const Actions = ({ row, onView, onApprove, onDelete, onApply }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openMenu = () => {
    const rect = btnRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const dropUp = spaceBelow < 180; // 👈 smart flip

    setPos({
      top: dropUp ? rect.top - 0 : rect.bottom + 8,
      left: rect.right - 160,
    });

    setOpen(true);
  };

  const ActionItem = ({ label, icon: Icon, onClick }) => (
    <button
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <>
      <button
        ref={btnRef}
        onClick={openMenu}
        className="cursor-pointer p-2 hover:bg-gray-100 rounded"
      >
        <FiMoreVertical size={18} />
      </button>

      {open && (
        <DropdownPortal>
          <div
            ref={dropdownRef}
            style={{ top: pos.top, left: pos.left }}
            className="fixed w-40 bg-white border rounded-lg shadow-lg z-[9999]"
          >
            <ActionItem label="View" icon={FiEye} onClick={() => onView(row)} />
            {onApprove && (
              <ActionItem label="Approve" icon={FiCheckCircle} onClick={() => onApprove(row._id)} />
            )}
            {onApply && (
              <ActionItem label="Apply" icon={FiSend} onClick={() => onApply(row)} />
            )}
            {onDelete && (
              <ActionItem label="Delete" icon={FiTrash2} onClick={() => onDelete(row._id)} />
            )}
          </div>
        </DropdownPortal>
      )}
    </>
  );
};

export default Actions;