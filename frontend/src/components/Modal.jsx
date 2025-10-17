// Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, title, children, showActionBtn, actionBtnText, actionBtnIcon, onActionClick }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div>{children}</div>
        {showActionBtn && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onActionClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              {actionBtnIcon}
              <span>{actionBtnText}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;