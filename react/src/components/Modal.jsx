import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-bg fixed inset-0 bg-black opacity-50"></div>
            <div className="modal-content bg-white p-8 rounded shadow-md z-50 w-3/4">
            {children}         
            </div>
        </div>
    );
  };
  
  export default Modal;