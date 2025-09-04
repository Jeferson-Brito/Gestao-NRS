import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;